import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Have questions or need support? Reach out to our team at <a href="mailto:support@artguard.com" className="text-blue-600 underline">support@artguard.com</a> and we’ll get back to you as soon as possible.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 