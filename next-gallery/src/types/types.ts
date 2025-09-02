// src/types/index.ts
export interface Photo {
  _id: string;
  filename: string;
  originalName: string;
  category?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}
