import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Session } from "@supabase/supabase-js";

const dummyScans = [
  { id: "001", label: "Handmade", confidence: 0.98, date: "2023-10-26", imageUrl: "https://via.placeholder.com/300/D96D6D/FFFFFF" },
  { id: "002", label: "AI-Generated", confidence: 0.92, date: "2023-10-25", imageUrl: "https://via.placeholder.com/300/4C8DE5/FFFFFF" },
  { id: "003", label: "Digital Print", confidence: 0.99, date: "2023-10-24", imageUrl: "https://via.placeholder.com/300/4EE5D3/1E1E1E" },
  { id: "004", label: "Handmade", confidence: 0.85, date: "2023-10-22", imageUrl: "https://via.placeholder.com/300/D96D6D/FFFFFF" },
];

const getBadgeStyle = (label: string): string => {
  switch (label) {
    case "Handmade": return "bg-handmade text-white";
    case "AI-Generated": return "bg-ai-generated text-white";
    case "Digital Print": return "bg-digital-print text-gray-900";
    default: return "bg-gray-500 text-white";
  }
};

interface DashboardProps {
  session: Session | null;
}

const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">My Dashboard</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Welcome, {session?.user?.email}! Here is a history of your
          authenticated artworks.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyScans.map((scan) => (
          <Card
            key={scan.id}
            className="rounded-2xl shadow-md overflow-hidden flex flex-col group transition-transform duration-300 hover:-translate-y-2"
          >
            <CardHeader className="p-0 relative">
              <img
                src={scan.imageUrl}
                alt={scan.label}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className={cn("text-sm", getBadgeStyle(scan.label))}>
                  {scan.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Scanned on: {scan.date}
                </p>
                <div className="font-bold text-2xl mt-1">
                  {Math.round(scan.confidence * 100)}% Confidence
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Certificate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 