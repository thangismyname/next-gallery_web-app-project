import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import SideMenu from "./SideMenu";
import Search from "./Search";
import { AppContext } from "../AppContext";

interface HeaderProps {
  username?: string;
  isLoggedIn?: boolean;
}

const HeaderWithMenu: React.FC<HeaderProps> = ({
  username = "User",
  isLoggedIn = false,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const context = useContext(AppContext);
  if (!context) {
    throw new Error("HeaderWithMenu must be used within an AppProvider");
  }

  const { darkMode } = context;

  const handleUserClick = () => {
    if (isLoggedIn) {
      console.log("Go to user info page");
    } else {
      console.log("Redirect to login/register");
    }
  };

  const handleGoHome = () => {
    window.location.href = "/";
    // OR with react-router-dom: navigate("/");
  };

  return (
    <>
      <header
        className={`w-full sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
          darkMode
            ? "bg-black text-white border-white"
            : "bg-white text-black border-black"
        }`}
      >
        <div className="mx-auto px-5 py-1.5 flex justify-between items-center">
          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className={`px-3 py-1 text-l font-semibold flex items-center gap-2 rounded-2xl transition-all duration-200 ease-in-out ${
              darkMode
                ? "text-white hover:bg-gray-800"
                : "text-black hover:bg-gray-200"
            }`}
          >
            Menu
          </button>

          {/* Logo / Title */}
          <div
            className={`text-l font-semibold text-center cursor-pointer transition-all duration-200 ease-in-out ${
              darkMode
                ? "text-white hover:text-gray-200"
                : "text-black hover:text-gray-600"
            }`}
            onClick={handleGoHome}
          >
            Next Gallery®
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Icon (circle) */}
            <div
              className={`w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 ease-in-out ${
                darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
              }`}
              onClick={() => setSearchOpen(true)}
            >
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className={`text-base ${
                  darkMode ? "text-white" : "text-black"
                }`}
              />
            </div>

            {/* User Section */}
            <div
              className={`flex items-center gap-2 cursor-pointer transition-all duration-200 ease-in-out ${
                darkMode
                  ? "text-white hover:text-gray-400"
                  : "text-black hover:text-gray-600"
              }`}
              onClick={handleUserClick}
            >
              <span className="text-l font-semibold">{username}</span>
              <FontAwesomeIcon icon={faCircleUser} className="text-xl" />
            </div>
          </div>
        </div>
      </header>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {searchOpen && <Search onClose={() => setSearchOpen(false)} />}
    </>
  );
};

export default HeaderWithMenu;
