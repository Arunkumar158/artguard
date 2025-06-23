import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Session } from "@supabase/supabase-js";
import { ScanHistory } from "@/components/ScanHistory";

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
      <ScanHistory session={session} />
    </div>
  );
};

export default Dashboard; 