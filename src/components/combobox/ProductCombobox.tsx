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
import { useProducts } from "../../modules/stocks/reference/hooks/useProducts";
import { useMemo } from "react";

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
  const [searchTerm, setSearchTerm] = React.useState("");
  const { products } = useProducts();
  const allProducts = useMemo(() => products.data?.pages?.flatMap(page => page.data) || [], [products.data?.pages]);
  // Filtrer les produits selon la recherche
  const filteredProducts = React.useMemo(() => {
    if (!searchTerm) return allProducts;
    return allProducts.filter(
      (product) =>
        (product.desi_produit ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (product.code_produit ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allProducts]);

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
            ? allProducts.find(
                (product) => String(product.id_produit) === value
              )?.desi_produit
            : `Sélectionner un ${isTools ? "outil" : "produit"}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Rechercher un ${isTools ? "outil" : "produit"}...`}
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              Aucun {isTools ? "outil" : "produit"} trouvé.
            </CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {filteredProducts.map((product) => (
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
                  </div>
                  {product.code_produit} - {product.desi_produit}
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
