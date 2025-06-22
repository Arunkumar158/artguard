import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const ResetPasswordPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your email to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Reset password form will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage; 