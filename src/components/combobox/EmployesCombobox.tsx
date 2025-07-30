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

import { useDebounce } from "../../modules/stocks/entree/utils/helpers";
import { useApi } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { Employe } from "@/modules/administration-Finnance/administration/types/interfaces";

interface EmployesComboboxProps {
  value: string | number | undefined;
  onChange: (value: string | number) => void;
}

interface EmployeResponse {
  data: Employe[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function EmployesCombobox({ value, onChange }: EmployesComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const getEmployes = async () => {
    const response = await api.get<EmployeResponse>("/administration/employes");
    return response.data;
  };

  const api = useApi();
  const { data: employes, isLoading } = useQuery({
    queryKey: ["employesCombobox"],
    queryFn: getEmployes,
    staleTime: 2 * 60 * 1000,
  });

  // Debounce du terme de recherche pour éviter trop d'appels API
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredDeliveries = React.useMemo(() => {
    if (!debouncedSearchTerm) return employes?.data;
    return employes?.data.filter((employe) =>
      employe.nom_employes
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase())
    );
  }, [employes, debouncedSearchTerm]);

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
            ? employes?.data.find(
                (employe) => String(employe.id_employes) === value
              )?.nom_employes
            : "Sélectionner un  employé..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Rechercher un employé..."
            className="h-9"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>Aucun employé.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {filteredDeliveries?.map((employe) => (
                <CommandItem
                  key={employe.id_employes}
                  value={String(employe.id_employes)}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  {employe.nom_employes}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === String(employe.id_employes)
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
