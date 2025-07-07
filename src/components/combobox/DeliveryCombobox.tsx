// src/components/combobox/DeliveryCombobox.tsx
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
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLivraisonData } from "@/modules/stocks/livraison/hooks/useLivraison";

interface DeliveryComboboxProps {
  value: string;
  onChange: (value: string | number) => void;
}

export function DeliveryCombobox({ value, onChange }: DeliveryComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const { livraisons: deliveries, isLoading } = useLivraisonData();

  const deliveriesArray = React.useMemo(
    () => (Array.isArray(deliveries) ? deliveries : []),
    [deliveries]
  );

  const filteredDeliveries = React.useMemo(() => {
    if (!searchTerm) return deliveriesArray;
    return deliveriesArray.filter((delivery) =>
      delivery.reference_livraison.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [deliveriesArray, searchTerm]);

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
            ? deliveriesArray.find(
                (delivery) => String(delivery.id_livraison) === value
              )?.reference_livraison
            : "Sélectionner reference d'achat..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Rechercher une référence..."
            className="h-9"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>Aucune référence trouvée.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {filteredDeliveries.map((delivery) => (
                <CommandItem
                  key={delivery.id_livraison}
                  value={String(delivery.id_livraison)}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  {delivery.reference_livraison}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === String(delivery.id_livraison)
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
