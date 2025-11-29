import { Moon, Sun, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme/theme-provider";
import { useTranslation } from "react-i18next";

interface ToggleProps {
  variant?: "minimal" | "default";
}

export function ThemeToggle({ variant = "default" }: ToggleProps) {
  const { theme, setTheme } = useTheme();

  const baseClasses = "h-8 w-8 p-0 shadow-none focus:ring-0 transition-all";
  const minimalClasses =
    "bg-transparent hover:bg-transparent border-none rounded-none";
  const defaultClasses = "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`${baseClasses} ${
            variant === "minimal" ? minimalClasses : defaultClasses
          }`}
        >
          {theme === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LanguageToggle({ variant = "default" }: ToggleProps) {
  const { i18n } = useTranslation();

  const baseClasses = "h-8 w-8 p-0 shadow-none focus:ring-0 transition-all";
  const minimalClasses =
    "bg-transparent hover:bg-transparent border-none rounded-none";
  const defaultClasses = "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`${baseClasses} ${
            variant === "minimal" ? minimalClasses : defaultClasses
          }`}
        >
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => i18n.changeLanguage("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => i18n.changeLanguage("vi")}>
          Tiếng Việt
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => i18n.changeLanguage("jp")}>
          日本語
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
