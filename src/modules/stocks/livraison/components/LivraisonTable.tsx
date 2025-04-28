import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Livraison, Partenaire } from "../types/types";
import {
  ChevronRight,
  ChevronDown,
  Edit,
  Trash,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  onDelete: (id: number) => void;
  onViewPartenaire?: (id: number) => void;
}

const LivraisonTable: React.FC<LivraisonTableProps> = ({
  livraisons,
  partenaires,
  onEdit,
  onDelete,
}) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();

  // Helper pour obtenir le nom du partenaire
  const getPartenaireName = (id: number) => {
    const partenaire = partenaires.find((p) => p.id_partenaire === id);
    return partenaire ? partenaire.nom_partenaire : "Inconnu";
  };

  // Toggle pour l'affichage responsive sur mobile
  const toggleRow = (id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Gestion du clic sur le partenaire
  const handlePartenaireClick = (id: number) => {
    navigate(`/partenaire/${id}`);
  };

  return (
    <div className="w-full overflow-hidden rounded-md border">
      {/* Table Desktop */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Reference</TableHead>
              <TableHead className="font-semibold">Frais Divers</TableHead>
              <TableHead className="font-semibold">Période d'achat</TableHead>
              <TableHead className="font-semibold">Prix d'achat</TableHead>
              <TableHead className="font-semibold">Prix de revient</TableHead>
              <TableHead className="font-semibold">Prix de vente</TableHead>
              <TableHead className="font-semibold">Partenaire</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {livraisons.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  Aucun achat trouvé
                </TableCell>
              </TableRow>
            ) : (
              livraisons.map((livraison) => (
                <TableRow
                  key={livraison.id_livraison}
                  className="hover:bg-gray-50"
                >
                  <TableCell className="font-medium">
                    {livraison.reference}
                  </TableCell>
                  <TableCell>
                    {livraison.frais_divers.toLocaleString()} FCFA
                  </TableCell>
                  <TableCell>{livraison.Periode_achat}</TableCell>
                  <TableCell>
                    {livraison.prix_achat.toLocaleString()} FCFA
                  </TableCell>
                  <TableCell>
                    {livraison.prix_de_revient.toLocaleString()} FCFA
                  </TableCell>
                  <TableCell>
                    {livraison.prix_de_vente.toLocaleString()} FCFA
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() =>
                        handlePartenaireClick(livraison.id_partenaire)
                      }
                      className="text-blue-600 hover:underline cursor-pointer hover:text-blue-800 flex items-center gap-1"
                    >
                      {getPartenaireName(livraison.id_partenaire)}
                      <ChevronRight className="w-4 h-4" />
                    </button>
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

      {/* Mobile View */}
      <div className="md:hidden">
        {livraisons.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Aucun achat trouvé
          </div>
        ) : (
          <div className="divide-y">
            {livraisons.map((livraison) => (
              <div key={livraison.id_livraison} className="bg-white">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleRow(livraison.id_livraison)}
                >
                  <div>
                    <div className="font-medium">{livraison.reference}</div>
                    <div className="text-sm text-gray-500">
                      {livraison.Periode_achat}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-medium">
                        {livraison.prix_de_vente.toLocaleString()} FCFA
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePartenaireClick(livraison.id_partenaire);
                        }}
                        className="text-sm text-blue-600 hover:underline cursor-pointer"
                      >
                        {getPartenaireName(livraison.id_partenaire)}
                      </button>
                    </div>
                    {expandedRows[livraison.id_livraison] ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {expandedRows[livraison.id_livraison] && (
                  <div className="p-4 bg-gray-50 space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-gray-500">Frais Divers:</div>
                      <div>{livraison.frais_divers.toLocaleString()} FCFA</div>

                      <div className="text-gray-500">Prix d'achat:</div>
                      <div>{livraison.prix_achat.toLocaleString()} FCFA</div>

                      <div className="text-gray-500">Prix de revient:</div>
                      <div>
                        {livraison.prix_de_revient.toLocaleString()} FCFA
                      </div>

                      <div className="text-gray-500">Prix de vente:</div>
                      <div>{livraison.prix_de_vente.toLocaleString()} FCFA</div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(livraison);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(livraison.id_livraison);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Trash className="w-4 h-4" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LivraisonTable;
