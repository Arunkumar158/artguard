import React, { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

// Placeholder user data
const user = {
  name: "Jane Doe",
  email: "jane.doe@email.com",
  emailVerified: true,
  avatarUrl: "",
  lastLogin: "2024-07-09 14:32",
};

const billing = {
  plan: "Pro",
  planColor: "#FF7F50",
  renewal: "August 1, 2025",
  invoices: [
    { id: "inv-001", date: "2024-07-01", amount: "$20.00", status: "Paid" },
    { id: "inv-002", date: "2024-06-01", amount: "$20.00", status: "Paid" },
    { id: "inv-003", date: "2024-05-01", amount: "$20.00", status: "Paid" },
  ],
};

const api = {
  key: "sk-*************",
  usage: 4000,
  limit: 10000,
  reset: "August 1, 2025",
};

export default function Account() {
  const { toast } = useToast();
  const [name, setName] = useState(user.name);
  const [email] = useState(user.email);
  const [saving, setSaving] = useState(false);
  const [apiKey, setApiKey] = useState(api.key);
  const [copied, setCopied] = useState(false);
  const [regenOpen, setRegenOpen] = useState(false);
  const [changePwOpen, setChangePwOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  // Profile actions
  const handleSaveProfile = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({ title: "Profile updated!", description: "Your changes have been saved." });
    }, 1000);
  };

  // API actions
  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast({ title: "API Key Copied!", description: "Your API key has been copied to clipboard." });
    setTimeout(() => setCopied(false), 1200);
  };
  const handleRegenerate = () => {
    setApiKey("sk-NEW-*********");
    setRegenOpen(false);
    toast({ title: "API Key Regenerated", description: "Your API key has been regenerated." });
  };

  // Security actions
  const handleChangePassword = () => {
    setChangePwOpen(false);
    toast({ title: "Password Changed", description: "Your password has been updated." });
  };
  const handleDeleteAccount = () => {
    setDeleteOpen(false);
    toast({ title: "Account Deleted", description: "Your account has been deleted." });
  };

  return (
    <div className="max-w-4xl mx-auto w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mt-4 mb-8 flex flex-col items-center">
      <div className="w-full text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Account Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">Manage your profile, billing, security, and API usage.</p>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-6">
          <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
          <TabsTrigger value="billing" className="text-xs sm:text-sm">Billing</TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm">Security</TabsTrigger>
          <TabsTrigger value="api" className="text-xs sm:text-sm">API</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="max-w-xl mx-auto rounded-2xl shadow-md">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Profile</CardTitle>
              <CardDescription className="text-sm sm:text-base">Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center gap-4 sm:gap-6">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={name} />
                  ) : (
                    <AvatarFallback className="text-lg sm:text-xl">{name[0]}</AvatarFallback>
                  )}
                </Avatar>
                <div className="w-full flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input value={name} onChange={e => setName(e.target.value)} className="max-w-md w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <Input value={email} readOnly className="max-w-md w-full bg-gray-100" />
                      {user.emailVerified && <Badge variant="secondary" className="w-fit">Verified</Badge>}
                    </div>
                  </div>
                </div>
                <Button onClick={handleSaveProfile} disabled={saving} className="w-full max-w-md mt-2">
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <Card className="max-w-xl mx-auto rounded-2xl shadow-md">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Billing</CardTitle>
              <CardDescription className="text-sm sm:text-base">Manage your subscription and invoices.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm sm:text-base">Current Plan:</span>
                  <span className="font-semibold text-sm sm:text-base text-brand">{billing.plan}</span>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mb-2">Renews on: <span className="font-semibold text-black">{billing.renewal}</span></div>
                <div className="mb-2">
                  <div className="font-medium mb-1 text-sm sm:text-base">Last 3 Invoices</div>
                  <div className="space-y-1">
                    {billing.invoices.map(inv => (
                      <div key={inv.id} className="flex justify-between text-xs sm:text-sm bg-gray-50 rounded px-3 py-1">
                        <span>{inv.date}</span>
                        <span>{inv.amount}</span>
                        <span className="text-green-600 font-semibold">{inv.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button variant="outline" className="flex-1 border-brand text-brand hover:bg-brand/10 text-sm">Manage Subscription</Button>
                  <Button className="flex-1 bg-brand hover:bg-brand/90 text-white font-semibold text-sm">Upgrade/Downgrade</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="max-w-xl mx-auto rounded-2xl shadow-md">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Security</CardTitle>
              <CardDescription className="text-sm sm:text-base">Manage your password and account security.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Button variant="outline" onClick={() => setChangePwOpen(true)} className="flex-1 text-sm">Change Password</Button>
                  <Dialog open={changePwOpen} onOpenChange={setChangePwOpen}>
                    <DialogContent className="w-[90vw] max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>Enter your new password below.</DialogDescription>
                      </DialogHeader>
                      <Input type="password" placeholder="New password" className="mb-2" />
                      <Input type="password" placeholder="Confirm password" className="mb-4" />
                      <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => setChangePwOpen(false)} className="w-full sm:w-auto">Cancel</Button>
                        <Button onClick={handleChangePassword} className="w-full sm:w-auto">Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={twoFA} onCheckedChange={setTwoFA} />
                  <span className="text-sm sm:text-base">Enable 2FA (coming soon)</span>
                </div>
                <div className="text-xs text-muted-foreground">Last login: {user.lastLogin}</div>
                <div className="mt-4">
                  <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full text-sm">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[90vw] max-w-md mx-auto">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                        <AlertDialogDescription>This action is permanent and cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="w-full sm:w-auto">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api">
          <Card className="max-w-xl mx-auto rounded-2xl shadow-md">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">API Usage</CardTitle>
              <CardDescription className="text-sm sm:text-base">Manage your API key and monitor usage.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="font-mono text-sm sm:text-lg tracking-wider bg-gray-100 px-3 py-2 sm:py-1 rounded select-all break-all flex-1">
                    {apiKey}
                  </span>
                  <Button size="icon" variant="outline" className="border-gray-300 hover:border-[#FF7F50] hover:bg-[#FF7F50]/10 w-full sm:w-auto" aria-label="Copy API Key" onClick={handleCopy}>
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button variant="destructive" className="bg-[#FF7F50] hover:bg-[#FF7F50]/90 w-full sm:w-auto text-sm" onClick={() => setRegenOpen(true)}>
                    Regenerate Key
                  </Button>
                </div>
                <Dialog open={regenOpen} onOpenChange={setRegenOpen}>
                  <DialogContent className="w-[90vw] max-w-md mx-auto">
                    <DialogHeader>
                      <DialogTitle>Regenerate API Key?</DialogTitle>
                      <DialogDescription>This will invalidate your current key immediately.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" onClick={() => setRegenOpen(false)} className="w-full sm:w-auto">Cancel</Button>
                      <Button variant="destructive" className="bg-[#FF7F50] hover:bg-[#FF7F50]/90 w-full sm:w-auto" onClick={handleRegenerate}>Confirm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <div className="flex flex-col gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Usage this month: <span className="font-semibold text-black">{api.usage.toLocaleString()} / {api.limit.toLocaleString()} API calls</span></span>
                  <Progress value={40} className="h-2 bg-gray-200" style={{ accentColor: '#FF7F50' }} />
                  <span className="text-xs text-muted-foreground mt-1">🕒 Resets on: {api.reset}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 