import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

const LABEL_COLORS: Record<string, string> = {
  Handmade: "bg-[#D96D6D] text-white",
  "AI-Generated": "bg-[#4C8DE5] text-white",
  Digital: "bg-[#4EE5D3] text-gray-900",
};

interface ScanResult {
  id: string;
  image_url: string;
  label: string;
  confidence: number;
  timestamp: string;
  report_url: string;
}

interface ScanHistoryProps {
  session: Session | null;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({ session }) => {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [reanalyzingId, setReanalyzingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchScans = async () => {
      setLoading(true);
      if (!session?.user?.id) {
        setScans([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("scan_results")
        .select("id, image_url, label, confidence, timestamp, report_url")
        .eq("user_id", session.user.id)
        .order("timestamp", { ascending: false });
      if (error) {
        toast({ title: "Error fetching scans", description: error.message });
        setScans([]);
      } else {
        setScans(data || []);
      }
      setLoading(false);
    };
    fetchScans();
  }, [session, toast]);

  const handleReanalyze = async (scan: ScanResult) => {
    setReanalyzingId(scan.id);
    try {
      const response = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: scan.image_url }),
      });
      if (!response.ok) throw new Error("Failed to re-analyze artwork");
      const data = await response.json();
      // Optionally update the scan in the UI if changed
      setScans((prev) =>
        prev.map((s) =>
          s.id === scan.id
            ? { ...s, label: data.label, confidence: data.confidence }
            : s
        )
      );
      toast({ title: "Re-analysis complete", description: `Result: ${data.label} (${Math.round(data.confidence * 100)}%)` });
    } catch (err: any) {
      toast({ title: "Re-analysis failed", description: err.message, variant: "destructive" });
    } finally {
      setReanalyzingId(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="rounded-2xl shadow-md p-4 bg-[#F9F6F2]">
            <Skeleton className="w-full h-48 mb-4 rounded-xl" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </Card>
        ))}
      </div>
    );
  }

  if (!scans.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <img src="/public/placeholder.svg" alt="No scans" className="w-32 h-32 mb-6 opacity-60" />
        <p className="text-xl text-gray-500 font-medium">No scans yet. Try uploading your first artwork!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {scans.map((scan) => (
        <Card
          key={scan.id}
          className="rounded-2xl shadow-md p-4 bg-[#F9F6F2] flex flex-col"
        >
          <CardHeader className="p-0 relative">
            <img
              src={scan.image_url}
              alt={scan.label}
              className="w-full h-48 object-cover rounded-xl"
            />
            <div className="absolute top-4 right-4">
              <Badge className={`text-sm ${LABEL_COLORS[scan.label] || "bg-gray-500 text-white"}`}>{scan.label}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex-1 flex flex-col">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">
                Scanned on: {new Date(scan.timestamp).toLocaleString()}
              </p>
              <div className="font-bold text-2xl mt-1">
                {Math.round(scan.confidence * 100)}% Confidence
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button asChild variant="outline" className="flex-1 border-[#E2B855] text-[#E2B855] hover:bg-[#E2B855]/10">
                <a href={scan.report_url} target="_blank" rel="noopener noreferrer">Download Report</a>
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-[#4C8DE5] hover:bg-[#4C8DE5]/90 text-white"
                disabled={reanalyzingId === scan.id}
                onClick={() => handleReanalyze(scan)}
              >
                {reanalyzingId === scan.id ? "Re-analyzing..." : "Re-analyze"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 