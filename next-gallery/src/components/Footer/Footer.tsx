"use client";

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";

import { AppContext } from "../theme/appcontext";
import { ThemeToggle, LanguageToggle } from "../theme/mode-toggle";

const Footer = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  if (!context) throw new Error("Footer must be used within an AppProvider");

  const handlePhoneClick = () => (window.location.href = "tel:+84123456789");
  const handleLocationClick = () =>
    window.open(
      "https://www.google.com/maps/search/?api=1&query=District+1,+Ho+Chi+Minh+City,+Vietnam",
      "_blank"
    );

  return (
    <footer className="w-full border-t bg-background text-foreground py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT: Company Info */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-accent rounded-md" />

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">
              {t("footer.company_name")}
            </h3>

            <p className="text-sm text-muted-foreground">
              {t("footer.tagline")}
            </p>

            <div className="flex flex-col mt-3 gap-2">
              <a
                onClick={handleLocationClick}
                className="text-sm font-medium cursor-pointer hover:text-blue-600 flex items-center"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                {t("footer.location")}
              </a>

              <a
                onClick={handlePhoneClick}
                className="text-sm font-medium cursor-pointer hover:text-blue-600 flex items-center"
              >
                <FontAwesomeIcon icon={faPhoneAlt} className="mr-2" />
                {t("footer.phone")}
              </a>
            </div>
          </div>
        </div>

        {/* CENTER: Legal Links */}
        <div className="flex flex-col items-center gap-1 text-sm font-medium mt-6">
          <a href="/terms" className="hover:text-blue-600 transition-colors">
            {t("footer.terms_conditions")}
          </a>
          <a
            href="/shipping-returns"
            className="hover:text-blue-600 transition-colors"
          >
            {t("footer.shipping_returns")}
          </a>
          <a href="/privacy" className="hover:text-blue-600 transition-colors">
            {t("footer.privacy_policy")}
          </a>
        </div>

        {/* RIGHT: Socials + ModeToggle */}
        <div className="flex justify-between mt-6">
          <div className="flex flex-col gap-2 text-sm font-medium">
            <a className="cursor-pointer hover:text-blue-600">
              {t("footer.instagram")}
            </a>
            <a className="cursor-pointer hover:text-blue-600">
              {t("footer.facebook")}
            </a>
            <a className="cursor-pointer hover:text-blue-600">
              {t("footer.faq")}
            </a>
          </div>

          <div className="flex flex-col items-end gap-3">
            {/* 🔥 LanguageSelector removed */}
            {/* 🔥 Replaced by unified ModeToggle */}
            <ThemeToggle variant="default" />
            <LanguageToggle variant="default" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
