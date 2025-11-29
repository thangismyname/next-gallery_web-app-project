// LinkProvider.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { linkProvider, getCurrentUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const LinkProvider: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: getCurrentUser()?.email || "",
    password: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLinkPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError(t("errors.link_provider.fill_fields"));
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await linkProvider(
        formData.email,
        undefined,
        undefined,
        formData.password
      );
      setMessage(response.message);
      navigate("/userpage");
    } catch (err: any) {
      setError(err.response?.data?.message || t("errors.link_provider.failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLink = () => {
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/api/auth/google?link=true`;
  };

  const handleDiscordLink = () => {
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/api/auth/discord?link=true`;
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-background text-foreground">
      <h2 className="text-2xl font-bold mb-4">{t("link_provider.title")}</h2>

      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleLinkPassword} className="space-y-4 mb-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            {t("link_provider.email")}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-input rounded bg-background text-foreground"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            {t("link_provider.password")}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 border border-input rounded bg-background text-foreground"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading
            ? t("link_provider.loading")
            : t("link_provider.link_password")}
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {/* GOOGLE */}
        <button
          onClick={handleGoogleLink}
          disabled={loading}
          className="w-full p-2 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>{t("link_provider.link_google")}</span>
        </button>

        {/* DISCORD */}
        <button
          onClick={handleDiscordLink}
          disabled={loading}
          className="w-full p-2 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>{t("link_provider.link_discord")}</span>
        </button>
      </div>
    </div>
  );
};

export default LinkProvider;
