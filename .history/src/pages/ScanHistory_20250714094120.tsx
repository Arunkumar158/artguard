import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import { cn } from "../lib/utils";

const mockScans = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    label: "AI",
    date: "2025-07-06T14:30:00Z",
    confidence: 92,
    reportUrl: "#",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    label: "Handmade",
    date: "2025-07-05T10:15:00Z",
    confidence: 87,
    reportUrl: "#",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    label: "Printed",
    date: "2025-07-04T09:00:00Z",
    confidence: 78,
    reportUrl: "#",
  },
];

const labelColors: Record<string, string> = {
  AI: "bg-red-500 text-white",
  Handmade: "bg-green-500 text-white",
  Printed: "bg-blue-500 text-white",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `Scanned on ${date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;
}

export default function ScanHistory() {
  const [search, setSearch] = useState("");
  // Filter logic stub (not functional for now)
  const scans = mockScans; // Replace with filtered data if search implemented
  const isEmpty = scans.length === 0;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-start py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-foreground">
          Scan History
        </h1>
        <p className="text-center text-sm sm:text-base text-muted-foreground mt-2 mb-6">
          Your uploaded artworks and scan results
        </p>
        {/* Search/Filter Bar (stub) */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8 max-w-md mx-auto">
          <div className="relative w-full">
            <Input
              placeholder="Search scans..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            {/* Optional icon */}
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-4 text-brand"><path stroke="currentColor" strokeWidth="1.5" d="M12 20v-6m0 0V4m0 10H6m6 0h6"/></svg>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2">No scans yet!</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 text-center">Try uploading your first artwork to see scan results here.</p>
            <Button asChild className="w-full sm:w-auto bg-brand hover:bg-brand/90 text-white font-semibold">
              <a href="/upload">Upload Artwork</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {scans.map(scan => (
              <Card key={scan.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src={scan.image}
                  alt="Artwork preview"
                  className="w-full h-40 sm:h-48 object-cover rounded-t-md"
                  style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                />
                <CardContent className="p-3 sm:p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Badge className={cn(labelColors[scan.label], "text-xs px-2 py-1 rounded")}>{scan.label}</Badge>
                    <span className="text-xs text-muted-foreground ml-auto">{formatDate(scan.date)}</span>
                  </div>
                  <div className="mt-2">
                    <span className="font-medium text-sm sm:text-base">Confidence:</span>
                    <span className="ml-2 text-sm">{scan.confidence}%</span>
                    <Progress value={scan.confidence} className="mt-1 h-2 bg-gray-100" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button variant="outline" className="flex-1 text-xs sm:text-sm" asChild>
                      <a href={scan.reportUrl} download>
                        Download Report
                      </a>
                    </Button>
                    <Button variant="ghost" className="flex-1 text-xs sm:text-sm">
                      Re-analyze
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 