// src/components/dashboard/ProductInstanceDashboard.tsx
import { useState, useRef } from "react";
import { SortieInstanceTable } from "../tables/SortieInstanceTable";
import { ProductInstanceForm } from "../forms/ProductInstanceForm";
import { useDeleteSortieExemplaire } from "@/modules/stocks/exemplaire/hooks/useSortieExemplaire";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { UseFormReturn } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ExemplaireProduitFormValues } from "@/modules/stocks/exemplaire";
import { ProductInstanceFormValues } from "../../schemas/SortieSchema";
import { SortieForm } from "../forms/SortieForm";
import { getAxiosErrorMessage } from "@/api/api";
import { CommandesTable } from "@/modules/marketing-commercial/commercial/commande/components/CommandeTable";

export function ProductSortieDashboard() {
  const formRef = useRef<UseFormReturn<ExemplaireProduitFormValues> | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentInstance, setCurrentInstance] =
    useState<ExemplaireProduitFormValues | null>(null);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [isOutDialogOpen, setIsOutDialogOpen] = useState(false);
  const { mutate: deleteSortieExemplaire } = useDeleteSortieExemplaire();

  // Pagination calculée à partir des pages

  const openEditForm = (instance: ProductInstanceFormValues) => {
    setCurrentInstance(instance);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentInstance(null);
  };

  const openDeleteDialog = (id: string | number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleFormSuccess = () => {
    toast.success("Exemplaire modifié avec succès");
    closeForm();
  };

  const handleDelete = async () => {
    if (deleteId) {
      deleteSortieExemplaire(deleteId as string, {
        onSuccess: () => {
          toast.success("Suppression réussie !");
        },
        onError: (error) => {
          toast.error(getAxiosErrorMessage(error));
        },
      });
      closeDeleteDialog();
    }
  };

  const openOutDialog = (instance: ProductInstanceFormValues) => {
    setCurrentInstance(instance);
    setIsOutDialogOpen(true);
  };

  const closeOutDialog = () => {
    setIsOutDialogOpen(false);
    setCurrentInstance(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des Sorties
        </h1>
      </div>

      <Tabs defaultValue="tableau">
        <TabsList>
          <TabsTrigger value="tableau">Tableau</TabsTrigger>
          <TabsTrigger value="commande">Commande</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>
        <TabsContent value="tableau">
          <SortieInstanceTable
            onEdit={openEditForm}
            onCancel={openDeleteDialog}
            onOut={openOutDialog}
          />
        </TabsContent>
        <TabsContent value="commande">
          <CommandesTable onEdit={() => {}} />
        </TabsContent>
        <TabsContent value="historique">Change your password here.</TabsContent>
      </Tabs>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {"Modifier l'etat d'un exmplaire de produit"}
            </DialogTitle>
          </DialogHeader>
          <ProductInstanceForm
            ref={formRef}
            initialData={currentInstance || undefined}
            onSuccess={handleFormSuccess}
            onCancel={closeForm}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera
              définitivement la sortie de l'historique des sorties.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-600"
              onClick={handleDelete}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isOutDialogOpen} onOpenChange={setIsOutDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Faire sortir un exemplaire de produit</DialogTitle>
          </DialogHeader>
          <SortieForm
            initialData={currentInstance || undefined}
            onCancel={closeOutDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
