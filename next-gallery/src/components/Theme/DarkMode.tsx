import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "./AppContext";

const DarkMode: React.FC = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("DarkMode must be used within an AppProvider");
  }

  const { darkMode, toggleDarkMode } = context;

  return (
    <button
      onClick={toggleDarkMode}
      className={`px-3 py-1 rounded-full font-semibold ${
        darkMode
          ? "bg-gray-black border border-white text-white hover:bg-gray-500"
          : "bg-gray-200 text-black hover:bg-gray-300"
      } flex items-center justify-center whitespace-nowrap`}
    >
      {darkMode ? t("darkmode.light_mode") : t("darkmode.dark_mode")}{" "}
      {/* Use translation keys for button text */}
    </button>
  );
};

export default DarkMode;
