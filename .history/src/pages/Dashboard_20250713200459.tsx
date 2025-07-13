import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { ChartContainer } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Session } from "@supabase/supabase-js";
import { ScanHistory } from "@/components/ScanHistory";
import { ImageUploader } from "@/components/ImageUploader";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";

interface DashboardProps {
  session: Session | null;
}

const dummyScans = [
  {
    id: "1",
    image_url: "/public/placeholder.svg",
    label: "Handmade",
    confidence: 0.92,
    report_url: "#",
  },
  {
    id: "2",
    image_url: "/public/placeholder.svg",
    label: "AI-Generated",
    confidence: 0.87,
    report_url: "#",
  },
  {
    id: "3",
    image_url: "/public/placeholder.svg",
    label: "Digital Print",
    confidence: 0.95,
    report_url: "#",
  },
  {
    id: "4",
    image_url: "/public/placeholder.svg",
    label: "Handmade",
    confidence: 0.89,
    report_url: "#",
  },
  {
    id: "5",
    image_url: "/public/placeholder.svg",
    label: "AI-Generated",
    confidence: 0.91,
    report_url: "#",
  },
];

const insightsData = [
  { name: "Handmade", value: 18 },
  { name: "AI-Generated", value: 12 },
  { name: "Digital Print", value: 8 },
];

const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [batch, setBatch] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <MainLayout session={session}>
      <div className="space-y-10">
        {/* Upload Artwork Panel */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Upload Artwork</h2>
              <p className="text-muted-foreground text-sm mt-1">Scan your artwork for authenticity.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Batch Upload</span>
              <Switch checked={batch} onCheckedChange={setBatch} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 w-full max-w-md">
                <ImageUploader onFileChange={setSelectedFile} />
              </div>
              <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                {selectedFile && (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-xl border shadow"
                  />
                )}
                <Button className="w-full mt-2" size="lg" disabled={!selectedFile}>
                  Scan Artwork
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Scans Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Scans</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {dummyScans.map((scan) => (
              <Card key={scan.id} className="min-w-[260px] max-w-xs flex-shrink-0 rounded-2xl shadow-md bg-[#F9F6F2] flex flex-col">
                <CardHeader className="p-0 relative">
                  <img
                    src={scan.image_url}
                    alt={scan.label}
                    className="w-full h-36 object-cover rounded-t-2xl"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={cn("text-xs px-2 py-1", scan.label === "Handmade" ? "bg-handmade text-white" : scan.label === "AI-Generated" ? "bg-ai-generated text-white" : "bg-digital-print text-gray-900")}>{scan.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-3 flex-1 flex flex-col">
                  <div className="font-bold text-lg mb-1">{Math.round(scan.confidence * 100)}% Confidence</div>
                  <div className="flex gap-2 mt-auto">
                    <Button variant="outline" className="flex-1" size="sm">View Details</Button>
                    <Button asChild variant="secondary" className="flex-1" size="sm">
                      <a href={scan.report_url} download>PDF Report</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Insights Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Insights</h2>
          <Card className="max-w-2xl">
            <CardContent>
              <ChartContainer
                config={{ Handmade: { color: "#D96D6D" }, "AI-Generated": { color: "#4C8DE5" }, "Digital Print": { color: "#4EE5D3" } }}
              >
                {/* Example: Pie chart using recharts */}
                <recharts.PieChart width={400} height={200}>
                  <recharts.Pie
                    data={insightsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    label
                  >
                    {insightsData.map((entry, index) => (
                      <recharts.Cell key={`cell-${index}`} fill={index === 0 ? "#D96D6D" : index === 1 ? "#4C8DE5" : "#4EE5D3"} />
                    ))}
                  </recharts.Pie>
                  <recharts.Tooltip />
                </recharts.PieChart>
              </ChartContainer>
              <div className="mt-4 text-sm text-muted-foreground">Total scans this month: <span className="font-bold">38</span></div>
            </CardContent>
          </Card>
        </section>

        {/* API Key & Usage Panel */}
        <section>
          <h2 className="text-xl font-semibold mb-4">API Key & Usage</h2>
          <Card className="max-w-xl">
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono bg-gray-100 px-3 py-1 rounded text-sm select-all">sk-test-1234-5678-ABCD-EFGH</span>
                <Badge variant="secondary">Test Key</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={42.5} className="flex-1 h-2" />
                <span className="text-sm">4,250 / 10,000</span>
              </div>
              <Button className="self-end" variant="default">Upgrade Plan</Button>
            </CardContent>
          </Card>
        </section>

        {/* Floating Help & Feedback Button */}
        <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg p-0 w-14 h-14 flex items-center justify-center bg-brand-primary hover:bg-brand-primary/90 text-white text-2xl"
              style={{ borderRadius: "50%" }}
              aria-label="Help & Feedback"
            >
              <HelpCircle className="w-7 h-7" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Help & Feedback</DialogTitle>
              <DialogDescription>
                Have a question or feedback? Let us know!
              </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-4 mt-4">
              <textarea className="border rounded p-2 min-h-[80px]" placeholder="Type your message..." />
              <Button type="submit">Send</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Dashboard; 