"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCurrentUser } from "../../services/userService";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/mode-toggle";
import { Search, User } from "lucide-react";

import { SideMenu } from "./SideMenu";
import { SearchDialog } from "./searchdialog";

interface UserHeader {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

const HeaderWithMenu: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<UserHeader | null>(getCurrentUser());
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Sync user with localStorage/session
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleUserClick = () => {
    if (user) navigate("/userpage");
    else navigate("/login");
  };

  const handleGoHome = () => navigate("/");

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background text-foreground transition-colors duration-300">
        <div className="mx-auto px-6 py-2 flex justify-between items-center">
          <SideMenu
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            user={user}
            setUser={setUser}
            onUserClick={handleUserClick}
          />

          <div
            className="text-lg font-semibold cursor-pointer hover:opacity-80 transition"
            onClick={handleGoHome}
          >
            {t("header.title")}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle variant="minimal" />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="rounded-full"
            >
              <Search className="w-5 h-5" />
            </Button>

            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
              onClick={handleUserClick}
            >
              {/* User name next to avatar */}
              {/* <span className="text-base font-medium">
                {user
                  ? user.firstName ||
                    user.lastName ||
                    user.email?.split("@")[0] ||
                    t("User")
                  : t("Sign In")}
              </span> */}

              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.firstName || user.email || "User Avatar"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6" />
              )}
            </div>
          </div>
        </div>
      </header>

      <SearchDialog searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
    </>
  );
};

export default HeaderWithMenu;
