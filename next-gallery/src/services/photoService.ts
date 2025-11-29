// src/services/photoService.ts
import axios from "axios";
import type { Photo } from "../types/types";

// Load from Vite env
const API_BASE = import.meta.env.VITE_API_URL;

// Photos endpoint
const PHOTO_API = `${API_BASE}/api/photos`;

// Fetch all photos
export const getPhotos = async (): Promise<Photo[]> => {
  const res = await axios.get<Photo[]>(PHOTO_API);
  return res.data;
};

// Get photo by ID
export const getPhotoById = async (id: string): Promise<Photo> => {
  const res = await axios.get<Photo>(`${PHOTO_API}/${id}`);
  return res.data;
};

// Delete a photo by ID
export const deletePhoto = async (id: string): Promise<void> => {
  await axios.delete(`${PHOTO_API}/${id}`);
};

// Upload a photo (formData contains key "photo")
export const uploadPhoto = async (formData: FormData): Promise<Photo> => {
  const res = await axios.post<Photo>(`${PHOTO_API}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Download a photo using the Photo object
export const downloadPhoto = async (photo: Photo): Promise<void> => {
  try {
    const url = `${PHOTO_API}/download/${photo._id}`;
    const res = await axios.get<Blob>(url, { responseType: "blob" });

    // Create a temporary link to trigger download
    const blobUrl = window.URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = photo.originalName || "photo.jpg";
    a.click();
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("❌ Download failed:", err);
    throw new Error("Failed to download photo");
  }
};
