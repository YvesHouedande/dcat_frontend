import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, Edit, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AlertDeleteDialog from "@/components/AlertDeleteDialog";

import {
  useDeleteProduct,
  useProduct,
} from "@/modules/stocks/reference/hooks/useProducts";
import ProductImageManager from "@/modules/stocks/reference/components/ProductImageManager";
import ProductDetails from "@/modules/stocks/reference/components/ProductDetails";
import ProductClassification from "@/modules/stocks/reference/components/ProductClassification";

// Fonction utilitaire pour l'état du stock
const getStockStatus = (quantity: number | undefined) => {
  if (!quantity || quantity <= 0) {
    return {
      label: "Indisponible",
      variant: "destructive" as const,
      color: "text-red-600",
    };
  } else if (quantity <= 3) {
    return {
      label: "Stock faible",
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
      label: "Disponible",
      variant: "success" as const,
      color: "text-green-600",
    };
  }
};

export default function ReferencePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { product } = useProduct(id);
  const productData = product.data;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  
  const { delete: deleteProduct } = useDeleteProduct();
  

  const stockStatus = getStockStatus(productData?.qte_produit);

  const handleSupprimer = async (id: string | number) => {
    if (id === undefined || id === null || id === "") return;
    await deleteProduct.mutateAsync(Number(id), {
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
        {/* Header */}
        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
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
                onClick={() => navigate(`edit`)}
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
          {/* Colonne gauche - Images */}
          <div className="lg:col-span-5">
            <ProductImageManager
              images={productData?.images}
              productName={productData?.desi_produit}
            />
          </div>

          {/* Colonne droite - Infos */}
          <div className="lg:col-span-7 space-y-6">
            <ProductDetails product={productData} />
            <ProductClassification product={productData} />
          </div>
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
