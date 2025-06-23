// src/components/dashboard/ProductInstanceDashboard.tsx
import { useState, useEffect, useRef } from "react";
import { ProductInstanceTable } from "../tables/ProductInstanceTable";
import { ProductInstanceForm } from "../forms/ProductInstanceForm";
import { useProductInstances } from "../../hooks/useProductInstances";
import {PaginationParams } from "../../types";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Package, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { UseFormReturn } from "react-hook-form";
import { ProductInstanceFormValues } from "../../schemas/productInstanceSchema";

interface ProductInstanceDashboardProps {
  produitId?: string | number;
}
export function ProductInstanceDashboard({produitId}: ProductInstanceDashboardProps) {
  const formRef = useRef<UseFormReturn<ProductInstanceFormValues> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentInstance, setCurrentInstance] =
    useState<Partial<ProductInstanceFormValues>| null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  // const [searchTerm, setSearchTerm] = useState("");
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    pageSize: 30,
  });

  const {
    productInstances = [],
    pagination = { page: 1, totalPages: 1, pageSize: 30, total: 0 },
    loading,
    error,
    fetchProductInstances,
    deleteProductInstance,
  } = useProductInstances();

  const handlePageChange = (page: number) => {
    setPaginationParams((prev) => ({ ...prev, page }));
  };

  const handleSearch = (term: string) => {
    // setSearchTerm(term);
    setPaginationParams((prev) => ({ ...prev, page: 1, search: term }));
  };

  const openAddForm = () => {
    setCurrentInstance({
      id_produit: String(produitId),
    });
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

    fetchProductInstances(paginationParams);
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
    fetchProductInstances(paginationParams);
  }, [fetchProductInstances, paginationParams]);

  // Calcul des statistiques pour le tableau de bord
  const soldCount = Array.isArray(productInstances)
    ? productInstances.filter((item) => item.etat_vente === "vendu").length
    : 0;
  const unsoldCount = Array.isArray(productInstances)
    ? productInstances.filter((item) => item.etat_vente === "invendu").length
    : 0;
  const totalProducts = Array.isArray(productInstances)
    ? productInstances.length
    : 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Exemplaires Vendus
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent >
            <div className="text-2xl font-bold">{soldCount}</div>
            <p className="text-xs text-muted-foreground">
              {pagination.total > 0
                ? `${((soldCount / productInstances.length) * 100).toFixed(
                    1
                  )}% du total`
                : "Aucun exemplaire"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Exemplaires Invendus
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unsoldCount}</div>
            <p className="text-xs text-muted-foreground">
              {pagination.total > 0
                ? `${((unsoldCount / productInstances.length) * 100).toFixed(
                    1
                  )}% du total`
                : "Aucun exemplaire"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produits Disponibles
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Types de produits dans le catalogue
            </p>
          </CardContent>
        </Card>
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
          productInstances={productInstances}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
          onAdd={openAddForm}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          total={pagination.total}
          loading={loading}
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Modifier un exemplaire" : "Ajouter un exemplaire"}
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
