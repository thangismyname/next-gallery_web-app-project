"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const AboutSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full max-w-screen-2xl mx-auto py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-4 md:px-8">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            {t("about.title") || "A Better Way to Share Your Photos"}
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
            {t("about.description") ||
              "Next Gallery® helps photographers organize photos into beautiful albums and deliver them to clients effortlessly. No more messy Google Drive links — just clean, visual collections optimized for sharing."}
          </p>

          {/* STATISTICS */}
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">
                200+
              </p>
              <p className="text-muted-foreground text-sm md:text-base">
                {t("about.stat1") || "High-quality images delivered"}
              </p>
            </div>

            <div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">
                50+
              </p>
              <p className="text-muted-foreground text-sm md:text-base">
                {t("about.stat2") || "Albums created for clients"}
              </p>
            </div>

            <div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">
                10+
              </p>
              <p className="text-muted-foreground text-sm md:text-base">
                {t("about.stat3") || "Photographers onboarded"}
              </p>
            </div>

            <div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">
                5x
              </p>
              <p className="text-muted-foreground text-sm md:text-base">
                {t("about.stat4") || "Faster delivery than Drive/Zalo"}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — IMAGE */}
        <div className="flex justify-center">
          <img
            src="/assets/about-preview.jpg" // <-- Replace with your real image
            alt="About Next Gallery"
            className="rounded-2xl shadow-lg w-full max-w-md object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
