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
import { Edit, Eye, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import React from "react";

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
  const partnerNameMap = new Map(
    partenaires.map((p) => [p.id_partenaire, p.nom_partenaire])
  );
  const familleNameMap = new Map(
    familles.map((f) => [f.id_famille, f.libelle_famille])
  );

  // Fonction pour formater un montant en Franc CFA
  const formatCFA = (amount: number | string | undefined): string => {
    // S'assurer que le montant est un nombre. S'il est undefined ou null, traiter comme 0.
    const numericAmount = Number(amount) || 0;
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF", // Code ISO 4217 pour le Franc CFA Ouest-Africain
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
      .map((id) => partnerNameMap.get(id) || `Partenaire Inconnu (${id})`)
      .join(", ");
  };

  const getFamilleName = (id_famille: number | undefined): string => {
    if (id_famille === undefined || id_famille === null) {
      return "Non spécifié";
    }
    return familleNameMap.get(id_famille) || `Famille Inconnue (${id_famille})`;
  };

  const [sortBy, setSortBy] = React.useState<string>("nom_projet");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortOrder("asc");
    }
  };

  const sortedProjets = React.useMemo(() => {
    const ps = [...projets];
    ps.sort((a, b) => {
      let aVal: string | number | undefined;
      let bVal: string | number | undefined;
      switch (sortBy) {
        case "nom_projet":
          aVal = a.nom_projet;
          bVal = b.nom_projet;
          break;
        case "type_projet":
          aVal = a.type_projet;
          bVal = b.type_projet;
          break;
        case "devis_estimatif":
          aVal = a.devis_estimatif;
          bVal = b.devis_estimatif;
          break;
        case "etat":
          aVal = a.etat;
          bVal = b.etat;
          break;
        case "lieu":
          aVal = a.lieu;
          bVal = b.lieu;
          break;
        case "responsable":
          aVal = a.responsable;
          bVal = b.responsable;
          break;
        case "id_famille":
          aVal = a.id_famille;
          bVal = b.id_famille;
          break;
        default:
          aVal = a.nom_projet;
          bVal = b.nom_projet;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return ps;
  }, [projets, sortBy, sortOrder]);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => handleSort("nom_projet")}
              className="cursor-pointer select-none"
            >
              Nom du Projet
              {sortBy === "nom_projet" &&
                (sortOrder === "asc" ? (
                  <ArrowUp className="inline h-3 w-3 ml-1" />
                ) : (
                  <ArrowDown className="inline h-3 w-3 ml-1" />
                ))}
            </TableHead>
            <TableHead
              onClick={() => handleSort("type_projet")}
              className="cursor-pointer select-none"
            >
              Type
              {sortBy === "type_projet" &&
                (sortOrder === "asc" ? (
                  <ArrowUp className="inline h-3 w-3 ml-1" />
                ) : (
                  <ArrowDown className="inline h-3 w-3 ml-1" />
                ))}
            </TableHead>
            <TableHead
              onClick={() => handleSort("devis_estimatif")}
              className="cursor-pointer select-none"
            >
              Budget Estimatif
              {sortBy === "devis_estimatif" &&
                (sortOrder === "asc" ? (
                  <ArrowUp className="inline h-3 w-3 ml-1" />
                ) : (
                  <ArrowDown className="inline h-3 w-3 ml-1" />
                ))}
            </TableHead>
            <TableHead
              onClick={() => handleSort("etat")}
              className="cursor-pointer select-none"
            >
              État
              {sortBy === "etat" &&
                (sortOrder === "asc" ? (
                  <ArrowUp className="inline h-3 w-3 ml-1" />
                ) : (
                  <ArrowDown className="inline h-3 w-3 ml-1" />
                ))}
            </TableHead>
            <TableHead
              onClick={() => handleSort("lieu")}
              className="cursor-pointer select-none"
            >
              Lieu
              {sortBy === "lieu" &&
                (sortOrder === "asc" ? (
                  <ArrowUp className="inline h-3 w-3 ml-1" />
                ) : (
                  <ArrowDown className="inline h-3 w-3 ml-1" />
                ))}
            </TableHead>
            <TableHead
              onClick={() => handleSort("responsable")}
              className="cursor-pointer select-none"
            >
              Responsable
              {sortBy === "responsable" &&
                (sortOrder === "asc" ? (
                  <ArrowUp className="inline h-3 w-3 ml-1" />
                ) : (
                  <ArrowDown className="inline h-3 w-3 ml-1" />
                ))}
            </TableHead>
            <TableHead
              onClick={() => handleSort("id_famille")}
              className="cursor-pointer select-none"
            >
              Catégorie
              {sortBy === "id_famille" &&
                (sortOrder === "asc" ? (
                  <ArrowUp className="inline h-3 w-3 ml-1" />
                ) : (
                  <ArrowDown className="inline h-3 w-3 ml-1" />
                ))}
            </TableHead>
            <TableHead>Partenaires</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                Aucun projet à afficher.
              </TableCell>
            </TableRow>
          ) : (
            sortedProjets.map((projet) => (
              <TableRow key={projet.id_projet}>
                <TableCell className="font-medium">
                  {projet.nom_projet}
                </TableCell>
                <TableCell>{projet.type_projet}</TableCell>
                <TableCell>{formatCFA(projet.devis_estimatif)}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${
                        projet.etat === "planifié" &&
                        "bg-blue-100 text-blue-800"
                      }
                      ${
                        projet.etat === "en_cours" &&
                        "bg-yellow-100 text-yellow-800"
                      }
                      ${
                        projet.etat === "terminé" &&
                        "bg-green-100 text-green-800"
                      }
                      ${
                        projet.etat === "annulé" &&
                        "bg-red-100 text-neutral-700"
                      }
                      ${
                        projet.etat === "bloqué" &&
                        "bg-neutral-100 text-neutral-700"
                      }
                    `}
                  >
                    {projet.etat?.replace(/_/g, " ") || "Inconnu"}
                  </span>
                </TableCell>
                <TableCell>{projet.lieu || "N/A"}</TableCell>
                <TableCell>{projet.responsable || "N/A"}</TableCell>
                <TableCell>{getFamilleName(projet.id_famille)}</TableCell>
                <TableCell>{getPartnerNames(projet.id_projet)}</TableCell>
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
            ))
          )}
        </TableBody>
      </Table>
      {projets.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          Aucun projet à afficher.
        </div>
      )}
    </div>
  );
};
