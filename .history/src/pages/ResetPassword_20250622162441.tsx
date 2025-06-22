import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { Link } from "react-router-dom";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <form onSubmit={handlePasswordReset}>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email to get a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {success ? (
              <p className="text-green-600">
                Password reset link sent! Please check your email.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </>
            )}
          </CardContent>
          {!success && (
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </CardFooter>
          )}
        </form>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Remembered your password?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordPage; 