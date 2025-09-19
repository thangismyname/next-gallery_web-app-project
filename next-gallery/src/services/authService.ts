import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const AUTH_URL = `${BASE_URL}/auth`;

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

interface ForgotPasswordResponse {
  message: string;
}

// -------- Login --------
export const login = async (data: LoginData): Promise<User> => {
  try {
    const res = await axios.post<LoginResponse>(`${AUTH_URL}/login`, {
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
    throw new Error(err.response?.data?.message || "Login failed. Please try again.");
  }
};

// -------- Logout --------
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};

// -------- Current User --------
export const getCurrentUser = (): User | null => {
  const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

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

export const register = async (data: RegisterData): Promise<User> => {
  try {
    const res = await axios.post<RegisterResponse>(`${AUTH_URL}/register`, data);

    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Registration failed. Please try again.");
  }
};

// -------- Forgot Password --------
export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  try {
    const res = await axios.post<ForgotPasswordResponse>(`${AUTH_URL}/forgot-password`, { email });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to send reset link");
  }
};

// -------- Reset Password --------
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const res = await axios.post(`${AUTH_URL}/reset-password`, {
      token,
      newPassword,
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to reset password");
  }
};
