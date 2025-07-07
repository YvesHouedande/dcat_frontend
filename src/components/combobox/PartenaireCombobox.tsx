// src/components/combobox/partenaireCombobox.tsx
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

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/api/api";
import { Partenaires } from "@/modules/administration-Finnance/administration/types/interfaces";

interface PartenaireComboboxProps {
  value: string | undefined;
  onChange: (value: string | number) => void;
}

const PartenaireService = () => {
  const api = useApi();
  return {
    fetchPartenaire: async (): Promise<Partenaires[]> => {
      const response = await api.get(`administration/partenaires`);
      return response.data;
    },
  };
};

const usePartenaire = () => {
  // Query pour les livraisons
  const partenaireServie = PartenaireService();
  const partenaires = useQuery({
    queryKey: ["livraisons"],
    queryFn: partenaireServie.fetchPartenaire,
    staleTime: 15 * 60 * 1000, // 15 minutes (optionnel)
  });
  return {
    partenaires: partenaires.data,
    isLoading: partenaires.isLoading,
  };
};
export function PartenaireCombobox({ value, onChange }: PartenaireComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");


  const { partenaires: deliveries, isLoading } = usePartenaire();

  const deliveriesArray = React.useMemo(
    () => (Array.isArray(deliveries) ? deliveries : []),
    [deliveries]
  );

  const filteredDeliveries = React.useMemo(() => {
    if (!searchTerm) return deliveriesArray;
    return deliveriesArray.filter((partenaire) =>
      partenaire.nom_partenaire.toLowerCase().includes(searchTerm.toLowerCase())
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
                (partenaire) => String(partenaire.id_partenaire) === value
              )?.nom_partenaire
            : "Sélectionner une partenaire..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Rechercher une partenaire..."
            className="h-9"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>Aucune référence trouvée.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {filteredDeliveries.map((partenaire) => (
                <CommandItem
                  key={partenaire.id_partenaire}
                  value={String(partenaire.id_partenaire)}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                 
                  <div className="flex flex-col">
                    <span className="font-medium"> {partenaire.nom_partenaire}</span>
                    <span className="text-xs text-muted-foreground">
                      {partenaire.email_partenaire} | {partenaire.telephone_partenaire}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === String(partenaire.nom_partenaire)
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
