// src/services/authService.ts
import axios from "axios";

const API_URL = "http://localhost:3001/api";

interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  studentId?: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

// ✅ Login function
export const login = async (data: LoginData): Promise<User> => {
  try {
    const res = await axios.post<LoginResponse>(`${API_URL}/login`, {
      email: data.email,
      password: data.password,
    });

    const { token, user } = res.data;

    if (data.rememberMe) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
    }

    return user;
  } catch (err: any) {
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error("Login failed. Please try again.");
  }
};

// ✅ Logout function
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};

// ✅ Get current user
export const getCurrentUser = (): User | null => {
  const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

// ✅ Get current token
export const getToken = (): string | null => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// -------- Registration --------
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: "Admin" | "Photographer" | "User";
  studentId?: string;
}

interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}

// ✅ Register function
export const register = async (data: RegisterData): Promise<User> => {
  try {
    const res = await axios.post<RegisterResponse>(`${API_URL}/register`, data);

    const { token, user } = res.data;

    // Store token + user (default: localStorage)
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || "Registration failed. Please try again."
    );
  }
};
