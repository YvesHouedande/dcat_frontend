// src/components/dashboard/ExemplaireSortieDashboard.tsx
import { useState } from "react";
import { ExemplaireSortieTable } from "./ExemplaireSortieTable";
// import { ExemplaireSortieForm } from ".//ExemplaireSortieForm";
import {
  ExemplaireSortieFormValues,
  PaginationParams,
  ExemplaireProduit,
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
  exemplaires: ExemplaireProduit[];
  isEditMode: boolean;
  defaultValues?: ExemplaireSortieFormProps | undefined;
}
import { RetourForms } from "../../Retour/components/RetourForms";
import { RetourSchemaFormsValue } from "../../Retour/types";
import {
  useExemplaireOutils,
  useOutilsSortis,
} from "../../exemplaire/hooks/ExemaplaireOutils";
import { ExemplaireSortieForm } from "./ExemplaireSortieForm";

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
    pageSize: 20,
  });

  const { updateMouvementAsync, deleteMouvementAsync, createSortieOutilAsync } =
    useExemplaireOutils();
  const {
    outilsSortis,
    loading: loadingOutilsSortis,
    pagination: paginationOutilsSortis,
    fetchOutilsSortis,
  } = useOutilsSortis({
    page: paginationParams.page,
    limit: paginationParams.pageSize,
    search: searchTerm,
  });

  const handlePageChange = (page: number) => {
    setPaginationParams((prev) => ({ ...prev, page }));
    fetchOutilsSortis();
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
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
      await updateMouvementAsync({
        type: "sortie",
        id_exemplaire: currentSortie.id_exemplaire,
        id_employes: currentSortie.id_employes,
        data: data,
      });
    } else {
      await createSortieOutilAsync(data);
    }
    closeForm();
  };

  const handleRetourSubmit = async (data: RetourSchemaFormsValue) => {
    await updateMouvementAsync({
      type: "entree",
      id_exemplaire: currentSortie?.id_exemplaire ?? "",
      id_employes: currentSortie?.id_employes ?? "",
      data: data,
    });
    closeForm();
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      // await deleteExemplaireSortie(deleteId);
      deleteMouvementAsync(
        {
          type: "sortie",
          id_exemplaire: deleteId.id_exemplaire,
          id_employes: deleteId.id_employes,
        },
        {
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
        }
      );

      closeDeleteDialog();
    }
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-4"></div>
      {loadingOutilsSortis ? (
        <TableSkeleton />
      ) : (
        <ExemplaireSortieTable
          exemplaireSorties={outilsSortis ?? []}
          searchTerm={searchTerm}
          pagination={{
            page: paginationOutilsSortis?.page ?? 0,
            pageSize: paginationOutilsSortis?.pageSize ?? 0,
            total: paginationOutilsSortis?.total ?? 0,
            totalPages: paginationOutilsSortis?.totalPages ?? 0,
          }}
          loading={loadingOutilsSortis}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
          onAdd={openAddForm}
          onRetrun={openRetrunForm}
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="overflow-auto overscroll-none  max-h-[90vh] md:max-w-[700px] lg:max-w-[800px]">
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
        <DialogContent className="overflow-auto overscroll-none max-h-[90vh]  md:max-w-[700px] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Retourner un outil</DialogTitle>
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
            isEditMode={false}
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
