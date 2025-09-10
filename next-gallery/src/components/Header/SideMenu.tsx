import React, { useContext } from "react";
import { AppContext } from "../AppContext"; // Import AppContext
import LanguageSelector from "../LanguageSelector"; // Adjusted path
import DarkModeToggle from "../DarkMode"; // Adjusted path

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ open, onClose }) => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("SideMenu must be used within an AppProvider");
  }

  const { darkMode } = context;

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
          {/* Menu buttons */}
          <button onClick={onClose} className="p-5 py-3 border-b text-left">
            <span className="hover:text-red-600">Close</span>
          </button>
          <button className="p-5 py-3 border-b text-left">
            <span className=" hover:text-blue-600">Upload</span>
          </button>
          <button className="p-5 py-3 border-b text-left">
            <span className="hover:text-blue-600">Download</span>
          </button>
          <button className="p-5 py-3 border-b text-left">
            <span className="hover:text-blue-600">View Profile</span>
          </button>
          <button className="p-5 py-3 border-b text-left">
            <span className="hover:text-blue-600">See more Albums</span>
          </button>
        </div>

        {/* Footer links */}
        <div className="absolute bottom-5 left-5 right-5 flex gap-4 text-sm font-semibold justify-between">
          <div className="flex flex-col gap-1">
            {["Terms and Conditions", "Prices", "Privacy Policy"].map(
              (item, i) => (
                <button
                  key={i}
                  className="text-left hover:text-blue-600 transition-colors"
                >
                  {item}
                </button>
              )
            )}
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
