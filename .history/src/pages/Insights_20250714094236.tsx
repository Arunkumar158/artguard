import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Info, ThumbsUp, ThumbsDown, Palette, Bot, Printer } from "lucide-react";

const statCards = [
  {
    title: "Total Scans",
    value: 24,
    icon: <Palette className="w-7 h-7 text-[#FF7F50]" />, // 🎨
    desc: "All artwork scans",
  },
  {
    title: "Handmade Scans",
    value: 18,
    icon: <Palette className="w-7 h-7 text-[#FF7F50]" />, // 🎨
    desc: "Handmade classified",
  },
  {
    title: "AI-Generated",
    value: 5,
    icon: <Bot className="w-7 h-7 text-[#FF7F50]" />, // 🤖
    desc: "AI art detected",
  },
];

const pieData = [
  { name: "Handmade", value: 75 },
  { name: "AI-Generated", value: 20 },
  { name: "Printed", value: 5 },
];
const pieColors = ["#FF7F50", "#4C8DE5", "#A3E635"];

const barData = [
  { week: "W1", scans: 4 },
  { week: "W2", scans: 6 },
  { week: "W3", scans: 5 },
  { week: "W4", scans: 7 },
  { week: "W5", scans: 2 },
  { week: "W6", scans: 0 },
  { week: "W7", scans: 1 },
];

const Insights = () => {
  const { toast } = useToast();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const handleFeedback = (positive: boolean) => {
    toast({
      title: "Thanks for your feedback!",
      description: positive ? "We're glad you found it helpful." : "We'll use your feedback to improve.",
    });
    setFeedbackOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <span role="img" aria-label="chart">📊</span> Insights Overview
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-2">See how your uploaded artworks have been classified</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        {statCards.map((card, i) => (
          <Card key={card.title} className="rounded-2xl shadow-md flex flex-col items-center py-4 sm:py-6">
            <CardHeader className="flex flex-col items-center gap-2 p-0 mb-2">
              {card.icon}
              <CardTitle className="text-lg sm:text-xl font-semibold text-foreground text-center">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center p-0">
              <span className="text-2xl sm:text-3xl font-bold text-brand">{card.value}</span>
              <CardDescription className="mt-1 text-xs sm:text-sm text-center">{card.desc}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
        {/* Pie Chart */}
        <Card className="rounded-2xl shadow-md p-4 sm:p-6 flex flex-col items-center">
          <CardHeader className="flex flex-row items-center gap-2 p-0 mb-4">
            <span className="text-base sm:text-lg font-semibold text-foreground">Classification Breakdown</span>
          </CardHeader>
          <CardContent className="w-full flex flex-col items-center p-0">
            <ResponsiveContainer width="100%" height={200} className="min-h-[200px]">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle"/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="rounded-2xl shadow-md p-4 sm:p-6 flex flex-col items-center">
          <CardHeader className="flex flex-row items-center gap-2 p-0 mb-4">
            <span className="text-base sm:text-lg font-semibold text-foreground">Weekly Scan Trend</span>
          </CardHeader>
          <CardContent className="w-full flex flex-col items-center p-0">
            <ResponsiveContainer width="100%" height={200} className="min-h-[200px]">
              <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <XAxis dataKey="week" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="scans" fill="hsl(var(--brand-primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Model Accuracy Box */}
      <Card className="rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-6 mb-8 sm:mb-10 border-l-4 border-brand">
        <Info className="w-6 h-6 sm:w-7 sm:h-7 text-brand flex-shrink-0" />
        <div>
          <div className="font-semibold text-foreground text-sm sm:text-base">Scans are analyzed using our custom MobileNetV2-based model (v2.1), trained on curated data. Current accuracy: <span className="text-brand font-bold">93.4%</span>.</div>
        </div>
      </Card>

      {/* Feedback CTA */}
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <span className="text-sm sm:text-base font-medium text-foreground">Was this page helpful?</span>
          <button
            className="rounded-full p-2 hover:bg-brand/10 transition"
            aria-label="Yes"
            onClick={() => handleFeedback(true)}
          >
            <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
          </button>
          <button
            className="rounded-full p-2 hover:bg-brand/10 transition"
            aria-label="No"
            onClick={() => handleFeedback(false)}
          >
            <ThumbsDown className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Insights; 