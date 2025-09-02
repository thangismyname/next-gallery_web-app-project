// src/services/photoService.ts
import axios from "axios";
import type { Photo } from "../types/types";

const API_URL = "http://localhost:3001/photos";

// Fetch all photos
export const getPhotos = async (): Promise<Photo[]> => {
  const res = await axios.get<Photo[]>(API_URL);
  return res.data;
};

// Delete a photo by ID
export const deletePhoto = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

// Upload a photo
export const uploadPhoto = async (formData: FormData): Promise<Photo> => {
  const res = await axios.post<Photo>(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
