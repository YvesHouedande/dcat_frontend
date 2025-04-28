// pages/LivraisonPage.tsx

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

import { Livraison, Partenaire } from "../types/livraison.types";
import { LivraisonService } from "../services/livraison.service";
import LivraisonTable from "../components/LivraisonTable";
import LivraisonForm from "../components/LivraisonForm";
import LivraisonDetails from "../components/LivraisonDetails";

const LivraisonPage: React.FC = () => {
  const [livraisons, setLivraisons] = useState<Livraison[]>([]);
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États pour la gestion des modes (liste, création, édition, détails)
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [selectedLivraison, setSelectedLivraison] = useState<Livraison | null>(
    null
  );

  // États pour les dialogues
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [livraisonToDelete, setLivraisonToDelete] = useState<string | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Chargement initial des données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [livraisonsData, partenairesData] = await Promise.all([
        LivraisonService.getAll(),
        LivraisonService.getPartenaires(),
      ]);

      setLivraisons(livraisonsData);
      setPartenaires(partenairesData);
    } catch (error) {
      toast("Erreur", {
        description: "Impossible de charger les données",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la création d'une livraison
  const handleCreate = async (data: Omit<Livraison, "id_livraison">) => {
    setIsSubmitting(true);
    try {
      const newLivraison = await LivraisonService.create(data);
      setLivraisons([...livraisons, newLivraison]);
      setMode("list");
      toast("Succès", {
        description: "Livraison créée avec succès",
      });
    } catch (error) {
      toast("Erreur", {
        description: "Impossible de créer la livraison",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer la mise à jour d'une livraison
  const handleUpdate = async (data: Livraison) => {
    setIsSubmitting(true);
    try {
      const updatedLivraison = await LivraisonService.update(data);
      if (updatedLivraison) {
        setLivraisons(
          livraisons.map((l) =>
            l.id_livraison === updatedLivraison.id_livraison
              ? updatedLivraison
              : l
          )
        );
        setMode("list");
        toast("Succès", {
          description: "Livraison mise à jour avec succès",
        });
      }
    } catch (error) {
      toast("Erreur", {
        description: "Impossible de mettre à jour la livraison",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer la suppression d'une livraison
  const handleDelete = async () => {
    if (!livraisonToDelete) return;

    try {
      const success = await LivraisonService.delete(livraisonToDelete);
      if (success) {
        setLivraisons(
          livraisons.filter((l) => l.id_livraison !== livraisonToDelete)
        );
        toast("Succès", {
          description: "Livraison supprimée avec succès",
        });
      }
    } catch (error) {
      toast("Erreur", {
        description: "Impossible de supprimer la livraison",
      });
    } finally {
      setLivraisonToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Gérer l'édition d'une livraison
  const handleEdit = (livraison: Livraison) => {
    setSelectedLivraison(livraison);
    setMode("edit");
  };

  // Gérer l'affichage des détails d'une livraison
  const handleView = (livraison: Livraison) => {
    setSelectedLivraison(livraison);
    setIsDetailsOpen(true);
  };

  // Confirmer la suppression d'une livraison
  const confirmDelete = (id: string) => {
    setLivraisonToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Annuler le formulaire
  const handleCancel = () => {
    setMode("list");
    setSelectedLivraison(null);
  };

  // Gérer la soumission du formulaire (création ou mise à jour)
  const handleSubmit = (data: any) => {
    if (mode === "edit" && selectedLivraison) {
      handleUpdate({ ...data, id_livraison: selectedLivraison.id_livraison });
    } else {
      handleCreate(data);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestion des Livraisons</CardTitle>
            <CardDescription>
              {mode === "list"
                ? "Liste des livraisons enregistrées"
                : mode === "create"
                ? "Ajouter une nouvelle livraison"
                : "Modifier une livraison"}
            </CardDescription>
          </div>

          {mode === "list" ? (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadData}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Button size="sm" onClick={() => setMode("create")}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Livraison
              </Button>
            </div>
          ) : null}
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">
              Chargement des données...
            </div>
          ) : mode === "list" ? (
            <LivraisonTable
              livraisons={livraisons}
              partenaires={partenaires}
              onEdit={handleEdit}
              onDelete={confirmDelete}
              onView={handleView}
            />
          ) : (
            <LivraisonForm
              initialData={
                mode === "edit" ? selectedLivraison || undefined : undefined
              }
              partenaires={partenaires}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera
              définitivement la livraison.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Composant de détails d'une livraison */}
      <LivraisonDetails
        livraison={selectedLivraison}
        partenaires={partenaires}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default LivraisonPage;
