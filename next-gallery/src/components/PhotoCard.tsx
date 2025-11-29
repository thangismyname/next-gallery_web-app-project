import React from "react";
import { downloadPhoto } from "../services/photoService";
import type { Photo } from "../types/types";
import { Button } from "@/components/ui/button"; // Shadcn Button

interface PhotoCardProps {
  photo: Photo;
  onDelete: (id: string) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onDelete }) => {
  const handleDownload = async () => {
    try {
      await downloadPhoto(photo);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download photo");
    }
  };

  return (
    <div className="border border-border rounded-lg bg-card shadow-sm overflow-hidden transition-colors">
      <img
        src={`${import.meta.env.VITE_API_URL}/${photo.previewUrl}`}
        alt={photo.originalName}
        className="w-full h-48 object-cover"
      />

      <div className="p-3 flex flex-col gap-2">
        {/* Title */}
        <div>
          <p className="text-sm font-medium text-foreground">
            {photo.originalName}
          </p>
          <small className="text-xs text-muted-foreground">
            {photo.category}
          </small>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-2">
          <Button size="sm" variant="outline" onClick={handleDownload}>
            Download
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(photo._id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
