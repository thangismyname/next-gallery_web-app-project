import React, { useContext } from "react";
import { AppContext } from "../AppContext";
import LanguageSelector from "../LanguageSelector";
import DarkModeToggle from "../DarkMode";
import { useTranslation } from "react-i18next";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ open, onClose }) => {
  const context = useContext(AppContext);
  if (!context) throw new Error("SideMenu must be used within an AppProvider");

  const { darkMode } = context;
  const { t } = useTranslation();

  const menuItems = [
    { key: "upload", onClick: () => {} },
    { key: "download", onClick: () => {} },
    { key: "viewProfile", onClick: () => {} },
    { key: "seeMoreAlbums", onClick: () => {} },
  ];

  const footerItems = ["terms", "prices", "privacy"];

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
        className={`fixed top-0 left-0 h-full w-72 shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
      >
        <div className="flex flex-col font-semibold">
          <button onClick={onClose} className="p-5 py-3 border-b text-left">
            <span className="hover:text-red-600">{t("sidemenu.close")}</span>
          </button>

          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={item.onClick}
              className="p-5 py-3 border-b text-left"
            >
              <span className="hover:text-blue-600">
                {t(`sidemenu.${item.key}`)}
              </span>
            </button>
          ))}
        </div>

        {/* Footer links */}
        <div className="absolute bottom-5 left-5 right-5 flex gap-4 text-sm font-semibold justify-between">
          <div className="flex flex-col gap-1">
            {footerItems.map((key) => (
              <button
                key={key}
                className="text-left hover:text-blue-600 transition-colors"
              >
                {t(`sidemenu.${key}`)}
              </button>
            ))}
          </div>

          {/* Language + Dark mode buttons */}
          <div className="flex flex-col gap-2 items-end justify-center">
            <LanguageSelector />
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
