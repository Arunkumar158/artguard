import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, AlertTriangle, Scale } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-brand" />
            Terms of Service
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Please review our terms and conditions for using ArtGuard. By accessing our platform, you agree to comply with these terms.
          </p>
        </div>

        {/* Main Content */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
              Terms and Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-6">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              These Terms of Service govern your use of ArtGuard's platform and services. By using our service, 
              you agree to be bound by these terms and our Privacy Policy.
            </p>

            {/* Key Terms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-xl bg-muted/50">
                <CheckCircle className="w-8 h-8 text-brand" />
                <h3 className="font-semibold text-base">Acceptable Use</h3>
                <p className="text-sm text-muted-foreground">
                  Use our platform responsibly and in compliance with applicable laws
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-xl bg-muted/50">
                <Scale className="w-8 h-8 text-brand" />
                <h3 className="font-semibold text-base">Legal Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  All usage must comply with local, state, and federal laws
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-xl bg-muted/50">
                <AlertTriangle className="w-8 h-8 text-brand" />
                <h3 className="font-semibold text-base">Prohibited Activities</h3>
                <p className="text-sm text-muted-foreground">
                  Certain activities are strictly prohibited on our platform
                </p>
              </div>
            </div>

            {/* Service Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Service Description</h3>
              <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
                <p>ArtGuard provides AI-powered artwork authentication and detection services. Our platform allows users to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Upload artwork images for AI analysis</li>
                  <li>Receive detailed reports on artwork authenticity</li>
                  <li>Access API services for integration</li>
                  <li>View scan history and analytics</li>
                </ul>
              </div>
            </div>

            {/* User Responsibilities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">User Responsibilities</h3>
              <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
                <p>As a user of ArtGuard, you agree to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Use the service only for lawful purposes</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not attempt to circumvent our security measures</li>
                </ul>
              </div>
            </div>

            {/* Prohibited Uses */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Prohibited Uses</h3>
              <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
                <p>You may not use our service to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Upload content that infringes on copyrights or trademarks</li>
                  <li>Attempt to reverse engineer our AI models</li>
                  <li>Use automated systems to abuse our API</li>
                  <li>Share or resell access to our services</li>
                  <li>Engage in any illegal or harmful activities</li>
                </ul>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Limitation of Liability</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                ArtGuard provides its services "as is" and makes no warranties about the accuracy or reliability 
                of our AI detection results. We are not liable for any damages arising from the use of our service.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Changes to Terms</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes, 
                and continued use of the service constitutes acceptance of updated terms.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold text-foreground">Questions About Terms</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                If you have questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:legal@artguard.com" className="text-brand hover:underline">
                  legal@artguard.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 