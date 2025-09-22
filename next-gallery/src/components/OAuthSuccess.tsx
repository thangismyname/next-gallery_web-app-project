import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface OAuthParams {
  token: string | null;
  status: string | null;
  firstName: string | null;
  avatar?: string | null;
}

const OAuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const status = params.get("status");
    const firstName = params.get("firstName") || "User"; // fallback if backend provides
    const avatar = params.get("avatar") || undefined; // optional avatar

    if (!token) {
      navigate("/login");
      return;
    }

    // Save token and user in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ firstName, avatar }));

    // Trigger storage event so HeaderWithMenu updates automatically
    window.dispatchEvent(new Event("storage"));

    // Redirect based on user status
    if (status === "new") {
      navigate("/register");
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-medium">Processing your login...</p>
    </div>
  );
};

export default OAuthSuccess;
