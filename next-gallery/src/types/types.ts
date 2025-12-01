// src/types/index.ts
export interface Photo {
  _id: string;
  originalName: string;
  category?: string;

  originalFile: string;
  originalUrl: string;     // original file for download
  previewFile: string;
  previewUrl: string;      // browser-friendly preview
  mimetype: string;
  previewMimetype: string;
  storage: "local" | "s3";
  size: number;
  createdAt?: string;
}

export interface Album {
  id: string;
  title: string;
  coverPhoto: Photo;
  photos: Photo[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
}
