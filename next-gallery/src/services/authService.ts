import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const AUTH_URL = `${BASE_URL}/api/auth`;

export interface User {
  id?: string;
  firstName: string;
  email?: string;
  role?: string;
  studentId?: string;
}

// -------- Login --------
interface LoginResponse {
  token: string;
  user: User;
}

export const login = async ({
  email,
  password,
  rememberMe,
}: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<User> => {
  const res = await axios.post<LoginResponse>(`${AUTH_URL}/login`, { email, password });
  const { token, user } = res.data;

  if (rememberMe) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ firstName: user.firstName }));
  } else {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify({ firstName: user.firstName }));
  }

  return user;
};

// -------- Registration --------
interface RegisterResponse {
  token: string;
  user: User;
}

export const register = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: "Admin" | "Photographer" | "User";
  studentId?: string;
}): Promise<User> => {
  const res = await axios.post<RegisterResponse>(`${AUTH_URL}/register`, data);
  const { token, user } = res.data;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify({ firstName: user.firstName }));

  return user;
};

// -------- Forgot Password --------
interface ForgotPasswordResponse {
  message: string;
}

export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  const res = await axios.post<ForgotPasswordResponse>(`${AUTH_URL}/forgot-password`, { email });
  return res.data;
};

// -------- Reset Password --------
interface ResetPasswordResponse {
  message: string;
}

export const resetPassword = async (token: string, newPassword: string): Promise<ResetPasswordResponse> => {
  const res = await axios.post<ResetPasswordResponse>(`${AUTH_URL}/reset-password`, { token, newPassword });
  return res.data;
};

// -------- Logout --------
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};

// -------- Current User --------
export const getCurrentUser = (): { firstName: string } | null => {
  const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const getToken = (): string | null => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};
