"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";

const CTASection = () => {
  const { theme } = useTheme();

  return (
    <section className="w-full px-6 h-[300px] md:h-[400px] rounded-2xl overflow-hidden relative flex flex-col md:flex-row border border-border shadow-lg md:shadow-xl mt-16">
      {/* Mobile background image */}
      <img
        src="/assets/background.jpg"
        alt="Photography hero"
        className="absolute inset-0 w-full h-full object-cover md:hidden"
      />
      <div className="absolute inset-0 bg-black/25 md:hidden"></div>

      {/* Left side image for desktop */}
      <div className="hidden md:block md:w-1/2 h-full relative">
        <img
          src="/assets/background.jpg"
          alt="Photography hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Right side CTA */}
      <div
        className={`md:w-1/2 flex items-center justify-center p-8 relative z-10 md:bg-opacity-100 rounded-2xl`}
      >
        <div className="text-center md:text-left max-w-lg">
          <h2 className="text-3xl md:text-4xl font-bold">{`Elevate Your Photography Workflow`}</h2>
          <p className="mt-4">{`Upload, organize, and share your photos effortlessly with our modern gallery platform.`}</p>
          <div className="mt-6">
            <Button
              size="lg"
              className="rounded-xl px-8 py-4 text-base shadow-md hover:shadow-lg transition font-semibold md:w-sm"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
