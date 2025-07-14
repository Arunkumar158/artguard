// /api-access page for ArtGuard
// Features:
// - API key management (masked key, copy, regenerate with dialog)
// - Usage tracking with progress bar
// - Current plan and upgrade CTA
// - API docs link
// - Uses ShadCN UI, Lucide icons, ArtGuard brand (#FF7F50), mobile responsive
// - Does not touch header or global layout
//
// See: https://github.com/shadcn-ui/ui
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { Copy } from "lucide-react";
import { Link } from "react-router-dom";

const API_KEY = "sk-*************";
const USAGE = 3200;
const LIMIT = 10000;
const USAGE_PERCENT = (USAGE / LIMIT) * 100;
const RESET_DATE = "August 1, 2025";

export default function ApiAccess() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(API_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleRegenerate = () => {
    // Regenerate logic here
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="w-full max-w-4xl space-y-6 sm:space-y-8">
        {/* Page Title */}
        <div className="mb-4 sm:mb-6">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <span role="img" aria-label="API Access">🔐</span> API Access
        </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Use this key to integrate ArtGuard into your app.</p>
        </div>

        {/* API Key Card */}
        <Card className="shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base">Your API Key</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="font-mono text-sm sm:text-lg tracking-wider bg-gray-100 px-3 py-2 sm:py-1 rounded select-all break-all flex-1">
                {API_KEY}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-gray-300 hover:border-[#FF7F50] hover:bg-[#FF7F50]/10 w-full sm:w-auto"
                      aria-label="Copy API Key"
                      onClick={handleCopy}
                    >
                      <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {copied ? "Copied!" : "Copy to clipboard"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      className="bg-[#FF7F50] hover:bg-[#FF7F50]/90 w-full sm:w-auto"
                      onClick={() => setDialogOpen(true)}
                    >
                      Generate New Key
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    Regenerate your API key
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        {/* Regenerate Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="w-[90vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Regenerate API Key?</DialogTitle>
              <DialogDescription>
                This will invalidate your current key immediately.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="bg-[#FF7F50] hover:bg-[#FF7F50]/90 w-full sm:w-auto"
                onClick={handleRegenerate}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Usage Card */}
        <Card className="shadow-sm">
          <CardContent className="py-4 sm:py-5 p-4 sm:p-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Usage this month: <span className="font-semibold text-black">{USAGE.toLocaleString()} / {LIMIT.toLocaleString()} API calls</span>
              </span>
              <Progress value={USAGE_PERCENT} className="h-2 bg-gray-200" style={{ accentColor: '#FF7F50' }} />
              <span className="text-xs text-muted-foreground mt-1">🕒 Resets on: {RESET_DATE}</span>
            </div>
          </CardContent>
        </Card>

        {/* Plan Card */}
        <Card className="shadow-sm">
          <CardContent className="py-4 sm:py-5 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="font-medium text-sm sm:text-base">Current Plan: <span className="text-[#FF7F50]">Free (D2C)</span></span>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                Upgrade for more calls, API analytics, and support.
              </div>
            </div>
            <Button
              className="bg-[#FF7F50] hover:bg-[#FF7F50]/90 text-white font-semibold mt-2 sm:mt-0 w-full sm:w-auto"
            >
              🚀 Upgrade to PRO →
            </Button>
          </CardContent>
        </Card>

        {/* API Docs Link */}
        <div className="flex justify-center pt-2">
          <Button asChild variant="outline" className="border-[#FF7F50] text-[#FF7F50] hover:bg-[#FF7F50]/10 w-full sm:w-auto">
            <Link to="/docs">View API Documentation</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 