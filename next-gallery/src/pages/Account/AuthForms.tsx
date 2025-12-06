"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import { login, register } from "@/services/authService";
import { BrandGoogle } from "@mynaui/icons-react";
import { RiDiscordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom"; // ADD THIS IMPORT

// Login Form

export function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate(); // ADD THIS HOOK
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ADD LOADING STATE

  const handleSubmit = async () => {
    try {
      setIsLoading(true); // START LOADING
      if (!email || !password) throw new Error(t("auth.errors.fillAllFields"));
      const user = await login({ email, password, rememberMe });
      console.log("Logged in user:", user);
      setError("");

      // ADD NAVIGATION AFTER SUCCESSFUL LOGIN
      navigate("/"); // or navigate("/home") if you uncomment the home route
    } catch (err: any) {
      setError(err.message || t("auth.errors.loginFailed"));
    } finally {
      setIsLoading(false); // STOP LOADING
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <Alert variant="destructive" className="whitespace-normal">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">{t("auth.email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("auth.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("auth.password")}</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.password")}
            className="pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(!!checked)}
          disabled={isLoading}
        />
        <Label
          htmlFor="remember"
          className="text-sm font-normal cursor-pointer"
        >
          {t("auth.rememberMe")}
        </Label>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? t("auth.loading") || "Loading..." : t("auth.login")}
      </Button>
    </div>
  );
}

// Register Form

export type RoleType = "User" | "Admin" | "Photographer" | "IUPC Member";

interface RegisterFormProps {
  onRoleChange?: (role: RoleType) => void;
}

export function RegisterForm({ onRoleChange }: RegisterFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate(); // ADD THIS HOOK

  const [showPassword, setShowPassword] = useState(false);
  const [showRetype, setShowRetype] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ADD LOADING STATE

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    retypePassword: "",
    role: "User" as RoleType,
    studentId: "",
    agree: false,
  });

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (role: RoleType) => {
    handleChange("role", role);
    onRoleChange?.(role);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true); // START LOADING
      const {
        firstName,
        lastName,
        email,
        password,
        retypePassword,
        agree,
        role,
        studentId,
        phone,
      } = form;

      if (!firstName || !lastName || !email || !password || !retypePassword)
        throw new Error(t("auth.errors.fillRequiredFields"));

      if (password !== retypePassword)
        throw new Error(t("auth.errors.passwordMismatch"));

      if (!agree) throw new Error(t("auth.errors.mustAgreePolicies"));

      const payload = {
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        password,
        role: role === "IUPC Member" ? "User" : role,
        studentId: role === "IUPC Member" ? studentId : undefined,
      };

      const user = await register(payload);
      console.log("Registered user:", user);
      setError("");

      // ADD NAVIGATION AFTER SUCCESSFUL REGISTRATION
      navigate("/"); // or navigate("/home") if you uncomment the home route
    } catch (err: any) {
      setError(err.message || t("auth.errors.registerFailed"));
    } finally {
      setIsLoading(false); // STOP LOADING
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <Alert variant="destructive" className="whitespace-normal">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Name fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("auth.firstName")}</Label>
          <Input
            placeholder={t("auth.firstName")}
            value={form.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label>{t("auth.lastName")}</Label>
          <Input
            placeholder={t("auth.lastName")}
            value={form.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label>{t("auth.email")}</Label>
        <Input
          type="email"
          placeholder={t("auth.email")}
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label>{t("auth.phone")}</Label>
        <Input
          placeholder={t("auth.phoneOptional")}
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label>{t("auth.password")}</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.password")}
            className="pr-10"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Retype Password */}
      <div className="space-y-2">
        <Label>{t("auth.retypePassword")}</Label>
        <div className="relative">
          <Input
            type={showRetype ? "text" : "password"}
            placeholder={t("auth.retypePassword")}
            className="pr-10"
            value={form.retypePassword}
            onChange={(e) => handleChange("retypePassword", e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowRetype(!showRetype)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            disabled={isLoading}
          >
            {showRetype ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label>{t("auth.role")}</Label>
        <select
          value={form.role}
          onChange={(e) => handleRoleChange(e.target.value as RoleType)}
          className="w-full px-3 py-2 border rounded-md bg-background"
          disabled={isLoading}
        >
          <option value="User">{t("auth.roles.user")}</option>
          <option value="Admin">{t("auth.roles.admin")}</option>
          <option value="Photographer">{t("auth.roles.photographer")}</option>
          <option value="IUPC Member">{t("auth.roles.iupcMember")}</option>
        </select>
      </div>

      {/* Student ID if IUPC */}
      {form.role === "IUPC Member" && (
        <div className="space-y-2">
          <Label>{t("auth.studentId")}</Label>
          <Input
            placeholder={t("auth.studentIdPlaceholder")}
            value={form.studentId}
            onChange={(e) => handleChange("studentId", e.target.value)}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Agree policies */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="agree"
          checked={form.agree}
          onCheckedChange={(checked) => handleChange("agree", !!checked)}
          disabled={isLoading}
        />
        <Label htmlFor="agree" className="text-sm">
          {t("auth.agreePolicies")}{" "}
          <a href="/policies" className="underline text-blue-600">
            {t("auth.policies")}
          </a>
        </Label>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? t("auth.loading") || "Loading..." : t("auth.register")}
      </Button>
    </div>
  );
}

/* =======================================================
   SOCIAL LOGIN
======================================================== */

function useAuth() {
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    const check = () => {
      try {
        const stored = localStorage.getItem("user");
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };
    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  return { user };
}

export function SocialLogin({ mode = "login" }: { mode?: "login" | "link" }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [hovered, setHovered] = useState<string | null>(null);

  const isLinking = mode === "link" || !!user;

  const handleOAuth = (provider: "google" | "discord") => {
    const baseUrl = import.meta.env.VITE_API_URL;
    if (!baseUrl) {
      alert("VITE_API_URL is not set");
      return;
    }

    const path =
      provider === "google" ? "/api/auth/google" : "/api/auth/discord";
    const url = isLinking ? `${baseUrl}${path}?link=true` : `${baseUrl}${path}`;

    window.location.href = url;
  };

  const googleText = isLinking
    ? t("auth.linkGoogle")
    : t("auth.loginWithGoogle");

  const discordText = isLinking
    ? t("auth.linkDiscord")
    : t("auth.loginWithDiscord");

  return (
    <div className="flex justify-center gap-6 mt-8">
      {/* Google */}
      <button
        onClick={() => handleOAuth("google")}
        onMouseEnter={() => setHovered("google")}
        onMouseLeave={() => setHovered(null)}
        className="relative p-3 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <BrandGoogle size={20} />
        {hovered === "google" && (
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1.5 rounded z-50">
            {googleText}
          </span>
        )}
      </button>

      {/* Discord */}
      <button
        onClick={() => handleOAuth("discord")}
        onMouseEnter={() => setHovered("discord")}
        onMouseLeave={() => setHovered(null)}
        className="relative p-3 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <RiDiscordLine size={22} />
        {hovered === "discord" && (
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1.5 rounded z-50">
            {discordText}
          </span>
        )}
      </button>
    </div>
  );
}
