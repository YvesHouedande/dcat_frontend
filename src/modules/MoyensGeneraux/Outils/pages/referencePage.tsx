import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, Edit } from "lucide-react";
import { ReferenceProduit } from "@/modules/stocks/types/reference";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AlertDeleteDialog from "@/components/AlertDeleteDialog";
import { ProductInstanceDashboard } from "../exemplaire";

// Fonction utilitaire pour l'état du stock
const getStockStatus = (quantity: number) => {
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
    image_produit: "/images/products/lcd_screen.jpg",
    id_categorie: 1,
    id_modele: 1,
    id_marque: 1,
    id_famille: 1,
    qte_produit: 0,
    id_type_produit: 0,
    emplacement: "",
    caracteristiques: "Résolution 1920x1080, Temps de réponse 5ms",
  };

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
      navigate("/stocks/references");
    } catch (error) {
      setDeleteError("La suppression a échoué. Veuillez réessayer.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full py-6">
      <div className="max-w-4xl">
        {/* En-tête minimaliste */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium">{product.desi_produit}</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/moyens-generaux/outils/${id}/edit`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        <Card className="overflow-hidden">
          <div className="grid grid-cols-3 gap-0">
            {/* Image */}
            <div className="bg-gray-50 aspect-square flex items-center justify-center p-4">
              <img
                src={product.image_produit}
                alt={product.desi_produit}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Informations essentielles */}
            <div className="col-span-2 p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">
                    {product.code_produit}
                  </p>
                  <Badge
                    variant={getStockStatus(product.qte_produit).variant}
                    className="mt-1"
                  >
                    {product.qte_produit} en stock
                  </Badge>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="text-sm">
                <p>{product.desc_produit}</p>
              </div>

              <Separator className="my-2" />

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-500">Caractéristiques</div>
                <div>{product.caracteristiques}</div>

                <div className="text-gray-500">Emplacement</div>
                <div>{product.emplacement || "Non défini"}</div>

                <div className="text-gray-500">Catégorie</div>
                <div>{product.id_categorie}</div>

                <div className="text-gray-500">Marque</div>
                <div>{product.id_marque}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <ProductInstanceDashboard id_outil={id} />
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
