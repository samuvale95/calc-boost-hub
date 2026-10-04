import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { countryOptions } from "@/data/countries";

interface CountrySelectProps {
  id?: string;
  /** ISO 3166-1 alpha-2 code of the selected country, or "" for none. */
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

/** Searchable list of all countries, names in the interface language. */
export const CountrySelect = ({ id, value, onChange, disabled }: CountrySelectProps) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const options = useMemo(() => countryOptions(i18n.language), [i18n.language]);
  const selected = options.find((o) => o.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between pl-10 font-normal relative"
        >
          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected ? selected.name : t("completeProfile.countryPlaceholder")}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder={t("completeProfile.countrySearch")} />
          <CommandList>
            <CommandEmpty>{t("completeProfile.countryEmpty")}</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.code}
                value={option.name}
                onSelect={() => {
                  onChange(option.code);
                  setOpen(false);
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", option.code === value ? "opacity-100" : "opacity-0")} />
                {option.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
