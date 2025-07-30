import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package2,
  Barcode,
  Hash,
  Layers,
  Building2,
  Calendar,
} from "lucide-react";
import { ReferenceProduit } from "@/modules/stocks/types/reference";
import {
  useProductFamilies,
  useProductMarques,
  useProductModels,
} from "@/modules/stocks/reference/hooks/useOthers";

interface ProductInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ReferenceProduit | null;
}

const ProductInfoDialog: React.FC<ProductInfoDialogProps> = ({
  open,
  onOpenChange,
  product,
}) => {
  const { productFamilies } = useProductFamilies();
  const { productMarques } = useProductMarques();
  const { productModels } = useProductModels();

  if (!product) return null;

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

  const stockStatus = getStockStatus(product.qte_produit);

  const familyName = productFamilies.data.find(
    (f) => f.id_famille === product.id_famille
  )?.libelle_famille;

  const marqueName = productMarques.data.find(
    (m) => m.id_marque === product.id_marque
  )?.libelle_marque;

  const modelName = productModels.data.find(
    (m) => m.id_modele === product.id_modele
  )?.libelle_modele;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Détails du produit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête produit */}
          <div className="flex items-start gap-4">
            {/* Image */}
            <div className="flex-shrink-0">
              {product.images?.[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={product.desi_produit}
                  className="w-24 h-24 object-cover rounded-lg border border-slate-200"
                />
              ) : (
                <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                  <Package2 className="w-12 h-12 text-slate-400" />
                </div>
              )}
            </div>

            {/* Infos principales */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {product.desi_produit}
              </h3>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Barcode className="w-4 h-4" />
                  <span className="font-mono">{product.code_produit}</span>
                </div>
                <Badge className={stockStatus.className}>
                  {stockStatus.label}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Hash className="w-4 h-4" />
                <span>
                  Quantité en stock:{" "}
                  <span className="font-medium">
                    {product.qte_produit || 0}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informations détaillées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Classification */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Classification
              </h4>

              <div className="space-y-3">
                {familyName && (
                  <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-md">
                    <span className="text-sm text-slate-600">Famille</span>
                    <span className="text-sm font-medium text-slate-900">
                      {familyName}
                    </span>
                  </div>
                )}

                {marqueName && (
                  <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-md">
                    <span className="text-sm text-slate-600">Marque</span>
                    <span className="text-sm font-medium text-slate-900">
                      {marqueName}
                    </span>
                  </div>
                )}

                {modelName && (
                  <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-md">
                    <span className="text-sm text-slate-600">Modèle</span>
                    <span className="text-sm font-medium text-slate-900">
                      {modelName}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Informations techniques */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Informations techniques
              </h4>
            </div>
          </div>

          {/* Description si elle existe */}
          {product.description && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-3">
                  Description
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-md">
                  {product.description}
                </p>
              </div>
            </>
          )}

          {/* Métadonnées */}
          <Separator />
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>ID: {product.id_produit}</span>
            </div>
            {product.created_at && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  Créé le{" "}
                  {new Date(product.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductInfoDialog;
