// src/components/dashboard/ExemplaireCombobox.tsx
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProductInstance } from "../types";

interface ExemplaireComboboxProps {
  exemplaires: ProductInstance[];
  value: number | null;
  onChange: (value: number) => void;
}

export function ExemplaireCombobox({ exemplaires, value, onChange }: ExemplaireComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedExemplaire = exemplaires.find(
    (exemplaire) => exemplaire.id_exemplaire === value
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value && selectedExemplaire
            ? `${selectedExemplaire.num_serie}`
            : "Sélectionner un exemplaire..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Rechercher un exemplaire..." />
          <CommandEmpty>Aucun exemplaire trouvé.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {exemplaires.map((exemplaire) => (
              <CommandItem
                key={exemplaire.id_exemplaire}
                value={exemplaire.num_serie}
                onSelect={() => {
                  onChange(exemplaire.id_exemplaire);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === exemplaire.id_exemplaire ? "opacity-100" : "opacity-0"
                  )}
                />
                {exemplaire.num_serie}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}