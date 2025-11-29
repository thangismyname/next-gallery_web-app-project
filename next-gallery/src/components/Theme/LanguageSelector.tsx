import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "next-themes"; // 👈 Shadcn theme provider hook

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme(); // 👈 get current theme from shadcn provider

  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  const toggleLangMenu = () => setShowLangMenu((prev) => !prev);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Supported languages
  const languageOptions = [
    { code: "en", key: "language.english" },
    { code: "vi", key: "language.vietnamese" },
  ];

  const languageDisplayMap: { [key: string]: string } = {
    en: "language.english",
    vi: "language.vietnamese",
  };

  const currentLang = i18n.language.startsWith("vi") ? "vi" : "en";

  // Dark or light mode check
  const isDark = theme === "dark";

  return (
    <div ref={langMenuRef} className="relative flex flex-col items-end">
      {/* Button */}
      <button
        onClick={toggleLangMenu}
        className={`px-3 py-1.5 rounded-full font-semibold flex items-center gap-2 transition-colors duration-200 border ${
          isDark
            ? "bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
            : "bg-gray-200 border-gray-300 text-black hover:bg-gray-300"
        }`}
      >
        {t(languageDisplayMap[currentLang] || "language.english")}
        <FontAwesomeIcon icon={faGlobe} className="text-sm" />
      </button>

      {/* Dropdown */}
      {showLangMenu && (
        <div
          className={`absolute bottom-full right-0 mb-2 w-36 rounded-lg shadow-lg overflow-hidden z-10 transition-all duration-200 ${
            isDark ? "bg-gray-900 text-white" : "bg-white text-black"
          }`}
        >
          {languageOptions.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setShowLangMenu(false);
              }}
              className={`w-full text-left px-3 py-2 transition-colors ${
                isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
            >
              {t(lang.key)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
