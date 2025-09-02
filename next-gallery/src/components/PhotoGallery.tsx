// src/components/PhotoGallery.tsx
import React from "react";
import { deletePhoto } from "../services/photoService";
import PhotoCard from "./PhotoCard";
import type { Photo } from "../types/types";

interface PhotoGalleryProps {
  photos: Photo[];
  onDelete?: (id: string) => void; // optional if deletion is handled externally
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onDelete }) => {
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      if (onDelete) {
        onDelete(id); // use parent handler if provided
      } else {
        await deletePhoto(id); // delete directly
        alert("Photo deleted successfully");
        // Normally you'd refresh photos after deletion
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete photo");
    }
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
