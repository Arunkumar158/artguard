import React from "react";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const dummyScans = [
  { id: "001", label: "Handmade", confidence: 0.98, date: "2023-10-26", imageUrl: "https://via.placeholder.com/150/D96D6D/FFFFFF?text=Art1" },
  { id: "002", label: "AI-Generated", confidence: 0.92, date: "2023-10-25", imageUrl: "https://via.placeholder.com/150/4C8DE5/FFFFFF?text=Art2" },
  { id: "003", label: "Digital Print", confidence: 0.99, date: "2023-10-24", imageUrl: "https://via.placeholder.com/150/4EE5D3/FFFFFF?text=Art3" },
  { id: "004", label: "Handmade", confidence: 0.85, date: "2023-10-22", imageUrl: "https://via.placeholder.com/150/D96D6D/FFFFFF?text=Art4" },
];

const getBadgeVariant = (label: string): "destructive" | "default" | "secondary" => {
  switch (label) {
    case "Handmade": return "destructive";
    case "AI-Generated": return "default";
    case "Digital Print": return "secondary";
    default: return "default";
  }
};

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-4xl font-bold">My Dashboard</h1>
            <p className="text-lg text-muted-foreground mt-2">A history of your authenticated artworks.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyScans.map((scan) => (
            <Card key={scan.id} className="rounded-2xl shadow-md overflow-hidden flex flex-col">
              <CardHeader className="p-0">
                <img src={scan.imageUrl} alt={scan.label} className="w-full h-40 object-cover" />
              </CardHeader>
              <CardContent className="p-6 flex-1">
                <Badge variant={getBadgeVariant(scan.label)}>{scan.label}</Badge>
                <div className="font-bold text-xl mt-2">Confidence: {Math.round(scan.confidence * 100)}%</div>
                <p className="text-sm text-muted-foreground mt-1">Scanned on: {scan.date}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button variant="outline" className="w-full">View Certificate</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard; 