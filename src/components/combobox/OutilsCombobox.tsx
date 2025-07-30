// src/components/combobox/DeliveryCombobox.tsx
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useDebounce } from "../../modules/stocks/entree/utils/helpers";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useOutilsDisponibles } from "@/modules/MoyensGeneraux/Outils/exemplaire/hooks/ExemaplaireOutils";

interface OutilsComboboxProps {
  value: string | number | undefined;
  onChange: (value: string | number) => void;
}

export function OutilsCombobox({ value, onChange }: OutilsComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Debounce du terme de recherche pour éviter trop d'appels API
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: deliveries, isLoading } = useOutilsDisponibles({
    page: 1,
    limit: 10,
    search: debouncedSearchTerm,
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {value
            ? deliveries?.find(
                (delivery) => String(delivery.id_exemplaire) === value
              )?.id_exemplaire
            : "Sélectionner un outil..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Rechercher un outil..."
            className="h-9"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>Aucun outil trouvé.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {deliveries?.map((delivery) => (
                <CommandItem
                  key={delivery.id_exemplaire}
                  value={String(delivery.id_exemplaire)}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  {delivery.id_exemplaire}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === String(delivery.id_exemplaire)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
