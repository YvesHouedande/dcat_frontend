// components/LivraisonTable.tsx

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
import { Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import { Livraison, Partenaire } from "../types/livraison.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LivraisonTableProps {
  livraisons: Livraison[];
  partenaires: Partenaire[];
  onEdit: (livraison: Livraison) => void;
  onDelete: (id: string) => void;
  onView: (livraison: Livraison) => void;
}

const LivraisonTable: React.FC<LivraisonTableProps> = ({
  livraisons,
  partenaires,
  onEdit,
  onDelete,
  onView,
}) => {
  // Fonction pour obtenir le nom du partenaire à partir de son ID
  const getPartenaireName = (id: string): string => {
    const partenaire = partenaires.find((p) => p.id === id);
    return partenaire ? partenaire.nom_partenaire : "Inconnu";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Partenaire</TableHead>
            <TableHead>Période</TableHead>
            <TableHead className="text-right">Prix d'achat</TableHead>
            <TableHead className="text-right">Frais divers</TableHead>
            <TableHead className="text-right">Prix de revient</TableHead>
            <TableHead className="text-right">Prix de vente</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {livraisons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                Aucune livraison trouvée
              </TableCell>
            </TableRow>
          ) : (
            livraisons.map((livraison) => (
              <TableRow key={livraison.id_livraison}>
                <TableCell className="font-medium">
                  {livraison.id_livraison}
                </TableCell>
                <TableCell>
                  {getPartenaireName(livraison.Id_partenaire)}
                </TableCell>
                <TableCell>{livraison.Periode_achat}</TableCell>
                <TableCell className="text-right">
                  {livraison.prix_achat}
                </TableCell>
                <TableCell className="text-right">
                  {livraison.frais_divers}
                </TableCell>
                <TableCell className="text-right">
                  {livraison.Prix_de_revient}
                </TableCell>
                <TableCell className="text-right">
                  {livraison.Prix_de_vente}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(livraison)}>
                        <Edit className="mr-2 h-4 w-4" /> Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(livraison.id_livraison)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LivraisonTable;
