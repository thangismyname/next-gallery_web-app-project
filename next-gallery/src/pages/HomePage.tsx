import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppProvider, AppContext } from "../components/AppContext";
import Header from "../components/Header/Header";
import Newsletter from "../components/Footer/Newsletter";
import Footer from "../components/Footer/Footer";
import PhotoGallery from "../components/PhotoGallery";
import UploadForm from "../components/UploadForm";
import { getPhotos } from "../services/photoService";
import type { Photo } from "../types/types";

const HomePageContent: React.FC = () => {
  const { t } = useTranslation(); // Initialize translation hook
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
      setError(t("error.failed_to_load_photos")); // Use translation key for error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <header>
        <Header />
      </header>
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">{t("title.next_gallery")}</h1>

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

        <UploadForm onUploadSuccess={fetchPhotos} />
        <PhotoGallery photos={photos} />
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
};

const HomePage: React.FC = () => (
  <AppProvider>
    <HomePageContent />
  </AppProvider>
);

export default HomePage;
