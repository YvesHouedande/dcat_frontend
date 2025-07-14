// src/components/ProjetFilters.tsx
// REMOVED: useState and useEffect as partnersOptions will be passed via props
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
// REMOVED: getPartenaires import as partners are now passed via props

type ProjetFiltersProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterEtat: string;
  onFilterChange: (value: string) => void;
  filterPartenaire: number;
  onFilterPartenaireChange: (value: number) => void;
  // ADDED: partenairesOptions is now a required prop
  partenairesOptions: { id: number; name: string }[]; 
  resultCount: number;
};

export const ProjetFilters = ({
  searchTerm,
  onSearchChange,
  filterEtat,
  onFilterChange,
  filterPartenaire,
  onFilterPartenaireChange,
  partenairesOptions, // <-- Now receiving partnersOptions via props
  resultCount,
}: ProjetFiltersProps) => {
  // REMOVED: The useState and useEffect for loading partners are no longer needed here
  // as the parent component (ProjetsPage) will provide them.

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Select onValueChange={onFilterChange} value={filterEtat}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="État" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tous">Tous états</SelectItem>
          <SelectItem value="en_cours">En cours</SelectItem>
          <SelectItem value="planifié">Planifié</SelectItem>
          <SelectItem value="terminé">Terminé</SelectItem>
          <SelectItem value="annulé">Annulé</SelectItem>
        </SelectContent>
      </Select>

      <Select
        // The value of the Select component should be a string, so we convert filterPartenaire to string
        value={filterPartenaire.toString()}
        // onValueChange receives the string value from the SelectItem, convert it to number
        onValueChange={(value) => onFilterPartenaireChange(Number(value))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Partenaires" />
        </SelectTrigger>
        <SelectContent>
          {/* Iterate over partenairesOptions received from props */}
          {partenairesOptions.map((p) => (
            <SelectItem key={p.id} value={p.id.toString()}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center text-sm text-gray-500">
        <Filter className="h-4 w-4 mr-1" />
        {resultCount} projet(s)
      </div>
    </div>
  );
};
