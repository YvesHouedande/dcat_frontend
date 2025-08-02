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
  Package,
} from "lucide-react";
// import { useLivraisonData } from "@/modules/stocks/livraison/hooks/useLivraison";
import { ProductInstanceFormValues } from "../../schemas/productInstanceSchema";
import { formatCurrency } from "@/modules/stocks/utils/helpers";
import { useProductInstances } from "../../hooks/useProductInstances";
import { useDebounce } from "../../utils/helpers";
interface ProductInstanceTableProps {
  onEdit: (instance: ProductInstanceFormValues) => void;
  onDelete: (id: string | number) => void;
  onAdd: () => void;
}

// interface Props {
//   Id: string | number;
// }
export function ProductInstanceTable({
  onEdit,
  onDelete,
  onAdd,
}: ProductInstanceTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    productInstances,
    pages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    loading,
  } = useProductInstances({ search: debouncedSearchTerm, id_type_produit: 1 });

  // Pagination calculée à partir des pages
  const total = pages?.[0]?.total ? pages?.[0]?.total : 0;
  const totalPages = pages?.[0]?.totalPages ? pages?.[0]?.totalPages : 0;
  const pageInstances = productInstances.slice(
    (currentPage - 1) * pages?.[0]?.pageSize
      ? (currentPage - 1) * pages?.[0]?.pageSize
      : 0,
    currentPage * pages?.[0]?.pageSize ? currentPage * pages?.[0]?.pageSize : 0
  );

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

  const handlePageChange = (page: number) => {
    if (page > currentPage && hasNextPage) {
      fetchNextPage();
    }
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const EtatColor = (etat: string) => {
    switch (etat) {
      case "vendu":
        return "text-red-500 bg-red-500/10";
      case "invendu":
        return "text-green-500 bg-green-500/10";
      case "bon":
        return "text-blue-500 bg-blue-500/10";
      case "disponible":
        return "text-green-500 bg-green-500/10";
      case "endommage":
        return "text-yellow-500 bg-yellow-500/10";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full max-sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        <Button onClick={onAdd} variant={"blue"} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-" /> Ajouter un produit
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Image</TableHead>
              <TableHead className="font-semibold">Produit</TableHead>
              <TableHead className="font-semibold">N° Série</TableHead>
              <TableHead className="font-semibold">Prix de vente</TableHead>
              <TableHead className="font-semibold">Date d'entrée</TableHead>
              <TableHead className="font-semibold">Etat</TableHead>
              <TableHead className="w-[80px] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading || isFetchingNextPage ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : pageInstances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Aucun exemplaire trouvé
                </TableCell>
              </TableRow>
            ) : (
              pageInstances.map((instance) => (
                <TableRow key={instance.id_exemplaire}>
                  <TableCell>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      {instance.image_produit ? (
                        <ImageOrIcon src={instance.image_produit} />
                      ) : (
                        <Package className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{instance.nom_produit}</TableCell>
                  <TableCell>{instance.num_serie}</TableCell>
                  <TableCell>
                    {formatCurrency(
                      instance.prix_de_vente
                        ? Number(instance.prix_de_vente)
                        : 0
                    )}
                  </TableCell>
                  <TableCell>{instance.date_entree}</TableCell>
                  <TableCell>
                    <div
                      className={`${EtatColor(
                        String(instance.etat_exemplaire).toLowerCase()
                      )} rounded-md px-2 py-1 w-max`}
                    >
                      {instance.etat_exemplaire.charAt(0).toUpperCase() +
                        instance.etat_exemplaire.slice(1)}
                    </div>
                  </TableCell>
                  {/* <TableCell>
                    <LivraisonReference Id={instance.id_livraison} />
                  </TableCell> */}
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
          Affichage de{" "}
          {total === 0 ? 0 : (currentPage - 1) * pages?.[0]?.pageSize + 1} à{" "}
          {Math.min(currentPage * pages?.[0]?.pageSize, total)} sur {total}{" "}
          exemplaire
          {total > 1 ? "s" : ""}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading || isFetchingNextPage}
          >
            Précédent
          </Button>
          <div className="text-sm">
            Page {currentPage} sur {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={
              currentPage >= totalPages || loading || isFetchingNextPage
            }
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
