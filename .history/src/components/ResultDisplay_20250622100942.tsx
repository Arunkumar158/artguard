
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2Icon, BrushIcon, SparklesIcon, MonitorIcon } from "lucide-react";

interface ResultDisplayProps {
  result: {
    label: string;
    confidence: number;
  };
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const { label, confidence } = result;
  
  // Format confidence as percentage
  const confidencePercent = Math.round(confidence * 100);
  
  // Determine result color and icon based on label
  const getResultData = () => {
    switch(label.toLowerCase()) {
      case "handmade":
        return {
          icon: <BrushIcon className="h-5 w-5" />,
          color: "text-amber-600",
          bgColor: "bg-amber-100",
          description: "This appears to be a handmade artwork created by human artists."
        };
      case "ai-generated":
        return {
          icon: <SparklesIcon className="h-5 w-5" />,
          color: "text-purple-600",
          bgColor: "bg-purple-100", 
          description: "This appears to be an AI-generated artwork (e.g., Midjourney, DALL·E)."
        };
      case "digital":
        return {
          icon: <MonitorIcon className="h-5 w-5" />,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          description: "This appears to be digitally printed or graphic art."
        };
      default:
        return {
          icon: <CheckCircle2Icon className="h-5 w-5" />,
          color: "text-green-600",
          bgColor: "bg-green-100",
          description: "Analysis complete."
        };
    }
  };

  const resultData = getResultData();
  
  return (
    <div className="animate-fade-in">
      <Card className={`border-none ${resultData.bgColor} shadow-sm`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`rounded-full p-2 ${resultData.bgColor} ${resultData.color}`}>
              {resultData.icon}
            </div>
            <div>
              <h3 className={`font-medium text-lg ${resultData.color}`}>{label}</h3>
              <p className="text-sm text-muted-foreground">{resultData.description}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Confidence</span>
              <span className="font-medium">{confidencePercent}%</span>
            </div>
            <Progress value={confidencePercent} className="h-2" 
              indicatorClassName={label.toLowerCase() === "handmade" ? "bg-amber-500" : 
                                 label.toLowerCase() === "ai-generated" ? "bg-purple-500" : "bg-blue-500"} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
