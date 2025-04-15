
import React, { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { ScanButton } from "@/components/ScanButton";
import { ResultDisplay } from "@/components/ResultDisplay";
import { MainLayout } from "@/components/MainLayout";
import { ArtworkScanService } from "@/services/ArtworkScanService";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

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
      
      const scanResult = await ArtworkScanService.scanArtwork(file);
      setResult(scanResult);
      
      toast({
        title: "Scan complete",
        description: `Classified as ${scanResult.label}`,
      });
    } catch (error) {
      console.error("Scanning error:", error);
      toast({
        title: "Scanning failed",
        description: "There was an error processing your artwork",
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
    <MainLayout>
      <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            ArtSense
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Detect if your artwork is handmade, AI-generated, or digitally created
          </p>
        </div>

        <Card className="w-full overflow-hidden bg-white/50 backdrop-blur-sm border-opacity-50">
          <CardContent className="p-6">
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
                      <button
                        onClick={resetScan}
                        className="px-5 py-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors rounded-md"
                      >
                        Scan Another Artwork
                      </button>
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
    </MainLayout>
  );
};

export default Index;
