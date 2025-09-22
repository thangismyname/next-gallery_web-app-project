// LoginPage.tsx
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../components/Theme/AppContext";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const context = useContext(AppContext);
  if (!context)
    throw new Error("This component must be used within an AppProvider");
  const { darkMode } = context;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError(t("errors.login.fill_fields"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      // Redirect to user page after successful login
      navigate("/"); // now this works
    } catch (err: any) {
      setError(err.response?.data?.message || t("errors.login.failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  const handleDiscordLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/discord`;
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-slate-50"
      }`}
    >
      {/* Title */}
      <div className="text-center space-y-3 mb-6">
        <h1
          className={`text-4xl md:text-5xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {t("login.title")}
        </h1>
        <p
          className={`text-sm md:text-base mx-auto max-w-md ${
            darkMode ? "text-zinc-300" : "text-zinc-600"
          }`}
        >
          {t("login.subtitle")}
        </p>
      </div>

      {/* Form Card */}
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-xl flex flex-col gap-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={t("login.email_placeholder")}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
              darkMode
                ? "bg-gray-700 border-zinc-600 text-zinc-300 focus:ring-blue-400"
                : "bg-white border-zinc-200 text-zinc-600 focus:ring-blue-500"
            }`}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={t("login.password_placeholder")}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
              darkMode
                ? "bg-gray-700 border-zinc-600 text-zinc-300 focus:ring-blue-400"
                : "bg-white border-zinc-200 text-zinc-600 focus:ring-blue-500"
            }`}
          />

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
                {t("login.remember_me")}
              </span>
            </label>

            <Link
              to="/forgot-password"
              className={`text-sm hover:text-blue-600 hover:underline dark:hover:text-blue-400 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("login.forgot_password")}
            </Link>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-blue-600 dark:bg-blue-700 text-white font-semibold hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            {loading ? t("login.loading") : t("login.sign_in")}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <hr
            className={`flex-1 ${
              darkMode ? "border-zinc-600" : "border-zinc-200"
            }`}
          />
          <span
            className={`text-sm ${
              darkMode ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            {t("login.or")}
          </span>
          <hr
            className={`flex-1 ${
              darkMode ? "border-zinc-600" : "border-zinc-200"
            }`}
          />
        </div>

        <div className="gap-3 flex flex-col">
          {/* Social Login Buttons Container */}
          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full px-4 py-3 rounded-lg border flex items-center justify-center gap-2 ${
              darkMode
                ? "bg-gray-700 border-zinc-600 text-zinc-300 hover:bg-gray-600"
                : "bg-white border-zinc-200 text-zinc-600 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-5 h-5"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            <span>{t("login.google_sign_in")}</span>
          </button>

          {/* Discord Sign-In Button */}
          <button
            onClick={handleDiscordLogin}
            disabled={loading}
            className={`w-full px-4 py-3 rounded-lg border flex items-center justify-center gap-2 ${
              darkMode
                ? "bg-[#5865F2] border-zinc-600 text-white hover:bg-[#4752C4]"
                : "bg-[#5865F2] border-zinc-200 text-white hover:bg-[#4752C4]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-discord"
              viewBox="0 0 16 16"
            >
              <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
            </svg>
            <span>{t("login.discord_sign_in")}</span>
          </button>
        </div>

        <p
          className={`text-center text-sm ${
            darkMode ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          {t("login.register_prompt")}{" "}
          <Link
            to="/register"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300"
          >
            {t("login.sign_up")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
