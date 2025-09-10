import React, { createContext, useState, useEffect, useRef } from "react";
import type { ReactNode } from "react"; // Use type-only import for ReactNode

interface AppContextType {
  darkMode: boolean;
  language: string;
  showLangMenu: boolean;
  toggleDarkMode: () => void;
  toggleLangMenu: () => void;
  selectLanguage: (lang: string) => void;
  langMenuRef: React.RefObject<HTMLDivElement | null>; // Allow null for ref
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const toggleLangMenu = () => {
    setShowLangMenu((prev) => !prev);
  };

  const selectLanguage = (lang: string) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
