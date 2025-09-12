import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../Theme/AppContext";

const Newsletter: React.FC = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const [email, setEmail] = useState("");
  const context = useContext(AppContext);

  if (!context)
    throw new Error("Newsletter must be used within an AppProvider");

  const { darkMode } = context;

  const handleSubscribe = () => {
    if (email) {
      alert(t("newsletter.subscribed_message", { email })); // Use translation key with interpolation
      setEmail("");
    } else {
      alert(t("newsletter.error_invalid_email")); // Use translation key for error
    }
  };

  return (
    <div
      className={`w-full px-4 md:px-6 lg:px-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 md:gap-10 py-2 md:py-3 overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-black border-white" : "bg-white border-black"
      }`}
    >
      {/* Text */}
      <div
        className={`text-base md:text-base font-semibold text-center md:text-left ${
          darkMode ? "text-white" : "text-black"
        }`}
      >
        {t("newsletter.subscribe_text")}{" "}
        {/* Use translation key for promotional text */}
      </div>

      {/* Input + Button */}
      <div className="flex flex-col md:flex-row justify-start items-center gap-2.5 w-full md:w-auto">
        <div
          className={`w-full md:w-[300px] h-[26px] px-3.5 rounded-[20px] flex items-center overflow-hidden ${
            darkMode ? "bg-white" : "bg-gray-200"
          }`}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("newsletter.email_placeholder")} // Use translation key for placeholder
            className={`w-full bg-transparent text-base font-semibold outline-none placeholder-gray-400 ${
              darkMode ? "text-black" : "text-gray-600"
            }`}
          />
        </div>

        <button
          onClick={handleSubscribe}
          className={`w-full md:w-auto h-[26px] px-2.5 rounded-[20px] flex justify-center items-center gap-[3px] mt-2 md:mt-0 transition-colors duration-200 ${
            darkMode
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          <span className="text-base font-semibold">
            {t("newsletter.subscribe_button")}{" "}
            {/* Use translation key for button */}
          </span>
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              darkMode ? "border-black" : "border-white"
            }`}
          >
            <FontAwesomeIcon
              icon={faArrowRight}
              className={darkMode ? "text-black text-sm" : "text-white text-sm"}
            />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Newsletter;
