import React, { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { ScanButton } from "@/components/ScanButton";
import { ResultDisplay } from "@/components/ResultDisplay";
import { MainLayout } from "@/components/MainLayout";
import { ArtworkScanService } from "@/services/ArtworkScanService";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    </MainLayout>
  );
};

export default Index;
