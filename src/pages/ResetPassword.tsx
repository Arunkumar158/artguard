import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function handleResetPassword(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });
    if (error) {
      toast({
        title: "Error resetting password",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password reset successfully",
        description: "You can now sign in with your new password.",
      });
      navigate("/auth");
    }
    setIsSubmitting(false);
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-brand-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <header>
          <h1 className="font-serif text-4xl font-bold text-brand-text">
            Reset Your Password
          </h1>
        </header>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleResetPassword)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
} 