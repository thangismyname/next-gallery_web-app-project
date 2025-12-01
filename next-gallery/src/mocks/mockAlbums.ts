// src/mocks/mockAlbums.ts
import type { Album, Photo } from "@/types/types";

const mockPhotos: Photo[] = [
  {
    _id: "1",
    originalName: "photo1.jpg",
    category: "Nature",
    originalFile: "photo1.jpg",
    originalUrl: "/assets/photo1.jpg",
    previewFile: "photo1.jpg",
    previewUrl: "/assets/photo1.jpg",
    mimetype: "image/jpeg",
    previewMimetype: "image/jpeg",
    storage: "local",
    size: 102400,
  },
  {
    _id: "2",
    originalName: "photo2.jpg",
    category: "Nature",
    originalFile: "photo2.jpg",
    originalUrl: "/assets/photo2.jpg",
    previewFile: "photo2.jpg",
    previewUrl: "/assets/photo2.jpg",
    mimetype: "image/jpeg",
    previewMimetype: "image/jpeg",
    storage: "local",
    size: 204800,
  },
  {
    _id: "3",
    originalName: "photo3.jpg",
    category: "Nature",
    originalFile: "photo3.jpg",
    originalUrl: "/assets/photo3.jpg",
    previewFile: "photo3.jpg",
    previewUrl: "/assets/photo3.jpg",
    mimetype: "image/jpeg",
    previewMimetype: "image/jpeg",
    storage: "local",
    size: 307200,
  },
];

export const mockAlbums: Album[] = [
  {
    id: "a1",
    title: "Nature Album",
    coverPhoto: mockPhotos[0],
    photos: mockPhotos,
  },
  {
    id: "a2",
    title: "Travel Album",
    coverPhoto: mockPhotos[1],
    photos: mockPhotos,
  },
  {
    id: "a3",
    title: "Food Album",
    coverPhoto: mockPhotos[2],
    photos: mockPhotos,
  },
];
