import axios from "axios";
import type { User } from "../services/authService"; // type-only import
import { getToken } from "../services/authService";  // normal import


const BASE_URL = import.meta.env.VITE_API_URL;
const AUTH_URL = `${BASE_URL}/api/auth`;

// ---- Get Current User ----
export const getCurrentUser = (): User | null => {
  const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user");

  if (!storedUser || storedUser === "undefined") {
    console.log("userService: getCurrentUser: No user found in storage");
    return null;
  }

  try {
    const user = JSON.parse(storedUser) as User;
    console.log("userService: getCurrentUser: Retrieved user:", user);
    return user;
  } catch (err) {
    console.error("userService: getCurrentUser: Failed to parse user:", err);
    return null;
  }
};

// ---- Update User ----
export const updateUser = async (
  data: Partial<User> & { password?: string; address?: string }
): Promise<User> => {
  const token = getToken();
  if (!token) throw new Error("No authentication token found");

  const url = `${BASE_URL}/api/users/me`;

  const res = await axios.put<{ user: User }>(url, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const { user } = res.data;

  // Sync storage
  if (localStorage.getItem("token")) {
    localStorage.setItem("user", JSON.stringify(user));
  } else if (sessionStorage.getItem("token")) {
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  window.dispatchEvent(new Event("storage"));
  return user;
};

// ---- Change Password (logged in) ----
export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<{ message: string }> => {
  const token = getToken();
  if (!token) throw new Error("No authentication token found");

  const res = await axios.put<{ message: string }>(
    `${AUTH_URL}/change-password`,
    { oldPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};
