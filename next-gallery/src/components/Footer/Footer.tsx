import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";
import LanguageSelector from "../LanguageSelector";
import DarkModeToggle from "../DarkMode";
import { AppContext } from "../AppContext";

const Footer = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("Footer must be used within an AppProvider");
  }
  const { darkMode, toggleDarkMode } = context;

  const handlePhoneClick = () => {
    window.location.href = "tel:+84123456789";
  };

  const handleLocationClick = () => {
    window.open(
      "https://www.google.com/maps/search/?api=1&query=District+1,+Ho+Chi+Minh+City,+Vietnam",
      "_blank"
    );
  };

  return (
    <footer
      className={`w-full flex flex-row justify-between items-center border-t border-b transition-colors duration-300 ${
        darkMode
          ? "bg-black text-white border-white"
          : "bg-white text-black border-black"
      }`}
      style={{ height: "120px" }}
    >
      <div className="h-full flex flex-row items-center gap-2 w-1/3 px-6 border-r border-inherit">
        <div
          className={`w-16 h-16 rounded-md ${
            darkMode ? "bg-[#ffffff]" : "bg-[#e3e3e3]"
          }`}
        ></div>
        <div className="flex flex-col items-start gap-1">
          <div className="text-lg font-semibold">
            © 2025 Next Gallery® Company
          </div>
          <div className="text-xs font-semibold">
            Bring your photos near the arts.
          </div>
          <div className="text-xs font-semibold mt-1 flex items-center gap-2">
            <div
              className="flex items-center gap-1 transition-all duration-200 ease-in-out cursor-pointer hover:text-blue-400"
              onClick={handleLocationClick}
            >
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-base"
                style={{ cursor: "pointer" }}
              />
              <span>District 1, Ho Chi Minh City, Vietnam</span>
            </div>
            <div
              className="flex items-center gap-1 transition-all duration-200 ease-in-out cursor-pointer hover:text-blue-400"
              onClick={handlePhoneClick}
            >
              <FontAwesomeIcon
                icon={faPhoneAlt}
                className="text-base"
                style={{ cursor: "pointer" }}
              />
              <span>+84 123 456 789</span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-full px-6 flex flex-col items-start justify-center w-1/3 border-r border-inherit">
        {["Terms & Conditions", "Shipping & Returns", "Privacy Policy"].map(
          (item) => (
            <button
              key={item}
              className={`text-base font-semibold text-left transition-all duration-200 ease-in-out ${
                darkMode
                  ? "text-white hover:text-gray-400 hover:bg-gray-800"
                  : "text-black hover:text-gray-600 hover:bg-gray-200"
              } px-2 py-1 rounded-md`}
            >
              {item}
            </button>
          )
        )}
      </div>
      <div className="h-full flex flex-row items-center justify-between px-6 w-1/3">
        <div className="flex flex-col items-start gap-1">
          {["Instagram", "Facebook", "FAQ"].map((item) => (
            <button
              key={item}
              className={`text-base font-semibold text-left transition-all duration-200 ease-in-out ${
                darkMode
                  ? "text-white hover:text-gray-400 hover:bg-gray-800"
                  : "text-black hover:text-gray-600 hover:bg-gray-200"
              } px-2 py-1 rounded-md`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 items-end relative">
          <LanguageSelector />
          <DarkModeToggle />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
