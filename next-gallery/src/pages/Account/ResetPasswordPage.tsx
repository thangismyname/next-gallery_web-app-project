"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "@/components/theme/theme-provider";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

import { verifyOtp, resetPassword } from "@/services/authService";
import { ThemeToggle } from "@/components/theme/mode-toggle";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"; // Shadcn OTP API

const otpStepSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});
const newPasswordSchema = z.object({
  otp: z.string(), // still required because you send it later
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

type ResetForm =
  | z.infer<typeof otpStepSchema>
  | z.infer<typeof newPasswordSchema>;

export default function ResetPasswordPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"otp" | "newPassword">("otp");
  const [error, setError] = useState("");

  const form = useForm<ResetForm>({
    resolver: zodResolver(step === "otp" ? otpStepSchema : newPasswordSchema),
    defaultValues: { otp: "", newPassword: "" },
  });

  // Get email from query string safely (Vite / browser)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email") || "");
  }, []);

  const handleVerifyOtp = async (data: ResetForm) => {
    setLoading(true);
    setError("");
    try {
      await verifyOtp(email, data.otp);
      setStep("newPassword");
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetForm) => {
    setLoading(true);
    setError("");
    try {
      await resetPassword(
        email,
        form.getValues("otp"),
        form.getValues("newPassword")
      );
      alert("Password reset successful! You can now log in.");
      window.location.href = "/auth";
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
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
          <CardTitle className="text-3xl font-bold">
            {step === "otp" ? "Enter OTP" : "Set New Password"}
          </CardTitle>
          <CardDescription>
            {step === "otp"
              ? `Enter the 6-digit OTP sent to ${email}`
              : `Set a new password for ${email}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-10 pb-10 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={
              step === "otp"
                ? form.handleSubmit(handleVerifyOtp)
                : form.handleSubmit(handleResetPassword)
            }
            className="space-y-6 items-center justify-center"
          >
            {step === "otp" && (
              <div className="w-full flex items-center justify-center">
                <InputOTP
                  value={form.watch("otp")}
                  onChange={(val) =>
                    form.setValue("otp", val, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  maxLength={6}
                  textAlign="center"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            )}

            {step === "newPassword" && (
              <Input
                {...form.register("newPassword")}
                type="password"
                placeholder="New password"
              />
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {step === "otp" ? "Verify OTP" : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
