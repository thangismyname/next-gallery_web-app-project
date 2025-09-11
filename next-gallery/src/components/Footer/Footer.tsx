import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";
import LanguageSelector from "../LanguageSelector";
import DarkModeToggle from "../DarkMode";
import { AppContext } from "../AppContext";

const Footer = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const context = useContext(AppContext);
  if (!context) throw new Error("Footer must be used within an AppProvider");

  const { darkMode } = context;

  const handlePhoneClick = () => {
    window.location.href = "tel:+84123456789";
  };

  const handleLocationClick = () => {
    window.open(
      "https://www.google.com/maps/search/?api=1&query=District+1,+Ho+Chi+Minh+City,+Vietnam",
      "_blank"
    );
  };

  return (
    <footer
      className={`w-full flex flex-row justify-between items-center border-t border-b transition-colors duration-300 ${
        darkMode
          ? "bg-black text-white border-white"
          : "bg-white text-black border-black"
      }`}
      style={{ height: "120px" }}
    >
      {/* Company Info */}
      <div className="h-full flex flex-row items-center gap-2 w-1/3 px-6 border-r border-inherit">
        <div
          className={`w-16 h-16 rounded-md ${
            darkMode ? "bg-[#ffffff]" : "bg-[#e3e3e3]"
          }`}
        ></div>
        <div className="flex flex-col items-start gap-1">
          <div className="text-lg font-semibold">
            {t("footer.company_name")}{" "}
            {/* Use translation key for company name */}
          </div>
          <div className="text-xs font-semibold">
            {t("footer.tagline")} {/* Use translation key for tagline */}
          </div>
          <div className="text-xs font-semibold mt-1 flex items-center gap-2">
            <div
              className="flex items-center gap-1 transition-all duration-200 ease-in-out cursor-pointer hover:text-blue-400"
              onClick={handleLocationClick}
            >
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-base"
                style={{ cursor: "pointer" }}
              />
              <span>{t("footer.location")}</span>{" "}
              {/* Use translation key for location */}
            </div>
            <div
              className="flex items-center gap-1 transition-all duration-200 ease-in-out cursor-pointer hover:text-blue-400"
              onClick={handlePhoneClick}
            >
              <FontAwesomeIcon
                icon={faPhoneAlt}
                className="text-base"
                style={{ cursor: "pointer" }}
              />
              <span>{t("footer.phone")}</span>{" "}
              {/* Use translation key for phone */}
            </div>
          </div>
        </div>
      </div>

      {/* Legal / Policy Links */}
      <div className="h-full px-6 flex flex-col justify-center w-1/3 border-r border-inherit">
        {[
          t("footer.terms_conditions"), // Use translation keys for legal links
          t("footer.shipping_returns"),
          t("footer.privacy_policy"),
        ].map((item) => (
          <button
            key={item}
            className={`text-base font-semibold text-left transition-all duration-200 px-2 py-1 rounded-md ${
              darkMode
                ? "text-white hover:text-gray-400"
                : "text-black hover:text-gray-600"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Social + Settings */}
      <div className="h-full flex flex-row items-center justify-between px-6 w-1/3">
        <div className="flex flex-col">
          {[
            t("footer.instagram"), // Use translation keys for social/FAQ links
            t("footer.facebook"),
            t("footer.faq"),
          ].map((item) => (
            <button
              key={item}
              className={`text-base font-semibold text-left transition-all duration-200 px-2 py-1 rounded-md ${
                darkMode
                  ? "text-white hover:text-gray-400"
                  : "text-black hover:text-gray-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 items-end">
          <LanguageSelector />
          <DarkModeToggle />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
