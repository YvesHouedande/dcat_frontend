// src/components/dashboard/ExemplaireSortieDashboard.tsx
import { useState } from "react";
import { ExemplaireSortieTable } from "./ExemplaireSortieTable";
import { ExemplaireSortieForm } from ".//ExemplaireSortieForm";
import { useExemplaireSorties } from "../hooks/useExemplaireSorties";
import {
  ExemplaireSortieFormValues,
  PaginationParams,
  ProductInstance,
} from "../types";
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
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { idSotieOutils } from "../types";

export interface ExemplaireSortieFormProps {
  onSubmit: (data: ExemplaireSortieFormValues) => void;
  onCancel: () => void;
  exemplaires: ProductInstance[];
  isEditMode: boolean;
  defaultValues?: ExemplaireSortieFormProps | undefined;
}
import { RetourForms } from "../../Retour/components/RetourForms";
import { RetourSchemaFormsValue } from "../../Retour/types";
import { useRetourSorties } from "../../Retour/hooks/useRetourSorties";

export function ExemplaireSortieDashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormReturnOpen, setIsReturnFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSortie, setCurrentSortie] =
    useState<ExemplaireSortieFormValues | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteId, setDeleteId] = useState<idSotieOutils | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });

  const {
    exemplaireSorties,
    pagination = { page: 1, totalPages: 1, pageSize: 10, total: 0 },
    loading,
    fetchExemplaireSorties,
    createExemplaireSortie,
    updateExemplaireSortie,
    deleteExemplaireSortie,
  } = useExemplaireSorties();
  const { createRetourSortie } = useRetourSorties();

  const handlePageChange = (page: number) => {
    setPaginationParams((prev) => ({ ...prev, page }));
    fetchExemplaireSorties(paginationParams);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPaginationParams((prev) => ({ ...prev, page: 1, search: term }));
    fetchExemplaireSorties(paginationParams);
  };

  const openAddForm = () => {
    setCurrentSortie(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const openEditForm = (sortie: ExemplaireSortieFormValues) => {
    setCurrentSortie(sortie);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const openRetrunForm = (sortie: ExemplaireSortieFormValues) => {
    setCurrentSortie(sortie);
    setIsReturnFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsReturnFormOpen(false);
    setCurrentSortie(null);
  };

  const openDeleteDialog = (id: idSotieOutils) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleSubmit = async (data: ExemplaireSortieFormValues) => {
    if (isEditMode && currentSortie) {
      await updateExemplaireSortie(
        {
          id_exemplaire: currentSortie.id_employes,
          id_employes: currentSortie.id_exemplaire,
          date_de_sortie: currentSortie.date_de_sortie,
        },
        data
      );
    } else {
      await createExemplaireSortie(data);
    }
    closeForm();
  };

  const handleRetourSubmit = async (data: RetourSchemaFormsValue) => {
    await createRetourSortie(data);
    closeForm();
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      // await deleteExemplaireSortie(deleteId);
      deleteExemplaireSortie.mutate(deleteId, {
        onSuccess: () => {
          console.log("Suppression réussie !");
          toast.success("Suppression réussie !", {
            duration: 2000,
          });
        },
        onError: (error) => {
          toast.error("Erreur lors de la suppression", {
            duration: 2000,
            description:
              error instanceof Error
                ? error.message
                : "Une erreur inconnue est survenue",
          });
        },
      });

      closeDeleteDialog();
    }
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-4"></div>
      {loading ? (
        <TableSkeleton />
      ) : (
        <ExemplaireSortieTable
          exemplaireSorties={exemplaireSorties}
          searchTerm={searchTerm}
          pagination={pagination}
          loading={loading}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
          onAdd={openAddForm}
          onRetrun={openRetrunForm}
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="overflow-auto overscroll-none  md:max-w-[700px] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode
                ? "Modifier une sortie d'outils"
                : "Faire une sortie d'outils"}
            </DialogTitle>
          </DialogHeader>
          <ExemplaireSortieForm
            onSubmit={handleSubmit}
            onCancel={closeForm}
            defaultValues={currentSortie || undefined}
            isEditMode={isEditMode}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isFormReturnOpen} onOpenChange={setIsReturnFormOpen}>
        <DialogContent className="overflow-auto overscroll-none  md:max-w-[700px] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode
                ? "Modifier un retour d'outils"
                : "Retourner un outil"}
            </DialogTitle>
          </DialogHeader>
          <RetourForms
            onSubmit={handleRetourSubmit}
            onCancel={closeForm}
            defaultValues={{
              id_employes: currentSortie?.id_employes ?? "",
              id_exemplaire: currentSortie?.id_exemplaire ?? "",
              etat_apres: "",
              date_de_retour: "",
              commentaire: "",
            }}
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
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer cette sortie?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible et supprimera définitivement la
              sortie d'exemplaire.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
