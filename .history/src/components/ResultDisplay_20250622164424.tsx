import React from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2Icon, BrushIcon, SparklesIcon, MonitorIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultDisplayProps {
  result: {
    label: string;
    confidence: number;
  };
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const { label, confidence } = result;
  
  const confidencePercent = Math.round(confidence * 100);
  
  const getResultData = () => {
    switch(label.toLowerCase()) {
      case "handmade":
        return {
          icon: <BrushIcon className="h-6 w-6" />,
          textColor: "text-handmade",
          bgColor: "bg-handmade/10",
          progressColor: "bg-handmade",
          description: "This appears to be a handmade artwork."
        };
      case "ai-generated":
        return {
          icon: <SparklesIcon className="h-6 w-6" />,
          textColor: "text-ai-generated",
          bgColor: "bg-ai-generated/10",
          progressColor: "bg-ai-generated",
          description: "This appears to be an AI-generated artwork."
        };
      case "digital": // Assuming "digital" maps to "Digital Print"
        return {
          icon: <MonitorIcon className="h-6 w-6" />,
          textColor: "text-digital-print",
          bgColor: "bg-digital-print/10",
          progressColor: "bg-digital-print",
          description: "This appears to be a digital print or graphic art."
        };
      default:
        return {
          icon: <CheckCircle2Icon className="h-6 w-6" />,
          textColor: "text-green-600",
          bgColor: "bg-green-100",
          progressColor: "bg-green-500",
          description: "Analysis complete."
        };
    }
  };

  const resultData = getResultData();
  
  return (
    <div className={cn("p-6 rounded-lg animate-fade-in border", resultData.bgColor)}>
      <div className="flex items-start gap-4">
        <div className={cn("p-2 rounded-full", resultData.bgColor, resultData.textColor)}>
          {resultData.icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Result</p>
          <h3 className={cn("font-bold text-2xl", resultData.textColor)}>{label}</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Confidence</p>
          <p className={cn("font-bold text-2xl", resultData.textColor)}>{confidencePercent}%</p>
        </div>
      </div>
      <div className="mt-4">
        <Progress value={confidencePercent} className="h-2 bg-black/10" 
                  indicatorClassName={resultData.progressColor} />
      </div>
      <p className="text-sm text-muted-foreground mt-3 text-center">{resultData.description}</p>
    </div>
  );
};
