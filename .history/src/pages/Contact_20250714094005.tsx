import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-brand" />
            Contact Us
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or need support? We're here to help you with any inquiries about ArtGuard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Contact Form */}
          <Card className="rounded-2xl shadow-md">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input type="email" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea 
                  placeholder="Tell us about your inquiry..." 
                  className="min-h-[120px]"
                />
              </div>
              <Button className="w-full bg-brand hover:bg-brand/90 text-white font-semibold">
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="rounded-2xl shadow-md">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-brand mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Email</h3>
                    <a 
                      href="mailto:support@artguard.com" 
                      className="text-brand hover:underline text-sm"
                    >
                      support@artguard.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-brand mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Phone</h3>
                    <p className="text-muted-foreground text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Address</h3>
                    <p className="text-muted-foreground text-sm">
                      123 Art Street<br />
                      Creative District<br />
                      San Francisco, CA 94102
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="rounded-2xl shadow-md">
              <CardContent className="p-4 sm:p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6 text-brand" />
                </div>
                <h3 className="font-semibold text-foreground">Quick Response</h3>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24 hours during business days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 