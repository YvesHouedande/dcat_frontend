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
import { Edit, Eye, Trash2, UserMinus, UserPlus, ArrowUp, ArrowDown } from "lucide-react";
// Importez TacheWithAssignedEmployes qui contient le tableau complet d'Employe
import {Employe, TacheWithAssignedEmployes, Operation } from "../../types/types"; 
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface TacheTableProps {
  // MODIFICATION ICI : Le tableau de tâches doit inclure les employés assignés complets
  taches: TacheWithAssignedEmployes[]; 
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onAssign?: (tacheId: number, employeId: number) => void;
  onUnassign?: (tacheId: number, employeId: number) => void;
  employes: Employe[]; // Liste de TOUS les employés disponibles
  operations: Operation[]; // Ajouté pour compatibilité avec TasksPage
}

export const TacheTable: React.FC<TacheTableProps> = ({
  taches,
  onDelete,
  onView,
  onEdit,
  onAssign,
  onUnassign,
  employes, // Tous les employés
}) => {
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
        case "priorite":
          aVal = a.priorite;
          bVal = b.priorite;
          break;
        case "date_debut":
          aVal = a.date_debut;
          bVal = b.date_debut;
          break;
        case "id_assigne_a":
          aVal = a.id_assigne_a ? a.id_assigne_a.length : 0;
          bVal = b.id_assigne_a ? b.id_assigne_a.length : 0;
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

  // SUPPRESSION : plus besoin de projectNameMap ni de getProjectName

  // Fonction pour gérer l'affichage des employés assignés (déjà correcte pour Employe[])
  const getEmployesAssignesDisplay = (tache: TacheWithAssignedEmployes): string => {
    const employesAssignes = tache.id_assigne_a || []; 
    
    if (employesAssignes.length === 0) {
      return "Non assigné";
    }

    const validEmployes = employesAssignes.filter(emp => 
      emp.prenom_employes && emp.prenom_employes.trim() !== '' &&
      emp.nom_employes && emp.nom_employes.trim() !== ''
    );

    if (validEmployes.length === 0) {
      return "Employés inconnus";
    }

    if (validEmployes.length === 1) {
      const employe = validEmployes[0];
      return `${employe.prenom_employes} ${employe.nom_employes}`;
    }

    if (validEmployes.length <= 2) {
      return validEmployes.map(emp => `${emp.prenom_employes} ${emp.nom_employes}`).join(', ');
    }
    
    const first = validEmployes[0];
    const second = validEmployes[1];
    const remaining = validEmployes.length - 2;
    
    return `${first.prenom_employes} ${first.nom_employes}, ${second.prenom_employes} ${second.nom_employes} +${remaining}`;
  };

  // Fonction pour obtenir le titre complet des employés assignés (pour le hover) (déjà correcte pour Employe[])
  const getEmployesAssignesTitle = (tache: TacheWithAssignedEmployes): string => {
    const employesAssignes = tache.id_assigne_a || [];
    
    if (employesAssignes.length === 0) {
      return "Aucun employé assigné";
    }

    const validEmployes = employesAssignes.filter(emp => 
      emp.prenom_employes && emp.prenom_employes.trim() !== '' &&
      emp.nom_employes && emp.nom_employes.trim() !== ''
    );

    if (validEmployes.length === 0) {
      return "Employés inconnus";
    }

    return "Employés assignés :\n" + validEmployes.map(emp => 
      `• ${emp.prenom_employes} ${emp.nom_employes}`
    ).join('\n');
  };

  // Fonction pour obtenir les employés non assignés à une tâche (déjà correcte)
  const getUnassignedEmployees = (tache: TacheWithAssignedEmployes): Employe[] => {
    const assignedIds = (tache.id_assigne_a || []).map(emp => emp.id_employes);
    return employes.filter(emp => !assignedIds.includes(emp.id_employes));
  };

  // Ajoute les helpers pour les couleurs de badge
  function getStatutBadgeColor(statut: string) {
    switch (statut) {
      case 'en cours': return 'bg-yellow-100 text-yellow-800';
      case 'terminé': return 'bg-green-100 text-green-800';
      case 'planifié': return 'bg-gray-100 text-gray-800';
      case 'bloqué': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-50 text-gray-500';
    }
  }
  function getPrioriteBadgeColor(priorite: string) {
    switch (priorite) {
      case 'haute': return 'bg-red-100 text-red-800';
      case 'moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-50 text-gray-500';
    }
  }


  return (
    <div className="bg-white p-6 rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort("nom_tache")}
              className="cursor-pointer select-none">
              Nom de la tâche
              {sortBy === "nom_tache" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </TableHead>
            {/* SUPPRIMÉ : <TableHead>Projet</TableHead> */}
            <TableHead onClick={() => handleSort("id_assigne_a")}
              className="cursor-pointer select-none">
              Assigné à
              {sortBy === "id_assigne_a" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </TableHead>
            <TableHead onClick={() => handleSort("statut")}
              className="cursor-pointer select-none">
              Statut
              {sortBy === "statut" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </TableHead>
            <TableHead onClick={() => handleSort("priorite")}
              className="cursor-pointer select-none">
              Priorité
              {sortBy === "priorite" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </TableHead>
            <TableHead onClick={() => handleSort("date_debut")}
              className="cursor-pointer select-none">
              Dates
              {sortBy === "date_debut" && (sortOrder === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />)}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTaches.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                Aucune tâche trouvée.
              </TableCell>
            </TableRow>
          ) : (
            sortedTaches.map((tache) => {
              // tache est maintenant de type TacheWithAssignedEmployes
              const unassignedEmployees = getUnassignedEmployees(tache);
              const assignedEmployees = tache.id_assigne_a || []; // Assuré d'être Employe[]

              return (
                <TableRow key={tache.id_tache}>
                  <TableCell className="font-medium">{tache.nom_tache}</TableCell>
                  {/* SUPPRIMÉ : <TableCell>{getProjectName(tache.id_projet)}</TableCell> */}
                  <TableCell className="max-w-[200px]">
                    <div 
                      className="truncate cursor-help" 
                      title={getEmployesAssignesTitle(tache)}
                    >
                      {getEmployesAssignesDisplay(tache)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatutBadgeColor(tache.statut)}`}>{tache.statut}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getPrioriteBadgeColor(tache.priorite)}`}>{tache.priorite}</span>
                  </TableCell>
                  <TableCell>
                    {tache.date_debut ? format(new Date(tache.date_debut), 'dd/MM/yyyy', { locale: fr }) : 'N/A'} -{" "}
                    {tache.date_fin ? format(new Date(tache.date_fin), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(tache.id_tache)}
                        title="Voir les détails"
                        aria-label="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(tache.id_tache)}
                        title="Modifier la tâche"
                        aria-label="Modifier la tâche"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {/* Menu de gestion des assignations */}
                      {(onAssign || onUnassign) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Gérer les assignations"
                              aria-label="Gérer les assignations"
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            {/* Section pour assigner de nouveaux employés */}
                            {onAssign && unassignedEmployees.length > 0 && (
                              <>
                                <div className="px-2 py-1 text-xs font-medium text-gray-500">
                                  Assigner à :
                                </div>
                                {unassignedEmployees.map((employe) => (
                                  <DropdownMenuItem
                                    key={employe.id_employes}
                                    onClick={() => onAssign(tache.id_tache, employe.id_employes)}
                                    className="cursor-pointer"
                                  >
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    {`${employe.prenom_employes || ''} ${employe.nom_employes || ''}`.trim() || `Employé #${employe.id_employes}`}
                                  </DropdownMenuItem>
                                ))}
                              </>
                            )}

                            {/* Séparateur si les deux sections sont présentes */}
                            {onAssign && onUnassign && unassignedEmployees.length > 0 && assignedEmployees.length > 0 && (
                              <DropdownMenuSeparator />
                            )}

                            {/* Section pour désassigner des employés */}
                            {onUnassign && assignedEmployees.length > 0 && (
                              <>
                                <div className="px-2 py-1 text-xs font-medium text-gray-500">
                                  Désassigner :
                                </div>
                                {assignedEmployees.map((employe) => (
                                  <DropdownMenuItem
                                    key={employe.id_employes}
                                    onClick={() => onUnassign(tache.id_tache, employe.id_employes)}
                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                  >
                                    <UserMinus className="mr-2 h-4 w-4" />
                                    {`${employe.prenom_employes || ''} ${employe.nom_employes || ''}`.trim() || `Employé #${employe.id_employes}`}
                                  </DropdownMenuItem>
                                ))}
                              </>
                            )}

                            {/* Message si aucune action possible */}
                            {unassignedEmployees.length === 0 && assignedEmployees.length === 0 && (
                              <DropdownMenuItem disabled>
                                Aucun employé disponible
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(tache.id_tache)}
                        title="Supprimer la tâche"
                        aria-label="Supprimer la tâche"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};