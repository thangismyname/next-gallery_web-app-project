import React, { useState, useEffect } from "react";
import axios from "axios";
import PhotoCard from "../components/PhotoCard";
import UploadForm from "../components/UploadForm";

interface Photo {
  _id: string;
  filename: string;
  originalName: string;
  category?: string;
}

const HomePage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const fetchPhotos = async () => {
    try {
      const res = await axios.get<Photo[]>("http://localhost:3001/photos");
      setPhotos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      await axios.delete(`http://localhost:3001/photos/${id}`);
      setPhotos((prev) => prev.filter((photo) => photo._id !== id));
      alert("Photo deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete photo");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">📸 Next Gallery</h1>

      <UploadForm onUploadSuccess={fetchPhotos} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <PhotoCard key={photo._id} photo={photo} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
