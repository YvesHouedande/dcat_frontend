import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Projet } from "../../types/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

type ProjetRowProps = {
  projet: Projet;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
};

export const ProjetRow = ({ projet, onDelete, onView, onEdit }: ProjetRowProps) => {
  const getEtatBadge = (etat: Projet['etat']) => {
    switch (etat) {
      case "planifié":
        return <Badge variant="secondary">Planifié</Badge>;
      case "en_cours":
        return <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>;
      case "terminé":
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case "annulé":
        return <Badge variant="destructive">Annulé</Badge>;
    }
  };

  function formatDateForDisplay(dateValue: string | Date | null): string {
    if (!dateValue) return 'Non défini';
    
    try {
      const date = typeof dateValue === 'string' ? parseISO(dateValue) : dateValue;
      return isNaN(date.getTime()) ? 'Non défini' : format(date, 'dd/MM/yyyy', { locale: fr });
    } catch {
      return 'Non défini';
    }
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{projet.nom_projet}</TableCell>
      <TableCell>{projet.type_projet}</TableCell>
      <TableCell>{projet.devis_estimatif.toLocaleString()} €</TableCell>
      <TableCell>
        {formatDateForDisplay(projet.date_debut)} - {formatDateForDisplay(projet.date_fin)}
      </TableCell>
      <TableCell>{getEtatBadge(projet.etat)}</TableCell>
      <TableCell>{projet.lieu}</TableCell>
      <TableCell>{projet.responsable}</TableCell>
      <TableCell>{projet.id_famille}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {projet.id_partenaire.map((p, i) => (
            <Badge key={i} variant="outline" className="whitespace-nowrap">
              {p}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onView(projet.id_projet)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(projet.id_projet)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(projet.id_projet)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};