import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SUPPORTED_LANGUAGES } from "@/i18n/languages";

/** Interface language switcher — see src/i18n/languages.ts to add a language. */
export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ?? SUPPORTED_LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1.5 px-2">
          <Languages className="h-4 w-4" />
          <span className="uppercase text-xs font-semibold">{current.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={lang.code === current.code ? "font-semibold" : undefined}
          >
            {lang.nativeLabel}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
