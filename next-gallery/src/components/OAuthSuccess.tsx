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

    // Fetch full user info
    axios
      .get<{ user: User }>(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data.user;

        // Save user in localStorage
        localStorage.setItem("user", JSON.stringify(user));

        // Trigger storage event so UI updates
        window.dispatchEvent(new Event("storage"));

        // Redirect home
        navigate("/");
      })
      .catch(() => {
        navigate("/login");
      });
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-medium">Processing your login...</p>
    </div>
  );
};

export default OAuthSuccess;
