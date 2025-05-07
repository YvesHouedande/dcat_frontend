// src/components/dashboard/ExemplaireSortieDashboard.tsx
import { useState } from "react";
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
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { idSotieOutils, PaginationParams } from "../../sorties/types";

export interface ExemplaireSortieFormProps {
  onSubmit: (data: RetourSchemaFormsValue) => void;
  onCancel: () => void;
  exemplaires: RetourSchemaFormsValue[];
  isEditMode: boolean;
  defaultValues?: ExemplaireSortieFormProps | undefined;
}
import { RetourForms } from "../../Retour/components/RetourForms";
import { RetourSchemaFormsValue } from "../../Retour/types";
import { useRetourSorties } from "../../Retour/hooks/useRetourSorties";
import RetourTable from "../components/RetourTable";

export function RetourDashboard() {
  const [isFormReturnOpen, setIsReturnFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSortie, setCurrentSortie] =
    useState<RetourSchemaFormsValue | null>(null);
  const [deleteId, setDeleteId] = useState<idSotieOutils | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });

  const {
    updateRetourSortie,
    isUpdating,
    isDeleting,
    loading,
    fetchRetourSorties,
    deleteRetourSortie,
    retourSorties,
    pagination = { page: 1, totalPages: 1, pageSize: 10, total: 0 },
  } = useRetourSorties();

  const handlePageChange = (page: number) => {
    setPaginationParams((prev) => ({ ...prev, page }));
    fetchRetourSorties(paginationParams);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPaginationParams((prev) => ({ ...prev, page: 1, search: term }));
    fetchRetourSorties(paginationParams);
  };

  const openEditForm = (sortie: RetourSchemaFormsValue) => {
    setCurrentSortie(sortie);
    setIsReturnFormOpen(true);
  };

  const closeForm = () => {
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

  const handleRetourSubmit = async (data: RetourSchemaFormsValue) => {
    await updateRetourSortie(
      {
        id_exemplaire: data.id_exemplaire,
        id_employes: data.id_employes,
        date_de_retour: data.date_de_retour,
      },
      data
    );
    closeForm();
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteRetourSortie(deleteId);
    }
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-4"></div>
      {loading ? (
        <TableSkeleton />
      ) : (
        <RetourTable
          exemplairesRetour={retourSorties}
          searchTerm={searchTerm}
          pagination={pagination}
          loading={loading}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
        />
      )}

      <Dialog open={isFormReturnOpen} onOpenChange={setIsReturnFormOpen}>
        <DialogContent className="overflow-auto overscroll-none  md:max-w-[700px] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle> Modifier un retour d'outils</DialogTitle>
          </DialogHeader>
          <RetourForms
            onSubmit={handleRetourSubmit}
            onCancel={closeForm}
            defaultValues={{
              id_employes: currentSortie?.id_employes ?? "",
              id_exemplaire: currentSortie?.id_exemplaire ?? "",
              etat_apres: currentSortie?.etat_apres ?? "",
              date_de_retour: currentSortie?.date_de_retour ?? "",
              commentaire: currentSortie?.commentaire ?? "",
            }}
            isEditMode={true}
            isLoading={isUpdating}
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
              Êtes-vous sûr de vouloir supprimer ce retour ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible et supprimera définitivement !
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={closeDeleteDialog}
              disabled={isDeleting}
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
