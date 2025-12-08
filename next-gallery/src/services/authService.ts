import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const AUTH_URL = `${BASE_URL}/api/auth`;

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "Admin" | "Photographer" | "User" | "IUPC Member";
  studentId?: string;
  providers: { provider: "local" | "google" | "discord"; providerId?: string }[];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

// ---------------------- LOGIN ----------------------
export const login = async ({
  email,
  password,
  rememberMe,
}: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<User> => {
  try {
    console.log("authService: Login attempt:", { email });
    const res = await axios.post<AuthResponse>(`${AUTH_URL}/auth`, { email, password });
    const { token, user } = res.data;

    if (rememberMe) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
    }
    window.dispatchEvent(new Event("storage"));

    console.log("authService: Login success:", { user, token });
    return user;
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || "Login failed";
    console.error("authService: Login error:", message);
    throw new Error(message);
  }
};

// ---------------------- REGISTER ----------------------
export const register = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: "Admin" | "Photographer" | "User";
  studentId?: string;
}): Promise<User> => {
  try {
    console.log("authService: Register attempt:", data);
    const res = await axios.post<AuthResponse>(`${AUTH_URL}/register`, data);
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("storage"));

    console.log("authService: Register success:", { user, token });
    return user;
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || "Registration failed";
    console.error("authService: Register error:", message);
    throw new Error(message);
  }
};

// ---------------------- LINK PROVIDER ----------------------
export const linkProvider = async (
  email: string,
  provider?: "google" | "discord",
  providerId?: string,
  password?: string
): Promise<{ message: string; user: User }> => {
  try {
    console.log("authService: Link provider attempt:", { email, provider, providerId, hasPassword: !!password });
    const res = await axios.post<{ message: string; user: User }>(
      `${AUTH_URL}/link-provider`,
      { email, provider, providerId, password }
    );

    localStorage.setItem("user", JSON.stringify(res.data.user));
    window.dispatchEvent(new Event("storage"));

    console.log("authService: Link provider success:", res.data);
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || "Link provider failed";
    console.error("authService: Link provider error:", message);
    throw new Error(message);
  }
};

// ---------------------- FORGOT PASSWORD ----------------------
export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  try {
    console.log("authService: Forgot password attempt:", { email });
    const res = await axios.post<{ message: string }>(
      `${AUTH_URL}/forgot-password`,
      { email }
    );
    console.log("authService: Forgot password success:", res.data);
    return res.data; // only message, never return OTP
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || "Forgot password failed";
    console.error("authService: Forgot password error:", message);
    throw new Error(message);
  }
};

// ---------------------- VERIFY OTP ----------------------
export const verifyOtp = async (email: string, otp: string): Promise<{ message: string }> => {
  try {
    const res = await axios.post<{ message: string }>(`${AUTH_URL}/verify-otp`, { email, otp });
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || "OTP verification failed";
    throw new Error(message);
  }
};


// ---------------------- RESET PASSWORD ----------------------
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<{ message: string }> => {
  try {
    console.log("authService: Reset password attempt:", { email, otp });
    const res = await axios.post<{ message: string }>(
      `${AUTH_URL}/reset-password`,
      { email, otp, newPassword } // must match backend field names
    );
    console.log("authService: Reset password success:", res.data);
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || "Reset password failed";
    console.error("authService: Reset password error:", message);
    throw new Error(message);
  }
};

// ---------------------- LOGOUT ----------------------
export const logout = () => {
  console.log("authService: Logging out");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  window.dispatchEvent(new Event("storage"));
};

// ---------------------- GET TOKEN ----------------------
export const getToken = (): string | null => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  console.log("authService: getToken:", token ? "Found" : "Not found");
  return token;
};
