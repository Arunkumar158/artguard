import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Login form will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage; 