// RegisterPage.tsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../components/Theme/AppContext";
import LegalLinks from "../../components/LegalLinks";
import { register as registerApi } from "../../services/authService";

// Example whitelist (replace with real data from API/backend)
const adminWhitelist = [
  { studentId: "123456", fullName: "John Doe" },
  { studentId: "654321", fullName: "Jane Smith" },
];

interface RegisterProps {
  onSwitchToLogin?: () => void;
}

type RoleType = "User" | "Admin" | "Photographer";

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    repeatPassword: "",
    agreePolicy: false,
    studentId: "",
    role: "User" as RoleType,
  });
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    repeatPassword?: string;
    agreePolicy?: string;
    studentId?: string;
  }>({});
  const [statusMessage, setStatusMessage] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

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
      [name]:
        type === "checkbox" || type === "radio"
          ? type === "checkbox"
            ? checked
            : value
          : value,
    }));
    // Clear error for the field when user starts typing
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      repeatPassword?: string;
      agreePolicy?: string;
      studentId?: string;
    } = {};

    if (!formData.firstName) {
      newErrors.firstName = t("errors.register.first_name");
    }
    if (!formData.lastName) {
      newErrors.lastName = t("errors.register.last_name");
    }
    if (!formData.email) {
      newErrors.email = t("errors.register.email");
    }
    if (!formData.password) {
      newErrors.password = t("errors.register.password");
    }
    if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = t("errors.register.password_mismatch");
    }
    if (!formData.agreePolicy) {
      newErrors.agreePolicy = t("errors.register.agree_policy");
    }

    // IUPC Member validation (mapped to Admin)
    if (formData.role === "Admin") {
      if (!formData.studentId.trim()) {
        newErrors.studentId = t("errors.register.student_id_required");
      } else {
        const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
        const match = adminWhitelist.find(
          (entry) =>
            entry.studentId === formData.studentId.trim() &&
            entry.fullName.toLowerCase() === fullName.toLowerCase()
        );
        if (!match) {
          newErrors.studentId = t("errors.register.admin_not_whitelisted");
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await registerApi(formData);
      console.log("Register success:", response);
      setStatusMessage({
        message: t("register.success_message"),
        isError: false,
      });
      setErrors({});
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      console.error("Register failed:", error);
      setStatusMessage({
        message: error.response?.data?.message || t("register.error_message"),
        isError: true,
      });
    }
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
        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-md text-center ${
              statusMessage.isError
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            }`}
          >
            {statusMessage.message}
          </div>
        )}

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
                errors.repeatPassword
                  ? "border-red-500 focus:ring-red-400"
                  : darkMode
                  ? "bg-gray-700 border-zinc-600 text-zinc-300 focus:ring-blue-400"
                  : "bg-white border-zinc-200 text-zinc-600 focus:ring-blue-500"
              }`}
            />
            {errors.repeatPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.repeatPassword}
              </p>
            )}
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
            <div className="flex flex-col sm:flex-row gap-4">
              {[
                { label: t("register.role_iupc_member"), value: "Admin" },
                { label: t("register.role_user"), value: "User" },
                {
                  label: t("register.role_photographer"),
                  value: "Photographer",
                },
              ].map((role) => (
                <label
                  key={role.value}
                  className="flex items-center gap-2 text-base"
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className={darkMode ? "text-white" : "text-black"}>
                    {role.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Show student ID input only if Admin role is selected */}
          {formData.role === "Admin" && (
            <div>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                placeholder={t("register.student_id_placeholder")}
                className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 ${
                  errors.studentId
                    ? "border-red-500 focus:ring-red-400"
                    : darkMode
                    ? "bg-gray-700 border-zinc-600 text-zinc-300 focus:ring-blue-400"
                    : "bg-white border-zinc-200 text-zinc-600 focus:ring-blue-500"
                }`}
              />
              {errors.studentId && (
                <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>
              )}
            </div>
          )}

          {/* Agree policy */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="agreePolicy"
                checked={formData.agreePolicy}
                onChange={handleInputChange}
                className="w-5 h-5 rounded-md"
              />
              <span className={darkMode ? "text-white" : "text-black"}>
                {t("register.agree_policy")}{" "}
                <LegalLinks
                  show={["privacy_policy"]}
                  vertical={false}
                  className="inline underline"
                />
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
