// src/components/ProjetTable.tsx

import { Projet, Partenaire, Famille } from "../../types/types"; 
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, Trash2 } from "lucide-react";

type ProjetTableProps = {
  projets: Projet[];
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  partenaires: Partenaire[];
  familles: Famille[]; 
  // NOUVEAU: Ajout de la map des associations projet-partenaires
  projectPartnersMap: Map<number, number[]>; 
};

export const ProjetTable = ({
  projets,
  onDelete,
  onView,
  onEdit,
  partenaires,
  familles,
  projectPartnersMap, // <-- Réception de la map d'associations
}: ProjetTableProps) => {
  const partnerNameMap = new Map(partenaires.map(p => [p.id_partenaire, p.nom_partenaire]));
  const familleNameMap = new Map(familles.map(f => [f.id_famille, f.libelle_famille]));

  // Fonction pour formater un montant en Franc CFA
  const formatCFA = (amount: number | string | undefined): string => {
    // S'assurer que le montant est un nombre. S'il est undefined ou null, traiter comme 0.
    const numericAmount = Number(amount) || 0; 
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF', // Code ISO 4217 pour le Franc CFA Ouest-Africain
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  };

  // MODIFIÉ: getPartnerNames prend maintenant l'objet projet complet
  const getPartnerNames = (projetId: number): string => {
    // Récupérer les IDs des partenaires associés à ce projet depuis la map
    const ids = projectPartnersMap.get(projetId);

    if (!ids || ids.length === 0) {
      return "N/A";
    }
    return ids
      .map(id => partnerNameMap.get(id) || `Partenaire Inconnu (${id})`)
      .join(", ");
  };

  const getFamilleName = (id_famille: number | undefined): string => {
    if (id_famille === undefined || id_famille === null) {
        return "Non spécifié";
    }
    return familleNameMap.get(id_famille) || `Famille Inconnue (${id_famille})`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom du Projet</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Budget Estimatif</TableHead>
            <TableHead>État</TableHead>
            <TableHead>Lieu</TableHead>
            <TableHead>Responsable</TableHead> 
            <TableHead>Famille</TableHead>
            <TableHead>Partenaires</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projets.map((projet) => (
            <TableRow key={projet.id_projet}>
              <TableCell className="font-medium">{projet.nom_projet}</TableCell>
              <TableCell>{projet.type_projet}</TableCell>
              {/* MODIFIÉ ICI: Utilisation de formatCFA pour le budget estimatif */}
              <TableCell>{formatCFA(projet.devis_estimatif)}</TableCell> 
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${projet.etat === "planifié" && "bg-blue-100 text-blue-800"}
                    ${projet.etat === "en_cours" && "bg-yellow-100 text-yellow-800"}
                    ${projet.etat === "terminé" && "bg-green-100 text-green-800"}
                    ${projet.etat === "annulé" && "bg-red-100 text-red-800"}
                  `}
                >
                  {projet.etat?.replace(/_/g, " ") || 'Inconnu'} 
                </span>
              </TableCell>
              <TableCell>{projet.lieu || 'N/A'}</TableCell> 
              <TableCell>
                {projet.responsable || 'N/A'}
              </TableCell>
              <TableCell>{getFamilleName(projet.id_famille)}</TableCell>
              <TableCell>
                {/* MODIFIÉ: Appel de getPartnerNames avec l'ID du projet */}
                {getPartnerNames(projet.id_projet)} 
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(projet.id_projet)}
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(projet.id_projet)}
                    title="Modifier le projet"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(projet.id_projet)}
                    title="Supprimer le projet"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {projets.length === 0 && (
        <div className="p-4 text-center text-gray-500">Aucun projet à afficher.</div>
      )}
    </div>
  );
};