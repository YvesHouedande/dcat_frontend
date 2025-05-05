// src/components/dashboard/ExemplaireSortieDashboard.tsx
import React, { useState, useEffect } from "react";
import { ExemplaireSortieTable } from "./ExemplaireSortieTable";
import { ExemplaireSortieForm } from ".//ExemplaireSortieForm";
import { useExemplaireSorties } from "../hooks/useExemplaireSorties";
import { ExemplaireSortie, PaginationParams, ProductInstance } from "../types";
import { ExemplaireSortieFormValues } from "../schemas/exemplaireSortieSchema";
import { useProducts } from "../../examplaire";
import { productInstanceService } from "../../examplaire";
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
import { LogOut, Archive, BarChart2 } from "lucide-react";

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
  const [exemplaires, setExemplaires] = useState<ProductInstance[]>([]);
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    pageSize: 30,
  });

  const {
    exemplaireSorties = [],
    pagination = { page: 1, totalPages: 1, pageSize: 30, total: 0 },
    loading,
    error,
    fetchExemplaireSorties,
    createExemplaireSortie,
    updateExemplaireSortie,
    deleteExemplaireSortie,
  } = useExemplaireSorties();

  // Charger les exemplaires pour la combobox
  useEffect(() => {
    const loadExemplaires = async () => {
      try {
        const response = await productInstanceService.getAll({
          page: 1,
          pageSize: 100,
        });
        setExemplaires(response.data as ProductInstance[]);
      } catch (error) {
        console.error("Erreur lors du chargement des exemplaires", error);
      }
    };

    loadExemplaires();
  }, []);

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
      await deleteExemplaireSortie(deleteId);
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des Sorties d'Exemplaires
        </h1>
        <p className="text-muted-foreground">
          Gérez toutes les sorties d'exemplaires dans le système
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ventes Directes
            </CardTitle>
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ventesDirectes}</div>
            <p className="text-xs text-muted-foreground">
              {exemplaireSorties.length > 0
                ? `${(
                    (ventesDirectes / exemplaireSorties.length) *
                    100
                  ).toFixed(1)}% du total`
                : "Aucune sortie"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ventes En Ligne
            </CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ventesEnLigne}</div>
            <p className="text-xs text-muted-foreground">
              {exemplaireSorties.length > 0
                ? `${((ventesEnLigne / exemplaireSorties.length) * 100).toFixed(
                    1
                  )}% du total`
                : "Aucune sortie"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interventions</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interventions}</div>
            <p className="text-xs text-muted-foreground">
              {exemplaireSorties.length > 0
                ? `${((interventions / exemplaireSorties.length) * 100).toFixed(
                    1
                  )}% du total`
                : "Aucune sortie"}
            </p>
          </CardContent>
        </Card>
      </div>

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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditMode
                ? "Modifier une sortie d'exemplaire"
                : "Ajouter une sortie d'exemplaire"}
            </DialogTitle>
          </DialogHeader>
          <ExemplaireSortieForm
            onSubmit={handleSubmit}
            onCancel={closeForm}
            defaultValues={currentSortie || undefined}
            exemplaires={exemplaires}
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
