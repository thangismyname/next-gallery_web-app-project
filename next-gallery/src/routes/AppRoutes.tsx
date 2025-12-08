import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import LandingPage from "../pages/Landing/LandingPage";
import Auth from "../pages/Account/AuthPage";
import OAuthSuccess from "../components/account/OAuthSuccess";
import ForgotPassword from "@/pages/Account/ForgotPasswordPage";
import ResetPassword from "../pages/Account/ResetPasswordPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />} /> */}
      <Route path="/" element={<HomePage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
};

export default AppRoutes;
