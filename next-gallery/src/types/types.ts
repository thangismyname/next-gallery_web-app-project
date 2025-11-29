// src/types/index.ts
export interface Photo {
  _id: string;
  originalName: string;
  category?: string;

  // backend fields
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

export interface User {
  _id: string;
  name: string;
  email: string;
}
