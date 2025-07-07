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
import { Livrable } from "../../types/types"; // Importez le type Livrable

interface LivrableFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  // Filtre pour le statut d'approbation des livrables
  filterApprobation: Livrable["approbation"] | "tous";
  onFilterApprobationChange: (approbation: Livrable["approbation"] | "tous") => void;
  filterProjet: number;
  onFilterProjetChange: (projetId: number) => void;
  projetsOptions: { id_projet: number; nom_projet: string }[]; // Options pour le sélecteur de projets - ajusté pour correspondre au type Projet[] de LivrablesPage
  resultCount: number; // Nombre de livrables trouvés après filtrage
}

export const LivrableFilters: React.FC<LivrableFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterApprobation,
  onFilterApprobationChange,
  filterProjet,
  onFilterProjetChange,
  projetsOptions,
  resultCount,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Filtres et Recherche pour les Livrables</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Champ de recherche */}
        <div className="space-y-2">
          <Label htmlFor="search">Rechercher</Label>
          <Input
            id="search"
            placeholder="Rechercher par libellé, réalisations ou réserves..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filtre par statut d'approbation */}
        <div className="space-y-2">
          <Label htmlFor="filter-approbation">Statut d'approbation</Label>
          <Select
            value={filterApprobation}
            onValueChange={(value) => onFilterApprobationChange(value as Livrable["approbation"] | "tous")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par statut d'approbation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              <SelectItem value="en attente">En attente</SelectItem>
              <SelectItem value="approuvé">Approuvé</SelectItem>
              <SelectItem value="rejeté">Rejeté</SelectItem>
              <SelectItem value="révisions requises">Révisions requises</SelectItem>
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
        {/* Le filtre "Priorité" et "Assigné à" sont retirés car non pertinents pour l'interface Livrable */}
      </div>
      <div className="text-sm text-gray-600">
        <Badge variant="outline" className="mr-2">
          {resultCount} livrable(s) trouvé(s)
        </Badge>
      </div>
    </div>
  );
};