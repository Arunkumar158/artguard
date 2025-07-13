import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>About ArtGuard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            ArtGuard is dedicated to protecting artists and their work using advanced AI technology. Our mission is to empower creators and ensure the authenticity of digital art in a rapidly evolving world.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 