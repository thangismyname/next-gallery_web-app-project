"use client";

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";

import { AppContext } from "../theme/AppContext";
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
      <div className="max-w-7xl mx-auto px-6">
        {/* 🔥 Logo + Company Info (Mobile & Desktop) */}
        <div
          className="
  flex flex-col items-center gap-4 mb-6 
  md:flex-row md:items-center md:gap-6 md:mb-10
"
        >
          {/* Logo */}
          <div className="w-16 h-16 bg-accent rounded-md px-2 shrink-0" />

          {/* Company Text */}
          <div className="flex flex-col text-center md:text-left ">
            <h3 className="text-lg font-semibold">
              {t("footer.company_name")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("footer.tagline")}
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-end">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4 items-center md:items-start">
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleLocationClick}
                className="text-sm font-medium hover:text-blue-600 flex items-start"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                {t("footer.location")}
              </button>

              <button
                onClick={handlePhoneClick}
                className="text-sm font-medium hover:text-blue-600 flex items-start"
              >
                <FontAwesomeIcon icon={faPhoneAlt} className="mr-2" />
                {t("footer.phone")}
              </button>
            </div>
          </div>

          {/* CENTER COLUMN – Legal */}
          <div className="flex flex-col items-center md:items-center gap-2 text-sm font-medium">
            <a href="/terms" className="hover:text-blue-600">
              {t("footer.terms_conditions")}
            </a>
            <a href="/shipping-returns" className="hover:text-blue-600">
              {t("footer.shipping_returns")}
            </a>
            <a href="/privacy" className="hover:text-blue-600">
              {t("footer.privacy_policy")}
            </a>
          </div>

          {/* SOCIALS COLUMN */}
          <div className="flex flex-col items-center md:items-center gap-2 text-sm font-medium">
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

          {/* MODE TOGGLES COLUMN */}
          <div className="flex flex-col items-center md:items-end text-sm font-medium">
            <div className="flex md:flex-col gap-3 pt-2">
              <ThemeToggle variant="default" />
              <LanguageToggle variant="default" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
