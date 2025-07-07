import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReferenceProduit } from "@/modules/stocks/types/reference";
import { useNavigate } from "react-router-dom";
import { ExemplaireProduitForm } from "@/modules/stocks/exemplaire";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExemplaireSortieForm } from "../../sorties/components/ExemplaireSortieForm";
import { ExemplaireSortieFormValues } from "../../sorties/types";
import { useExemplaireSorties } from "../../sorties/hooks/useExemplaireSorties";
import { UseFormReturn } from "react-hook-form";
import { ExemplaireProduitFormValues } from "@/modules/stocks/exemplaire";
import { Package, Plus, ShoppingCart, Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReferenceCarteProps {
  product: ReferenceProduit;
}

function ReferenceCarte({ product }: ReferenceCarteProps) {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormSortieOpen, setIsSortieFormOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const closeSortieForm = () => {
    setIsSortieFormOpen(false);
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

  const { createExemplaireSortie } = useExemplaireSorties();

  const handleSubmit = async (data: ExemplaireSortieFormValues) => {
    await createExemplaireSortie(data);
    closeForm();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getStockStatus = (quantity: number | undefined) => {
    if (!quantity || quantity <= 0) {
      return { color: "bg-red-100 text-red-700", label: "Indisponible" };
    } else if (quantity <= 3) {
      return { color: "bg-orange-100 text-orange-700", label: "Stock faible" };
    } else {
      return { color: "bg-green-100 text-green-700", label: "Disponible" };
    }
  };

  const stockStatus = getStockStatus(product.qte_produit);

  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un exemplaire d'outils</DialogTitle>
          </DialogHeader>
          <ExemplaireProduitForm
            initialData={{
              id_produit: String(product.id_produit),
              etat_exemplaire: "Bon",
            }}
            ref={formRef}
            onCancel={closeForm}
            onSuccess={handleFormSuccess}
            isTools={true}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isFormSortieOpen} onOpenChange={setIsSortieFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter une sortie d'outil</DialogTitle>
          </DialogHeader>
          <ExemplaireSortieForm
            onSubmit={handleSubmit}
            onCancel={closeSortieForm}
            defaultValues={{
              id_exemplaire: Number(product.id_produit),
              id_employes: 0,
              but_usage: "",
              etat_avant: "",
              date_de_sortie: "",
              site_intervention: "",
              commentaire: "",
            }}
            isEditMode={false}
          />
        </DialogContent>
      </Dialog>

      <Card className="group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 ease-out transform hover:-translate-y-1 cursor-pointer rounded-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Image Section */}
        <div className="relative h-48 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
          {!imageError && product.images?.[0]?.url ? (
            <div className="w-full h-full p-4 flex items-center justify-center">
              <img
                src={product.images[0].url}
                alt={product.images[0].libelle_image || product.desi_produit}
                className="max-w-full max-h-full object-contain transition-all duration-500 group-hover:scale-105"
                onError={handleImageError}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500">Aucune image</p>
              </div>
            </div>
          )}

          {/* Stock Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge
              className={`${stockStatus.color} text-xs font-medium shadow-lg`}
            >
              {stockStatus.label}
            </Badge>
          </div>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
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
        <div className="relative p-5 space-y-3">
          {/* Product Info */}
          <div className="space-y-2">
            <CardTitle className="text-lg font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-300">
              {product.desi_produit}
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                {product.code_produit}
              </span>
            </div>
          </div>

          {/* Stock Info */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              <span className="font-medium">{product.qte_produit || 0}</span>{" "}
              exemplaire{(product.qte_produit || 0) > 1 ? "s" : ""}
            </div>
            <div className="text-xs text-slate-500">
              {product.emplacement_produit}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            <Badge
              variant="outline"
              className="text-xs px-2 py-1 border-slate-200 text-slate-600 bg-white/50"
            >
              {product.type_produit}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsFormOpen(true);
              }}
              size="sm"
              className="flex-1 h-9 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 border-slate-200 hover:bg-slate-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => navigate(`${product.id_produit}`)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Voir les détails
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setIsFormOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter exemplaire
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    toast.info("Fonctionnalité de sortie à venir");
                  }}
                  className="text-orange-600 focus:text-orange-600"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Sortie
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Corner Accent */}
        <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full" />
      </Card>
    </>
  );
}

export default ReferenceCarte;
