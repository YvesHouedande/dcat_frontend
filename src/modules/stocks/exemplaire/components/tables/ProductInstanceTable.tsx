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
  ChevronRight,
  Undo2,
  BadgePlus,
  NotepadTextDashed,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLivraisonData } from "@/modules/stocks/livraison/hooks/useLivraison";
import { ProductInstanceFormValues } from "../../schemas/productInstanceSchema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [achatSearch, setAchatSearch] = useState("");
  const [sortField, setSortField] = useState<
    "prix_exemplaire" | "date_entree" | ""
  >("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [etatFilter, setEtatFilter] = useState<"all" | "vendu" | "disponible">(
    "all"
  );
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAchatSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAchatSearch(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  // Tri et filtre local (à adapter si vous voulez côté serveur)
  let filteredInstances = [...productInstances];
  if (etatFilter !== "all") {
    filteredInstances = filteredInstances.filter(
      (instance) => instance.etat_vente === etatFilter
    );
  }
  if (achatSearch.trim() !== "") {
    filteredInstances = filteredInstances.filter(
      (instance) =>
        String(instance.id_produit)
          .toLowerCase()
          .includes(achatSearch.trim().toLowerCase()) ||
        String(instance.id_livraison)
          .toLowerCase()
          .includes(achatSearch.trim().toLowerCase())
    );
  }
  if (sortField) {
    filteredInstances.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      if (sortField === "date_entree") {
        const aTime = new Date(aValue as string).getTime();
        const bTime = new Date(bValue as string).getTime();
        if (sortOrder === "asc") {
          return aTime > bTime ? 1 : aTime < bTime ? -1 : 0;
        } else {
          return aTime < bTime ? 1 : aTime > bTime ? -1 : 0;
        }
      }
      if (aValue === undefined || bValue === undefined) return 0;
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }

  // Dans ton composant React (ProductInstanceTable ou un sous-composant)

  const LivraisonReference: React.FC<Props> = ({ Id }) => {
    const { livraison, isLoading } = useLivraisonData(Id);

    if (isLoading) return <span>Chargement...</span>;

    return <span>{livraison?.reference || Id}</span>;
  };

  const handleProductClick = (id: number | string) => {
    navigate(`/stocks/achats/${id}`);
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
        <Input
          placeholder="Recherche achat (ID produit ou livraison)"
          value={achatSearch}
          onChange={handleAchatSearchChange}
          className="w-full max-w-xs"
        />
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={onAdd} className="w-full sm:w-auto">
            <NotepadTextDashed className="mr-2 h-4 w-4" /> Achat
          </Button>
          <Button
            onClick={onAdd}
            className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700"
          >
            <Undo2 className="mr-2 h-4 w-4" /> Sortie d'exemplaire
          </Button>
          <Button onClick={onAdd} variant={"blue"} className="w-full sm:w-auto">
            <BadgePlus className="mr-2 h-4 w-4" /> Ajouter un exemplaire
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 items-center">
        <label className="text-xs font-medium">Trier par :</label>
        <Select
          value={sortField}
          onValueChange={(value) =>
            setSortField(value as "prix_exemplaire" | "date_entree" | "")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="prix_exemplaire">Prix</SelectItem>
              <SelectItem value="date_entree">Date d'entrée</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Ordre" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="asc">Ascendant</SelectItem>
              <SelectItem value="desc">Descendant</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <label className="ml-4 text-xs font-medium">État :</label>
        <Select
          value={etatFilter}
          onValueChange={(value) =>
            setEtatFilter(value as "all" | "vendu" | "disponible")
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="État" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="vendu">Vendu</SelectItem>
              <SelectItem value="disponible">Disponible</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table className="table-fixed">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">N° Série</TableHead>
              <TableHead className="font-semibold">Prix</TableHead>
              <TableHead className="font-semibold">Date d'entrée</TableHead>
              <TableHead className="font-semibold">État</TableHead>
              <TableHead className="font-semibold">Date sortie</TableHead>
              <TableHead className="font-semibold">Type sortie</TableHead>
              <TableHead className="font-semibold">Prix de sortie</TableHead>
              <TableHead className="font-semibold">Reference</TableHead>
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
            ) : filteredInstances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Aucun exemplaire trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredInstances.map((instance) => (
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
                    <button
                      onClick={() => handleProductClick(instance.id_produit)}
                      className="text-blue-600 hover:underline cursor-pointer hover:text-blue-800 flex items-center gap-1"
                    >
                      <LivraisonReference Id={instance.id_livraison} />
                      <ChevronRight className="w-4 h-4" />
                    </button>{" "}
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
                          <Edit className="mr-2 h-4 w-4 text-blue-600" />{" "}
                          Modifier exemplaire
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(instance)}>
                          <Edit className="mr-2 h-4 w-4 text-green-600" />{" "}
                          Modifier sortie
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(instance)}>
                          <Edit className="mr-2 h-4 w-4 text-orange-600" />{" "}
                          Modifer achat
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            if (instance.id_exemplaire !== undefined) {
                              onDelete(instance.id_exemplaire);
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-red-600" />{" "}
                          Supprimer
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
          Affichage de {filteredInstances.length} sur {total} exemplaires
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
