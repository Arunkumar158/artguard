import React, { useState, useEffect } from 'react';
import { 
  artworkScanService, 
  ScanRecord, 
  AnalyticsResponse,
  ArtworkScanService 
} from '../services/ArtworkScanService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, 
  Trash2, 
  Download, 
  Calendar, 
  BarChart3, 
  RefreshCw,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { toast } from './ui/use-toast';

interface ScanHistoryProps {
  userId: string;
  onScanSelect?: (scan: ScanRecord) => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({ 
  userId, 
  onScanSelect 
}) => {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ScanRecord[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedScans, setSelectedScans] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const ITEMS_PER_PAGE = 20;

  // Load initial data
  useEffect(() => {
    loadScanHistory();
    loadAnalytics();
  }, [userId]);

  const loadScanHistory = async () => {
    setLoading(true);
    try {
      const response = await artworkScanService.getScanHistory(
        userId, 
        ITEMS_PER_PAGE, 
        currentPage * ITEMS_PER_PAGE
      );
      setScans(response.data);
      setHasMore(response.data.length === ITEMS_PER_PAGE);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load scan history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await artworkScanService.getScanAnalytics(userId, 30);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await artworkScanService.searchScanHistory(
        userId, 
        searchQuery, 
        20
      );
      setSearchResults(response.data);
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search scan history",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleDeleteScan = async (scanId: string) => {
    try {
      await artworkScanService.deleteScan(scanId, userId);
      toast({
        title: "Success",
        description: "Scan deleted successfully",
      });
      loadScanHistory();
      loadAnalytics();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete scan",
        variant: "destructive",
      });
    }
  };

  const handleBatchDelete = async () => {
    if (selectedScans.size === 0) return;

    try {
      await artworkScanService.batchDeleteScans({
        scan_ids: Array.from(selectedScans),
        user_id: userId,
      });
      toast({
        title: "Success",
        description: `Deleted ${selectedScans.size} scans`,
      });
      setSelectedScans(new Set());
      loadScanHistory();
      loadAnalytics();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete selected scans",
        variant: "destructive",
      });
    }
  };

  const handleScanSelection = (scanId: string, checked: boolean) => {
    const newSelected = new Set(selectedScans);
    if (checked) {
      newSelected.add(scanId);
    } else {
      newSelected.delete(scanId);
    }
    setSelectedScans(newSelected);
  };

  const handleSelectAll = () => {
    const currentScans = searchQuery ? searchResults : scans;
    if (selectedScans.size === currentScans.length) {
      setSelectedScans(new Set());
    } else {
      setSelectedScans(new Set(currentScans.map(scan => scan.id)));
    }
  };

  const filteredScans = (searchQuery ? searchResults : scans).filter(scan => 
    filterStatus === 'all' || scan.status === filterStatus
  );

  const formatFileSize = (bytes: number) => ArtworkScanService.formatFileSize(bytes);
  const formatDate = (dateString: string) => ArtworkScanService.formatDate(dateString);
  const getStatusColor = (status: string) => ArtworkScanService.getStatusColor(status);

  return (
    <div className="space-y-6">
      {/* Analytics Section */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Scan Analytics (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{analytics.total_scans}</div>
                <div className="text-sm text-muted-foreground">Total Scans</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatFileSize(analytics.total_file_size)}</div>
                <div className="text-sm text-muted-foreground">Total Storage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatFileSize(analytics.average_file_size)}</div>
                <div className="text-sm text-muted-foreground">Avg File Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{analytics.scans_per_day.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Scans/Day</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search scans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="uploaded">Uploaded</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
              <Button variant="outline" onClick={loadScanHistory}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Actions */}
      {selectedScans.size > 0 && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span>{selectedScans.size} scans selected</span>
              <Button 
                variant="destructive" 
                onClick={handleBatchDelete}
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading scan history...</p>
          </div>
        ) : filteredScans.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? 'No scans found matching your search.' : 'No scans found.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Select All */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedScans.size === filteredScans.length && filteredScans.length > 0}
                onChange={handleSelectAll}
                className="rounded"
              />
              <span className="text-sm text-muted-foreground">Select All</span>
            </div>

            {/* Scan Items */}
            {filteredScans.map((scan) => (
              <Card key={scan.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedScans.has(scan.id)}
                      onChange={(e) => handleScanSelection(scan.id, e.target.checked)}
                      className="mt-1 rounded"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={`text-${getStatusColor(scan.status)}-600`}>
                              {scan.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(scan.created_at)}
                            </span>
                          </div>
                          
                          {scan.description && (
                            <p className="text-sm font-medium mb-1">{scan.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{formatFileSize(scan.file_size)}</span>
                            <span>{scan.content_type}</span>
                            <span>ID: {scan.id.slice(0, 8)}...</span>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onScanSelect?.(scan)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <a 
                                href={scan.artwork_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <Download className="h-4 w-4" />
                                Download
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteScan(scan.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            {!searchQuery && hasMore && (
              <div className="text-center">
                <Button 
                  onClick={() => {
                    setCurrentPage(prev => prev + 1);
                    loadScanHistory();
                  }}
                  variant="outline"
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Scan Details Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="hidden">View Details</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Scan Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected scan.
            </DialogDescription>
          </DialogHeader>
          {/* Dialog content would be populated when a scan is selected */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScanHistory; 