import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Package2,
  Barcode,
  Hash,
  Layers,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  MapPin,
  Settings,
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
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const images = product.images || [];
  const hasImages = images.length > 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleEdit = () => {
    onOpenChange(false);
    navigate(`${product.id_produit}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-slate-900">
              Détails de produit
            </DialogTitle>
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête produit */}
          <div className="flex items-start gap-6">
            {/* Carrousel d'images */}
            <div className="flex-shrink-0">
              <div className="relative">
                {hasImages ? (
                  <div className="relative w-48 h-48">
                    <img
                      src={
                        images[currentImageIndex]?.url ||
                        images[currentImageIndex]?.lien_image
                      }
                      alt={`${product.desi_produit} - Image ${
                        currentImageIndex + 1
                      }`}
                      className="w-full h-full object-cover rounded-lg border border-slate-200"
                    />

                    {/* Navigation du carrousel */}
                    {images.length > 1 && (
                      <>
                        <Button
                          onClick={prevImage}
                          variant="outline"
                          size="sm"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={nextImage}
                          variant="outline"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>

                        {/* Indicateurs */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex
                                  ? "bg-white"
                                  : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                    <Package2 className="w-12 h-12 text-slate-400" />
                  </div>
                )}
              </div>
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

              <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-2">
                <Hash className="w-4 h-4" />
                <span>
                  Quantité disponible:{" "}
                  <span className="font-medium">
                    {product.qte_produit || 0}
                  </span>
                </span>
              </div>

              {/* Prix si disponible */}
              {product.prix_produit && (
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <span className="font-medium text-green-600">
                    {product.prix_produit.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "XOF",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Informations détaillées */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                {product.categorie && (
                  <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-md">
                    <span className="text-sm text-slate-600">Catégorie</span>
                    <span className="text-sm font-medium text-slate-900">
                      {product.categorie}
                    </span>
                  </div>
                )}

                {product.type_produit && (
                  <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-md">
                    <span className="text-sm text-slate-600">Type</span>
                    <span className="text-sm font-medium text-slate-900">
                      {product.type_produit}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Informations techniques */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Informations techniques
              </h4>

              <div className="space-y-3">
                {product.emplacement_produit && (
                  <div className="flex items-start gap-2 py-2 px-3 bg-slate-50 rounded-md">
                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm text-slate-600 block">
                        Emplacement
                      </span>
                      <span className="text-sm font-medium text-slate-900">
                        {product.emplacement_produit}
                      </span>
                    </div>
                  </div>
                )}

                {product.caracteristiques_produit && (
                  <div className="py-2 px-3 bg-slate-50 rounded-md">
                    <span className="text-sm text-slate-600 block mb-1">
                      Caractéristiques
                    </span>
                    <p className="text-sm text-slate-900 leading-relaxed">
                      {product.caracteristiques_produit}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description si elle existe */}
          {(product.description || product.desc_produit) && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-3">
                  Description
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-md">
                  {product.description || product.desc_produit}
                </p>
              </div>
            </>
          )}

          {/* Métadonnées */}
          <Separator />
          <div className="flex items-center gap-4 text-xs text-slate-500 justify-between w-full">
            <div className="flex items-center gap-1 w-28">
              <Calendar className="w-3 h-3" />
              <span>ID: {product.id_produit}</span>
            </div>
            {product.created_at && (
              <div className="flex items-center gap-1 justify-between w-full">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Créé le{" "}
                    {new Date(product.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                {product.updated_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      mis à jour le{" "}
                      {new Date(product.updated_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductInfoDialog;
