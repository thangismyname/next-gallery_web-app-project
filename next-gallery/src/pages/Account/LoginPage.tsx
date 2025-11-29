import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { login } from "../../services/authService";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "next-themes"; // ✅ Shadcn ThemeProvider hook

const Login: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme } = useTheme(); // ✅ Access Shadcn theme
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      const user = await login(formData);
      console.log("Login successful:", user);
      navigate("/");
    } catch (err: any) {
      console.error("Login failed:", err);
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

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 ${
        isDark ? "bg-gray-950 text-white" : "bg-slate-50 text-black"
      }`}
    >
      {/* Title & Subtitle */}
      <div className="text-center space-y-3 mb-6">
        <h1
          className={`text-4xl md:text-5xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {t("login.title")}
        </h1>
        <p
          className={`text-sm md:text-base mx-auto max-w-md ${
            isDark ? "text-zinc-300" : "text-zinc-600"
          }`}
        >
          {t("login.subtitle")}
        </p>
      </div>

      {/* Login Card */}
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-xl flex flex-col gap-6 ${
          isDark ? "bg-gray-900" : "bg-white"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={t("login.email_placeholder")}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
              isDark
                ? "bg-gray-800 border-zinc-700 text-zinc-100 focus:ring-blue-400"
                : "bg-white border-zinc-200 text-zinc-700 focus:ring-blue-500"
            }`}
          />

          {/* Password */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={t("login.password_placeholder")}
              className={`w-full px-4 py-3 pr-10 rounded-lg border focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-800 border-zinc-700 text-zinc-100 focus:ring-blue-400"
                  : "bg-white border-zinc-200 text-zinc-700 focus:ring-blue-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

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
              <span className="text-sm">{t("login.remember_me")}</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm hover:text-blue-600 hover:underline dark:hover:text-blue-400"
            >
              {t("login.forgot_password")}
            </Link>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
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
              isDark ? "border-zinc-700" : "border-zinc-200"
            }`}
          />
          <span
            className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
          >
            {t("login.or")}
          </span>
          <hr
            className={`flex-1 ${
              isDark ? "border-zinc-700" : "border-zinc-200"
            }`}
          />
        </div>

        {/* Social Logins */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full px-4 py-3 rounded-lg border flex items-center justify-center gap-2 ${
              isDark
                ? "bg-gray-800 border-zinc-700 text-zinc-100 hover:bg-gray-700"
                : "bg-white border-zinc-200 text-zinc-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-5 h-5"
            >
              <path
                fill="#FFC107"
                d="M43.6,20H24v8h11.3c-1.6,4.7-6.1,8-11.3,8C17.4,36,12,30.6,12,24S17.4,12,24,12
                c3.1,0,5.8,1.2,7.9,3l5.7-5.7C34,6.1,29.3,4,24,4C12.9,4,4,12.9,4,24s8.9,20,20,20s20-8.9,20-20C44,22.7,43.9,21.4,43.6,20z"
              />
              <path
                fill="#1976D2"
                d="M43.6,20H24v8h11.3c-0.8,2.2-2.2,4.2-4.1,5.6l6.2,5.2C36.9,39.2,44,34,44,24C44,22.7,43.9,21.4,43.6,20z"
              />
            </svg>
            <span>{t("login.google_sign_in")}</span>
          </button>

          <button
            onClick={handleDiscordLogin}
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-[#5865F2] text-white font-semibold hover:bg-[#4752C4] flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011..." />
            </svg>
            <span>{t("login.discord_sign_in")}</span>
          </button>
        </div>

        {/* Register Prompt */}
        <p
          className={`text-center text-sm ${
            isDark ? "text-zinc-400" : "text-zinc-500"
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

      {/* Language Switcher */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => changeLanguage("en")}
          className={`font-light ${
            i18n.language === "en"
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : isDark
              ? "text-zinc-400 hover:text-white"
              : "text-zinc-500 hover:text-black"
          }`}
        >
          {t("language.english")}
        </button>
        <span className={`${isDark ? "text-zinc-700" : "text-zinc-400"}`}>
          |
        </span>
        <button
          onClick={() => changeLanguage("vi")}
          className={`font-light ${
            i18n.language === "vi"
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : isDark
              ? "text-zinc-400 hover:text-white"
              : "text-zinc-500 hover:text-black"
          }`}
        >
          {t("language.vietnamese")}
        </button>
      </div>
    </div>
  );
};

export default Login;
