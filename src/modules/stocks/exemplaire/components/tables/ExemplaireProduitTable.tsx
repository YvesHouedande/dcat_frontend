// src/components/tables/ExemplaireProduitTable.tsx
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
  BadgePlus,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLivraisonData } from "@/modules/stocks/livraison/hooks/useLivraison";
import { ExemplaireProduitFormValues } from "../../schemas/ExemplaireProduitSchema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ParametresVente from "../ui/ParametresLivraison";
import { useExemplaireProduits } from "../../hooks/useExemplaireProduits";
import { format } from "date-fns";
import { EtatExemplaire } from "./EtatExemplaire";

interface ExemplaireProduitTableProps {
  ExemplaireProduits: ExemplaireProduitFormValues[];
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onOutEdit: (id: string | number) => void;
  onEdit: (instance: ExemplaireProduitFormValues) => void;
  onDelete: (id: string | number) => void;
  onInfo: (open: boolean) => void;
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
export function ExemplaireProduitTable({
  ExemplaireProduits,
  onPageChange,
  onSearch,
  onEdit,
  onOutEdit,
  onInfo,
  onDelete,
  onAdd,
  currentPage,
  totalPages,
  total,
  loading,
}: ExemplaireProduitTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<
    "prix_exemplaire" | "date_entree" | ""
  >("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [etatFilter, setEtatFilter] = useState<"all" | EtatExemplaire>("all");
  const idProduit = ExemplaireProduits[0]?.id_produit;
  const { ExemplaireProduitByEtat } = useExemplaireProduits(
    idProduit,
    etatFilter
  );
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  // Tri et filtre local (à adapter si vous voulez côté serveur)
  let filteredInstances = [...ExemplaireProduits];
  if (etatFilter !== "all") {
    filteredInstances = ExemplaireProduitByEtat;
    console.log("Filtered by etat:", etatFilter, filteredInstances);
  }

  if (searchTerm.trim() !== "") {
    filteredInstances = filteredInstances.filter((instance) => {
      const numSerie = instance.num_serie?.toLowerCase() || "";
      return numSerie.includes(searchTerm.trim().toLowerCase());
    });
  }
  if (sortField) {
    filteredInstances.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
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

  // Dans ton composant React (ExemplaireProduitTable ou un sous-composant)

  const LivraisonReference: React.FC<Props> = ({ Id }) => {
    const { livraison, isLoading, errorLivraisons } = useLivraisonData(Id);

    if (isLoading) return <span>Chargement...</span>;
    if (errorLivraisons) {
      return <span className="text-red-500">Erreur de chargement</span>;
    }

    return <span>{livraison?.reference_livraison || Id}</span>;
  };

  const handleProductClick = (id: number | string) => {
    navigate(`/stocks/achats/${id}`);
  };
  function getEtatBadgeClass(etat: EtatExemplaire | string) {
    switch (etat) {
      case EtatExemplaire.Vendu:
        return "bg-green-100 text-green-800";
      case EtatExemplaire.Disponible:
        return "bg-blue-100 text-blue-800";
      case EtatExemplaire.Reserve:
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function formatDateSafe(dateValue: string | Date | undefined | null) {
    if (!dateValue) return "-";
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return "-";
      return format(date, "dd/MM/yyyy HH:mm");
    } catch {
      return "-";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full max-sm:w-64"
        >
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher par numéro de série..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8 max-w-2xl sm:max-w-xs w-full"
          />
        </form>
        <div className="flex gap-2 w-full sm:w-auto">
          <ParametresVente />

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
          onValueChange={(value) => {
            setEtatFilter(value as "all" | EtatExemplaire);
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="État" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value={EtatExemplaire.Vendu}>
                {EtatExemplaire.Vendu}
              </SelectItem>
              <SelectItem value={EtatExemplaire.Disponible}>
                {EtatExemplaire.Disponible}
              </SelectItem>

              <SelectItem value={EtatExemplaire.Reserve}>
                {EtatExemplaire.Reserve}
              </SelectItem>
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
              <TableHead className="font-semibold">Livraison</TableHead>
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
                  <TableCell>{formatDateSafe(instance.created_at)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getEtatBadgeClass(
                        instance.etat_exemplaire
                      )}`}
                    >
                      {instance.etat_exemplaire}
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
                        {instance.etat_exemplaire ===
                          EtatExemplaire.Disponible && (
                          <DropdownMenuItem onClick={() => onEdit(instance)}>
                            <Edit className="mr-2 h-4 w-4 text-blue-600" />{" "}
                            Modifier exemplaire
                          </DropdownMenuItem>
                        )}

                        {instance.etat_exemplaire ===
                          EtatExemplaire.Reserve && (
                          <DropdownMenuItem
                            onClick={() =>
                              onOutEdit(String(instance.id_exemplaire))
                            }
                          >
                            <Edit className="mr-2 h-4 w-4 text-green-600" />{" "}
                            Faire une sortie
                          </DropdownMenuItem>
                        )}
                        {instance.etat_exemplaire === EtatExemplaire.Vendu && (
                          <DropdownMenuItem
                            onClick={() =>
                              onOutEdit(String(instance.id_exemplaire))
                            }
                          >
                            <Edit className="mr-2 h-4 w-4 text-green-600" />{" "}
                            Annuler la sortie
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem onClick={() => onInfo(true)}>
                          <Info className="mr-2 h-4 w-4 text-blue-600" />{" "}
                          information
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
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
