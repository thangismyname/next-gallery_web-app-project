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

// Upload a photo
export const uploadPhoto = async (formData: FormData): Promise<Photo> => {
  const res = await axios.post<Photo>(
    `${API_BASE}/api/upload`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};

// Download a photo (fixes "unknown" → Blob error)
export const downloadPhoto = async (id: string): Promise<Blob> => {
  const res = await axios.get<Blob>(
    `${PHOTO_API}/download/${id}`,
    { responseType: "blob" }
  );
  return res.data;
};
