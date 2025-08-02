import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { ReferenceProduit } from "@/modules/stocks/types/reference";

import { Package } from "lucide-react";
import { useState } from "react";
import ProductInfoDialog from "../ProductInfoDialog";

interface ReferenceCarteProps {
  product: ReferenceProduit;
}

function ReferenceCarte({ product }: ReferenceCarteProps) {
  const [imageError, setImageError] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <Card
        onClick={() => {
          setShowInfoDialog(true);
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
        </div>

        {/* Corner Accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full" />
      </Card>
      {/* Dialogue d'informations du produit */}
      <ProductInfoDialog
        open={showInfoDialog}
        onOpenChange={setShowInfoDialog}
        product={product}
      />
    </>
  );
}

export default ReferenceCarte;
