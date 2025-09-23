import React from "react";

interface Photo {
  _id: string;
  filename: string;
  originalName: string;
  category?: string;
}

interface PhotoCardProps {
  photo: Photo;
  onDelete: (id: string) => void;  // New prop
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onDelete }) => {
  return (
    <div className="border rounded shadow-sm overflow-hidden">
      <img
        src={`http://localhost:3001/uploads/${photo.filename}`}
        alt={photo.originalName}
        className="w-full h-48 object-cover"
      />
      <div className="p-2 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{photo.originalName}</p>
          <small className="text-gray-500">{photo.category}</small>
        </div>
        <button
          onClick={() => onDelete(photo._id)}
          className="text-red-600 hover:text-red-800 font-semibold"
          aria-label={`Delete ${photo.originalName}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PhotoCard;
