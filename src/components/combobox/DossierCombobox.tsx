import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
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
import {
  useDossiersByType,
  useCreateDossier,
} from "../../modules/administration-Finnance/dossier/hooks/useDosier";
import { useDebounce } from "../../modules/stocks/entree/utils/helpers";

interface DossierComboboxProps {
  value: string | undefined;
  onChange: (value: string | number) => void;
  type: string;
}

export function DossierCombobox({
  value,
  onChange,
  type,
}: DossierComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState<string | undefined>(
    undefined
  );

  // Debounce du terme de recherche pour éviter trop d'appels API
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { dossiersByType, isLoadingDossiersByType, isErrorDossiersByType } =
    useDossiersByType(type, {
      libelle_dossier: debouncedSearchTerm,
    });
  const { createDossierAsync, isCreatingDossier } = useCreateDossier();
  const allDossiers = dossiersByType?.pages.flatMap((page) => page.data) || [];

  const handleCreateDossier = async () => {
    if (!searchTerm || searchTerm.trim() === "") return;

    try {
      const newDossier = await createDossierAsync({
        libelle_dossier: searchTerm.trim(),
        type_dossier: type,
      });
      // Sélectionner automatiquement le nouveau dossier créé
      if (newDossier?.id_dossier) {
        onChange(newDossier.id_dossier);
      }
      setOpen(false);
      setSearchTerm(undefined);
    } catch (error) {
      console.error("Erreur lors de la création du dossier:", error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoadingDossiersByType}
        >
          {value
            ? allDossiers?.find(
                (dossier) => String(dossier.id_dossier) === value
              )?.libelle_dossier
            : isLoadingDossiersByType
            ? "Chargement..."
            : isErrorDossiersByType
            ? "Erreur"
            : `Sélectionner un dossier de ${type}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Rechercher un dossier de ${type}...`}
            value={searchTerm}
            onValueChange={(v) => setSearchTerm(v === "" ? "" : v)}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-3">
                  Aucun dossier de {type} trouvé.
                </p>
                {searchTerm && searchTerm.trim() !== "" && (
                  <Button
                    onClick={handleCreateDossier}
                    disabled={isCreatingDossier}
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {isCreatingDossier
                      ? "Création..."
                      : `Créer "${searchTerm.trim()}"`}
                  </Button>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {searchTerm &&
                searchTerm.trim() !== "" &&
                allDossiers?.length === 0 &&
                !isLoadingDossiersByType && (
                  <CommandItem
                    onSelect={handleCreateDossier}
                    className="border-t border-gray-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="text-blue-600">
                      {isCreatingDossier
                        ? "Création..."
                        : `Créer "${searchTerm.trim()}"`}
                    </span>
                  </CommandItem>
                )}
              {isLoadingDossiersByType && searchTerm && (
                <CommandItem disabled>
                  <div className="flex items-center justify-center w-full py-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-gray-500">
                      Recherche...
                    </span>
                  </div>
                </CommandItem>
              )}
              {allDossiers?.map((dossier) => (
                <CommandItem
                  key={String(dossier.id_dossier)}
                  value={String(dossier.id_dossier)}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  {dossier.libelle_dossier}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === String(dossier.id_dossier)
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
