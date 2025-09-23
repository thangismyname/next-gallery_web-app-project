import React, { useContext, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "./AppContext";

const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("LanguageSelector must be used within an AppProvider");
  }

  const { language, selectLanguage, darkMode } = context;

  // Local state & ref
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  const toggleLangMenu = () => setShowLangMenu((prev) => !prev);

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

  // Map language codes to display names and translation keys
  const languageOptions = [
    { code: "English", key: "language.english" },
    { code: "Vietnamese", key: "language.vietnamese" },
  ];

  // Map language codes to translation keys for display
  const languageDisplayMap: { [key: string]: string } = {
    en: "language.english",
    vi: "language.vietnamese",
  };

  return (
    <div ref={langMenuRef} className="flex flex-col items-end relative">
      <button
        onClick={toggleLangMenu}
        className={`px-3 py-1 rounded-full font-semibold flex items-center gap-2 whitespace-nowrap ${
          darkMode
            ? "bg-gray-black border border-white text-white hover:bg-gray-500"
            : "bg-gray-200 text-black hover:bg-gray-300"
        }`}
      >
        {t(languageDisplayMap[language] || "language.english")}
        <FontAwesomeIcon icon={faGlobe} />
      </button>

      {showLangMenu && (
        <div
          className={`absolute bottom-full right-0 mb-2 w-32 rounded-lg shadow-md font-semibold ${
            darkMode ? "bg-black text-white" : "bg-white text-black"
          } z-10`}
        >
          {languageOptions.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                selectLanguage(lang.code);
                setShowLangMenu(false);
              }}
              className={`w-full text-left px-3 py-2 ${
                darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              } rounded-md`}
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
