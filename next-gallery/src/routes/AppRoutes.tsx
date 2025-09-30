import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Login from "../pages/AccountPages/LoginPage";
import Register from "../pages/AccountPages/ReigsterPage";
import ForgotPassword from "../pages/AccountPages/ForgotPasswordPage";
import ResetPassword from "../pages/AccountPages/ResetPasswordPage";
import OAuthSuccess from "../components/Account/OAuthSuccess";
import UserPage from "../pages/UserPage"; // ← renamed import

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/userpage" element={<UserPage />} /> {/* ← changed path */}
    </Routes>
  );
};

export default AppRoutes;
