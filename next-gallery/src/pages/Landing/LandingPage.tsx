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

const HomePageContent: React.FC = () => {
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
        <section className="relative w-full max-w-screen-2xl mx-auto mt-6">
          {/* 3-Image Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-hidden">
            {/* Image 1 – top-left */}
            <img
              src="/assets/image1.jpg"
              alt="Hero 1"
              className="w-full h-32 md:h-64 object-cover col-start-1 md:row-start-1 md:col-start-1"
            />

            {/* Image 2 – large, centered */}
            <img
              src="/assets/image2.jpg"
              alt="Hero 2"
              className="w-full h-64 md:h-128 object-cover 
               col-span-2 
               md:col-start-2 md:col-span-1 
               md:row-start-1 md:row-span-2"
            />

            {/* Image 3 – bottom-right */}
            <img
              src="/assets/image3.jpg"
              alt="Hero 3"
              className="w-full h-32 md:h-64 object-cover col-start-2
               md:row-start-2 md:col-start-3"
            />
          </div>

          {/* Title + Slogan Overlay */}
          <div className="absolute inset-0 flex flex-col h-full justify-between p-2 pointer-events-none">
            <h1 className="text-left text-4xl md:text-7xl font-extrabold text-white drop-shadow-lg uppercase mt-4 md:mt-6">
              Next Gallery®
            </h1>
            <div>
              <p className="text-left text-6xl md:text-9xl font-bold text-white mt-2 drop-shadow-md uppercase md:mt-3">
                Hold your
              </p>
              <p className="text-right text-6xl md:text-9xl font-bold text-white mt-2 drop-shadow-md uppercase md:mt-3">
                memories
              </p>
            </div>
          </div>
        </section>

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

export default HomePageContent;
