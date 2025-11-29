import React, { createContext, useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import i18n from "../../i18n";

interface AppContextType {
  language: string;
  showLangMenu: boolean;
  toggleLangMenu: () => void;
  selectLanguage: (lang: string) => void;
  langMenuRef: React.RefObject<HTMLDivElement | null>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  const languageCodeMap: { [key: string]: string } = {
    English: "en",
    Vietnamese: "vi",
  };

  const selectLanguage = (lang: string) => {
    const langCode = languageCodeMap[lang] || "en";
    setLanguage(langCode);
    localStorage.setItem("language", langCode);
    i18n.changeLanguage(langCode);
    setShowLangMenu(false);
  };

  const toggleLangMenu = () => setShowLangMenu((prev) => !prev);

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

  // Initialize i18n
  useEffect(() => {
    i18n.changeLanguage(language);
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        showLangMenu,
        toggleLangMenu,
        selectLanguage,
        langMenuRef,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
