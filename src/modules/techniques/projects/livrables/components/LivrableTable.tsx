import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// Importez Livrable et Projet
import { Livrable, Projet } from "../../types/types";
import { format } from "date-fns"; // Import format from date-fns
import { fr } from "date-fns/locale"; // Import French locale for date-fns

interface LivrableTableProps {
  livrables: Livrable[]; // La liste des livrables à afficher
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  projets: Projet[]; // La liste des projets pour afficher le nom du projet parent
}

export const LivrableTable: React.FC<LivrableTableProps> = ({
  livrables,
  onDelete,
  onView,
  onEdit,
  projets,
}) => {
  // Fonction utilitaire pour obtenir le nom du projet à partir de son ID
  const getProjectName = (projectId: number): string => {
    const projet = projets.find((p) => p.id_projet === projectId);
    return projet ? projet.nom_projet : "Projet Inconnu";
  };

  // Fonction pour obtenir le badge de statut d'approbation stylisé
  const getApprobationBadge = (approbation: Livrable["approbation"]) => {
    switch (approbation) {
      case "en attente":
        return <Badge variant="secondary">En attente</Badge>;
      case "approuvé":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approuvé</Badge>;
      case "rejeté":
        return <Badge variant="destructive">Rejeté</Badge>;
      case "révisions requises":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Révisions requises</Badge>;
      default:
        return <Badge variant="outline">{approbation}</Badge>;
    }
  };

  const [sortBy, setSortBy] = React.useState<string>("libelle_livrable");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortOrder("asc");
    }
  };

  const sortedLivrables = React.useMemo(() => {
    const ls = [...livrables];
    ls.sort((a, b) => {
      let aVal: string | number | undefined;
      let bVal: string | number | undefined;
      switch (sortBy) {
        case "libelle_livrable":
          aVal = a.libelle_livrable;
          bVal = b.libelle_livrable;
          break;
        case "id_projet":
          aVal = getProjectName(a.id_projet);
          bVal = getProjectName(b.id_projet);
          break;
        case "date":
          aVal = a.date;
          bVal = b.date;
          break;
        case "approbation":
          aVal = a.approbation;
          bVal = b.approbation;
          break;
        case "realisations":
          aVal = a.realisations;
          bVal = b.realisations;
          break;
        case "reserves":
          aVal = a.reserves;
          bVal = b.reserves;
          break;
        default:
          aVal = a.libelle_livrable;
          bVal = b.libelle_livrable;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return ls;
  }, [livrables, sortBy, sortOrder]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort("libelle_livrable")}
              className="cursor-pointer select-none">
              Libellé du Livrable
              {sortBy === "libelle_livrable" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </TableHead>
            <TableHead onClick={() => handleSort("id_projet")}
              className="cursor-pointer select-none">
              Projet Parent
              {sortBy === "id_projet" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </TableHead>
            <TableHead onClick={() => handleSort("date")}
              className="cursor-pointer select-none">
              Date
              {sortBy === "date" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </TableHead>
            <TableHead onClick={() => handleSort("approbation")}
              className="cursor-pointer select-none">
              Approbation
              {sortBy === "approbation" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </TableHead>
            <TableHead onClick={() => handleSort("realisations")}
              className="cursor-pointer select-none max-w-[200px] truncate">
              Réalisations
              {sortBy === "realisations" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </TableHead>
            <TableHead onClick={() => handleSort("reserves")}
              className="cursor-pointer select-none max-w-[200px] truncate">
              Réserves
              {sortBy === "reserves" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLivrables.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                Aucun livrable trouvé.
              </TableCell>
            </TableRow>
          ) : (
            sortedLivrables.map((livrable) => (
              <TableRow key={livrable.id_livrable}>
                <TableCell className="font-medium">{livrable.libelle_livrable}</TableCell>
                <TableCell>{getProjectName(livrable.id_projet)}</TableCell>
                <TableCell>
                  {/* Format the date for better readability */}
                  {livrable.date ? format(new Date(livrable.date), 'dd MMMM yyyy', { locale: fr }) : 'N/A'}
                </TableCell>
                <TableCell>{getApprobationBadge(livrable.approbation)}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {livrable.realisations || "N/A"}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {livrable.reserves || "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(livrable.id_livrable)}
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(livrable.id_livrable)}
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(livrable.id_livrable)}
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};