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
  const [currentInstance, setCurrentInstance] =
    useState<ExemplaireProduitFormValues| null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    productInstances = [],
    pages = [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    loading,
    error,
  } = useProductInstances();

  // Pagination calculée à partir des pages
  const total = pages.length > 0 ? pages[0].total : 0;
  const totalPages = pages.length > 0 ? pages[0].totalPages : 1;
  const pageInstances = productInstances.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    if (page > currentPage && hasNextPage) {
      fetchNextPage();
    }
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };



  const openEditForm = (
    instance: ProductInstanceFormValues
  ) => {
    setCurrentInstance(instance);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentInstance(null);
  };





  const handleFormSuccess = () => {
    const numSerie = formRef.current?.getValues("num_serie");

    toast.success(
      isEditMode
        ? "Achat modifié avec succès"
        : `Achat "${numSerie ?? ""}" ajouté avec succès`,
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



  useEffect(() => {
    // Initial fetch is handled by useInfiniteQuery
  }, [currentPage]); // Re-run when currentPage changes to fetch next page if needed

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des Achats
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
          onSearch={() => {}}
          onEdit={openEditForm}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
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

   
    </div>
  );
}
