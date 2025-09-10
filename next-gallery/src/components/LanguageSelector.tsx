import React, { useContext, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "./AppContext";

const LanguageSelector: React.FC = () => {
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

  return (
    <div ref={langMenuRef} className="flex flex-col items-end relative">
      <button
        onClick={toggleLangMenu}
        className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${
          darkMode
            ? "bg-gray-black border border-white text-white hover:bg-gray-500"
            : "bg-gray-200 text-black hover:bg-gray-300"
        }`}
      >
        {language} <FontAwesomeIcon icon={faGlobe} />
      </button>

      {showLangMenu && (
        <div
          className={`absolute bottom-full right-0 mb-2 w-32 rounded-lg shadow-md font-semibold ${
            darkMode ? "bg-black text-white" : "bg-white text-black"
          } z-10`}
        >
          {["English", "Vietnamese", "French", "Spanish"].map((lang) => (
            <button
              key={lang}
              onClick={() => {
                selectLanguage(lang);
                setShowLangMenu(false); // close only this menu
              }}
              className={`w-full text-left px-3 py-2 ${
                darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              } rounded-md`}
            >
              {lang}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
