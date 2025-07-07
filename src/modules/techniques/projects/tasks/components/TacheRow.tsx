import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
// MODIFICATION ICI : Import de TacheWithAssignedEmployes
import { Tache, Projet, TacheWithAssignedEmployes } from "../../types/types"; 
import { TableCell, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
// SUPPRESSION : Plus besoin de useState, useEffect et getEmployesAssignes ici
// import { useState, useEffect } from 'react';
// import { getEmployesAssignes } from "../api/taches";

type TacheRowProps = {
  // MODIFICATION ICI : La tâche passée en prop doit déjà contenir les employés assignés
  tache: TacheWithAssignedEmployes; 
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  projets: Projet[];
  // SUPPRESSION : La prop 'employes' n'est plus nécessaire ici
  // employes: Employe[];
};

export const TacheRow = ({
  tache,
  onDelete,
  onView,
  onEdit,
  projets,
  // SUPPRESSION : Plus besoin de destructuring 'employes'
  // employes,
}: TacheRowProps) => {
  // SUPPRESSION : L'état et l'useEffect pour les employés assignés ne sont plus nécessaires
  // const [employesAssignes, setEmployesAssignes] = useState<Employe[]>([]);
  // const [loadingEmployes, setLoadingEmployes] = useState(false);

  // useEffect(() => {
  //   const loadEmployesAssignes = async () => {
  //     try {
  //       setLoadingEmployes(true);
  //       const assignedEmployes = await getEmployesAssignes(tache.id_tache);
  //       setEmployesAssignes(assignedEmployes);
  //     } catch (error) {
  //       console.error('Erreur lors du chargement des employés assignés:', error);
  //       setEmployesAssignes([]);
  //     } finally {
  //       setLoadingEmployes(false);
  //     }
  //   };

  //   loadEmployesAssignes();
  // }, [tache.id_tache]);

  // Fonction pour obtenir le nom du projet à partir de son ID (inchangée)
  const getProjectName = (projectId: number): string => {
    const projet = projets.find((p) => p.id_projet === projectId);
    return projet ? projet.nom_projet : "Projet Inconnu";
  };

  // Fonction pour afficher les employés assignés (adaptée, utilise tache.id_assigne_a directement)
  const getEmployesAssignesDisplay = (): string => {
    const employesAssignes = tache.id_assigne_a || []; // Assuré d'être Employe[]

    if (employesAssignes.length === 0) {
      return "Aucun employé assigné";
    }

    const validEmployes = employesAssignes.filter(emp => 
      emp.prenom_employes && emp.prenom_employes.trim() !== '' &&
      emp.nom_employes && emp.nom_employes.trim() !== ''
    );

    if (validEmployes.length === 0) {
      return "Employés Inconnus";
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
    
    return `${first.prenom_employes} ${first.nom_employes}, ${second.prenom_employes} ${second.nom_employes} +${remaining} autre${remaining > 1 ? 's' : ''}`;
  };

  // NOUVEAU/RÉTABLI : Fonction pour obtenir le titre complet des employés assignés (pour le hover)
  const getEmployesAssignesTitle = (): string => {
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

  // Fonction pour obtenir le badge de statut stylisé (inchangée)
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

  // Fonction pour obtenir le badge de priorité stylisé (correction du cas 'urgent')
  const getPriorityBadge = (priorite: Tache["priorite"]) => {
    // Ajout d'une vérification pour priorite.toLowerCase() pour plus de robustesse
    if (!priorite || typeof priorite !== 'string') {
        return <Badge variant="outline">Non définie</Badge>;
    }

    switch (priorite.toLowerCase()) {
      case "basse": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Basse</Badge>;
      case "moyenne": return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Moyenne</Badge>;
      case "haute":
      case "élevée": // Ajouté pour être compatible avec les deux écritures potentielles
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Haute</Badge>;
      case "urgent": // Cas 'urgent' ajouté
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Urgent</Badge>;
      default: return <Badge variant="outline">{priorite}</Badge>;
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{tache.nom_tache}</TableCell>
      <TableCell>{getProjectName(tache.id_projet)}</TableCell>
      <TableCell className="max-w-[200px]">
        <div className="truncate" title={getEmployesAssignesTitle()}>
          {getEmployesAssignesDisplay()}
        </div>
      </TableCell>
      <TableCell>{getStatutBadge(tache.statut)}</TableCell>
      <TableCell>{getPriorityBadge(tache.priorite)}</TableCell>
      <TableCell>
        {tache.date_debut ? format(new Date(tache.date_debut), 'dd/MM/yyyy', { locale: fr }) : 'N/A'} -{" "}
        {tache.date_fin ? format(new Date(tache.date_fin), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
      </TableCell>
      {/* SUPPRESSION : Retrait de la cellule de description pour correspondre à TacheTable */}
      {/* <TableCell className="max-w-[300px] truncate">
        {tache.desc_tache || "N/A"}
      </TableCell> */}
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onView(tache.id_tache)} title="Voir détails">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(tache.id_tache)} title="Modifier">
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(tache.id_tache)}
            className="text-red-600 hover:text-red-800"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};