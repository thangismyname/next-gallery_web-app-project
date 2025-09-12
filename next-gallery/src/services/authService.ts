// src/services/authService.ts
import axios from "axios";

const API_URL = "http://localhost:3001/api"; // updated backend URL

interface LoginData {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

// Login function
export const login = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const res = await axios.post<LoginResponse>(`${API_URL}/login`, data);
    return res.data;
  } catch (err: any) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error("Login failed. Please try again.");
  }
};

// Optional: Logout function
export const logout = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};

// Optional: Get current user token
export const getToken = (): string | null => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};
