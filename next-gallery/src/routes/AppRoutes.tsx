import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Login from "../pages/AccountPages/LoginPage";
import OauthSuccess from "../pages/AccountPages/OAuthSuccessPage";
import Register from "../pages/AccountPages/ReigsterPage";
import ForgotPassword from "../pages/AccountPages/ForgotPasswordPage";
import ResetPassword from "../pages/AccountPages/ResetPasswordPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth-success" element={<OauthSuccess />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
};

export default AppRoutes;
