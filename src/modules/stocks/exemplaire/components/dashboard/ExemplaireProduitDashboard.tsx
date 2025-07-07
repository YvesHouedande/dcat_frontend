// src/components/dashboard/ExemplaireProduitDashboard.tsx
import { useState, useEffect, useRef } from "react";
import { ExemplaireProduitTable } from "../tables/ExemplaireProduitTable";
import { ExemplaireProduitForm } from "../forms/ExemplaireProduitForm";
import { useExemplaireProduits } from "../../hooks/useExemplaireProduits";
import { PaginationParams } from "../../types";
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
import { ExemplaireProduitFormValues } from "../../schemas/ExemplaireProduitSchema";
import { ExemplaireLimit } from "../../types/const";
import ExemplaireInformation from "../ui/ExemplaireInformation";

interface ExemplaireProduitDashboardProps {
  produitId?: string | number;
}
export function ExemplaireProduitDashboard({
  produitId,
}: ExemplaireProduitDashboardProps) {
  const formRef = useRef<UseFormReturn<ExemplaireProduitFormValues> | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [currentInstance, setCurrentInstance] =
    useState<Partial<ExemplaireProduitFormValues> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  // const [idsSelected, setIdsSelected] = useState<string | number>();
  // const [dialogOutOpen, setOutDialogOpen] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    limit: ExemplaireLimit,
  });

  const {
    ExemplaireProduits,
    pagination,
    loading,
    fetchExemplaireProduits,
    deleteExemplaireProduit,
  } = useExemplaireProduits(String(produitId));

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

  const openEditForm = (instance: ExemplaireProduitFormValues) => {
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

    fetchExemplaireProduits(paginationParams);
  };

  const handleDelete = async () => {
    if (deleteId) {
      deleteExemplaireProduit.mutate(deleteId, {
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
    fetchExemplaireProduits(paginationParams);
  }, [fetchExemplaireProduits, paginationParams]);

  // Calcul des statistiques pour le tableau de bord
  const soldCount = Array.isArray(ExemplaireProduits)
    ? ExemplaireProduits.filter((item) => item.etat_exemplaire === "Vendu")
        .length
    : 0;
  const unsoldCount = Array.isArray(ExemplaireProduits)
    ? ExemplaireProduits.filter((item) => item.etat_exemplaire === "Disponible")
        .length
    : 0;
  const totalProducts = Array.isArray(ExemplaireProduits)
    ? ExemplaireProduits.length
    : 0;
  const EnReserve = Array.isArray(ExemplaireProduits)
    ? ExemplaireProduits.filter((item) => item.etat_exemplaire === "Reserve")
        .length
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
          <CardContent>
            <div className="text-2xl font-bold">{soldCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalProducts > 0
                ? `${((soldCount / totalProducts) * 100).toFixed(1)}% du total`
                : "0 exemplaires vendus"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En reserve</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{EnReserve}</div>
            <p className="text-xs text-muted-foreground">
              {totalProducts > 0
                ? `${((EnReserve / totalProducts) * 100).toFixed(1)}% du total`
                : "0 exemplaires réservés"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unsoldCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalProducts > 0
                ? `${((unsoldCount / totalProducts) * 100).toFixed(
                    1
                  )}% du total`
                : "0 exemplaires disponibles"}
            </p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <ExemplaireProduitTable
          ExemplaireProduits={ExemplaireProduits}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
          onAdd={openAddForm}
          onInfo={setInfoOpen}
          onOutEdit={() => {
            toast.info(
              "La fonctionnalité de sortie n'est pas encore implémentée."
            );
          }}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          total={pagination.total}
          loading={loading}
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode
                ? "Modifier un exemplaire de produit"
                : "Ajouter un exemplaire de produit"}
            </DialogTitle>
          </DialogHeader>
          <ExemplaireProduitForm
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
      <ExemplaireInformation open={infoOpen} onOpenChange={setInfoOpen} />
    </div>
  );
}
