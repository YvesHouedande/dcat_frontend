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
import { Edit, Eye, Trash2 } from "lucide-react";
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Libellé du Livrable</TableHead>
            <TableHead>Projet Parent</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Approbation</TableHead>
            <TableHead className="max-w-[200px] truncate">Réalisations</TableHead>
            <TableHead className="max-w-[200px] truncate">Réserves</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {livrables.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                Aucun livrable trouvé.
              </TableCell>
            </TableRow>
          ) : (
            livrables.map((livrable) => (
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