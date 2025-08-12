// src/components/tables/ProductInstanceTable.tsx
import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Edit,
  Package,
  Filter,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ProductInstanceFormValues } from "../../schemas/productInstanceSchema";
import { formatCurrency } from "@/modules/stocks/utils/helpers";
import { useProductInstances } from "../../hooks/useProductInstances";
import { useDebounce } from "@/modules/stocks/entree/utils/helpers";
import { ProductCombobox } from "@/components/combobox/ProductCombobox";

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
  onEdit: (instance: ProductInstanceFormValues) => void;
}

// Interface pour les filtres
interface Filters {
  search: string;
  id_type_produit?: number;
  prix_de_vente_min?: number;
  prix_de_vente_max?: number;
  prix_de_revient_min?: number;
  prix_de_revient_max?: number;
  prix_achat_min?: number;
  prix_achat_max?: number;
  date_achat_min?: Date;
  date_achat_max?: Date;
  etat_exemplaire?: string;
  frais_divers_min?: number;
  frais_divers_max?: number;
  coef_divers_min?: number;
  coef_divers_max?: number;
  id_produit?: number;
}

export function ProductInstanceTable({ onEdit }: ProductInstanceTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    search: "",
    id_type_produit: 1,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);

  // Mise à jour des filtres avec le terme de recherche
  const activeFilters = {
    ...filters,
    search: debouncedSearchTerm,
  };

  const {
    productInstances,
    pages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    loading,
  } = useProductInstances(activeFilters);

  // Pagination calculée à partir des pages
  const total = pages?.[0]?.total ? pages?.[0]?.total : 0;
  const totalPages = pages?.[0]?.totalPages ? pages?.[0]?.totalPages : 0;
  const pageInstances = productInstances.slice(
    (currentPage - 1) * pages?.[0]?.pageSize
      ? (currentPage - 1) * pages?.[0]?.pageSize
      : 0,
    currentPage * pages?.[0]?.pageSize ? currentPage * pages?.[0]?.pageSize : 0
  );



  const handlePageChange = (page: number) => {
    if (page > currentPage && hasNextPage) {
      fetchNextPage();
    }
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (
    key: keyof Filters,
    value: string | number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange({ from: range.from, to: range.to });
    setFilters((prev) => ({
      ...prev,
      date_achat_min: range.from,
      date_achat_max: range.to,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      id_type_produit: 1,
    });
    setDateRange({ from: undefined, to: undefined });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Object.values(filters).some(
      (value) =>
        value !== undefined && value !== "" && value !== 1 && value !== ""
    ) ||
    dateRange.from ||
    dateRange.to;

  const getEtatExemplaireColor = (etat: string) => {
    switch (etat) {
      case "vendu":
        return "bg-green-100 text-green-800";
      case "invendu":
        return "bg-blue-100 text-blue-800";
      case "bon":
        return "bg-yellow-100 text-yellow-800";
      case "endommage":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEtatExemplaireLabel = (etat: string) => {
    switch (etat) {
      case "vendu":
        return "Vendu";
      case "invendu":
        return "Invendu";
      case "bon":
        return "Bon état";
      case "endommage":
        return "Endommagé";
      default:
        return etat;
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Barre de recherche et filtres */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
          <div className="relative w-full max-w-md">
            <ProductCombobox
              value={filters.id_produit?.toString() || ""}
              onChange={(value) =>
                handleFilterChange(
                  "id_produit",
                  value ? String(value) : undefined
                )
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtres
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1">
                  {Object.keys(filters).filter(
                    (key) =>
                      filters[key as keyof Filters] !== undefined &&
                      filters[key as keyof Filters] !== "" &&
                      filters[key as keyof Filters] !== 1 &&
                      filters[key as keyof Filters] !== ""
                  ).length + (dateRange.from || dateRange.to ? 1 : 0)}
                </Badge>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Effacer
              </Button>
            )}
          </div>
        </div>

        {/* Panneau de filtres */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Filtre par état de vente */}
              <div className="space-y-2">
                <Label htmlFor="etat-exemplaire">État de vente</Label>
                <Select
                  value={filters.etat_exemplaire || undefined}
                  onValueChange={(value) =>
                    handleFilterChange("etat_exemplaire", value || undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les états" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponible">Disponible</SelectItem>
                    <SelectItem value="Reserve">Réservé</SelectItem>
                    <SelectItem value="Vendu">Vendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre par date d'entrée */}
              <div className="space-y-2">
                <Label>Date d'entrée</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy", {
                              locale: fr,
                            })}{" "}
                            -{" "}
                            {format(dateRange.to, "dd/MM/yyyy", { locale: fr })}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy", { locale: fr })
                        )
                      ) : (
                        "Sélectionner une période"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={(range) =>
                        handleDateRangeChange({
                          from: range?.from,
                          to: range?.to,
                        })
                      }
                      numberOfMonths={2}
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Filtres de prix d'achat */}
              <div className="space-y-2">
                <Label>Prix d'achat</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.prix_achat_min || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "prix_achat_min",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    className="text-sm"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.prix_achat_max || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "prix_achat_max",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Filtres de prix de vente */}
              <div className="space-y-2">
                <Label>Prix de vente</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.prix_de_vente_min || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "prix_de_vente_min",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    className="text-sm"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.prix_de_vente_max || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "prix_de_vente_max",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Filtres de prix de revient */}
              <div className="space-y-2">
                <Label>Prix de revient</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.prix_de_revient_min || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "prix_de_revient_min",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    className="text-sm"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.prix_de_revient_max || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "prix_de_revient_max",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Filtres de frais divers */}
              <div className="space-y-2">
                <Label>Frais divers</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.frais_divers_min || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "frais_divers_min",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    className="text-sm"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.frais_divers_max || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "frais_divers_max",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Filtres de coefficient divers */}
              <div className="space-y-2">
                <Label>Coefficient divers</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    step="0.01"
                    value={filters.coef_divers_min || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "coef_divers_min",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    className="text-sm"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    step="0.01"
                    value={filters.coef_divers_max || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "coef_divers_max",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
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
                Prix de revient
              </TableHead>
              <TableHead className="font-bold text-gray-700 text-base border-r">
                Prix de vente
              </TableHead>
              <TableHead className="font-bold text-gray-700 text-base border-r">
                Marge basse
              </TableHead>
              <TableHead className="font-bold text-gray-700 text-base border-r">
                Marge haute
              </TableHead>
              <TableHead className="font-bold text-gray-700 text-base border-r">
                État
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
                <TableCell colSpan={11} className="text-center py-4">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : pageInstances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-4">
                  Aucun exemplaire trouvé
                </TableCell>
              </TableRow>
            ) : (
              pageInstances.map((instance) => (
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
                    {formatCurrency(Number(instance.prix_de_revient))}
                  </TableCell>
                  <TableCell className="text-gray-700 border-r">
                  {formatCurrency(Number(instance.prix_de_vente))}
                  </TableCell>
                  <TableCell className="text-gray-700 border-r">
                    {formatCurrency(Number(instance.marge_basse))}
                  </TableCell>
                  <TableCell className="text-gray-700 border-r">
                    {formatCurrency(Number(instance.marge_haute))}
                  </TableCell>
                  <TableCell className="border-r">
                    <Badge
                      className={getEtatExemplaireColor(
                        instance.etat_exemplaire
                      )}
                    >
                      {getEtatExemplaireLabel(instance.etat_exemplaire)}
                    </Badge>
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
