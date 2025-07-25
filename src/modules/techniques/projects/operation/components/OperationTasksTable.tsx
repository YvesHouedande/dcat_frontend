import React from "react";
import { Tache } from "../../types/types";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

interface OperationTasksTableProps {
  taches: Tache[];
  onEdit?: (tache: Tache) => void;
  onDelete?: (tache: Tache) => void;
}

const OperationTasksTable: React.FC<OperationTasksTableProps> = ({ taches, onEdit, onDelete }) => {
  const [sortBy, setSortBy] = React.useState<string>("nom_tache");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortOrder("asc");
    }
  };

  const sortedTaches = React.useMemo(() => {
    const ts = [...taches];
    ts.sort((a, b) => {
      let aVal: string | number | undefined;
      let bVal: string | number | undefined;
      switch (sortBy) {
        case "nom_tache":
          aVal = a.nom_tache;
          bVal = b.nom_tache;
          break;
        case "statut":
          aVal = a.statut;
          bVal = b.statut;
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
        default:
          aVal = a.nom_tache;
          bVal = b.nom_tache;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return ts;
  }, [taches, sortBy, sortOrder]);

  if (!taches || taches.length === 0) {
    return <div className="text-xs text-gray-400">Aucune tâche pour cette opération.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border border-gray-200 rounded">
        <thead className="bg-gray-50">
          <tr>
            <th onClick={() => handleSort("nom_tache")} className="px-3 py-2 text-left cursor-pointer select-none">
              Nom
              {sortBy === "nom_tache" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </th>
            <th onClick={() => handleSort("statut")} className="px-3 py-2 text-left cursor-pointer select-none">
              Statut
              {sortBy === "statut" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </th>
            <th onClick={() => handleSort("date_debut")} className="px-3 py-2 text-left cursor-pointer select-none">
              Début
              {sortBy === "date_debut" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </th>
            <th onClick={() => handleSort("date_fin")} className="px-3 py-2 text-left cursor-pointer select-none">
              Fin
              {sortBy === "date_fin" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </th>
            <th onClick={() => handleSort("priorite")} className="px-3 py-2 text-left cursor-pointer select-none">
              Priorité
              {sortBy === "priorite" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </th>
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTaches.map((tache) => (
            <tr key={tache.id_tache} className="border-t">
              <td className="px-3 py-2 font-medium">{tache.nom_tache}</td>
              <td className="px-3 py-2">{tache.statut}</td>
              <td className="px-3 py-2">{tache.date_debut}</td>
              <td className="px-3 py-2">{tache.date_fin}</td>
              <td className="px-3 py-2">{tache.priorite}</td>
              <td className="px-3 py-2 flex gap-2">
                {onEdit && (
                  <Button size="sm" variant="outline" onClick={() => onEdit(tache)}>
                    Éditer
                  </Button>
                )}
                {onDelete && (
                  <Button size="sm" variant="destructive" onClick={() => onDelete(tache)}>
                    Supprimer
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OperationTasksTable;
