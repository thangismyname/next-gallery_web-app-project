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

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="mx-auto px-5 py-2.5 flex justify-between items-center">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-black text-xl font-semibold flex items-center gap-2"
          >
            Menu
          </button>

          <div className="text-black text-xl font-semibold text-center">
            Next Gallery®
          </div>

          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-xl text-black cursor-pointer hover:text-gray-800"
              onClick={() => setSearchOpen(true)}
            />
            <div
              className="flex items-center gap-2 cursor-pointer text-black hover:text-gray-800"
              onClick={handleUserClick}
            >
              <span className="text-xl font-semibold">{username}</span>
              <FontAwesomeIcon icon={faCircleUser} className="text-2xl" />
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
