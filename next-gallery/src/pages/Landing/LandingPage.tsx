"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme/theme-provider"; // Fixed import

import HeaderWithMenu from "@/components/header/headerwithmenu";
import Newsletter from "@/components/footer/Newsletter";
import Footer from "@/components/footer/Footer";
import PhotoGallery from "@/components/PhotoGallery";
import UploadForm from "@/components/UploadForm";
import { getPhotos } from "@/services/photoService";
import type { Photo } from "@/types/types";

// Sections
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import FeatureSection from "./sections/FeatureSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import ShowcaseSection from "./sections/ShowcaseSection";

const LandingPageContent: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme(); // Now using the correct custom theme provider

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPhotos();
      setPhotos(data);
    } catch (err) {
      console.error(err);
      setError(t("error.failed_to_load_photos") || "Failed to load photos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <HeaderWithMenu />

      {/* Main content */}
      <main className="grow mx-6 md:mx-12 lg:mx-18 max-w-screen-2xl">
        {/* ===== HERO SECTION ===== */}
        <HeroSection />
        {/* ===== ABOUT SECTION ===== */}
        <AboutSection />
        {/* ===== FEATURE SECTION ===== */}
        <FeatureSection />
        {/* ===== HOW IT WORKS SECTION ===== */}
        <HowItWorksSection />
        {/* ===== SHOWCASE SECTION ===== */}
        <ShowcaseSection albums={[]} />

        {/* Status messages */}
        {isLoading && (
          <p className="text-center text-muted-foreground">
            {t("status.loading_photos") || "Loading photos..."}
          </p>
        )}
        {error && <p className="text-center text-destructive">{error}</p>}
        {!isLoading && !error && photos.length === 0 && (
          <p className="text-center text-muted-foreground">
            {t("status.no_photos_available") || "No photos available"}
          </p>
        )}

        {/* Upload form and gallery */}
        <div className="p-6 space-y-6">
          <UploadForm onUploadSuccess={fetchPhotos} />
          <PhotoGallery photos={photos} />
        </div>
      </main>

      {/* Footer */}
      <Newsletter />
      <Footer />
    </div>
  );
};

export default LandingPageContent;
