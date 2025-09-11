import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../components/AppContext";

const Login: React.FC = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);

  const context = useContext(AppContext);
  if (!context) {
    throw new Error("This component must be used within an AppProvider");
  }

  const { darkMode } = context;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError(t("login.error_fill_fields")); // Use translation for error
      return;
    }
    console.log("Login with:", formData);
    setError(null);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 
      ${darkMode ? "bg-gray-900" : "bg-slate-50"}`}
    >
      {/* Title & Subtitle OUTSIDE the box */}
      <div className="text-center space-y-3 mb-6">
        <h1
          className={`text-4xl md:text-5xl font-bold leading-tight
          ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          {t("login.title")} {/* Translated title */}
        </h1>
        <p
          className={`text-sm md:text-base font-normal leading-relaxed text-center mx-auto
          ${darkMode ? "text-zinc-300" : "text-zinc-600"} max-w-md`}
        >
          {t("login.subtitle")} {/* Translated subtitle */}
        </p>
      </div>

      {/* Card box */}
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-xl flex flex-col gap-6
        ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={t("login.email_placeholder")} // Translated placeholder
            className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 
            ${
              darkMode
                ? "bg-gray-700 border-zinc-600 text-zinc-300 focus:ring-blue-400"
                : "bg-white border-zinc-200 text-zinc-600 focus:ring-blue-500"
            }`}
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={t("login.password_placeholder")} // Translated placeholder
            className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2
            ${
              darkMode
                ? "bg-gray-700 border-zinc-600 text-zinc-300 focus:ring-blue-400"
                : "bg-white border-zinc-200 text-zinc-600 focus:ring-blue-500"
            }`}
          />

          {/* Remember Me + Forgot Password */}
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-5 h-5 rounded-md border border-slate-400 dark:border-slate-500 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <span
                className={`text-sm ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {t("login.remember_me")} {/* Translated label */}
              </span>
            </label>
            <Link
              to="/forgot-password"
              className={`text-sm hover:text-blue-600 hover:underline dark:hover:text-blue-400 
              ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              {t("login.forgot_password")} {/* Translated link */}
            </Link>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-blue-600 dark:bg-blue-700 text-white text-base font-semibold leading-7 hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            {t("login.sign_in")} {/* Translated button */}
          </button>

          {/* Google Sign In */}
          <button
            type="button"
            className={`w-full px-4 py-3 rounded-lg border flex items-center justify-center gap-2 font-semibold 
            ${
              darkMode
                ? "bg-gray-700 border-zinc-600 text-white hover:bg-gray-600"
                : "bg-slate-50 border-zinc-200 text-slate-800 hover:bg-gray-100"
            }`}
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            {t("login.google_sign_in")} {/* Translated button */}
          </button>

          {/* Switch to Register */}
          <p
            className={`text-center text-sm 
            ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}
          >
            {t("login.register_prompt")}{" "}
            <Link
              to="/register"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300"
            >
              {t("login.sign_up")} {/* Translated link */}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
