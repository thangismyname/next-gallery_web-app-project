import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
  provider: string;
}

const OAuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // Save token
    localStorage.setItem("token", token);

    // Fetch user from backend
    axios
      .get<{ user: User }>(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data.user;

        // Save user info
        localStorage.setItem("user", JSON.stringify(user));

        // Trigger UI update
        window.dispatchEvent(new Event("storage"));

        navigate("/");
      })
      .catch(() => {
        navigate("/login");
      });
  }, [location, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-3">
        {/* Loading spinner */}
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

        <p className="text-lg font-medium">Processing your login...</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
