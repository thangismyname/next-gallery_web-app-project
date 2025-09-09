import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ open, onClose }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [showLangMenu, setShowLangMenu] = useState(false);

  const langMenuRef = useRef<HTMLDivElement>(null);

  function toggleDarkMode() {
    setDarkMode((prev) => !prev);
  }

  function toggleLangMenu() {
    setShowLangMenu((prev) => !prev);
  }

  function selectLanguage(lang: string) {
    setLanguage(lang);
    setShowLangMenu(false);
  }

  // Close language dropdown when clicking outside
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
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-gray-800/40 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-90 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col font-semibold">
          {/* Menu buttons */}
          <button
            onClick={onClose}
            className="p-5 py-4 border-b text-left text-black hover:text-red-600"
          >
            Close
          </button>
          <button className="p-5 py-4 border-b text-left text-black hover:text-blue-600">
            Upload
          </button>
          <button className="p-5 py-4 border-b text-left text-black hover:text-blue-600">
            Download
          </button>
          <button className="p-5 py-4 border-b text-left text-black hover:text-blue-600">
            View Profile
          </button>
          <button className="p-5 py-4 border-b text-left text-black hover:text-blue-600">
            See more Albums
          </button>
        </div>

        {/* Footer links */}
        <div className="absolute bottom-5 left-5 right-5 flex gap-4 text-sm font-semibold justify-between">
          <div className="flex flex-col gap-1">
            {["Terms and Conditions", "Prices", "Privacy Policy"].map(
              (item, i) => (
                <button
                  key={i}
                  className="text-black text-left hover:text-blue-600 transition-colors"
                >
                  {item}
                </button>
              )
            )}
          </div>

          {/* Language + Dark mode buttons */}
          <div
            ref={langMenuRef}
            className="relative flex flex-col gap-2 items-start justify-center"
          >
            {/* Language button */}
            <button
              onClick={toggleLangMenu}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 text-sm hover:bg-gray-300"
            >
              {language} <FontAwesomeIcon icon={faGlobe} />
            </button>

            {/* Language dropdown */}
            {showLangMenu && (
              <div className="absolute bottom-full left-0 mb-1 w-32 bg-white rounded-md shadow-md">
                {["English", "Vietnamese", "French", "Spanish"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => selectLanguage(lang)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}

            {/* Dark mode button */}
            <button
              onClick={toggleDarkMode}
              className="px-3 py-1 rounded-full bg-gray-300 hover:bg-gray-100 text-sm"
            >
              {darkMode ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
