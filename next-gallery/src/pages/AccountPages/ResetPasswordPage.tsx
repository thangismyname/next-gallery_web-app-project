import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../components/AppContext";

const ResetPassword: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(AppContext);

  if (!context) throw new Error("Must be used within AppProvider");
  const { darkMode } = context;

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Extract token from URL query params
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      setError(t("reset_password.error_required"));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("reset_password.error_mismatch"));
      return;
    }

    if (!token) {
      setError(t("reset_password.error_invalid_token"));
      return;
    }

    // Simulate API call
    console.log(
      "Resetting password with token:",
      token,
      "New password:",
      formData.password
    );
    setSuccess(t("reset_password.success_message"));
    setFormData({ password: "", confirmPassword: "" });

    // Optionally redirect to login after 2-3 seconds
    setTimeout(() => navigate("/login"), 2500);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-slate-50 text-black"
      }`}
    >
      <div className="text-center space-y-3 mb-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          {t("reset_password.title")}
        </h1>
        <p className="text-sm md:text-base text-center max-w-md mx-auto">
          {t("reset_password.subtitle")}
        </p>
      </div>

      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-xl flex flex-col gap-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={t("reset_password.new_password")}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
              darkMode
                ? "bg-gray-700 border-zinc-600 text-zinc-300 focus:ring-blue-400"
                : "bg-white border-zinc-200 text-zinc-600 focus:ring-blue-500"
            }`}
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder={t("reset_password.confirm_password")}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
              darkMode
                ? "bg-gray-700 border-zinc-600 text-zinc-300 focus:ring-blue-400"
                : "bg-white border-zinc-200 text-zinc-600 focus:ring-blue-500"
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-1">{success}</p>}

          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-blue-600 dark:bg-blue-700 text-white font-semibold hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            {t("reset_password.submit_button")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
