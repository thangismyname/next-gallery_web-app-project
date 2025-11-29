"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme/theme-provider";

import HeaderWithMenu from "@/components/header/headerwithmenu";
import Footer from "@/components/footer/Footer";

const HomePageContent: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <HeaderWithMenu />

      {/* MAIN AREA — Minimal + Centered */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Next Gallery</h1>

        <p className="text-muted-foreground mb-8 max-w-lg">
          {t("homepage.subtitle", {
            defaultValue:
              "A clean and minimal workspace for developing your photo-sharing platform.",
          })}
        </p>

        <div className="border border-border rounded-lg p-6 w-full max-w-md text-sm text-muted-foreground">
          <p>🚧 Development Zone</p>
          <p className="mt-2">
            Start building your components here, or connect your backend.
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePageContent;
