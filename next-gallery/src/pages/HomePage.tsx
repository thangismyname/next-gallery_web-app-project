// src/pages/HomePage.tsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import PhotoGallery from "../components/PhotoGallery";
import UploadForm from "../components/UploadForm";
import { getPhotos } from "../services/photoService";
import type { Photo } from "../types/types"; // <-- import Photo type

const HomePage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  // Fetch all photos from backend
  const fetchPhotos = async () => {
    try {
      const data = await getPhotos(); // returns Photo[]
      setPhotos(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch photos on mount
  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <>
      <header>
        <Header />
      </header>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">📸 Next Gallery</h1>

        {/* UploadForm calls fetchPhotos after successful upload */}
        <UploadForm onUploadSuccess={fetchPhotos} />

        {/* PhotoGallery displays photos */}
        <PhotoGallery photos={photos} />
      </div>
    </>
  );
};

export default HomePage;
