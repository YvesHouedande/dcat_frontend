import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { AlertCircle, Trash2, Loader2 } from "lucide-react";
import { se } from "date-fns/locale";

export default function PoduitDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  // Données exemple d'un produit
  const product = {
    id_produit: "PRD001",
    Code_produit: "CP123456",
    desi_produit: "Écran LCD 24 pouces",
    desc_produit: "Écran LCD haute résolution 1080p avec ports HDMI et VGA",
    image_produit: "lcd_screen.jpg",
    Qte_produit: "15",
    emplacement: "Entrepôt A, Étagère 3",
    Id_type_produit: "TYPE001",
    Id_modele: "MOD123",
    id_famille: "FAM22",
    id_marque: "BRAND05",
  };

  const handleSupprimer = async (id: string | undefined) => {
    if (!id) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/equipements/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });


      // Ajouter un petit délai pour l'animation de succès
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      
      // Fermer le dialogue et rediriger uniquement en cas de succès
      setShowDeleteDialog(false);
      navigate("/moyens-generaux/equipement-outils");
      
    } catch (error) {
      // En cas d'erreur, on met à jour le message d'erreur mais on ne ferme pas le dialogue
      setDeleteError("La suppression a échoué. Veuillez réessayer.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <h1 className="text-3xl font-bold mb-6">Détails du Produit</h1>
        </div>
        <div className="flex space-x-4">
          <Button
            onClick={() => {
              setShowDeleteDialog(true); // Ouvre la boîte de dialogue de confirmation de suppression
              // navigate(`/moyens-generaux/equipement-outils/${id}/delete`);
            }}
            className=" cursor-pointer"
            variant={"destructive"}
          >
            Supprimer
          </Button>
          <Button
            onClick={() => {
              navigate(`/moyens-generaux/equipement-outils/${id}/edit`);
            }}
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            Editer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Image du produit */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Image</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center p-4">
            <div className="relative w-full aspect-square bg-gray-100 rounded-md flex items-center justify-center">
              <img
                src="/api/placeholder/400/400"
                alt="Image du produit"
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute bottom-2 right-2">
                <Badge variant="outline">{product.image_produit}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations principales */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informations du Produit</CardTitle>
            <CardDescription>Code: {product.Code_produit}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id_produit">ID Produit</Label>
                <Input id="id_produit" value={product.id_produit} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="Code_produit">Code Produit</Label>
                <Input
                  id="Code_produit"
                  value={product.Code_produit}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desi_produit">Désignation</Label>
                <Input
                  id="desi_produit"
                  value={product.desi_produit}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="Qte_produit">Quantité</Label>
                <Input id="Qte_produit" value={product.Qte_produit} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emplacement">Emplacement</Label>
                <Input id="emplacement" value={product.emplacement} readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc_produit">Description</Label>
              <Textarea
                id="desc_produit"
                value={product.desc_produit}
                readOnly
                className="min-h-24"
              />
            </div>
          </CardContent>
        </Card>

        {/* Informations complémentaires */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Classifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="Id_type_produit">Type</Label>
                <div className="flex">
                  <Input
                    id="Id_type_produit"
                    value={product.Id_type_produit}
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="Id_modele">Modèle</Label>
                <div className="flex">
                  <Input id="Id_modele" value={product.Id_modele} readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_famille">Famille</Label>
                <div className="flex">
                  <Input id="id_famille" value={product.id_famille} readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_marque">Marque</Label>
                <div className="flex">
                  <Input id="id_marque" value={product.id_marque} readOnly />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Badge className="bg-blue-500 hover:bg-blue-600">Version 1.0</Badge>
          </CardFooter>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'équipement avec l'ID {id} ?
              Cette action est irréversible et supprimera définitivement toutes
              les données associées.
            </AlertDialogDescription>
            {deleteError && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                {deleteError}
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Annuler
            </AlertDialogCancel>
            <Button
              className={`bg-red-600 hover:bg-red-700 ${isDeleting ? 'opacity-75 cursor-not-allowed' : ''}`}
              onClick={() => handleSupprimer(id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
