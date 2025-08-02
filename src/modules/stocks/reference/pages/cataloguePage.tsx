import { useState, useEffect, useRef } from "react";
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
import ReferenceCarte from "@/modules/stocks/reference/components/ui/ReferenceCarte";
import { useProducts } from "../hooks/useProducts";
import {
  useProductFamilies,
  useProductMarques,
  useProductModels,
} from "../hooks/useOthers";
import ProductCatalogSkeleton from "../../../../components/skeleton/ProductCatalogSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import Parametres from "../components/ui/Parametres";
import SocialShareButton from "@/modules/marketing-commercial/marketing/components/SocialShareButton";
import { Label } from "@/components/ui/label";

interface CataloguePageProps {
  showSocialSharing?: boolean;
}

export default function CataloguePage({
  showSocialSharing = false,
}: CataloguePageProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [marqueId, setMarqueId] = useState<string | null>(null);
  const [familyFilter, setFamilyFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [qteMax, setQteMax] = useState<number | null>(null);
  const [qteMin, setQteMin] = useState<number | null>(null);
  const [prixMax, setPrixMax] = useState<number | null>(null);
  const [prixMin, setPrixMin] = useState<number | null>(null);

  const navigate = useNavigate();

  const {
    products: productsQuery,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts({
    searchTerm: searchTerm || undefined,
    modeleLibelle: modelFilter !== "all" ? modelFilter : undefined,
    marqueLibelle: brandFilter !== "all" ? brandFilter : undefined,
    familleLibelle: familyFilter !== "all" ? familyFilter : undefined,
    sortOrder,
    qteMax,
    qteMin,
    prixMax,
    prixMin,
  });
  const { productFamilies } = useProductFamilies();
  const { productMarques } = useProductMarques();
  const { modelesByMarque } = useProductModels(
    undefined,
    marqueId && marqueId !== "all" ? marqueId : undefined
  );

  const allProducts =
    productsQuery.data?.pages?.flatMap((page) => page.data) || [];
  const filteredProducts = allProducts;

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Réinitialiser le filtre modèle quand la marque change
  useEffect(() => {
    if (marqueId === null) {
      setModelFilter("all");
    } else {
      // Réinitialiser le modèle car les modèles disponibles ont changé
      setModelFilter("all");
    }
  }, [marqueId]);

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
        <h1 className="text-2xl font-bold">Catalogue des Produits</h1>
        {!showSocialSharing && (
          <Button
            onClick={() => {
              navigate("nouveau");
            }}
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            <Wrench size={16} className="mr-2" />
            Ajouter
          </Button>
        )}
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
                setFamilyFilter("all");
                setModelFilter("all");
                setBrandFilter("all");
                setMarqueId(null);
                setQteMax(null);
                setQteMin(null);
                setPrixMax(null);
                setPrixMin(null);
              }}
              className="h-9 whitespace-nowrap"
              style={{ display: showSocialSharing ? "none" : undefined }}
            >
              Réinitialiser les filtres
            </Button>
            {!showSocialSharing && <Parametres />}
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
                  value={family.libelle_famille}
                >
                  {family.libelle_famille}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={brandFilter}
            onValueChange={(value) => {
              setBrandFilter(value);
              // Trouver l'ID de la marque correspondant au libellé sélectionné
              if (value === "all" || value === null) {
                setMarqueId(null);
              } else {
                const selectedMarque = productMarques.data.find(
                  (brand) => brand.libelle_marque === value
                );
                setMarqueId(
                  selectedMarque ? String(selectedMarque.id_marque) : null
                );
              }
            }}
          >
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Marque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes marques</SelectItem>
              {productMarques.data.map((brand) => (
                <SelectItem key={brand.id_marque} value={brand.libelle_marque}>
                  {brand.libelle_marque}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={modelFilter}
            onValueChange={setModelFilter}
            disabled={marqueId === null}
          >
            <SelectTrigger className="w-40 h-9">
              <SelectValue
                placeholder={
                  marqueId === null
                    ? "Sélectionnez d'abord une marque"
                    : "Modèle"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous modèles</SelectItem>
              {modelesByMarque.data?.map((model) => (
                <SelectItem key={model.id_modele} value={model.libelle_modele}>
                  {model.libelle_modele}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
          >
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Ordre de tri" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Prix croissant</SelectItem>
              <SelectItem value="desc">Prix décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2 border py-4 px-1 rounded-md bg-gray-50">
          <div className="flex gap-2">
            <Label>Quantité min</Label>
            <Input
              type="number"
              value={qteMin || ""}
              onChange={(e) => setQteMin(Number(e.target.value))}
              min={0}
            ></Input>
          </div>
          <div className="flex gap-2">
            <Label>Quantité max</Label>
            <Input
              type="number"
              value={qteMax || ""}
              onChange={(e) => setQteMax(Number(e.target.value))}
              min={0}
            ></Input>
          </div>
          <div className="flex gap-2">
            <Label>Prix min</Label>
            <Input
              type="number"
              value={prixMin || ""}
              onChange={(e) => setPrixMin(Number(e.target.value))}
              min={0}
            ></Input>
          </div>
          <div className="flex gap-2">
            <Label>Prix max</Label>
            <Input
              type="number"
              value={prixMax || ""}
              onChange={(e) => setPrixMax(Number(e.target.value))}
              min={0}
            ></Input>
          </div>
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
              <div key={product.id_produit} className="relative">
                <ReferenceCarte product={product} />
                {showSocialSharing && (
                  <div className="mt-2 flex justify-center">
                    <SocialShareButton
                      product={{
                        name: product.desi_produit,
                        description: product.desc_produit || "",
                        url:
                          window.location.origin +
                          "/produit/" +
                          product.id_produit,
                        image:
                          product.images?.[0]?.url || product.imagesMeta || "",
                      }}
                    />
                  </div>
                )}
              </div>
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
