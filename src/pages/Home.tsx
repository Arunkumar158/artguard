import React from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center text-center py-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
          Clarity in Every Pixel.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
          ArtGuard is the leading platform for verifying the authenticity of your artwork. Distinguish between handmade originals, AI-generated pieces, and digital prints with confidence.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-8 px-10 text-lg">
          <Link to="/scan">Authenticate Your Artwork</Link>
        </Button>
      </div>
    </MainLayout>
  );
};

export default Home; 