import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, Edit } from "lucide-react";
import { ReferenceProduit } from "../../types/reference";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AlertDeleteDialog from "@/components/AlertDeleteDialog";

// Ajoutez cette fonction utilitaire en haut du fichier
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

  // Exemple de données avec l'interface ReferenceProduit
  const product: ReferenceProduit = {
    id_produit: "REF001",
    code_produit: "CP123456",
    desi_produit: "Écran LCD 24 pouces",
    desc_produit: "Écran LCD haute résolution 1080p avec ports HDMI et VGA",
    image_produit: "/images/products/lcd_screen.jpg",
    categorie: "CAT001",
    type_produit: "TYPE001",
    modele: "MOD123",
    marque: "BRAND05",
    famille: "FAM22",
    qte_produit: 0,
    emplacement: "",
    caracteristiques: "Résolution 1920x1080, Temps de réponse 5ms",
  };

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
      // En cas d'erreur, on met à jour le message d'erreur mais on ne ferme pas le dialogue
      setDeleteError("La suppression a échoué. Veuillez réessayer.");
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
            <h1 className="text-2xl font-bold">{product.desi_produit}</h1>
            <p className="text-sm text-muted-foreground">
              Référence: {product.code_produit}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/stocks/references/${id}/edit`)}
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
        {/* Colonne de gauche - Image uniquement */}
        <div className="col-span-12 md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                <img
                  src={product.image_produit}
                  alt={product.desi_produit}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne de droite - Toutes les informations */}
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
                  <p className="text-2xl font-bold">{product.qte_produit}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">
                    État du stock
                  </p>
                  <Badge variant={getStockStatus(product.qte_produit).variant}>
                    {getStockStatus(product.qte_produit).label}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-base">{product.desc_produit}</p>
              </div>

              <Separator />

              {/* Caractéristiques */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  Caractéristiques
                </p>
                <p className="text-base">{product.caracteristiques}</p>
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
                    <p className="mt-1">{product.categorie}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Modèle</p>
                    <p className="mt-1">{product.modele}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Marque</p>
                    <p className="mt-1">{product.marque}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Famille</p>
                    <p className="mt-1">{product.famille}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Emplacement
                    </p>
                    <p className="mt-1">
                      {product.emplacement || "Non défini"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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
