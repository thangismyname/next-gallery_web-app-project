"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "@/components/theme/theme-provider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { forgotPassword } from "@/services/authService";
import { ThemeToggle } from "@/components/theme/mode-toggle";

const emailSchema = z.object({ email: z.string().email("Invalid email") });
type EmailForm = z.infer<typeof emailSchema>;

export default function ForgotPasswordPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const form = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });

  const handleSendOtp = async (data: EmailForm) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await forgotPassword(data.email);
      setEmail(data.email);
      setSuccess("OTP has been sent to your email!");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 ${
        isDark ? "bg-black" : "bg-gray-50"
      }`}
    >
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md bg-white dark:bg-black/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
        <CardHeader className="text-center pt-10 pb-6">
          <CardTitle className="text-3xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset OTP
          </CardDescription>
        </CardHeader>

        <CardContent className="px-10 pb-10 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <AlertDescription className="text-green-800 dark:text-green-200">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {!success && (
            <form
              onSubmit={form.handleSubmit(handleSendOtp)}
              className="space-y-6"
            >
              <Input
                {...form.register("email")}
                type="email"
                placeholder="Enter your email"
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Send OTP
              </Button>
            </form>
          )}

          {success && (
            <Button
              className="w-full"
              onClick={() =>
                (window.location.href = `/reset-password?email=${encodeURIComponent(
                  email
                )}`)
              }
            >
              Enter OTP
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
