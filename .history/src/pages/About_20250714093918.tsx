import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Palette, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            About ArtGuard
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Protecting artists and their work using advanced AI technology
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-6">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              ArtGuard is dedicated to protecting artists and their work using advanced AI technology. 
              Our mission is to empower creators and ensure the authenticity of digital art in a rapidly 
              evolving world where AI-generated content is becoming increasingly sophisticated.
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-xl bg-muted/50">
                <Shield className="w-8 h-8 text-brand" />
                <h3 className="font-semibold text-base">Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced AI detection to identify and protect authentic artwork
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-xl bg-muted/50">
                <Palette className="w-8 h-8 text-brand" />
                <h3 className="font-semibold text-base">Authenticity</h3>
                <p className="text-sm text-muted-foreground">
                  Verify the origin and authenticity of digital art pieces
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-xl bg-muted/50">
                <Zap className="w-8 h-8 text-brand" />
                <h3 className="font-semibold text-base">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  Cutting-edge technology to stay ahead of emerging threats
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center pt-6">
              <Button className="bg-brand hover:bg-brand/90 text-white font-semibold">
                Get Started Today
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 