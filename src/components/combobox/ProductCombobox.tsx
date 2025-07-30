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
import { useProducts } from "../../modules/stocks/reference/hooks/useProducts";

interface ProductComboboxProps {
  value: string;
  onChange: (value: string | number) => void;
  isTools?: boolean;
}

export function ProductCombobox({
  value,
  onChange,
  isTools = false,
}: ProductComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState<string | undefined>(
    undefined
  );

  // Debounce du terme de recherche pour éviter trop d'appels API
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { products } = useProducts({
    search: debouncedSearchTerm,
    typeId: isTools ? 2 : 1,
  });
  const allProducts = products.data?.pages?.flatMap((page) => page.data);

  // Filtrer les produits selon la recherche

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={products.isLoading}
        >
          {value
            ? allProducts?.find(
                (product) => String(product.id_produit) === value
              )?.desi_produit
            : `Sélectionner un ${isTools ? "outil" : "produit"}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Rechercher un ${isTools ? "outil" : "produit"}...`}
            value={searchTerm}
            onValueChange={(v) => setSearchTerm(v === "" ? undefined : v)}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              Aucun {isTools ? "outil" : "produit"} trouvé.
            </CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {allProducts?.map((product) => (
                <CommandItem
                  key={String(product.id_produit)}
                  value={String(product.id_produit)}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <div>
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.images?.[0]?.libelle_image}
                      className="w-8 h-8 rounded mr-2"
                    />
                  </div>{" "}
                  {product.desi_produit}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === String(product.id_produit)
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
