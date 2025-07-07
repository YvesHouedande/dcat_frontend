import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Trash2,
  Edit,
  ArrowLeft,
  Package,
  Info,
  Tag,
  MapPin,
  BarChart3,
} from "lucide-react";
import { ReferenceProduit } from "@/modules/stocks/types/reference";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AlertDeleteDialog from "@/components/AlertDeleteDialog";
import { ExemplaireOutilsDashboard } from "../exemplaire";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Exemple de données
  const product: ReferenceProduit = {
    id_produit: id,
    code_produit: "CP123456",
    desi_produit: "Écran LCD 24 pouces",
    desc_produit: "Écran LCD haute résolution 1080p avec ports HDMI et VGA",
    imagesMeta: "/images/products/lcd_screen.jpg",
    id_categorie: 1,
    id_modele: 1,
    id_marque: 1,
    id_famille: 1,
    qte_produit: 0,
    id_type_produit: 0,
    emplacement_produit: "Rayon A - Étage 2",
    caracteristiques:
      "Résolution 1920x1080, Temps de réponse 5ms, Ports HDMI/VGA",
  };

  const stockStatus = getStockStatus(product.qte_produit);

  const handleSupprimer = async (id: string | number) => {
    if (!id) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/references/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      setShowDeleteDialog(false);
      navigate("/moyens-generaux/outils");
    } catch (error) {
      setDeleteError("La suppression a échoué. Veuillez réessayer. " + error);
    } finally {
      setIsDeleting(false);
    }
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
              onClick={() => navigate("/moyens-generaux/outils")}
              className="hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">
                {product.desi_produit}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">
                  {product.code_produit}
                </span>
                <Badge variant={stockStatus.variant} className="text-xs">
                  {stockStatus.label}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/moyens-generaux/outils/${id}/edit`)}
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
          {/* Colonne de gauche - Image */}
          <div className="lg:col-span-5">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <Package className="h-5 w-5 text-blue-600" />
                  Image du produit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                  {product.images?.[0]?.lien_image ? (
                    <img
                      src={product.images[0].lien_image}
                      alt={product.desi_produit}
                      className="max-w-full max-h-full object-contain p-4 rounded-xl"
                    />
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center shadow-lg">
                        <Package className="w-10 h-10 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">
                          Aucune image
                        </p>
                        <p className="text-xs text-slate-400">
                          Image non disponible
                        </p>
                      </div>
                    </div>
                  )}
                </div>
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
                      {product.qte_produit || 0}
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
                    {product.desc_produit || "Aucune description disponible"}
                  </p>
                </div>

                <Separator className="bg-slate-200" />

                {/* Caractéristiques */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">
                    Caractéristiques
                  </p>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">
                    {product.caracteristiques ||
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
                      {product.id_categorie || "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Modèle
                    </p>
                    <p className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">
                      {product.id_modele || "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Marque
                    </p>
                    <p className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">
                      {product.id_marque || "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Famille
                    </p>
                    <p className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">
                      {product.id_famille || "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Type
                    </p>
                    <p className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">
                      {product.id_type_produit || "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Emplacement
                    </p>
                    <p className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {product.emplacement_produit || "Non défini"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dashboard des exemplaires */}
        <div className="mt-8">
          <ExemplaireOutilsDashboard id_outil={id} />
        </div>

        {/* Dialog de suppression */}
        <AlertDeleteDialog
          showDeleteDialog={showDeleteDialog}
          id={id ?? ""}
          setShowDeleteDialog={setShowDeleteDialog}
          deleteError={deleteError}
          handleSupprimer={handleSupprimer}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
