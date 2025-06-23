import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AlertDeleteDialog from "@/components/AlertDeleteDialog";
import { useProducts } from "../hooks/useProducts";
import { ImageProduit } from "@/modules/stocks/types/reference";
import { ProductInstanceDashboard } from "../../exemplaire";
// Ajoutez cette fonction utilitaire en haut du fichier
const getStockStatus = (quantity: number | undefined) => {
  if (quantity === undefined) {
    return { label: "Non défini", variant: "default" as const };
  }
  if (quantity <= 0) {
    return { label: "Épuisé", variant: "destructive" as const };
  } else if (quantity <= 5) {
    return { label: "Presque épuisé", variant: "secondary" as const };
  } else if (quantity <= 10) {
    return { label: "Stock limité", variant: "secondary" as const };
  } else {
    return { label: "En stock", variant: "success" as const };
  }
};

// Composant Carrousel
const ImageCarousel = ({
  images,
  productName,
}: {
  images?: ImageProduit[];
  productName?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Si pas d'images, afficher un placeholder
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-lg  border-gray-200 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Aucune image disponible</p>
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
    <div className="relative">
      {/* Image principale */}
      <div className="aspect-square rounded-lg overflow-hidden relative  border-gray-200 flex items-center justify-center group">
        <img
          src={images[currentIndex]?.url}
          alt={`${productName ?? "Produit"} - Image ${currentIndex + 1}`}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay gradient pour les boutons */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Boutons de navigation - affichés seulement s'il y a plus d'une image */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Indicateur du nombre d'images */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Indicateurs (dots) - affichés seulement s'il y a plus d'une image */}
      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-blue-600 scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}

      {/* Miniatures - affichées seulement s'il y a plus d'une image */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                index === currentIndex
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-400"
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { product } = useProducts(id);

  // Sécuriser l'accès aux données produit
  const productData = product.data;

  const handleSupprimer = async (id: string | number) => {
    if (id === undefined || id === null || id === "") return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/references/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Ajouter un petit délai pour l'animation de succès
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      // Fermer le dialogue et rediriger uniquement en cas de succès
      setShowDeleteDialog(false);
      navigate("/stocks/references");
    } catch (error) {
      setDeleteError("La suppression a échoué. Veuillez réessayer." + error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header avec navigation et actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{productData?.desi_produit}</h1>
            <p className="text-sm text-muted-foreground">
              Référence: {productData?.code_produit}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() =>
              navigate(`/stocks/references/${id}/edit`, {
                state: {
                  product: productData,
                },
              })
            }
            className="cursor-pointer"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Nouvelle organisation du contenu principal */}
      <div className="grid grid-cols-12 gap-6">
        {/* Colonne de gauche - Carrousel d'images */}
        <div className="col-span-12 md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Images du produit</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageCarousel
                images={productData?.image_produit}
                productName={productData?.desi_produit}
              />
            </CardContent>
          </Card>
        </div>

        {/* Colonne de droite - les examplaire du produit */}
        <div className="col-span-12 md:col-span-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Informations du produit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* État du stock et Quantité */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">
                    Quantité en stock
                  </p>
                  <p className="text-2xl font-bold">
                    {productData?.qte_produit ?? "Non défini"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">
                    État du stock
                  </p>
                  <Badge
                    variant={getStockStatus(productData?.qte_produit).variant}
                  >
                    {getStockStatus(productData?.qte_produit).label}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-base">{productData?.desc_produit ?? "—"}</p>
              </div>

              <Separator />

              {/* Caractéristiques */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  Caractéristiques
                </p>
                <p className="text-base">
                  {productData?.caracteristiques ?? "—"}
                </p>
              </div>

              <Separator />

              {/* Classifications */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-4">
                  Classifications
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Catégorie
                    </p>
                    <p className="mt-1">{productData?.categorie ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Modèle</p>
                    <p className="mt-1">{productData?.modele ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Marque</p>
                    <p className="mt-1">{productData?.marque ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Famille</p>
                    <p className="mt-1">{productData?.famille ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Type de produit
                    </p>
                    <p className="mt-1">{productData?.type_produit ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Emplacement
                    </p>
                    <p className="mt-1">
                      {productData?.emplacement_produit ?? "Non défini"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ProductInstanceDashboard produitId={id} />
      <AlertDeleteDialog
        showDeleteDialog={showDeleteDialog}
        id={id ?? ""}
        setShowDeleteDialog={setShowDeleteDialog}
        deleteError={deleteError}
        handleSupprimer={handleSupprimer}
        isDeleting={isDeleting}
      />
      
    </div>
  );
}
