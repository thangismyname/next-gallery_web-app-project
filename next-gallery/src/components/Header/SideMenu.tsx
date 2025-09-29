import React, { useContext } from "react";
import { AppContext } from "../Theme/AppContext";
import LanguageSelector from "../Theme/LanguageSelector";
import DarkModeToggle from "../Theme/DarkMode";
import { useTranslation } from "react-i18next";
import LegalLinks from "../LegalLinks";
import { logout } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export interface UserHeader {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "Admin" | "Photographer" | "User";
  studentId?: string;
  providers: {
    provider: "local" | "google" | "discord";
    providerId?: string;
  }[];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ... rest of SideMenu.tsx remains unchanged

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  user: UserHeader | null; // 👈 new prop
}

const SideMenu: React.FC<SideMenuProps> = ({ open, onClose, user }) => {
  const context = useContext(AppContext);
  if (!context) throw new Error("SideMenu must be used within an AppProvider");

  const { darkMode } = context;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login");
  };

  const menuItems = [
    { key: "upload", onClick: () => {} },
    { key: "download", onClick: () => {} },
    { key: "viewProfile", onClick: () => {} },
    { key: "seeMoreAlbums", onClick: () => {} },
  ];

  // Only add logout if user exists
  if (user) {
    menuItems.push({ key: "logout", onClick: handleLogout });
  }

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
        className={`fixed top-0 left-0 h-full shadow-lg z-50 transform transition-transform duration-300 ${
          darkMode ? "bg-black text-white" : "bg-white text-black"
        } ${open ? "translate-x-0" : "-translate-x-full"} 
          w-64 sm:w-72 md:w-80 lg:w-96`}
      >
        <div className="flex flex-col font-semibold">
          <button
            onClick={onClose}
            className="p-4 py-3 border-b text-left md:p-5"
          >
            <span className="hover:text-red-600">{t("sidemenu.close")}</span>
          </button>

          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={item.onClick}
              className="p-4 py-3 border-b text-left md:p-5"
            >
              <span
                className={`hover:${
                  item.key === "logout" ? "red-600" : "blue-600"
                }`}
              >
                {t(`sidemenu.${item.key}`)}
              </span>
            </button>
          ))}
        </div>

        {/* Footer links */}
        <div className="absolute bottom-5 left-5 right-5 flex gap-4 text-sm font-semibold justify-between md:bottom-6 md:left-6 md:right-6">
          <div className="flex flex-col gap-1">
            <LegalLinks vertical={true} />
          </div>

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
