// src/components/combobox/ProductCombobox.tsx
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
import { useProducts } from "../../hooks/useProducts";

interface ProductComboboxProps {
  value: string;
  onChange: (value: string | number) => void;
}

export function ProductCombobox({ value, onChange }: ProductComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const { products = [], loading } = useProducts();

    // S'assurer que products est toujours un tableau
    const productsArray = Array.isArray(products) ? products : [];
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
            ? products.find((product) => product.id_produit === value)
                ?.desi_produit
            : "Sélectionner un produit..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Rechercher un produit..." />
          <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
          <CommandGroup>
            {productsArray.map((product) => (
              <CommandItem
                key={product.id_produit}
                value={String(product.id_produit)}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === product.id_produit ? "opacity-100" : "opacity-0"
                  )}
                />
                {product.code_produit} - {product.desi_produit}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
