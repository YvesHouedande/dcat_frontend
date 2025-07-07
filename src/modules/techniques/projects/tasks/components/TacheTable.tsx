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
import { Edit, Eye, Trash2, UserMinus, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// Importez TacheWithAssignedEmployes qui contient le tableau complet d'Employe
import { Tache, Projet, Employe, TacheWithAssignedEmployes } from "../../types/types"; 
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
  projets: Projet[];
  employes: Employe[]; // Liste de TOUS les employés disponibles
}

export const TacheTable: React.FC<TacheTableProps> = ({
  taches,
  onDelete,
  onView,
  onEdit,
  onAssign,
  onUnassign,
  projets,
  employes, // Tous les employés
}) => {
  const projectNameMap = new Map(projets.map((p) => [p.id_projet, p.nom_projet]));

  const getProjectName = (projectId: number): string => {
    return projectNameMap.get(projectId) || "Projet Inconnu";
  };

  // Fonction pour gérer l'affichage des employés assignés (déjà correcte pour Employe[])
  const getEmployesAssignesDisplay = (tache: TacheWithAssignedEmployes): string => {
    // tache.id_assigne_a est déjà de type Employe[]
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

  // Fonctions pour les badges de statut et priorité (déjà correctes)
  const getStatutBadge = (statut: Tache["statut"]) => {
    switch (statut) {
      case "à faire": return <Badge variant="secondary">À faire</Badge>;
      case "en cours": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">En cours</Badge>;
      case "en revue": return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">En revue</Badge>;
      case "terminé": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Terminé</Badge>;
      case "bloqué": return <Badge variant="destructive">Bloqué</Badge>;
      default: return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const getPriorityBadge = (priorite: Tache["priorite"]) => {
    if (!priorite || typeof priorite !== 'string') {
      return <Badge variant="outline">Non définie</Badge>;
    }

    switch (priorite.toLowerCase()) {
      case "basse": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Basse</Badge>;
      case "moyenne": return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Moyenne</Badge>;
      case "élevée":
      case "haute": return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Élevée</Badge>;
      case "urgent": return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Urgent</Badge>;
      default: return <Badge variant="outline">{priorite}</Badge>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom de la tâche</TableHead>
            <TableHead>Projet</TableHead>
            <TableHead>Assigné à</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Priorité</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taches.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                Aucune tâche trouvée.
              </TableCell>
            </TableRow>
          ) : (
            taches.map((tache) => {
              // tache est maintenant de type TacheWithAssignedEmployes
              const unassignedEmployees = getUnassignedEmployees(tache);
              const assignedEmployees = tache.id_assigne_a || []; // Assuré d'être Employe[]

              return (
                <TableRow key={tache.id_tache}>
                  <TableCell className="font-medium">{tache.nom_tache}</TableCell>
                  <TableCell>{getProjectName(tache.id_projet)}</TableCell>
                  <TableCell className="max-w-[200px]">
                    <div 
                      className="truncate cursor-help" 
                      title={getEmployesAssignesTitle(tache)}
                    >
                      {getEmployesAssignesDisplay(tache)}
                    </div>
                  </TableCell>
                  <TableCell>{getStatutBadge(tache.statut)}</TableCell>
                  <TableCell>{getPriorityBadge(tache.priorite)}</TableCell>
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