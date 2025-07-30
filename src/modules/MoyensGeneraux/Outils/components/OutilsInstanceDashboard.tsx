// src/components/dashboard/ProductInstanceDashboard.tsx
import { useState, useRef } from "react";
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

import { OutilsInstanceTable } from "./OutilsInstanceTable";
import { OutilEntreeForm } from "./OutiEntreeForm";
import { useExemplaireOutils } from "../exemplaire/hooks/ExemaplaireOutils";
import { OutilEntreeType } from "../types/OutilsType";

export function OutilsInstanceDashboard() {
  const formRef = useRef<UseFormReturn<OutilEntreeType> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentInstance, setCurrentInstance] =
    useState<OutilEntreeType | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const { deleteExemplaire } = useExemplaireOutils();

  const openAddForm = () => {
    setCurrentInstance(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const openEditForm = (instance: OutilEntreeType) => {
    setCurrentInstance(instance);
    setIsEditMode(true);
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
    const numSerie = formRef.current?.getValues("num_serie");

    toast.success(
      isEditMode
        ? "Exemplaire modifié avec succès"
        : `Exemplaire "${numSerie ?? ""}" ajouté avec succès`,
      {
        duration: 2000,
      }
    );

    if (!isEditMode && formRef.current) {
      formRef.current.setValue("num_serie", "");
    } else {
      closeForm();
    }

    // fetchProductInstances(paginationParams); // This line is no longer needed as pagination is handled by useInfiniteQuery
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        deleteExemplaire(deleteId);
        toast.success("Exemplaire supprimé avec succès");
      } catch (error) {
        toast.error("Erreur lors de la suppression" + error);
      }
      closeDeleteDialog();
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <OutilsInstanceTable
        onEdit={openEditForm}
        onDelete={openDeleteDialog}
        onAdd={openAddForm}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Modifier un outil" : "Ajouter un outil"}
            </DialogTitle>
          </DialogHeader>
          <OutilEntreeForm
            ref={formRef}
            initialData={currentInstance || undefined}
            onSuccess={handleFormSuccess}
            onCancel={closeForm}
            isEditMode={isEditMode}
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
              définitivement cet exemplaire de l'outil de la base de données.
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
    </div>
  );
}
