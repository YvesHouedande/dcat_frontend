// src/components/taches/TacheFilters.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface TacheFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterProjet: number;
  onFilterProjetChange: (projetId: number) => void;
  filterAssignee: number;
  onFilterAssigneeChange: (employeId: number) => void;
  projetsOptions: { id: number; name: string }[];
  employesOptions: { id: number; name: string }[];
  resultCount: number;
}

export const TacheFilters: React.FC<TacheFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterProjet,
  onFilterProjetChange,
  filterAssignee,
  onFilterAssigneeChange,
  projetsOptions,
  employesOptions,
  resultCount,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Filtres et Recherche</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Rechercher</Label>
          <Input
            id="search"
            placeholder="Rechercher par nom..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Projet Filter */}
        <div className="space-y-2">
          <Label htmlFor="filter-projet">Projet</Label>
          <Select
            value={String(filterProjet)}
            onValueChange={(value) => onFilterProjetChange(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par projet" />
            </SelectTrigger>
            <SelectContent>
              {projetsOptions.map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Assignee Filter */}
        <div className="space-y-2">
          <Label htmlFor="filter-assignee">Assigné à</Label>
          <Select
            value={String(filterAssignee)}
            onValueChange={(value) => onFilterAssigneeChange(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par employé" />
            </SelectTrigger>
            <SelectContent>
              {employesOptions.map((option) => {
                if (!option.name || option.name.trim() === '') {
                  return null;
                }
                return (
                  <SelectItem key={option.id} value={String(option.id)}>
                    {option.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        <Badge variant="outline" className="mr-2">
          {resultCount} tâche(s) trouvée(s)
        </Badge>
      </div>
    </div>
  );
};