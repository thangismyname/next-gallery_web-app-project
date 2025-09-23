import React, { createContext, useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import i18n from "../../i18n";

interface AppContextType {
  darkMode: boolean;
  language: string;
  showLangMenu: boolean;
  toggleDarkMode: () => void;
  toggleLangMenu: () => void;
  selectLanguage: (lang: string) => void;
  langMenuRef: React.RefObject<HTMLDivElement | null>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  // Language code mapping
  const languageCodeMap: { [key: string]: string } = {
    English: "en",
    Vietnamese: "vi",
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", newMode.toString());
      return newMode;
    });
  };

  // Select language and update i18n
  const selectLanguage = (lang: string) => {
    const langCode = languageCodeMap[lang] || "en"; // Map display name to code
    console.log("Selecting language:", lang, "Mapped to:", langCode);
    setLanguage(langCode); // Store code (en, vi) in state
    localStorage.setItem("language", langCode);
    i18n.changeLanguage(langCode);
    setShowLangMenu(false);
  };

  const toggleLangMenu = () => setShowLangMenu((prev) => !prev);

  // Apply dark mode class to <html> dynamically
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize i18n language on load
  useEffect(() => {
    console.log("Initializing i18n with language:", language);
    i18n.changeLanguage(language);
  }, []);

  return (
    <AppContext.Provider
      value={{
        darkMode,
        language,
        showLangMenu,
        toggleDarkMode,
        toggleLangMenu,
        selectLanguage,
        langMenuRef,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
