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
import { Operation } from "../../types/types";

export interface OperationFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterStatut: Operation["statut"] | "tous";
  onFilterStatutChange: (statut: Operation["statut"] | "tous") => void;
  filterProjet: number;
  onFilterProjetChange: (projetId: number) => void;
  projetsOptions: { id_projet: number; nom_projet: string }[];
  resultCount: number;
}

export const OperationFilters: React.FC<OperationFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterStatut,
  onFilterStatutChange,
  filterProjet,
  onFilterProjetChange,
  projetsOptions,
  resultCount,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Filtres et Recherche pour les Opérations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Champ de recherche */}
        <div className="space-y-2">
          <Label htmlFor="search">Rechercher</Label>
          <Input
            id="search"
            placeholder="Rechercher par nom, description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filtre par statut */}
        <div className="space-y-2">
          <Label htmlFor="filter-statut">Statut</Label>
          <Select
            value={filterStatut}
            onValueChange={(value) => onFilterStatutChange(value as Operation["statut"] | "tous")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              <SelectItem value="planifié">Planifié</SelectItem>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="terminé">Terminé</SelectItem>
              <SelectItem value="annulé">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtre par Projet */}
        <div className="space-y-2">
          <Label htmlFor="filter-projet">Projet</Label>
          <Select
            value={filterProjet ? String(filterProjet) : "0"}
            onValueChange={(value) => onFilterProjetChange(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par projet" />
            </SelectTrigger>
            <SelectContent>
              {projetsOptions.map((option) => (
                <SelectItem key={option.id_projet} value={String(option.id_projet)}>
                  {option.nom_projet}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        <Badge variant="outline" className="mr-2">
          {resultCount} opération(s) trouvée(s)
        </Badge>
      </div>
    </div>
  );
}; 