import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Faq() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Here you'll find answers to the most common questions about ArtGuard, our technology, and how to use our platform. More details coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 