"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SideMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  user: any;
  setUser: (user: any) => void; // update header state
  onUserClick: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  menuOpen,
  setMenuOpen,
  user,
  setUser,
  onUserClick,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local/session storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    // Update parent header state
    setUser(null);

    // Trigger storage event for other tabs/components
    window.dispatchEvent(new Event("storage"));

    // Navigate to login page
    navigate("/auth");
    setMenuOpen(false);
  };

  return (
    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="font-medium text-base hover:bg-accent hover:text-accent-foreground"
        >
          Menu
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-64 p-2 bg-background text-foreground border-r border-border"
      >
        <SheetHeader>
          <SheetTitle className="text-lg font-bold tracking-tight">
            Menu
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col space-y-1 mt-4">
          <Button
            variant="ghost"
            className="justify-start text-base h-10 hover:bg-accent"
            onClick={() => {
              navigate("/");
              setMenuOpen(false);
            }}
          >
            Home
          </Button>

          <Button
            variant="ghost"
            className="justify-start text-base h-10 hover:bg-accent"
            onClick={() => {
              navigate("/products");
              setMenuOpen(false);
            }}
          >
            Shop
          </Button>

          <Button
            variant="ghost"
            className="justify-start text-base h-10 hover:bg-accent"
            onClick={() => {
              navigate("/about");
              setMenuOpen(false);
            }}
          >
            About
          </Button>

          <Separator className="my-3" />

          <Button
            variant="ghost"
            className="justify-start text-base h-10 hover:bg-accent"
            onClick={() => {
              onUserClick();
              setMenuOpen(false);
            }}
          >
            {user ? "Profile" : "Sign In"}
          </Button>

          {user && (
            <Button
              variant="ghost"
              className="justify-start text-base h-10 hover:bg-accent text-red-600"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
