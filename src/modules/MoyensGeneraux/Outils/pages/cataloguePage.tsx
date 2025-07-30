import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Search,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Package2,
  ImageIcon,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import Parametres from "@/modules/stocks/reference/components/ui/Parametres";
import ProductCatalogSkeleton from "@/components/skeleton/ProductCatalogSkeleton";
import {
  useProductFamilies,
  useProductMarques,
  useProductModels,
} from "@/modules/stocks/reference/hooks/useOthers";
import { useDeleteProduct } from "@/modules/stocks/reference/hooks/useProducts";
import { ReferenceProduit } from "@/modules/stocks/types/reference";
import ProductInfoDialog from "../components/ProductInfoDialog";
import AlertDeleteDialog from "@/components/AlertDeleteDialog";
import { toast } from "sonner";

export default function CataloguePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modelFilter, setModelFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [familyFilter, setFamilyFilter] = useState("all");
  const [productTypeFilter, setProductTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  // États pour le dialogue et la suppression
  const [selectedProduct, setSelectedProduct] =
    useState<ReferenceProduit | null>(null);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] =
    useState<ReferenceProduit | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    products: productsQuery,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts({
    searchTerm,
    categoryFilter,
    modelFilter,
    brandFilter,
    familyFilter,
    productTypeFilter,
  });

  const { productFamilies } = useProductFamilies();
  const { productMarques } = useProductMarques();
  const { productModels } = useProductModels();
  const { delete: deleteProduct } = useDeleteProduct();

  // Fonctions de gestion des actions
  const handleViewProduct = (product: ReferenceProduit) => {
    setSelectedProduct(product);
    setShowInfoDialog(true);
  };

  const handleDeleteProduct = (product: ReferenceProduit) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async (id: string | number) => {
    if (!id) return;

    try {
      await deleteProduct.mutateAsync(Number(id));
      toast.success("Produit supprimé avec succès");
      setShowDeleteDialog(false);
      setProductToDelete(null);
      setDeleteError(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      setDeleteError("La suppression a échoué. " + errorMessage);
      toast.error("Erreur lors de la suppression");
    }
  };

  const allProducts =
    productsQuery.data?.pages?.flatMap((page) => page.data) || [];

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.desi_produit
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      String(product.id_categorie) === categoryFilter;
    const matchesProductType =
      productTypeFilter === "all" ||
      String(product.id_type_produit) === productTypeFilter;
    const matchesModel =
      modelFilter === "all" || String(product.id_modele) === modelFilter;
    const matchesBrand =
      brandFilter === "all" || String(product.id_marque) === brandFilter;
    const matchesFamily =
      familyFilter === "all" || String(product.id_famille) === familyFilter;
    return (
      matchesSearch &&
      matchesCategory &&
      matchesProductType &&
      matchesModel &&
      matchesBrand &&
      matchesFamily
    );
  });

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    categoryFilter,
    modelFilter,
    brandFilter,
    familyFilter,
    productTypeFilter,
  ]);

  const handlePreviousPage = () => {
    fetchNextPage();
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Composant pour l'image du produit
  const ProductImage = ({ product }: { product: ReferenceProduit }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = () => {
      setImageError(true);
      setImageLoading(false);
    };

    const handleImageLoad = () => {
      setImageLoading(false);
    };

    if (imageError || !product.images?.[0].url) {
      return (
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <Package2 className="w-8 h-8 text-gray-400" />
        </div>
      );
    }

    return (
      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-gray-400 animate-pulse" />
          </div>
        )}
        <img
          src={product.images?.[0].url}
          alt={product.desi_produit}
          className="w-full h-full object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ display: imageLoading ? "none" : "block" }}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Catalogue des Outils</h1>
        <Button
          onClick={() => {
            navigate("nouveau");
          }}
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          <Wrench size={16} className="mr-2" />
          Ajouter
        </Button>
      </div>

      {/* Recherche + Filtres */}
      <div className="space-y-4 mb-4">
        <div className="flex gap-2 flex-col md:flex-row">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
          <div className="flex gap-2 justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setProductTypeFilter("all");
                setFamilyFilter("all");
                setModelFilter("all");
                setBrandFilter("all");
                setCurrentPage(1);
              }}
              className="h-9 whitespace-nowrap"
            >
              Réinitialiser les filtres
            </Button>
            <Parametres />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={familyFilter} onValueChange={setFamilyFilter}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {productFamilies.data.map((family) => (
                <SelectItem
                  key={family.id_famille}
                  value={String(family.id_famille)}
                >
                  {family.libelle_famille}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={modelFilter} onValueChange={setModelFilter}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Modèle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous modèles</SelectItem>
              {productModels.data.map((model) => (
                <SelectItem
                  key={model.id_modele}
                  value={String(model.id_modele)}
                >
                  {model.libelle_modele}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Marque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes marques</SelectItem>
              {productMarques.data.map((brand) => (
                <SelectItem
                  key={brand.id_marque}
                  value={String(brand.id_marque)}
                >
                  {brand.libelle_marque}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Informations sur les résultats */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          {filteredProducts.length} produits trouvés
        </div>
        {filteredProducts.length > 0 && (
          <div className="text-sm text-gray-500">
            Page {currentPage} sur {totalPages} ({startIndex + 1}-
            {Math.min(endIndex, filteredProducts.length)} sur{" "}
            {filteredProducts.length})
          </div>
        )}
      </div>

      {productsQuery.isLoading && !isFetchingNextPage ? (
        <ProductCatalogSkeleton />
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="flex w-full h-64 flex-col justify-center items-center">
              <Package className="w-24 h-24 text-blue-500" />
              <div className="mt-6 text-lg text-gray-600">
                Aucun Produit trouvé
              </div>
            </div>
          ) : (
            <>
              {/* Tableau des produits */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-20">Image</TableHead>
                      <TableHead>Désignation</TableHead>
                      <TableHead>Famille</TableHead>
                      <TableHead>Marque</TableHead>
                      <TableHead>Modèle</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProducts.map((product) => (
                      <TableRow
                        key={product.id_produit}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>
                          <ProductImage product={product} />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="max-w-xs">
                            <div
                              className="truncate"
                              title={product.desi_produit}
                            >
                              {product.desi_produit}
                            </div>
                            {product.code_produit && (
                              <div className="text-sm text-gray-500">
                                Réf: {product.code_produit}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {productFamilies.data.find(
                            (f) => f.id_famille === product.id_famille
                          )?.libelle_famille || "-"}
                        </TableCell>
                        <TableCell>
                          {productMarques.data.find(
                            (m) => m.id_marque === product.id_marque
                          )?.libelle_marque || "-"}
                        </TableCell>
                        <TableCell>
                          {productModels.data.find(
                            (m) => m.id_modele === product.id_modele
                          )?.libelle_modele || "-"}
                        </TableCell>

                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              product.qte_produit && product.qte_produit > 10
                                ? "bg-green-100 text-green-800"
                                : product.qte_produit && product.qte_produit > 0
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.qte_produit || 0}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewProduct(product)}
                              className="h-8 w-8 p-0 hover:bg-slate-100"
                              title="Voir les détails"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/gestion-des-outils-travail/creation-outils/${product.id_produit}/edit`
                                )
                              }
                              className="h-8 w-8 p-0 hover:bg-slate-100"
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProduct(product)}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Affichage de {startIndex + 1} à{" "}
                  {Math.min(endIndex, filteredProducts.length)} sur{" "}
                  {filteredProducts.length} résultats
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="h-8"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Précédent
                  </Button>

                  <div className="flex items-center space-x-1">
                    {/* Numéros de pages */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          variant={
                            currentPage === pageNumber ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          className="h-8 w-8 p-0"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages && !hasNextPage}
                    className="h-8"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Dialogue d'informations du produit */}
      <ProductInfoDialog
        open={showInfoDialog}
        onOpenChange={setShowInfoDialog}
        product={selectedProduct}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDeleteDialog
        showDeleteDialog={showDeleteDialog}
        id={productToDelete?.id_produit?.toString() ?? ""}
        setShowDeleteDialog={setShowDeleteDialog}
        deleteError={deleteError}
        handleSupprimer={handleConfirmDelete}
        isDeleting={deleteProduct.isLoading}
      />
    </div>
  );
}
