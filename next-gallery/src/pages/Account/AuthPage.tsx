"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";
import { useTranslation } from "react-i18next";
import { LoginForm, RegisterForm, SocialLogin } from "./AuthForms";
import { ThemeToggle, LanguageToggle } from "@/components/theme/mode-toggle";
import { Link } from "react-router-dom";

export default function AuthPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [isLogin, setIsLogin] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [needsExtraSpace, setNeedsExtraSpace] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 bg-background text-foreground">
      {/* Tabs */}
      <div className="mb-10 z-10">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex bg-white/10 backdrop-blur-md rounded-full shadow-lg border">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-8 py-3 rounded-full font-semibold transition-all ${
              isLogin
                ? "bg-card text-card-foreground shadow-md"
                : "text-foreground hover:bg-card/20"
            }`}
          >
            {t("auth.login")}
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`px-8 py-3 rounded-full font-semibold transition-all ${
              !isLogin
                ? "bg-card text-card-foreground shadow-md"
                : "text-foreground hover:bg-card/20"
            }`}
          >
            {t("auth.register")}
          </button>
        </div>
      </div>

      {/* Container */}
      <div className="w-full max-w-6xl">
        <div className="relative w-full h-[680px] rounded-3xl overflow-hidden shadow-2xl">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&w=2070')",
            }}
          >
            <div className="absolute inset-0 bg-black/60" />
          </div>

          {/* Mobile Layout */}
          {isMobile ? (
            <div className="relative z-10 h-full flex flex-col justify-center p-6">
              <div className="bg-card rounded-2xl p-8 shadow-2xl space-y-6 backdrop-blur-xl">
                {isLogin ? (
                  <>
                    <LoginForm />
                    <div className="text-center">
                      <Link
                        to="/forgot-password"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {t("auth.forgotPassword")}
                      </Link>
                    </div>
                  </>
                ) : (
                  <RegisterForm
                    onRoleChange={(role) =>
                      setNeedsExtraSpace(role === "IUPC Member")
                    }
                  />
                )}

                <p className="text-center text-sm text-muted-foreground">
                  {isLogin ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    {isLogin ? t("auth.register") : t("auth.login")}
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Sliding Panel */}
              <div
                className={`absolute top-0 h-full w-1/2 bg-card text-card-foreground backdrop-blur-xl transition-all duration-700 ease-in-out z-20 flex items-center justify-center px-12 overflow-y-auto ${
                  isLogin ? "left-0" : "left-1/2"
                }`}
              >
                <div className="max-w-md w-full space-y-6">
                  {isLogin ? (
                    <>
                      <LoginForm />
                      <div className="text-center">
                        <Link
                          to="/forgot-password"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {t("auth.forgotPassword")}
                        </Link>
                      </div>
                    </>
                  ) : (
                    <RegisterForm
                      onRoleChange={(role) =>
                        setNeedsExtraSpace(role === "IUPC Member")
                      }
                    />
                  )}
                </div>
              </div>

              {/* Left Welcome Panel */}
              <div
                className={`absolute left-0 top-0 h-full w-1/2 flex flex-col items-center justify-center px-12 text-white transition-opacity duration-700 ${
                  !isLogin ? "opacity-100 z-10" : "opacity-0"
                }`}
              >
                <h2 className="text-5xl font-bold mb-6">
                  {t("auth.welcomeBack")}
                </h2>
                <p className="text-lg max-w-sm mb-10">
                  {t("auth.welcomeBackDesc")}
                </p>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-10"
                  onClick={() => setIsLogin(true)}
                >
                  {t("auth.login")}
                </Button>
              </div>

              {/* Right Welcome Panel */}
              <div
                className={`absolute right-0 top-0 h-full w-1/2 flex flex-col items-center justify-center px-12 text-white transition-opacity duration-700 ${
                  isLogin ? "opacity-100 z-10" : "opacity-0"
                }`}
              >
                <h2 className="text-5xl font-bold mb-6">
                  {t("auth.helloFriends")}
                </h2>
                <p className="text-lg max-w-sm mb-10">
                  {t("auth.helloFriendsDesc")}
                </p>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-10"
                  onClick={() => setIsLogin(false)}
                >
                  {t("auth.registerNow")}
                </Button>
              </div>
            </>
          )}
        </div>

        {!isMobile && (
          <div className="flex justify-center mt-8">
            <SocialLogin mode="login" />
          </div>
        )}
      </div>
    </div>
  );
}
