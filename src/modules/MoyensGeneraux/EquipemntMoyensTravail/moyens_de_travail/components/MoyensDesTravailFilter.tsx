import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoyensFilters } from "../types/moyens-de-travail.types";
import { Search, X } from "lucide-react";

interface MoyensDesTravailFilterProps {
  filters: MoyensFilters;
  sections: string[];
  onFiltersChange: (filters: Partial<MoyensFilters>) => void;
}

export function MoyensDesTravailFilter({
  filters,
  sections,
  onFiltersChange,
}: MoyensDesTravailFilterProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  // Appliquer les filtres après un court délai pour éviter trop de requêtes pendant la saisie
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (localSearch !== filters.search) {
  //       onFiltersChange({ search: localSearch || undefined });
  //     }
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, [localSearch, filters.search, onFiltersChange]);

  const resetFilters = () => {
    setLocalSearch("");
    onFiltersChange({
      search: undefined,
      section: undefined,
      dateStart: undefined,
      dateEnd: undefined,
      page: 1,
    });
  };

  const hasFilters =
    filters.search || filters.section || filters.dateStart || filters.dateEnd;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Select
          value={filters.section ?? undefined}
          onValueChange={(value) =>
            onFiltersChange({ section: value || undefined })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue defaultValue={"all"} placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les sections</SelectItem>
            {sections?.map((section) => (
              <SelectItem key={section} value={section}>
                {section}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            placeholder="Date début"
            value={filters.dateStart || ""}
            onChange={(e) =>
              onFiltersChange({ dateStart: e.target.value || undefined })
            }
            className="w-[160px]"
          />
          <span>à</span>
          <Input
            type="date"
            placeholder="Date fin"
            value={filters.dateEnd || ""}
            onChange={(e) =>
              onFiltersChange({ dateEnd: e.target.value || undefined })
            }
            className="w-[160px]"
          />
        </div>

        {hasFilters && (
          <Button variant="ghost" onClick={resetFilters} className="h-10">
            <X className="h-4 w-4 mr-1" /> Réinitialiser
          </Button>
        )}
      </div>
    </div>
  );
}
