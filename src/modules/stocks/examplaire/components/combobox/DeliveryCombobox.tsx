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
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDeliveries } from "../../hooks/useDeliveries";

interface DeliveryComboboxProps {
  value: string ;
  onChange: (value: string |number) => void;
}



export function DeliveryCombobox({ value, onChange }: DeliveryComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const { deliveries = [], loading } = useDeliveries();
    
    // S'assurer que deliveries est toujours un tableau
    const deliveriesArray = Array.isArray(deliveries) ? deliveries : [];
  
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            {value
              ? deliveriesArray.find((delivery) => delivery.id_livraison === value)
                  ?.reference
              : "Sélectionner reference d'achat..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Rechercher une reference..." />
            <CommandEmpty>Aucune Reference d'acaht trouvée.</CommandEmpty>
            <CommandGroup>
              {deliveriesArray.map((delivery) => (
                <CommandItem
                  key={delivery.id_livraison}
                  value={String(delivery.id_livraison)}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === delivery.id_livraison
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {delivery.reference}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
