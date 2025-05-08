// src/components/dashboard/ExemplaireSortieTable.tsx
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Search,
  Edit,
  Trash2,
  Plus,
  ChevronRight,
} from "lucide-react";
import { ExemplaireSortie } from "../types";
import { formatDateTime } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../exemplaire";

interface Props {
  id_produit: string | number;
}
interface ExemplaireSortieTableProps {
  exemplaireSorties: ExemplaireSortie[];
  searchTerm: string;
  pagination: {
    page: number;
    totalPages: number;
    pageSize: number;
    total: number;
  };
  loading: boolean;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onEdit: (sortie: ExemplaireSortie) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export function ExemplaireSortieTable({
  exemplaireSorties,
  searchTerm,
  pagination,
  loading,
  onPageChange,
  onSearch,
  onEdit,
  onDelete,
  onAdd,
}: ExemplaireSortieTableProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };
  const navigate = useNavigate();
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  function getTypeSortieColor(type: string) {
    switch (type) {
      case "Vente en ligne":
        return "bg-green-100 text-green-800";
      case "Vente directe":
        return "bg-red-100 text-red-800";
      case "Projet":
        return "bg-yellow-100 text-yellow-800";
      case "Intervention":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  }

  const handlePartenaireClick = (id: number) => {
    navigate(`/stocks/references/${id}`);
  };

  const GetCodeProduit: React.FC<Props> = ({ id_produit }) => {
    const { product } = useProducts(id_produit);

    if (product.isLoading) return <span>Chargement...</span>;

    return <span>{product.data?.code_produit || id_produit}</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher..."
            value={localSearchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </form>
        <Button onClick={onAdd} variant={"blue"} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Ajouter une sortie
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Sortie</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Référence</TableHead>
              <TableHead>Date de sortie</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : exemplaireSorties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aucune sortie trouvée
                </TableCell>
              </TableRow>
            ) : (
              exemplaireSorties.map((sortie) => (
                <TableRow key={sortie.id_sortie_exemplaire}>
                  <TableCell>{sortie.id_sortie_exemplaire}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeSortieColor(
                        sortie.type_sortie
                      )}`}
                    >
                      {sortie.type_sortie}
                    </span>
                  </TableCell>
                  <TableCell>{sortie.reference_id}</TableCell>
                  <TableCell>{formatDateTime(sortie.date_sortie)}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handlePartenaireClick(sortie.id_produit)}
                      className="text-blue-600 hover:underline cursor-pointer hover:text-blue-800 flex items-center gap-1"
                    >
                      <GetCodeProduit id_produit={sortie.id_produit} />
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
                        <DropdownMenuItem onClick={() => onEdit(sortie)}>
                          <Edit className="mr-2 h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(sortie.id_sortie_exemplaire)}
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Affichage de {exemplaireSorties.length} sur {pagination.total} sorties
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1 || loading}
          >
            Précédent
          </Button>
          <div className="text-sm">
            Page {pagination.page} sur {pagination.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages || loading}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
