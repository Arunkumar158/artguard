import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Please review our terms and conditions for using ArtGuard. By accessing our platform, you agree to comply with these terms. Full details coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 