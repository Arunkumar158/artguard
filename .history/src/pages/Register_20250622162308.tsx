import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your details to register.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Registration form will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage; 