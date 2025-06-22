import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ScanIcon } from "lucide-react";

interface ScanButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export const ScanButton: React.FC<ScanButtonProps> = ({ onClick, isLoading }) => {
  return (
    <div className="flex justify-center p-4">
      <Button
        onClick={onClick}
        disabled={isLoading}
        size="lg"
        className="px-10 py-8 text-lg font-bold text-primary-foreground bg-primary rounded-lg shadow-md hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1"
      >
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <div className="flex items-center gap-2">
            <ScanIcon className="h-6 w-6" />
            <span>Scan Artwork</span>
          </div>
        )}
      </Button>
    </div>
  );
};
