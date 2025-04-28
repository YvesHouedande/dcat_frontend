// src/components/dashboard/ProductInstanceDashboard.tsx
import React, { useState, useEffect } from "react";
import { ProductInstanceTable } from "../tables/ProductInstanceTable";
import { ProductInstanceForm } from "../forms/ProductInstanceForm";
import { useProductInstances } from "../../hooks/useProductInstances";
import { useDeliveries } from "../../hooks/useDeliveries";
import { useProducts } from "../../hooks/useProducts";
import { ProductInstance, PaginationParams } from "../../types";
import {
  ProductInstanceFormValues,
  ProductInstanceFromEdit,
} from "../../schemas/productInstanceSchema";
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

export function ProductInstanceDashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentInstance, setCurrentInstance] =
    useState<ProductInstance | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });

  const {
    productInstances = [],
    pagination = { page: 1, totalPages: 1, pageSize: 10, total: 0 },
    loading,
    error,
    fetchProductInstances,
    createProductInstance,
    updateProductInstance,
    deleteProductInstance,
  } = useProductInstances();

  const { deliveries = [] } = useDeliveries();
  const { products = [] } = useProducts();

  const handlePageChange = (page: number) => {
    setPaginationParams((prev) => ({ ...prev, page }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPaginationParams((prev) => ({ ...prev, page: 1, search: term }));
  };

  const openAddForm = () => {
    setCurrentInstance(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const openEditForm = (instance: ProductInstance) => {
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

  const handleSubmit = async (
    data: ProductInstanceFormValues | ProductInstanceFromEdit
  ) => {
    if (isEditMode && currentInstance) {
      await updateProductInstance(currentInstance.id_exemplaire, {
        ...data,
        id_exemplaire: currentInstance.id_exemplaire, // Utilise l'ID existant pour garantir une valeur
      });
    } else {
      await createProductInstance({
        ...data,
      });
    }
    closeForm();
    if (error) {
      fetchProductInstances(paginationParams);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteProductInstance(deleteId);
      closeDeleteDialog();
      if (error) {
        fetchProductInstances(paginationParams);
      }
      //   fetchProductInstances(paginationParams);
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
  const totalProducts = Array.isArray(products) ? products.length : 0;

  //     // Calcul des statistiques pour le tableau de bord
  //   const soldCount = productInstances.filter(
  //     (item) => item.etat_vente === "vendu"
  //   ).length;
  //   const unsoldCount = productInstances.filter(
  //     (item) => item.etat_vente === "invendu"
  //   ).length;
  //   const totalProducts = products.length;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des Exemplaires
        </h1>
        <p className="text-muted-foreground">
          Gérez tous les exemplaires de produits dans le système
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Exemplaires Vendus
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
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

      <ProductInstanceTable
        productInstances={productInstances}
        deliveries={deliveries}
        products={products}
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Modifier un exemplaire" : "Ajouter un exemplaire"}
            </DialogTitle>
          </DialogHeader>
          <ProductInstanceForm
            initialData={currentInstance || undefined}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            isLoading={loading}
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
