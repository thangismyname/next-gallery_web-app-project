// SideMenu.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ open, onClose }) => {
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
        <div className="p-5 flex flex-col gap-4 font-semibold">
          <button className="border-b pb-2 text-left text-black hover:text-blue-600">
            Upload
          </button>
          <button className="border-b pb-2 text-left text-black hover:text-blue-600">
            Download
          </button>
          <button className="border-b pb-2 text-left text-black hover:text-blue-600">
            View Profile
          </button>
          <button className="border-b pb-2 text-left text-black hover:text-blue-600">
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
          <div className="flex flex-col gap-2 items-start justify-center">
            <button className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 text-sm hover:bg-gray-300">
              English <FontAwesomeIcon icon={faGlobe} />
            </button>
            <button className="px-3 py-1 rounded-full bg-gray-300 text-sm hover:bg-gray-400">
              Dark mode
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
