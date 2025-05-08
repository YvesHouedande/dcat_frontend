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
import { EmployeProfile } from "@/modules/administration-Finnance/administration/pages/employers/employe";
// import { PartenaireProfile } from '@/modules/administration-Finance/administration/pages/partenaires/partenaire';

export interface MultiSelectProfileProps {
  profiles: EmployeProfile[];
  selectedProfiles: number[];
  onChange: (value: number[]) => void;
  disabled?: boolean;
}

export const MultiSelectProfile: React.FC<MultiSelectProfileProps> = ({
  profiles,
  selectedProfiles,
  onChange,
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (id: number) => {
    if (selectedProfiles.includes(id)) {
      onChange(selectedProfiles.filter((selected) => selected !== id));
    } else {
      onChange([...selectedProfiles, id]);
    }
  };

  const handleRemove = (id: number) => {
    onChange(selectedProfiles.filter((selected) => selected !== id));
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
            {selectedProfiles.length === 0 ? (
              <span className="text-muted-foreground">
                Sélectionner un responsable
              </span>
            ) : (
              selectedProfiles.map((id) => {
                const profile = profiles.find((p) => Number(p.id) === id);
                return profile ? (
                  <Badge variant="secondary" key={id} className="mr-1 mb-1">
                    {profile.name || `Responsable ${id}`}
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
            {profiles.map((profile) => (
              <CommandItem
                key={profile.id}
                value={profile.name || `Partenaire ${profile.name}`}
                onSelect={() => {
                  handleSelect(Number(profile.id));
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedProfiles.includes(Number(profile.id))
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {profile.name || `Partenaire ${Number(profile.id)}`}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
