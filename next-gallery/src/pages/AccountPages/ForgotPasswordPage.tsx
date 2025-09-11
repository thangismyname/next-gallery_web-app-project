import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../components/AppContext";

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const [formData, setFormData] = useState({ email: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const context = useContext(AppContext);
  if (!context) {
    throw new Error("This component must be used within an AppProvider");
  }

  const { darkMode } = context;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error when typing
    setSuccess(null); // Clear success message when typing
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email) {
      setError(t("forgot_password.error_email"));
      return;
    }
    // Simulate sending reset link (replace with actual API call)
    console.log("Sending reset link to:", formData.email);
    setSuccess(t("forgot_password.success_message"));
    setError(null);
    setFormData({ email: "" }); // Clear form after success
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-slate-50 text-black"
      }`}
    >
      {/* Title & Subtitle */}
      <div className="text-center space-y-3 mb-6">
        <h1
          className={`text-4xl md:text-5xl font-bold leading-tight ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {t("forgot_password.title")}
        </h1>
        <p
          className={`text-sm md:text-base font-normal leading-relaxed text-center mx-auto ${
            darkMode ? "text-zinc-300" : "text-zinc-600"
          } max-w-md`}
        >
          {t("forgot_password.subtitle")}
        </p>
      </div>

      {/* Card */}
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-xl flex flex-col gap-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t("forgot_password.email_placeholder")}
              className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 ${
                error
                  ? "border-red-500"
                  : darkMode
                  ? "bg-gray-700 border-zinc-600 text-zinc-300 focus:ring-blue-400"
                  : "bg-white border-zinc-200 text-zinc-600 focus:ring-blue-500"
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {success && (
              <p className="text-green-500 text-sm mt-1">{success}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-blue-600 dark:bg-blue-700 text-white text-base font-semibold leading-7 hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            {t("forgot_password.send_reset_link")}
          </button>

          {/* Back to Login */}
          <p
            className={`text-center text-sm ${
              darkMode ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300"
            >
              {t("forgot_password.back_to_login")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
