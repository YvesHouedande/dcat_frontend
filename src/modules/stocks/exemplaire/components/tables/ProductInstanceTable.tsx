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
import {
  MoreHorizontal,
  Search,
  Edit,
  Trash2,
  Plus,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/modules/stocks/reference/hooks/useProducts";
import { useLivraisonData } from "@/modules/stocks/livraison/hooks/useLivraison";
import { ProductInstanceFormValues } from "../../schemas/productInstanceSchema";
interface ProductInstanceTableProps {
  productInstances: ProductInstanceFormValues[];
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onEdit: (instance: ProductInstanceFormValues) => void;
  onDelete: (id: string | number) => void;
  onAdd: () => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  loading: boolean;
}

interface Props {
  Id: string | number;
}
export function ProductInstanceTable({
  productInstances,
  onPageChange,
  onSearch,
  onEdit,
  onDelete,
  onAdd,
  currentPage,
  totalPages,
  total,
  loading,
}: ProductInstanceTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  // Dans ton composant React (ProductInstanceTable ou un sous-composant)

  const LivraisonReference: React.FC<Props> = ({ Id }) => {
    const { livraison, isLoading } = useLivraisonData(Id);

    if (isLoading) return <span>Chargement...</span>;

    return <span>{livraison?.reference || Id}</span>;
  };

  const GetCodeProduit: React.FC<Props> = ({ Id }) => {
    const { product } = useProducts(Id);

    if (product.isLoading) return <span>Chargement...</span>;

    return <span>{product.data?.code_produit || Id}</span>;
  };

  const handleProductClick = (id: number | string) => {
    navigate(`/stocks/references/${id}`);
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
            className="pl-8"
          />
        </form>
        <Button onClick={onAdd} variant={"blue"} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-" /> Ajouter un exemplaire
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">N° Série</TableHead>
              <TableHead className="font-semibold">Prix</TableHead>
              <TableHead className="font-semibold">Date d'entrée</TableHead>
              <TableHead className="font-semibold">État</TableHead>
              <TableHead className="font-semibold">Produit</TableHead>
              <TableHead className="font-semibold">Achat</TableHead>
              <TableHead className="w-[80px] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : productInstances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Aucun exemplaire trouvé
                </TableCell>
              </TableRow>
            ) : (
              productInstances.map((instance) => (
                <TableRow key={instance.id_exemplaire}>
                  <TableCell>{instance.num_serie}</TableCell>
                  <TableCell>
                    {instance.prix_exemplaire || "Non défini"}
                  </TableCell>
                  <TableCell>{instance.date_entree}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        instance.etat_vente === "vendu"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {instance.etat_vente}
                    </span>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <button
                      onClick={() => handleProductClick(instance.id_produit)}
                      className="text-blue-600 hover:underline cursor-pointer hover:text-blue-800 flex items-center gap-1"
                    >
                      <GetCodeProduit Id={instance.id_produit} />
                      <ChevronRight className="w-4 h-4" />
                    </button>{" "}
                  </TableCell>
                  <TableCell>
                    <LivraisonReference Id={instance.id_livraison} />
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
                        <DropdownMenuItem onClick={() => onEdit(instance)}>
                          <Edit className="mr-2 h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            if (instance.id_exemplaire !== undefined) {
                              onDelete(instance.id_exemplaire);
                            }
                          }}
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
          Affichage de {productInstances.length} sur {total} exemplaires
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
          >
            Précédent
          </Button>
          <div className="text-sm">
            Page {currentPage} sur {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
