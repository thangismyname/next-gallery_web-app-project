"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative w-full max-w-screen-2xl mx-auto mt-6">
      {/* 3-Image Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-hidden">
        <img
          src="/assets/image1.jpg"
          alt={t("landingpage.hero_image1_alt") || "Hero Image 1"}
          className="w-full h-32 md:h-64 object-cover col-start-1 md:row-start-1 md:col-start-1"
        />

        <img
          src="/assets/image2.jpg"
          alt={t("landingpage.hero_image2_alt") || "Hero Image 2"}
          className="w-full h-64 md:h-128 object-cover 
            col-span-2 
            md:col-start-2 md:col-span-1 
            md:row-start-1 md:row-span-2"
        />

        <img
          src="/assets/image3.jpg"
          alt={t("landingpage.hero_image3_alt") || "Hero Image 3"}
          className="w-full h-32 md:h-64 object-cover col-start-2
            md:row-start-2 md:col-start-3"
        />
      </div>

      {/* Title + Slogan Overlay */}
      <div className="absolute inset-0 flex flex-col h-full justify-between p-2 pointer-events-none">
        <h1 className="text-left text-4xl md:text-7xl font-extrabold text-white drop-shadow-lg uppercase mt-4 md:mt-6">
          {t("landingpage.hero_title")}
        </h1>

        <div>
          <p className="text-left text-6xl md:text-9xl font-bold text-white mt-2 drop-shadow-md uppercase md:mt-3">
            {t("landingpage.hero_line1")}
          </p>
          <p className="text-right text-6xl md:text-9xl font-bold text-white mt-2 drop-shadow-md uppercase md:mt-3">
            {t("landingpage.hero_line2")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
