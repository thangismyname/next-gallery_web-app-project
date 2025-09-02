// HeaderWithMenu.tsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import SideMenu from "./SideMenu";

interface HeaderProps {
  username?: string;
}

const HeaderWithMenu: React.FC<HeaderProps> = ({ username = "User" }) => {
  const [menuOpen, setMenuOpen] = useState(false);

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
            />
            <div className="flex items-center gap-2 cursor-pointer text-black hover:text-gray-800">
              <span className="text-xl font-semibold">{username}</span>
              <FontAwesomeIcon icon={faCircleUser} className="text-2xl" />
            </div>
          </div>
        </div>
      </header>

      {/* Side Menu */}
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default HeaderWithMenu;
