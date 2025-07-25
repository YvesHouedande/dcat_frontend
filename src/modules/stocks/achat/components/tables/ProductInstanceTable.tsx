// src/components/tables/ProductInstanceTable.tsx
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
import { MoreHorizontal, Search, Edit, Package } from "lucide-react";
// import { useLivraisonData } from "@/modules/stocks/livraison/hooks/useLivraison";
import { ProductInstanceFormValues } from "../../schemas/productInstanceSchema";
import { formatCurrency } from "@/modules/stocks/utils/helpers";

// Composant pour gérer l'affichage de l'image ou de l'icône en cas d'erreur
function ImageOrIcon({ src }: { src?: string }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return <Package className="w-6 h-6 text-white" />;
  }
  return (
    <img
      src={src}
      alt="image produit"
      className="object-cover w-11 h-11 rounded-lg mx-auto my-auto block"
      style={{ aspectRatio: "1/1" }}
      onError={() => setError(true)}
    />
  );
}

interface ProductInstanceTableProps {
  productInstances: ProductInstanceFormValues[];
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onEdit: (instance: ProductInstanceFormValues) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  loading: boolean;
}

// interface Props {
//   Id: string | number;
// }
export function ProductInstanceTable({
  productInstances,
  onPageChange,
  onSearch,
  onEdit,
  currentPage,
  totalPages,
  total,
  loading,
}: ProductInstanceTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full max-sm:w-64"
        >
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8 lg:w-1/2 rounded-lg border-gray-300 focus:border-blue-400 shadow-sm"
          />
        </form>
      </div>

      <div className="rounded-xl border overflow-x-auto bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-blue-50">
            <TableRow>
              <TableHead className="font-bold text-gray-700 text-base border-r">
                {" "}
              </TableHead>
              <TableHead className="font-bold text-gray-700 text-base border-r">
                Produit
              </TableHead>
              <TableHead className="font-bold text-gray-700 text-base border-r">
                N° Série
              </TableHead>
              <TableHead className="font-bold text-gray-700 text-base border-r">
                Prix d'achat
              </TableHead>
              <TableHead className="font-bold text-gray-700 text-base border-r">
                Frais divers
              </TableHead>
              <TableHead className="font-bold text-gray-700 text-base border-r">
                Coef.
              </TableHead>
              <TableHead className="font-bold text-gray-700 text-base border-r">
                Prix de revient
              </TableHead>
              <TableHead className="font-bold text-gray-700 text-base border-r">
                Prix de vente
              </TableHead>
              <TableHead className="font-bold text-gray-700 text-base border-r">
                Date d'entrée
              </TableHead>
              <TableHead className="w-[80px] font-bold text-gray-700 text-base">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : productInstances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">
                  Aucun exemplaire trouvé
                </TableCell>
              </TableRow>
            ) : (
              productInstances.map((instance) => (
                <TableRow
                  key={instance.id_exemplaire}
                  className="transition-colors hover:bg-blue-50/60"
                >
                  <TableCell className="border-r">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
                      <ImageOrIcon src={instance.image_produit} />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-800 border-r">
                    {instance.nom_produit}
                  </TableCell>
                  <TableCell className="text-gray-700 border-r">
                    {instance.num_serie}
                  </TableCell>
                  <TableCell className="text-gray-700 border-r">
                    {formatCurrency(Number(instance.prix_achat))}
                  </TableCell>
                  <TableCell className="text-gray-700 border-r">
                    {formatCurrency(Number(instance.frais_divers))}
                  </TableCell>
                  <TableCell className="text-gray-700 border-r">
                    {instance.coef_divers ? instance.coef_divers : 0}
                  </TableCell>
                  <TableCell className="text-gray-700 border-r">
                    {formatCurrency(instance.prix_de_revient ? Number(instance.prix_de_revient) : 0)}
                  </TableCell>
                  <TableCell className="text-gray-700 border-r">
                    {formatCurrency(instance.prix_de_vente ? Number(instance.prix_de_vente) : 0)}
                  </TableCell>
                  <TableCell className="text-gray-700 border-r">
                    {instance.date_entree}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-blue-100"
                        >
                          <span className="sr-only">Menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onEdit(instance)}
                          className="hover:bg-blue-50"
                        >
                          <Edit className="mr-2 h-4 w-4 text-blue-600" />{" "}
                          <span className="text-blue-700">Modifier</span>
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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-2">
        <p className="text-sm text-gray-500">
          Affichage de {productInstances.length} sur {total} exemplaires
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            className="transition-colors hover:bg-blue-100"
          >
            Précédent
          </Button>
          <div className="text-sm font-semibold text-gray-700">
            Page {currentPage} sur {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
            className="transition-colors hover:bg-blue-100"
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
