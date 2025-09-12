import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppProvider, AppContext } from "../components/Theme/AppContext";
import Header from "../components/Header/Header";
import Newsletter from "../components/Footer/Newsletter";
import Footer from "../components/Footer/Footer";
import PhotoGallery from "../components/PhotoGallery";
import UploadForm from "../components/UploadForm";
import { getPhotos } from "../services/photoService";
import type { Photo } from "../types/types";
import AnimatedTitle from "../components/HomePage/AnimatedTitle";
import CreatorCredit from "../components/HomePage/CreatorCredit";
import TransferLines from "../components/HomePage/TransferLines";

const HomePageContent: React.FC = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  if (!context)
    throw new Error("HomePageContent must be used within AppProvider");

  const { darkMode } = context;

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
      setError(t("error.failed_to_load_photos"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-center">
        <AnimatedTitle />
        <div className="flex-grow mx-6 md:mx-12 lg:mx-18 max-w-screen-2xl grid grid-cols-12 gap-px px-[1px] py-0 bg-border-primary border-l border-r">
          <header
            className={`col-span-12 ${
              menuOpen ? "backdrop-blur-sm bg-gray-800/40" : ""
            }`}
          >
            <Header />
          </header>
          <main className="col-span-12 flex-1">
            <CreatorCredit />
            <TransferLines />
            {isLoading && (
              <p className="text-gray-500 dark:text-gray-400">
                {t("status.loading_photos")}
              </p>
            )}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && photos.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400">
                {t("status.no_photos_available")}
              </p>
            )}
            <div className="p-6">
              <UploadForm onUploadSuccess={fetchPhotos} />
              <PhotoGallery photos={photos} />
            </div>
          </main>
          <div className="col-span-12">
            <Newsletter />
          </div>
          <footer className="col-span-12">
            <Footer />
          </footer>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => (
  <AppProvider>
    <HomePageContent />
  </AppProvider>
);

export default HomePage;
