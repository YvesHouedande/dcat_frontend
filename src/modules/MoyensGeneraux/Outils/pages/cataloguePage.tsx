import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Package, Search, Wrench } from "lucide-react";
import ReferenceCarte from "../components/ui/ReferenceCarte";
import { useProducts } from "../hooks/useProducts";
import Parametres from "@/modules/stocks/reference/components/ui/Parametres";
import ProductCatalogSkeleton from "@/components/skeleton/ProductCatalogSkeleton";
import {
  useProductCategories,
  useProductFamilies,
  useProductMarques,
  useProductModels,
} from "@/modules/stocks/reference/hooks/useOthers";
import { Skeleton } from "@/components/ui/skeleton";

export default function CataloguePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modelFilter, setModelFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [familyFilter, setFamilyFilter] = useState("all");
  const [productTypeFilter, setProductTypeFilter] = useState("all");
  const navigate = useNavigate();

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

  const { productCategories } = useProductCategories();
  const { productFamilies } = useProductFamilies();
  const { productMarques } = useProductMarques();
  const { productModels } = useProductModels();

  console.log("produits", productsQuery.data);

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

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target); // utilise la variable capturée
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
              }}
              className="h-9 whitespace-nowrap"
            >
              Réinitialiser les filtres
            </Button>
            <Parametres />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {productCategories.data.map((category) => (
                <SelectItem
                  key={category.id_categorie}
                  value={String(category.id_categorie)}
                >
                  {category.libelle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={familyFilter} onValueChange={setFamilyFilter}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Famille" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes familles</SelectItem>
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

      <div className="text-sm text-gray-500 p-2">
        {filteredProducts.length} produits
      </div>

      {productsQuery.isLoading && !isFetchingNextPage ? (
        <ProductCatalogSkeleton />
      ) : (
        <>
          {filteredProducts.length === 0 && (
            <div className="flex w-full h-full flex-col justify-center items-center">
              <Package className="w-24 h-24 text-blue-500" />
              <div className="mt-6">Aucun Produit trouvé</div>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredProducts.map((product) => (
              <ReferenceCarte key={product.id_produit} product={product} />
            ))}
          </div>
          {/* Pagination Skeleton */}
          {isFetchingNextPage && (
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          )}
          {!hasNextPage && allProducts.length > 0 && (
            <div className="text-center text-gray-500 mt-4">
              Fin de la liste
            </div>
          )}
        </>
      )}

      {/* Sentinelle pour scroll infini */}
      {hasNextPage && <div ref={loadMoreRef} className="h-1" />}
    </div>
  );
}
