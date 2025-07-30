import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package2, Barcode, Hash, Info } from "lucide-react";
import { useParams } from "react-router-dom";
import { useProduct } from "@/modules/stocks/reference/hooks/useProducts";

interface ReferenceInfoProps {
  className?: string;
}

const ReferenceInfo: React.FC<ReferenceInfoProps> = ({ className = "" }) => {
  const { id } = useParams<{ id: string }>();
  const { product: productQuery } = useProduct(id);
  const product = productQuery.data;
  const getStockStatus = (quantity: number | undefined) => {
    if (!quantity || quantity <= 0) {
      return {
        label: "Indisponible",
        className: "bg-slate-100 text-slate-700",
      };
    } else if (quantity <= 3) {
      return {
        label: "Stock critique",
        className: "bg-orange-50 text-orange-700 border border-orange-200",
      };
    } else if (quantity <= 10) {
      return {
        label: "Stock faible",
        className: "bg-amber-50 text-amber-700 border border-amber-200",
      };
    } else {
      return {
        label: "En stock",
        className: "bg-green-50 text-green-700 border border-green-200",
      };
    }
  };

  const stockStatus = getStockStatus(product?.qte_produit);

  if (!product) return <div>Produit non trouvé</div>;

  return (
    <Card className={`border-slate-200 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Informations de référence
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* En-tête avec image et info principale */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {product?.images?.[0]?.url ? (
              <img
                src={product?.images[0].url}
                alt={product?.desi_produit}
                className="w-16 h-16 object-cover rounded-lg border border-slate-200"
              />
            ) : (
              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                <Package2 className="w-8 h-8 text-slate-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-slate-900 mb-2 truncate">
              {product?.desi_produit}
            </h3>

            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <Barcode className="w-3 h-3" />
                <span className="font-mono text-xs">
                  {product?.code_produit}
                </span>
              </div>
              <Badge className={stockStatus.className} variant="outline">
                {stockStatus.label}
              </Badge>
            </div>

            <div className="flex items-center gap-1 text-sm text-slate-600">
              <Hash className="w-3 h-3" />
              <span>
                Stock:{" "}
                <span className="font-medium">{product?.qte_produit || 0}</span>
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Informations détaillées */}
        <div className="space-y-3">
          <div className="flex justify-between items-center py-1">
            <span className="text-sm text-slate-600">Emplacement</span>
            <span className="text-sm font-medium text-slate-900">
              {product?.emplacement_produit || "Non défini"}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-sm text-slate-600">ID Produit</span>
            <span className="text-sm font-mono text-slate-900">
              #{product?.id_produit}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-sm text-slate-600">Quantité disponible</span>
            <span className="text-sm font-medium text-slate-900">
              {product?.qte_produit || 0} unité(s)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferenceInfo;
