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
import { Operation } from "../../types/types";

interface OperationTableProps {
  operations: Operation[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const getStatutBadge = (statut: string) => {
  switch (statut) 
  {
    case "en cours":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En cours</Badge>;
    case "terminé":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Terminé</Badge>;
    case "planifié":
      return <Badge variant="secondary">Planifié</Badge>;
    case "annulé":
      return <Badge variant="destructive">Annulé</Badge>;
    default:
      return <Badge variant="outline">{statut}</Badge>;
  }
};

export const OperationTable: React.FC<OperationTableProps> = ({ operations, onView, onEdit, onDelete }) => {
  const [sortBy, setSortBy] = React.useState<string>("nom_operation");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortOrder("asc");
    }
  };

  const sortedOperations = React.useMemo(() => {
    const ops = [...operations];
    ops.sort((a, b) => {
      let aVal: string | number | undefined;
      let bVal: string | number | undefined;
      switch (sortBy) {
        case "nom_operation":
          aVal = a.nom_operation;
          bVal = b.nom_operation;
          break;
        case "date_debut":
          aVal = a.date_debut;
          bVal = b.date_debut;
          break;
        case "date_fin":
          aVal = a.date_fin;
          bVal = b.date_fin;
          break;
        case "priorite":
          aVal = a.priorite;
          bVal = b.priorite;
          break;
        case "statut":
          aVal = a.statut;
          bVal = b.statut;
          break;
        default:
          aVal = a.nom_operation;
          bVal = b.nom_operation;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return ops;
  }, [operations, sortBy, sortOrder]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort("nom_operation")}
              className="cursor-pointer select-none">
              Nom de l'opération
              {sortBy === "nom_operation" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </TableHead>
            <TableHead onClick={() => handleSort("date_debut")}
              className="cursor-pointer select-none">
              Date début
              {sortBy === "date_debut" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </TableHead>
            <TableHead onClick={() => handleSort("date_fin")}
              className="cursor-pointer select-none">
              Date fin
              {sortBy === "date_fin" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </TableHead>
            <TableHead onClick={() => handleSort("priorite")}
              className="cursor-pointer select-none">
              Priorité
              {sortBy === "priorite" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </TableHead>
            <TableHead onClick={() => handleSort("statut")}
              className="cursor-pointer select-none">
              Statut
              {sortBy === "statut" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOperations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                Aucune opération trouvée.
              </TableCell>
            </TableRow>
          ) : (
            sortedOperations.map((op) => (
              <TableRow key={op.id_operation}>
                <TableCell className="font-medium">{op.nom_operation}</TableCell>
                <TableCell>{op.date_debut}</TableCell>
                <TableCell>{op.date_fin}</TableCell>
                <TableCell>{op.priorite}</TableCell>
                <TableCell>{getStatutBadge(op.statut)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(op.id_operation)}
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(op.id_operation)}
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(op.id_operation)}
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

export default OperationTable;
