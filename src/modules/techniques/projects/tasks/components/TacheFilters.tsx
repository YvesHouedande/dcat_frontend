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
import { Tache } from "../../types/types";

interface TacheFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterStatut: Tache["statut"] | "tous";
  onFilterStatutChange: (statut: Tache["statut"] | "tous") => void;
  filterPriorite: Tache["priorite"] | "toutes";
  onFilterPrioriteChange: (priorite: Tache["priorite"] | "toutes") => void;
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
  filterStatut,
  onFilterStatutChange,
  filterPriorite,
  onFilterPrioriteChange,
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
            placeholder="Rechercher par nom ou description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Statut Filter */}
        <div className="space-y-2">
          <Label htmlFor="filter-statut">Statut</Label>
          <Select
            value={filterStatut}
            onValueChange={(value) => onFilterStatutChange(value as Tache["statut"] | "tous")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              <SelectItem value="à faire">À faire</SelectItem>
              <SelectItem value="en cours">En cours</SelectItem>
              <SelectItem value="en revue">En revue</SelectItem>
              <SelectItem value="terminé">Terminé</SelectItem>
              <SelectItem value="bloqué">Bloqué</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priorité Filter - CORRECTION ICI */}
        <div className="space-y-2">
          <Label htmlFor="filter-priorite">Priorité</Label>
          <Select
            value={filterPriorite || "toutes"}
            onValueChange={(value) => onFilterPrioriteChange(value as Tache["priorite"] | "toutes")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toutes">Toutes les priorités</SelectItem>
              <SelectItem value="basse">Basse</SelectItem>
              <SelectItem value="moyenne">Moyenne</SelectItem>
              <SelectItem value="élevée">Élevée</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
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

        {/* Assignee Filter - CORRECTION ICI */}
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
                // Filtrer les options avec des noms vides ou invalides
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