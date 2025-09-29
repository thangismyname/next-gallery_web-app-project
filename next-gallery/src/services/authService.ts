import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const AUTH_URL = `${BASE_URL}/api/auth`;

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "Admin" | "Photographer" | "User";
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

// Login
export const login = async ({
  email,
  password,
  rememberMe,
}: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<User> => {
  console.log("authService: Login attempt:", { email });
  const res = await axios.post<AuthResponse>(`${AUTH_URL}/login`, {
    email,
    password,
  });

  const { token, user } = res.data as AuthResponse;
  console.log("authService: Login success:", { user, token });

  if (rememberMe) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    console.log("authService: Stored in localStorage:", user);
  } else {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(user));
    console.log("authService: Stored in sessionStorage:", user);
  }

  window.dispatchEvent(new Event("storage"));
  return user;
};

// Register
export const register = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: "Admin" | "Photographer" | "User";
  studentId?: string;
}): Promise<User> => {
  console.log("authService: Register attempt:", data);
  const res = await axios.post<AuthResponse>(`${AUTH_URL}/register`, data);

  const { token, user } = res.data as AuthResponse;
  console.log("authService: Register success:", { user, token });

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  console.log("authService: Stored in localStorage:", user);

  window.dispatchEvent(new Event("storage"));
  return user;
};

// Link Provider
export const linkProvider = async (
  email: string,
  provider?: "google" | "discord",
  providerId?: string,
  password?: string
): Promise<{ message: string; user: User }> => {
  console.log("authService: Link provider attempt:", { email, provider, providerId, hasPassword: !!password });
  const res = await axios.post<{ message: string; user: User }>(
    `${AUTH_URL}/link-provider`,
    { email, provider, providerId, password }
  );
  console.log("authService: Link provider success:", res.data);

  localStorage.setItem("user", JSON.stringify(res.data.user));
  console.log("authService: Updated user in localStorage:", res.data.user);
  window.dispatchEvent(new Event("storage"));

  return res.data;
};

// Forgot Password
export const forgotPassword = async (
  email: string
): Promise<{ message: string }> => {
  console.log("authService: Forgot password attempt:", { email });
  const res = await axios.post<{ message: string }>(
    `${AUTH_URL}/forgot-password`,
    { email }
  );
  console.log("authService: Forgot password success:", res.data);
  return res.data;
};

// Reset Password
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<{ message: string }> => {
  console.log("authService: Reset password attempt:", { token });
  const res = await axios.post<{ message: string }>(
    `${AUTH_URL}/reset-password`,
    { token, newPassword }
  );
  console.log("authService: Reset password success:", res.data);
  return res.data;
};

// Logout
export const logout = () => {
  console.log("authService: Logging out");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  window.dispatchEvent(new Event("storage"));
};

// Current User
export const getCurrentUser = (): User | null => {
  const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user");

  if (!storedUser || storedUser === "undefined") {
    console.log("authService: getCurrentUser: No user found in storage");
    return null;
  }

  try {
    const user = JSON.parse(storedUser) as User;
    console.log("authService: getCurrentUser: Retrieved user:", user);
    return user;
  } catch (err) {
    console.error("authService: getCurrentUser: Failed to parse user:", err);
    return null;
  }
};

// Get Token
export const getToken = (): string | null => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  console.log("authService: getToken:", token ? "Found" : "Not found");
  return token;
};