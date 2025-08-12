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
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Filter,
  X,
  Calendar as CalendarIcon,
  Package,
  Plus,
} from "lucide-react";
// import { useLivraisonData } from "@/modules/stocks/livraison/hooks/useLivraison";
import { ProductInstanceFormValues } from "../../schemas/productInstanceSchema";
import { formatCurrency } from "@/modules/stocks/utils/helpers";
import { useProductInstances } from "../../hooks/useProductInstances";
import { useDebounce } from "../../utils/helpers";
import { ProductCombobox } from "@/components/combobox/ProductCombobox";
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
interface ProductInstanceTableProps {
  onEdit: (instance: ProductInstanceFormValues) => void;
  onDelete: (id: string | number) => void;
  onAdd: () => void;
}

interface Filters {
  search: string;
  id_type_produit?: number;
  prix_de_vente_min?: number;
  prix_de_vente_max?: number;
  etat_exemplaire?: string;
  id_produit?: number;
}

export function ProductInstanceTable({
  onEdit,
  onDelete,
  onAdd,
}: ProductInstanceTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    id_type_produit: 1,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<Date | undefined>();

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

  const handleDateRangeChange = (range: Date | undefined) => {
    setDateRange(range);
    setFilters((prev) => ({
      ...prev,
      date_entree: range,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      id_type_produit: 1,
    });
    setDateRange(undefined);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Object.values(filters).some(
      (value) =>
        value !== undefined && value !== "" && value !== 1 && value !== ""
    ) || dateRange;

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
      {/* Barre de recherche et filtres */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
          <div className="flex items-center gap-2 w-full">
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
                    ).length + (dateRange ? 1 : 0)}
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

          <Button onClick={onAdd} variant={"blue"} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-" /> Ajouter un produit
          </Button>
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
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange ? (
                        dateRange ? (
                          <>
                            {format(dateRange, "dd/MM/yyyy", {
                              locale: fr,
                            })}{" "}
                            - {format(dateRange, "dd/MM/yyyy", { locale: fr })}
                          </>
                        ) : (
                          format(dateRange, "dd/MM/yyyy", { locale: fr })
                        )
                      ) : (
                        "Sélectionner une période"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="single"
                      defaultMonth={dateRange}
                      selected={dateRange}
                      onSelect={(range) => handleDateRangeChange(range)}
                      numberOfMonths={1}
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
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
            </div>
          </div>
        )}
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
