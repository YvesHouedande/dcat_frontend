import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Package,
  Info,
  Tag,
  MapPin,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AlertDeleteDialog from "@/components/AlertDeleteDialog";
import { useProducts } from "../hooks/useProducts";
import { ImageProduit } from "@/modules/stocks/types/reference";
import { ExemplaireProduitDashboard } from "../../exemplaire";

// Fonction utilitaire pour le statut du stock
const getStockStatus = (quantity: number | undefined) => {
  if (quantity === undefined) {
    return {
      label: "Non défini",
      variant: "default" as const,
      color: "text-gray-500",
    };
  }
  if (quantity <= 0) {
    return {
      label: "Épuisé",
      variant: "destructive" as const,
      color: "text-red-600",
    };
  } else if (quantity <= 5) {
    return {
      label: "Presque épuisé",
      variant: "secondary" as const,
      color: "text-orange-600",
    };
  } else if (quantity <= 10) {
    return {
      label: "Stock limité",
      variant: "secondary" as const,
      color: "text-yellow-600",
    };
  } else {
    return {
      label: "En stock",
      variant: "success" as const,
      color: "text-green-600",
    };
  }
};

// Composant Carrousel amélioré
const ImageCarousel = ({
  images,
  productName,
}: {
  images?: ImageProduit[];
  productName?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Si pas d'images, afficher un placeholder moderne
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 group hover:border-slate-300 transition-all duration-300">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center shadow-lg">
            <Package className="w-10 h-10 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Aucune image</p>
            <p className="text-xs text-slate-400">Image non disponible</p>
          </div>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Image principale */}
      <div className="relative group">
        <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-lg">
          <img
            src={images[currentIndex]?.url}
            alt={`${productName ?? "Produit"} - Image ${currentIndex + 1}`}
            className="w-full h-full object-contain p-4 transition-all duration-500 group-hover:scale-105"
          />
        </div>

        {/* Overlay avec gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl" />

        {/* Boutons de navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 rounded-full p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-white/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 rounded-full p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-white/20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Indicateur du nombre d'images */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Indicateurs (dots) */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-blue-600 scale-125 shadow-lg"
                  : "bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      )}

      {/* Miniatures */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-sm hover:shadow-md ${
                index === currentIndex
                  ? "border-blue-600 ring-2 ring-blue-200 shadow-lg"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <img
                src={image.url}
                alt={`Miniature ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ReferencePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { product, delete: deleteProduct } = useProducts({}, id);
  const productData = product.data;
  const stockStatus = getStockStatus(productData?.qte_produit);

  const handleSupprimer = async (id: string | number) => {
    if (id === undefined || id === null || id === "") return;
    await deleteProduct.mutateAsync(String(id), {
      onSuccess: () => {
        setShowDeleteDialog(false);
        navigate("/stocks/references");
      },
      onError: (error) => {
        setDeleteError(
          "La suppression a échoué. Veuillez réessayer. Erreur: " + error
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header moderne */}
        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/stocks/references")}
              className="hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">
                {productData?.desi_produit}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">
                  {productData?.code_produit}
                </span>
                <Badge variant={stockStatus.variant} className="text-xs">
                  {stockStatus.label}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/stocks/references/${id}/edit`)}
                className="border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Colonne de gauche - Images */}
          <div className="lg:col-span-5">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <Package className="h-5 w-5 text-blue-600" />
                  Galerie d'images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageCarousel
                  images={productData?.images}
                  productName={productData?.desi_produit}
                />
              </CardContent>
            </Card>
          </div>

          {/* Colonne de droite - Informations */}
          <div className="lg:col-span-7 space-y-6">
            {/* État du stock */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  État du stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <p className="text-sm font-medium text-blue-600 mb-2">
                      Quantité
                    </p>
                    <p className="text-3xl font-bold text-blue-700">
                      {productData?.qte_produit ?? "—"}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <p className="text-sm font-medium text-green-600 mb-2">
                      Statut
                    </p>
                    <p className={`text-lg font-semibold ${stockStatus.color}`}>
                      {stockStatus.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description et caractéristiques */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <Info className="h-5 w-5 text-purple-600" />
                  Détails du produit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">
                    Description
                  </p>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">
                    {productData?.desc_produit ??
                      "Aucune description disponible"}
                  </p>
                </div>

                <Separator className="bg-slate-200" />

                {/* Caractéristiques */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">
                    Caractéristiques
                  </p>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">
                    {productData?.caracteristiques ??
                      "Aucune caractéristique disponible"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Classifications */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <Tag className="h-5 w-5 text-orange-600" />
                  Classifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Catégorie
                    </p>
                    <p className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">
                      {productData?.categorie ?? "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Modèle
                    </p>
                    <p className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">
                      {productData?.modele ?? "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Marque
                    </p>
                    <p className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">
                      {productData?.marque ?? "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Famille
                    </p>
                    <p className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">
                      {productData?.famille ?? "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Type
                    </p>
                    <p className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">
                      {productData?.type_produit ?? "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Emplacement
                    </p>
                    <p className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {productData?.emplacement_produit ?? "Non défini"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dashboard des exemplaires */}
        <div className="mt-8">
          <ExemplaireProduitDashboard produitId={id} />
        </div>

        {/* Dialog de suppression */}
        <AlertDeleteDialog
          showDeleteDialog={showDeleteDialog}
          id={id ?? ""}
          setShowDeleteDialog={setShowDeleteDialog}
          deleteError={deleteError}
          handleSupprimer={handleSupprimer}
          isDeleting={deleteProduct.isLoading}
        />
      </div>
    </div>
  );
}
