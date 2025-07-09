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
    <div className="min-h-screen flex flex-col items-center bg-white px-4 py-8 sm:py-12">
      <div className="w-full max-w-4xl space-y-8">
        {/* Page Title */}
        <div className="mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <span role="img" aria-label="API Access">🔐</span> API Access
          </h1>
          <p className="text-muted-foreground mt-1">Use this key to integrate ArtGuard into your app.</p>
        </div>

        {/* API Key Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Your API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="font-mono text-lg tracking-wider bg-gray-100 px-3 py-1 rounded select-all flex-1">
                {API_KEY}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-gray-300 hover:border-[#FF7F50] hover:bg-[#FF7F50]/10"
                      aria-label="Copy API Key"
                      onClick={handleCopy}
                    >
                      <Copy className="w-5 h-5" />
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
                      className="bg-[#FF7F50] hover:bg-[#FF7F50]/90"
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Regenerate API Key?</DialogTitle>
              <DialogDescription>
                This will invalidate your current key immediately.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="bg-[#FF7F50] hover:bg-[#FF7F50]/90"
                onClick={handleRegenerate}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Usage Card */}
        <Card className="shadow-sm">
          <CardContent className="py-5">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">
                Usage this month: <span className="font-semibold text-black">{USAGE.toLocaleString()} / {LIMIT.toLocaleString()} API calls</span>
              </span>
              <Progress value={USAGE_PERCENT} className="h-2 bg-gray-200" style={{ accentColor: '#FF7F50' }} />
              <span className="text-xs text-muted-foreground mt-1">🕒 Resets on: {RESET_DATE}</span>
            </div>
          </CardContent>
        </Card>

        {/* Plan Card */}
        <Card className="shadow-sm">
          <CardContent className="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="font-medium">Current Plan: <span className="text-[#FF7F50]">Free (D2C)</span></span>
              <div className="text-sm text-muted-foreground mt-1">
                Upgrade for more calls, API analytics, and support.
              </div>
            </div>
            <Button
              className="bg-[#FF7F50] hover:bg-[#FF7F50]/90 text-white font-semibold mt-2 sm:mt-0"
            >
              🚀 Upgrade to PRO →
            </Button>
          </CardContent>
        </Card>

        {/* API Docs Link */}
        <div className="flex justify-center pt-2">
          <Button asChild variant="outline" className="border-[#FF7F50] text-[#FF7F50] hover:bg-[#FF7F50]/10">
            <Link to="/docs">View API Documentation</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 