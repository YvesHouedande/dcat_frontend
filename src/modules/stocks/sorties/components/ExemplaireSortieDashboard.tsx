// src/components/dashboard/ExemplaireSortieDashboard.tsx
import { useState, useEffect } from "react";
import { ExemplaireSortieTable } from "./ExemplaireSortieTable";
import { ExemplaireSortieForm } from ".//ExemplaireSortieForm";
import { useExemplaireSorties } from "../hooks/useExemplaireSorties";
import { ExemplaireSortie, PaginationParams, ProductInstance } from "../types";
import { ExemplaireSortieFormValues } from "../schemas/exemplaireSortieSchema";
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
import CarteStatitique from "./CarteStatitique";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

export interface ExemplaireSortieFormProps {
  onSubmit: (data: ExemplaireSortieFormValues) => void;
  onCancel: () => void;
  exemplaires: ProductInstance[];
  isEditMode: boolean;
  defaultValues?: ExemplaireSortie | undefined;
}

export function ExemplaireSortieDashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSortie, setCurrentSortie] = useState<ExemplaireSortie | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
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

  const handlePageChange = (page: number) => {
    setPaginationParams((prev) => ({ ...prev, page }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPaginationParams((prev) => ({ ...prev, page: 1, search: term }));
  };

  const openAddForm = () => {
    setCurrentSortie(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const openEditForm = (sortie: ExemplaireSortie) => {
    setCurrentSortie(sortie);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentSortie(null);
  };

  const openDeleteDialog = (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleSubmit = async (data: ExemplaireSortieFormValues) => {
    if (isEditMode && currentSortie) {
      await updateExemplaireSortie(currentSortie.id_sortie_exemplaire, data);
    } else {
      await createExemplaireSortie(data);
    }
    closeForm();
    fetchExemplaireSorties(paginationParams);
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
      fetchExemplaireSorties(paginationParams);
    }
  };

  useEffect(() => {
    fetchExemplaireSorties(paginationParams);
  }, [fetchExemplaireSorties, paginationParams]);

  // Calcul des statistiques pour le tableau de bord
  const countByType = Array.isArray(exemplaireSorties)
    ? exemplaireSorties.reduce((acc, sortie) => {
        acc[sortie.type_sortie] = (acc[sortie.type_sortie] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    : {};

  const ventesDirectes = countByType["Vente directe"] || 0;
  const ventesEnLigne = countByType["Vente en ligne"] || 0;
  const interventions = countByType["Intervention"] || 0;
  const projets = countByType["Projet"] || 0;
  const totalSorties = ventesDirectes + ventesEnLigne + interventions + projets;

  const stats = [
    {
      label: "Ventes Directes",
      value: ventesDirectes,
      percent: (ventesDirectes / exemplaireSorties.length) * 100,
    },
    {
      label: "Ventes En Ligne",
      value: ventesEnLigne,
      percent: (ventesEnLigne / exemplaireSorties.length) * 100,
    },
    {
      label: "Projets",
      value: projets,
      percent: (projets / exemplaireSorties.length) * 100,
    },
    {
      label: "Intervention",
      value: interventions,
      percent: (interventions / exemplaireSorties.length) * 100,
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des Sorties de Produits
        </h1>
        <p className="text-muted-foreground">
          Gérez toutes les sorties d'exemplaires dans le système
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <CarteStatitique
          exemplaireSorties={exemplaireSorties}
          stats={stats}
          totalSorties={totalSorties}
        />
      </div>
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
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditMode
                ? "Modifier une sortie de produit"
                : "Ajouter une sortie de produit"}
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
