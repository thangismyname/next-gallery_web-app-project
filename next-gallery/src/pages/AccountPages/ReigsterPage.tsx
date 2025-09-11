import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../components/AppContext";

interface RegisterProps {
  onSwitchToLogin?: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    repeatPassword: "",
    agreePolicy: false,
    role: "User",
  });
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    agreePolicy?: string;
  }>({});

  const context = useContext(AppContext);
  if (!context) {
    throw new Error("This component must be used within an AppProvider");
  }

  const { darkMode } = context;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for the field when user starts typing
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      agreePolicy?: string;
    } = {};

    if (!formData.firstName) {
      newErrors.firstName = t("register.error_first_name");
    }
    if (!formData.lastName) {
      newErrors.lastName = t("register.error_last_name");
    }
    if (!formData.email) {
      newErrors.email = t("register.error_email");
    }
    if (!formData.password) {
      newErrors.password = t("register.error_password");
    }
    if (!formData.agreePolicy) {
      newErrors.agreePolicy = t("register.error_agree_policy");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Register with:", formData);
    setErrors({});
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center py-16 sm:py-24 px-4 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-slate-50 text-black"
      }`}
    >
      {/* Title */}
      <div className="text-center mb-8">
        <h1
          className={`text-4xl sm:text-5xl font-bold mb-2 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {t("register.title")}
        </h1>
        <p
          className={`text-base sm:text-lg max-w-md mx-auto ${
            darkMode ? "text-zinc-300" : "text-zinc-600"
          }`}
        >
          {t("register.subtitle")}
        </p>
      </div>

      {/* Card */}
      <div
        className={`w-full max-w-2xl p-8 rounded-2xl shadow-xl flex flex-col gap-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name fields */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder={t("register.first_name_placeholder")}
                className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 ${
                  errors.firstName
                    ? "border-red-500"
                    : darkMode
                    ? "bg-gray-700 border-zinc-600 text-zinc-300 focus:ring-blue-400"
                    : "bg-white border-zinc-200 text-zinc-600 focus:ring-blue-500"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="flex-1">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder={t("register.last_name_placeholder")}
                className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 ${
                  errors.lastName
                    ? "border-red-500"
                    : darkMode
                    ? "bg-gray-700 border-zinc-600 text-zinc-300 focus:ring-blue-400"
                    : "bg-white border-zinc-200 text-zinc-600 focus:ring-blue-500"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t("register.email_placeholder")}
              className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500"
                  : darkMode
                  ? "bg-gray-700 border-zinc-600 text-zinc-300 focus:ring-blue-400"
                  : "bg-white border-zinc-200 text-zinc-600 focus:ring-blue-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={t("register.phone_placeholder")}
              className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-zinc-600 text-zinc-300 focus:ring-blue-400"
                  : "bg-white border-zinc-200 text-zinc-600 focus:ring-blue-500"
              }`}
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={t("register.password_placeholder")}
              className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500"
                  : darkMode
                  ? "bg-gray-700 border-zinc-600 text-zinc-300 focus:ring-blue-400"
                  : "bg-white border-zinc-200 text-zinc-600 focus:ring-blue-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Repeat Password */}
          <div>
            <input
              type="password"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleInputChange}
              placeholder={t("register.repeat_password_placeholder")}
              className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-zinc-600 text-zinc-300 focus:ring-blue-400"
                  : "bg-white border-zinc-200 text-zinc-600 focus:ring-blue-500"
              }`}
            />
          </div>

          {/* Role selection */}
          <div className="flex flex-col gap-2">
            <span
              className={`${
                darkMode ? "text-white" : "text-black"
              } font-medium`}
            >
              {t("register.role_label")}
            </span>
            <div className="flex gap-4">
              {[
                t("register.role_user"),
                t("register.role_photographer"),
                t("register.role_other"),
              ].map((role, index) => (
                <label key={role} className="flex items-center gap-2 text-base">
                  <input
                    type="radio"
                    name="role"
                    value={["User", "Photographer", "Other"][index]}
                    checked={
                      formData.role === ["User", "Photographer", "Other"][index]
                    }
                    onChange={handleInputChange}
                    className={`w-5 h-5 rounded-full`}
                  />
                  <span className={darkMode ? "text-white" : "text-black"}>
                    {role}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Agree policy */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="agreePolicy"
                checked={formData.agreePolicy}
                onChange={handleInputChange}
                className={`w-5 h-5 rounded-md`}
              />
              <span className={darkMode ? "text-white" : "text-black"}>
                {t("register.agree_policy")}{" "}
                <a href="#" className="underline">
                  {t("register.privacy_policy")}
                </a>
              </span>
            </label>
            {errors.agreePolicy && (
              <p className="text-red-500 text-sm mt-1">{errors.agreePolicy}</p>
            )}
          </div>

          {/* Sign up button */}
          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-blue-600 dark:bg-blue-700 text-white font-semibold hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            {t("register.sign_up")}
          </button>

          {/* OR separator */}
          <div className="flex items-center gap-4 text-gray-400">
            <hr className="flex-1 border-t" />
            <span>{t("register.or_sign_up_with")}</span>
            <hr className="flex-1 border-t" />
          </div>

          {/* Social Sign Up */}
          <div className="flex flex-col gap-3">
            {[
              {
                name: "Google",
                key: "google_sign_up",
                icon: "https://www.svgrepo.com/show/355037/google.svg",
              },
              {
                name: "Facebook",
                key: "facebook_sign_up",
                icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
              },
            ].map((provider) => (
              <button
                key={provider.name}
                type="button"
                className={`w-full px-4 py-3 rounded-lg border flex items-center justify-center gap-2 font-semibold ${
                  darkMode
                    ? "bg-gray-700 border-zinc-600 text-white hover:bg-gray-600"
                    : "bg-slate-50 border-zinc-200 text-slate-800 hover:bg-gray-100"
                }`}
              >
                <img
                  src={provider.icon}
                  alt={provider.name}
                  className="w-5 h-5"
                />
                {t(`register.${provider.key}`)}
              </button>
            ))}
          </div>

          {/* Already have account */}
          <p
            className={`text-center text-base mt-3 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t("register.already_have_account")}{" "}
            <Link
              to="/login"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              {t("register.log_in")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
