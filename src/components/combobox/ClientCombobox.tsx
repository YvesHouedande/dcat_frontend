import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
import { useMemo } from "react";
import { useApi } from "@/api/api";
import { Clients } from "@/modules/stocks/commande/types/commande";
import { useQuery } from "@tanstack/react-query";

interface ClientComboboxProps {
  value: string | undefined;
  onChange: (value: string | number) => void;
}

const ClientService = () => {
  const api = useApi();
  return {
    fetchClient: async (): Promise<Clients[]> => {
      const response = await api.get(`stocks/clients`);
      return response.data;
    },
  };
};

const useClients = () => {
  const { fetchClient } = ClientService();
  return useQuery({
    queryKey: ["clients"],
    queryFn: fetchClient,
  });
};

export function ClientCombobox({
  value,
  onChange,
  disabled = false,
}: ClientComboboxProps & { disabled?: boolean; isLoading?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const { data: clients, isLoading: queryLoading } = useClients();

  // Filtrer les clients selon la recherche
  const filteredClients = useMemo(() => {
    if (!clients) return [];
    if (!searchTerm) return clients;
    return clients.filter(
      (client) =>
        (client.nom ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.email ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.contact ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, clients]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || queryLoading}
        >
          {value
            ? clients?.find((client) => String(client.id) === value)?.nom
            : `Sélectionner un client...`}
          {queryLoading ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Rechercher un client..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>Aucun client trouvé.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {filteredClients.map((client) => (
                <CommandItem
                  key={String(client.id)}
                  value={String(client.id)}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{client.nom}</span>
                    <span className="text-xs text-muted-foreground">
                      {client.email} | {client.contact}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === String(client.id) ? "opacity-100" : "opacity-0"
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
