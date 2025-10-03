import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../components/Theme/AppContext";
import {
  getCurrentUser,
  updateUser,
  changePassword,
} from "../services/userService";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type RoleType = "User" | "Admin" | "Photographer";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  studentId: string;
  role: RoleType;
  iupcMember: boolean;
  avatar: string;
  agreed: boolean;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context)
    throw new Error("This component must be used within an AppProvider");

  const { darkMode } = context;

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    studentId: "",
    role: "User",
    iupcMember: false,
    avatar: "",
    agreed: false,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

  // Load current user profile
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      address: (user as any).address || "",
      studentId: user.studentId || "",
      role: (user.role as RoleType) || "User",
      iupcMember: (user as any).iupcMember ?? user.role === "Admin",
      avatar: user.avatar || "",
      agreed: (user as any).agreed || false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      let didProfile = false;
      let didPassword = false;

      // --- Profile update ---
      const profilePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        studentId: formData.studentId,
        role: formData.iupcMember ? "Admin" : formData.role,
        avatar: formData.avatar,
      };

      // check if profile has any non-empty changes
      if (
        profilePayload.firstName ||
        profilePayload.lastName ||
        profilePayload.phone ||
        profilePayload.address ||
        profilePayload.studentId ||
        profilePayload.avatar
      ) {
        await updateUser(profilePayload);
        didProfile = true;
      }

      // --- Password update ---
      if (
        formData.oldPassword ||
        formData.newPassword ||
        formData.confirmPassword
      ) {
        if (!formData.oldPassword || !formData.newPassword) {
          setStatusMessage({
            message: t("user.password_fields_required"),
            isError: true,
          });
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setStatusMessage({
            message: t("user.password_mismatch"),
            isError: true,
          });
          return;
        }
        await changePassword(formData.oldPassword, formData.newPassword);
        didPassword = true;
      }

      // --- Status messages ---
      if (didProfile && didPassword) {
        setStatusMessage({
          message: t("user.update_and_password_success"),
          isError: false,
        });
      } else if (didProfile) {
        setStatusMessage({ message: t("user.update_success"), isError: false });
      } else if (didPassword) {
        setStatusMessage({
          message: t("user.password_update_success"),
          isError: false,
        });
      } else {
        setStatusMessage({
          message: t("user.no_changes_detected"),
          isError: true,
        });
      }

      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setShowPasswordChange(false);
      setIsEditing(false);
    } catch (error: any) {
      console.error("Save failed:", error);
      setStatusMessage({
        message: error.response?.data?.message || t("user.update_error"),
        isError: true,
      });
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center py-16 px-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-slate-50 text-black"
      }`}
    >
      <div
        className={`w-full max-w-xl p-8 rounded-2xl shadow-xl ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Go back button - only show in read-only mode */}
        {!isEditing && (
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-medium mb-4 px-3 py-2 rounded-md
              bg-gray-600 text-white hover:bg-gray-700
              dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            {t("common.go_back_home")}
          </button>
        )}

        <h1 className="text-3xl font-bold mb-6">{t("user.profile_title")}</h1>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-md text-center mb-4 ${
              statusMessage.isError
                ? "bg-white text-red-600 dark:bg-red-700 dark:text-red-100"
                : "bg-white text-green-600 dark:bg-green-700 dark:text-green-100"
            }`}
          >
            {statusMessage.message}
          </div>
        )}

        {/* View / Edit Modes */}
        {!isEditing ? (
          // -------------------- READ-ONLY MODE --------------------
          <div className="flex flex-col gap-4">
            {/* Avatar centered */}
            <div className="flex flex-col items-center gap-3">
              {formData.avatar && (
                <img
                  src={formData.avatar}
                  alt="Avatar preview"
                  className="w-40 h-40 rounded-full border-2 border-gray-400 object-cover"
                />
              )}
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById("avatarInput")?.click()}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                {formData.avatar
                  ? t("user.change_avatar")
                  : t("user.upload_avatar")}
              </button>
            </div>

            {/* User info aligned left */}
            <div className="flex flex-col gap-4 items-start">
              <p>
                <strong>{t("register.first_name_placeholder")}:</strong>{" "}
                {formData.firstName}
              </p>
              <p>
                <strong>{t("register.last_name_placeholder")}:</strong>{" "}
                {formData.lastName}
              </p>
              <p>
                <strong>{t("register.email_placeholder")}:</strong>{" "}
                {formData.email}
              </p>
              <p>
                <strong>{t("register.phone_placeholder")}:</strong>{" "}
                {formData.phone || "-"}
              </p>
              <p>
                <strong>{t("user.address_placeholder")}:</strong>{" "}
                {formData.address || "-"}
              </p>
              <p>
                <strong>{t("register.student_id_placeholder")}:</strong>{" "}
                {formData.studentId || "-"}
              </p>
              <p>
                <strong>Role:</strong> {formData.role}
              </p>
            </div>

            {/* Edit button */}
            <button
              onClick={() => setIsEditing(true)}
              className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              {t("user.edit_profile")}
            </button>
          </div>
        ) : (
          // -------------------- EDIT MODE --------------------
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {/* Avatar upload */}
            <div className="flex flex-col items-center gap-3">
              {formData.avatar && (
                <img
                  src={formData.avatar}
                  alt="Avatar preview"
                  className="w-40 h-40 rounded-full border-2 border-gray-400 object-cover"
                />
              )}
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById("avatarInput")?.click()}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                {formData.avatar
                  ? t("user.change_avatar")
                  : t("user.upload_avatar")}
              </button>
            </div>

            <input
              type="text"
              name="firstName"
              placeholder={t("register.first_name_placeholder")}
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300"
            />

            <input
              type="text"
              name="lastName"
              placeholder={t("register.last_name_placeholder")}
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300"
            />

            <input
              type="email"
              name="email"
              placeholder={t("register.email_placeholder")}
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300"
            />

            <input
              type="tel"
              name="phone"
              placeholder={t("register.phone_placeholder")}
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300"
            />

            <input
              type="text"
              name="address"
              placeholder={t("user.address_placeholder")}
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300"
            />

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

            {/* Student ID if Admin */}
            {formData.role === "Admin" && (
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                placeholder={t("register.student_id_placeholder")}
                className="w-full px-4 py-3 rounded-lg border border-zinc-300"
              />
            )}

            {/* Change Password Toggle Button */}
            <button
              type="button"
              onClick={() => {
                setShowPasswordChange(!showPasswordChange);
                setFormData((prev) => ({
                  ...prev,
                  oldPassword: "",
                  newPassword: "",
                }));
              }}
              className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              {showPasswordChange
                ? t("user.hide_password_form")
                : t("user.change_password")}
            </button>

            {/* Password Change Form (Conditional) */}
            {showPasswordChange && (
              <div className="flex flex-col gap-4 p-4 border border-zinc-300 rounded-lg">
                <h3 className="text-lg font-semibold">
                  {t("user.change_password")}
                </h3>

                <input
                  type="password"
                  name="oldPassword"
                  placeholder={t("user.old_password")}
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300"
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder={t("user.new_password")}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder={t("user.confirm_password")}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300"
                />
              </div>
            )}

            {/* Privacy Policy Agreement */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="agreed"
                checked={formData.agreed}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <span>
                {t("user.agree_with")}{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black font-semibold hover:underline dark:text-white"
                >
                  {t("privacy_policy")}
                </a>
              </span>
            </label>

            {/* Save and Cancel buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!formData.agreed}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition
                  ${
                    formData.agreed
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-blue-300 text-white cursor-not-allowed"
                  }`}
              >
                {t("user.save_changes")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setShowPasswordChange(false);
                  setFormData((prev) => ({
                    ...prev,
                    oldPassword: "",
                    newPassword: "",
                  }));
                }}
                className="flex-1 px-4 py-3 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600"
              >
                {t("common.cancel")}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Language Switcher */}
      <div className="flex justify-center gap-4 mt-6 mb-6">
        <button
          onClick={() => i18n.changeLanguage("en")}
          className={`font-light ${
            i18n.language === "en"
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : darkMode
              ? "text-zinc-400 hover:text-white hover:font-semibold"
              : "text-zinc-500 hover:text-black hover:font-semibold"
          }`}
        >
          {t("language.english")}
        </button>
        <span
          className={`${
            darkMode ? "text-zinc-600" : "text-zinc-400"
          } select-none`}
        >
          |
        </span>
        <button
          onClick={() => i18n.changeLanguage("vi")}
          className={`font-light ${
            i18n.language === "vi"
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : darkMode
              ? "text-zinc-400 hover:text-white hover:font-semibold"
              : "text-zinc-500 hover:text-black hover:font-semibold"
          }`}
        >
          {t("language.vietnamese")}
        </button>
      </div>
    </div>
  );
};

export default UserPage;
