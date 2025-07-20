import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, Loader2, Eye, Download, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { useToast } from "../hooks/use-toast";
import { useScanHistory } from "../hooks/useScanHistory";
import { ScanHistoryRecord } from "../services/ScanHistoryService";

const labelColors: Record<string, string> = {
  AI: "bg-red-500 text-white",
  Handmade: "bg-green-500 text-white",
  Printed: "bg-blue-500 text-white",
  "AI Generated": "bg-red-500 text-white",
  "Human Made": "bg-green-500 text-white",
  "Machine Printed": "bg-blue-500 text-white",
  "Likely AI": "bg-orange-500 text-white",
  "Likely Human": "bg-emerald-500 text-white",
  "Unknown": "bg-gray-500 text-white",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function ScanHistory() {
  const [search, setSearch] = useState("");
  const [scans, setScans] = useState<ScanHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Fetch user session and scan history
  useEffect(() => {
    fetchUserAndHistory();
  }, []);

  const fetchUserAndHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error("Failed to get user session");
      }

      if (!currentUser) {
        setError("Please sign in to view your scan history");
        setLoading(false);
        return;
      }

      setUser(currentUser);

      // Fetch scan history using the service
      const data = await ScanHistoryService.getScanHistory({
        user_id: currentUser.id,
        limit: 50,
        offset: 0
      });
      
      setScans(data.data || []);

    } catch (err) {
      console.error("Error fetching scan history:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to load scan history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter scans based on search query
  const filteredScans = scans.filter(scan => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    const description = scan.description?.toLowerCase() || "";
    const filename = scan.result.filename?.toLowerCase() || "";
    const label = scan.result.label?.toLowerCase() || "";
    
    return description.includes(searchLower) || 
           filename.includes(searchLower) || 
           label.includes(searchLower);
  });

  const isEmpty = !loading && filteredScans.length === 0;
  const hasError = error !== null;

  const handleRefresh = () => {
    fetchUserAndHistory();
  };

  const handleViewImage = (scan: ScanHistoryRecord) => {
    const imageUrl = scan.artwork_url || scan.upload_url || scan.result.upload_url;
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  };

  const handleDownloadReport = (scan: ScanHistoryRecord) => {
    // This would typically generate a PDF report
    // For now, we'll just show a toast
    toast({
      title: "Download Report",
      description: "Report download feature coming soon!",
    });
  };

  const getConfidenceScore = (scan: ScanHistoryRecord): number => {
    return scan.result.confidence || 0;
  };

  const getLabel = (scan: ScanHistoryRecord): string => {
    return scan.result.label || "Unknown";
  };

  const getImageUrl = (scan: ScanHistoryRecord): string => {
    return scan.artwork_url || scan.upload_url || scan.result.upload_url || "";
  };

  if (hasError) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Scan History</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={handleRefresh} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-start py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center sm:text-left text-foreground">
              Scan History
            </h1>
            <p className="text-center sm:text-left text-sm sm:text-base text-muted-foreground mt-2">
              Your uploaded artworks and scan results
            </p>
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={loading}
            className="hidden sm:flex"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8 max-w-md mx-auto sm:mx-0">
          <div className="relative w-full">
            <Input
              placeholder="Search scans..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 text-sm sm:text-base"
              disabled={loading}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={loading}
            className="sm:hidden"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand mb-4" />
            <h2 className="text-lg font-semibold mb-2">Loading scan history...</h2>
            <p className="text-sm text-muted-foreground">Please wait while we fetch your data</p>
          </div>
        )}

        {/* Empty State */}
        {isEmpty && !loading && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2">
              {search ? "No matching scans found" : "No scans yet!"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 text-center">
              {search 
                ? "Try adjusting your search terms or clear the search to see all scans."
                : "Try uploading your first artwork to see scan results here."
              }
            </p>
            {!search && (
              <Button asChild className="w-full sm:w-auto bg-brand hover:bg-brand/90 text-white font-semibold">
                <a href="/dashboard">Upload Artwork</a>
              </Button>
            )}
          </div>
        )}

        {/* Scan History Grid */}
        {!loading && !isEmpty && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredScans.map(scan => (
              <Card key={scan.id} className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={getImageUrl(scan)}
                    alt="Artwork preview"
                    className="w-full h-40 sm:h-48 object-cover rounded-t-2xl"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-2 py-1 bg-black/50 text-white backdrop-blur-sm"
                    >
                      {formatFileSize(scan.file_size)}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4 sm:p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Badge className={cn(
                      labelColors[getLabel(scan)] || "bg-gray-500 text-white", 
                      "text-xs px-2 py-1 rounded"
                    )}>
                      {getLabel(scan)}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatDate(scan.scan_timestamp || scan.created_at)}
                    </span>
                  </div>
                  
                  {scan.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {scan.description}
                    </p>
                  )}
                  
                  <div className="mt-2">
                    <span className="font-medium text-sm sm:text-base">Confidence:</span>
                    <span className="ml-2 text-sm">{getConfidenceScore(scan)}%</span>
                    <Progress 
                      value={getConfidenceScore(scan)} 
                      className="mt-1 h-2 bg-gray-100" 
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 text-xs sm:text-sm" 
                      onClick={() => handleViewImage(scan)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 text-xs sm:text-sm"
                      onClick={() => handleDownloadReport(scan)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && !isEmpty && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Showing {filteredScans.length} of {scans.length} scans
            {search && ` matching "${search}"`}
          </div>
        )}
      </div>
    </div>
  );
} 