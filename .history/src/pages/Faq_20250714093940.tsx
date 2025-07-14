import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mail } from "lucide-react";

const faqData = [
  {
    question: "How does ArtGuard detect AI-generated artwork?",
    answer: "ArtGuard uses advanced machine learning models trained on thousands of authentic and AI-generated images to identify patterns and characteristics that distinguish human-created art from AI-generated content."
  },
  {
    question: "What file formats does ArtGuard support?",
    answer: "We currently support JPEG, PNG, and WebP formats. Files should be at least 512x512 pixels for optimal detection accuracy."
  },
  {
    question: "How accurate is ArtGuard's detection?",
    answer: "Our current model achieves 93.4% accuracy across various art styles and AI generation methods. We continuously improve our algorithms with new training data."
  },
  {
    question: "Can I use ArtGuard for commercial purposes?",
    answer: "Yes! ArtGuard offers different pricing tiers for personal and commercial use. Check our pricing page for detailed information about usage limits and features."
  },
  {
    question: "How do I get an API key?",
    answer: "Sign up for an account and navigate to the API Access page. You'll find your API key there, along with documentation on how to integrate it into your applications."
  },
  {
    question: "What happens to my uploaded images?",
    answer: "Your images are processed securely and deleted after analysis. We do not store or use your artwork for any other purpose. See our Privacy Policy for more details."
  }
];

export default function Faq() {
  return (
    <div className="min-h-screen bg-background py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-brand" />
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to the most common questions about ArtGuard, our technology, and how to use our platform.
          </p>
        </div>

        {/* FAQ Content */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
              Common Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold text-base hover:text-brand transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4 sm:p-6 text-center space-y-4">
            <Mail className="w-8 h-8 mx-auto text-brand" />
            <h3 className="text-lg font-semibold text-foreground">Still have questions?</h3>
            <p className="text-muted-foreground">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Button asChild className="bg-brand hover:bg-brand/90 text-white font-semibold">
              <a href="mailto:support@artguard.com">Contact Support</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 