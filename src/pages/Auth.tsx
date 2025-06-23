import { AuthForm } from "@/components/auth/AuthForm";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-brand-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <header>
          <h1 className="font-serif text-4xl font-bold text-brand-text">
            Art Guard
          </h1>
          <p className="mt-2 text-lg text-brand-text/80">
            Authenticate to continue protecting your art.
          </p>
        </header>
        <AuthForm />
      </div>
    </div>
  );
} 