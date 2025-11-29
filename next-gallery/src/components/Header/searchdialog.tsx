"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";

interface SearchDialogProps {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  searchOpen,
  setSearchOpen,
}) => {
  const navigate = useNavigate();

  return (
    <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
      <CommandInput placeholder="Search products, categories..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Links">
          <CommandItem onSelect={() => navigate("/")}>🏠 Home</CommandItem>
          <CommandItem onSelect={() => navigate("/products")}>
            🛍️ Products
          </CommandItem>
          <CommandItem onSelect={() => navigate("/categories")}>
            📂 Categories
          </CommandItem>
          <CommandItem onSelect={() => navigate("/contact")}>
            📞 Contact Us
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
