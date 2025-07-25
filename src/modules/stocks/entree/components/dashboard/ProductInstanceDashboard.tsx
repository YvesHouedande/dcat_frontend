// src/components/dashboard/ProductInstanceDashboard.tsx
import { useState, useEffect, useRef } from "react";
import { ProductInstanceTable } from "../tables/ProductInstanceTable";
import { ProductInstanceForm } from "../forms/ProductInstanceForm";
import { useProductInstances } from "../../hooks/useProductInstances";
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
import { UseFormReturn } from "react-hook-form";

import { ExemplaireProduitFormValues } from "@/modules/stocks/exemplaire";
import { ProductInstanceFormValues } from "../../schemas/productInstanceSchema";

export function ProductInstanceDashboard() {
  const formRef = useRef<UseFormReturn<ExemplaireProduitFormValues> | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentInstance, setCurrentInstance] =
    useState<ExemplaireProduitFormValues | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const {
    productInstances,
    pages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    loading,
    error,
    deleteProductInstance,
  } = useProductInstances({ search });

  // Pagination calculée à partir des pages
  const total = pages?.[0]?.total ? pages?.[0]?.total : 0;
  const totalPages = pages?.[0]?.totalPages ? pages?.[0]?.totalPages : 0;
  const pageInstances = productInstances.slice(
    (currentPage - 1) * pages?.[0]?.pageSize
      ? (currentPage - 1) * pages?.[0]?.pageSize
      : 0,
    currentPage * pages?.[0]?.pageSize ? currentPage * pages?.[0]?.pageSize : 0
  );

  const setSercahTerm = (searchTerm: string) => {
    setSearch(searchTerm);
  };

  const handlePageChange = (page: number) => {
    if (page > currentPage && hasNextPage) {
      fetchNextPage();
    }
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openAddForm = () => {
    setCurrentInstance(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const openEditForm = (instance: ProductInstanceFormValues) => {
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
      deleteProductInstance.mutate(deleteId, {
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

  useEffect(() => {
    // Initial fetch is handled by useInfiniteQuery
  }, [currentPage]); // Re-run when currentPage changes to fetch next page if needed

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des Entrées
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-800">
          Erreur: {error.message}
        </div>
      )}

      {loading ? (
        <TableSkeleton />
      ) : (
        <ProductInstanceTable
          productInstances={pageInstances}
          onPageChange={handlePageChange}
          onSearch={setSercahTerm}
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
          onAdd={openAddForm}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pages[0].pageSize}
          total={total}
          loading={loading || isFetchingNextPage}
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Modifier un produit" : "Ajouter un produit"}
            </DialogTitle>
          </DialogHeader>
          <ProductInstanceForm
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
              définitivement cet exemplaire de produit de la base de données.
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
