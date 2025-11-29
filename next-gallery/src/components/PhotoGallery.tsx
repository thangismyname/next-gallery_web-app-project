// src/components/PhotoGallery.tsx
import React from "react";
import PhotoCard from "./PhotoCard";
import type { Photo } from "../types/types";

interface PhotoGalleryProps {
  photos: Photo[];
  onDelete?: (id: string) => void; // optional if deletion is handled externally
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onDelete }) => {
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    if (onDelete) onDelete(id);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <PhotoCard key={photo._id} photo={photo} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default PhotoGallery;
