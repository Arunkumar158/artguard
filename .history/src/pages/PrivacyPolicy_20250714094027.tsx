import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, Users } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-brand" />
            Privacy Policy
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. Learn how ArtGuard collects, uses, and protects your information.
          </p>
        </div>

        {/* Main Content */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
              Our Commitment to Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-6">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              At ArtGuard, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy outlines how we collect, use, and safeguard your data when you use our platform.
            </p>

            {/* Privacy Principles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-xl bg-muted/50">
                <Eye className="w-8 h-8 text-brand" />
                <h3 className="font-semibold text-base">Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  We're clear about what data we collect and how we use it
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-xl bg-muted/50">
                <Lock className="w-8 h-8 text-brand" />
                <h3 className="font-semibold text-base">Security</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is protected with industry-standard security measures
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-xl bg-muted/50">
                <Users className="w-8 h-8 text-brand" />
                <h3 className="font-semibold text-base">Control</h3>
                <p className="text-sm text-muted-foreground">
                  You have full control over your personal information
                </p>
              </div>
            </div>

            {/* Information We Collect */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Information We Collect</h3>
              <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
                <p><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password.</p>
                <p><strong>Usage Data:</strong> We collect information about how you use our platform, including scan history and API usage.</p>
                <p><strong>Artwork Images:</strong> Images you upload for analysis are processed securely and deleted after analysis.</p>
                <p><strong>Technical Data:</strong> We may collect device information, IP addresses, and browser data for security purposes.</p>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">How We Use Your Information</h3>
              <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
                <p>• To provide and improve our AI detection services</p>
                <p>• To process your artwork scans and generate reports</p>
                <p>• To communicate with you about your account and services</p>
                <p>• To ensure platform security and prevent fraud</p>
                <p>• To comply with legal obligations</p>
              </div>
            </div>

            {/* Data Protection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Data Protection</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                We implement industry-standard security measures to protect your data, including encryption, 
                secure servers, and regular security audits. Your artwork images are processed securely and 
                automatically deleted after analysis to ensure your privacy.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold text-foreground">Contact Us</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                If you have any questions about this Privacy Policy or our data practices, please contact us at{' '}
                <a href="mailto:privacy@artguard.com" className="text-brand hover:underline">
                  privacy@artguard.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 