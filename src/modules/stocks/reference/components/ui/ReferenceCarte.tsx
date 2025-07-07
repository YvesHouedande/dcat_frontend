import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReferenceProduit } from "@/modules/stocks/types/reference";
import { useNavigate } from "react-router-dom";
import {
  ExemplaireProduitForm,
  ExemplaireProduitFormValues,
} from "@/modules/stocks/exemplaire";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { Package, Plus, Eye, ShoppingCart } from "lucide-react";

interface ReferenceCarteProps {
  product: ReferenceProduit;
}

function ReferenceCarte({ product }: ReferenceCarteProps) {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const formRef = useRef<UseFormReturn<ExemplaireProduitFormValues>>(null);
  const handleFormSuccess = () => {
    if (formRef.current) {
      toast.success(
        `Exemplaire "${formRef.current.getValues(
          "num_serie"
        )}" ajouté avec succès`,
        {
          duration: 2000,
        }
      );
      formRef.current.setValue("num_serie", "");
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un exemplaire de produit</DialogTitle>
          </DialogHeader>
          <ExemplaireProduitForm
            initialData={{
              id_produit: String(product.id_produit),
            }}
            ref={formRef}
            onCancel={closeForm}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>

      <Card
        onClick={(e) => {
          e.stopPropagation();
          navigate(`${product.id_produit}`);
        }}
        className="group relative overflow-hidden bg-white border-0 shadow-sm hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 cursor-pointer rounded-xl"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Image Section */}
        <div className="relative h-52 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
          {!imageError && product.images?.[0]?.url ? (
            <div className="w-full h-full p-6 flex items-center justify-center">
              <img
                src={product.images[0].url}
                alt={product.images[0].libelle_image || product.desi_produit}
                className="max-w-full max-h-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                onError={handleImageError}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Package className="w-20 h-20 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Aucune image</p>
              </div>
            </div>
          )}

          {/* Stock Indicator */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg border border-white/20">
              {product.qte_produit &&
              product.qte_produit <= 3 &&
              product.qte_produit > 0 ? (
                <span className="text-orange-500">
                  En rupture ({product.qte_produit})
                </span>
              ) : product.qte_produit && product.qte_produit > 0 ? (
                <span className="text-sm font-semibold text-slate-700">
                  {product.qte_produit} en stock
                </span>
              ) : (
                <span className="text-sm font-semibold text-slate-700">
                  {product.qte_produit} en stock
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 border-0 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`${product.id_produit}`);
                }}
              >
                <Eye className="w-4 h-4 mr-1" />
                Voir
              </Button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative p-6 space-y-4">
          {/* Product Info */}
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-300">
              {product.desi_produit}
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                {product.code_produit}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="text-xs px-3 py-1 border-slate-200 text-slate-600 bg-white/50 backdrop-blur-sm"
            >
              📍 {product.emplacement_produit}
            </Badge>
            <Badge
              variant="secondary"
              className="text-xs px-3 py-1 bg-blue-100 text-blue-700 border-0"
            >
              🏷️ {product.type_produit}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                toast.info(
                  "La fonctionnalité de sortie n'est pas encore implémentée."
                );
              }}
              variant="outline"
              size="sm"
              className="flex-1 h-10 text-sm font-medium border-slate-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all duration-300 bg-white/50 backdrop-blur-sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Sortie
            </Button>
            <Button
              size="sm"
              className="flex-1 h-10 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={(e) => {
                e.stopPropagation();
                setIsFormOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </div>

        {/* Corner Accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full" />
      </Card>
    </>
  );
}

export default ReferenceCarte;
