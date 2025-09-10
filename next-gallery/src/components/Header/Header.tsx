import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import SideMenu from "./SideMenu";
import Search from "./Search";

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
      <header className="w-full sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="mx-auto px-5 py-1.5 flex justify-between items-center">
          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="px-3 py-1 text-black text-l font-semibold flex items-center gap-2 rounded-2xl hover:bg-gray-200 transition-all duration-200 ease-in-out"
          >
            Menu
          </button>

          {/* Logo / Title */}
          <div
            className="text-black text-l font-semibold text-center cursor-pointer hover:text-gray-600 transition-all duration-200 ease-in-out"
            onClick={handleGoHome}
          >
            Next Gallery®
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Icon (circle) */}
            <div
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer transition-all duration-200 ease-in-out"
              onClick={() => setSearchOpen(true)}
            >
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-black text-base"
              />
            </div>

            {/* User Section */}
            <div
              className="flex items-center gap-2 cursor-pointer text-black hover:text-gray-600 transition-all duration-200 ease-in-out"
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
