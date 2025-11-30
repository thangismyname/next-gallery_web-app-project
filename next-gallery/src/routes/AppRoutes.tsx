import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import LandingPage from "../pages/Landing/LandingPage";
import Login from "../pages/Account/LoginPage";
import ForgotPassword from "../pages/Account/ForgotPasswordPage";
import OAuthSuccess from "../components/account/OAuthSuccess";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />} /> */}
      <Route path="/" element={<Navigate to="/landing" replace />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
};

export default AppRoutes;
