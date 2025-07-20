import React, { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { ScanButton } from "@/components/ScanButton";
import { ResultDisplay } from "@/components/ResultDisplay";
import { ArtworkScanService } from "@/services/ArtworkScanService";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScanHistory from "./ScanHistory";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{
    label: string;
    confidence: number;
  } | null>(null);
  const { toast } = useToast();

  const handleFileChange = (uploadedFile: File | null) => {
    setFile(uploadedFile);
    setResult(null);
    
    if (uploadedFile) {
      const objectUrl = URL.createObjectURL(uploadedFile);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleScan = async () => {
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsScanning(true);
      setResult(null);
      
      // Check backend health first
      const isBackendHealthy = await ArtworkScanService.checkBackendHealth();
      if (!isBackendHealthy) {
        throw new Error(
          "Backend server is not accessible. Please ensure the Django server is running on http://localhost:8000"
        );
      }
      
      // Use the complete scan process that includes Cloudinary upload
      const scanResult = await ArtworkScanService.completeScanProcess(file, 'anonymous', 'Artwork scan');
      setResult(scanResult);
      
      toast({
        title: "Scan complete",
        description: `Classified as ${scanResult.label}. Image uploaded to Cloudinary.`,
      });
    } catch (error) {
      console.error("Scanning error:", error);
      
      let errorMessage = "There was an error processing your artwork";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide more specific error messages
        if (error.message.includes('Failed to fetch') || error.message.includes('Unable to connect')) {
          errorMessage = "Cannot connect to the server. Please check if the backend is running and try again.";
        } else if (error.message.includes('Invalid file type')) {
          errorMessage = "Please select a valid image file (JPG, PNG, GIF, or WebP).";
        } else if (error.message.includes('File size too large')) {
          errorMessage = "File size is too large. Please select an image smaller than 10MB.";
        }
      }
      
      toast({
        title: "Scanning failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const resetScan = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Upload Your Artwork</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Let's determine if your piece is handmade, AI-generated, or a digital print.
        </p>
      </div>

      <Card className="w-full overflow-hidden shadow-xl border-8 border-white rounded-2xl bg-white group transition-all hover:border-gray-100">
        <CardContent className="p-2">
          {!previewUrl ? (
            <ImageUploader onFileChange={handleFileChange} />
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-md overflow-hidden bg-black/5 animate-fade-in">
                <img
                  src={previewUrl}
                  alt="Artwork preview"
                  className="mx-auto max-h-[400px] object-contain"
                />
              </div>
              
              {result ? (
                <>
                  <ResultDisplay result={result} />
                  <div className="flex justify-center mt-6">
                    <Button onClick={resetScan} variant="outline" size="lg">
                      Scan Another Artwork
                    </Button>
                  </div>
                </>
              ) : (
                <ScanButton onClick={handleScan} isLoading={isScanning} />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
