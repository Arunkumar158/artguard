
import React from "react";
import { Button } from "@/components/ui/button";
import { ScanIcon } from "lucide-react";

interface ScanButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export const ScanButton: React.FC<ScanButtonProps> = ({ onClick, isLoading }) => {
  return (
    <div className="flex justify-center">
      <Button
        onClick={onClick}
        disabled={isLoading}
        className="group relative px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
      >
        <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <ScanIcon className="h-5 w-5" />
          Scan Artwork
        </span>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-white rounded-full"></div>
              <div className="h-2 w-2 bg-white rounded-full"></div>
              <div className="h-2 w-2 bg-white rounded-full"></div>
            </div>
          </div>
        )}
      </Button>
    </div>
  );
};
