import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns"; // Import format for date formatting
import { fr } from "date-fns/locale"; // Import French locale for date-fns

// Importez Livrable et Projet
import { Livrable, Projet } from "../../types/types";

interface LivrableRowProps {
  livrable: Livrable;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  projets: Projet[]; // Liste des projets pour afficher le nom du projet parent
}

export const LivrableRow: React.FC<LivrableRowProps> = ({
  livrable,
  onDelete,
  onView,
  onEdit,
  projets,
}) => {
  // Fonction pour obtenir le nom du projet à partir de son ID
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
    <TableRow>
      <TableCell className="font-medium">{livrable.libelle_livrable}</TableCell>
      <TableCell>{getProjectName(livrable.id_projet)}</TableCell> {/* Projet Parent */}
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
      {/* Note: La colonne 'Recommandation' a été retirée ici pour correspondre aux en-têtes de LivrableTable */}
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
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};