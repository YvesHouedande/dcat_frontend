// src/techniques/projects/components/gestions/MultiSelectPartenaires.tsx
import React from "react";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { PartenaireProfile } from '@/modules/administration-Finance/administration/pages/partenaires/partenaire';

export interface MultiSelectPartenaireProps {
  partenaires: PartenaireProfile[];
  selectedPartenaires: number[];
  onChange: (value: number[]) => void;
  disabled?: boolean;
}

export const MultiSelectPartenaires: React.FC<MultiSelectPartenaireProps> = ({
  partenaires,
  selectedPartenaires,
  onChange,
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (id: number) => {
    if (selectedPartenaires.includes(id)) {
      onChange(selectedPartenaires.filter((selected) => selected !== id));
    } else {
      onChange([...selectedPartenaires, id]);
    }
  };

  const handleRemove = (id: number) => {
    onChange(selectedPartenaires.filter((selected) => selected !== id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-h-10 h-auto w-full max-w-full justify-between overflow-hidden"
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 ">
            {selectedPartenaires.length === 0 ? (
              <span className="text-muted-foreground">Sélectionner des partenaires</span>
            ) : (
              selectedPartenaires.map((id) => {
                const partenaire = partenaires.find((p) => p.id_partenaire === id);
                return partenaire ? (
                  <Badge variant="secondary" key={id} className="mr-1 mb-1">
                    {partenaire.nom_partenaire || `Partenaire ${id}`}
                    <Button
                      className="ml-1 h-4 w-4 rounded-full p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ) : null;
              })
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Rechercher un partenaire..." />
          <CommandEmpty>Aucun partenaire trouvé.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {partenaires.map((partenaire) => (
              <CommandItem
                key={partenaire.id_partenaire}
                value={partenaire.nom_partenaire || `Partenaire ${partenaire.id_partenaire}`}
                onSelect={() => {
                  handleSelect(partenaire.id_partenaire);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedPartenaires.includes(partenaire.id_partenaire)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {partenaire.nom_partenaire || `Partenaire ${partenaire.id_partenaire}`}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};