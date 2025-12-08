import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LandingPage from "../Landing/LandingPage";

export default function LandingRedirect() {
  const [visited, setVisited] = useState<boolean | null>(null);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      localStorage.setItem("hasVisited", "true");
      setVisited(false); // First time → show landing
    } else {
      setVisited(true); // Already visited
    }
  }, []);

  if (visited === null) return null;

  if (visited) {
    return <Navigate to="/home" replace />;
  }

  return <LandingPage />;
}
