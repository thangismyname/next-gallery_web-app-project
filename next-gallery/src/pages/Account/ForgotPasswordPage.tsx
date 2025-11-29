import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { forgotPassword, resetPassword } from "../../services/authService";
import { useTheme } from "next-themes";

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate(); // for redirect after reset

  /* ---------- STATE ---------- */
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* ---------- HANDLERS ---------- */
  const handleSendOtp = async () => {
    setError(null);
    setSuccess(null);

    if (!email) {
      setError(t("forgot_password.error_email"));
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email);
      setSuccess(res.message || t("forgot_password.otp_sent"));
      setStep(2); // go to OTP step
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          t("forgot_password.error_failed")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError(null);

    if (!otp || !newPassword || !confirmPassword) {
      setError(t("forgot_password.error_missing_fields"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("forgot_password.error_password_mismatch"));
      return;
    }

    try {
      setLoading(true);
      await resetPassword(otp, newPassword);
      setSuccess(t("forgot_password.reset_success"));

      // Clear fields after success
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setEmail("");
      setStep(1);

      // Redirect to login after 2s
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          t("forgot_password.error_failed")
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 ${
        isDark ? "bg-gray-950 text-white" : "bg-slate-50 text-black"
      }`}
    >
      {/* Title & Subtitle */}
      <div className="text-center space-y-3 mb-6">
        <h1
          className={`text-4xl md:text-5xl font-bold leading-tight ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {t("forgot_password.title")}
        </h1>
        <p
          className={`text-sm md:text-base font-normal leading-relaxed text-center mx-auto ${
            isDark ? "text-zinc-300" : "text-zinc-600"
          } max-w-md`}
        >
          {t("forgot_password.subtitle")}
        </p>
      </div>

      {/* Card */}
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-xl flex flex-col gap-6 ${
          isDark ? "bg-gray-900" : "bg-white"
        }`}
      >
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendOtp();
            }}
            className="flex flex-col gap-4"
          >
            {/* Email Field */}
            <div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("forgot_password.email_placeholder")}
                className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 ${
                  error
                    ? "border-red-500 focus:ring-red-400"
                    : isDark
                    ? "bg-gray-800 border-zinc-700 text-zinc-100 focus:ring-blue-400"
                    : "bg-white border-zinc-200 text-zinc-700 focus:ring-blue-500"
                }`}
              />
            </div>

            {/* Error / Success */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-3 rounded-lg bg-blue-600 dark:bg-blue-700 text-white text-base font-semibold leading-7 hover:bg-blue-700 dark:hover:bg-blue-800 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading
                ? t("forgot_password.sending_otp")
                : t("forgot_password.send_reset_link")}
            </button>

            {/* Back to Login */}
            <p
              className={`text-center text-sm ${
                isDark ? "text-zinc-400" : "text-zinc-500"
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
        )}

        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleResetPassword();
            }}
            className="flex flex-col gap-4"
          >
            {/* OTP Field */}
            <div>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder={t("forgot_password.otp_placeholder")}
                className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 ${
                  error
                    ? "border-red-500 focus:ring-red-400"
                    : isDark
                    ? "bg-gray-800 border-zinc-700 text-zinc-100 focus:ring-blue-400"
                    : "bg-white border-zinc-200 text-zinc-700 focus:ring-blue-500"
                }`}
              />
            </div>

            {/* New Password Field */}
            <div>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("forgot_password.new_password_placeholder")}
                className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 ${
                  error
                    ? "border-red-500 focus:ring-red-400"
                    : isDark
                    ? "bg-gray-800 border-zinc-700 text-zinc-100 focus:ring-blue-400"
                    : "bg-white border-zinc-200 text-zinc-700 focus:ring-blue-500"
                }`}
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("forgot_password.confirm_password_placeholder")}
                className={`w-full px-4 py-3 rounded-lg border text-base focus:outline-none focus:ring-2 ${
                  error
                    ? "border-red-500 focus:ring-red-400"
                    : isDark
                    ? "bg-gray-800 border-zinc-700 text-zinc-100 focus:ring-blue-400"
                    : "bg-white border-zinc-200 text-zinc-700 focus:ring-blue-500"
                }`}
              />
            </div>

            {/* Error / Success */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-3 rounded-lg bg-blue-600 dark:bg-blue-700 text-white text-base font-semibold leading-7 hover:bg-blue-700 dark:hover:bg-blue-800 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading
                ? t("forgot_password.resetting")
                : t("forgot_password.update_password")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
