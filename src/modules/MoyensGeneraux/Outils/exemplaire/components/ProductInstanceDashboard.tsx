// src/components/dashboard/ProductInstanceDashboard.tsx
import { useState, useRef } from "react";
import { ProductInstanceTable } from "./ProductInstanceTable";
import { ProductInstanceForm } from "@/modules/stocks/exemplaire";
import { useProductInstances } from "../hooks/useProductInstances";
import { ProductInstance, PaginationParams } from "../types";
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
import { RetourForms } from "../../Retour/components/RetourForms";
import { ExemplaireSortieForm } from "../../sorties/components/ExemplaireSortieForm";

export function ProductInstanceDashboard({
  id_outil,
}: {
  id_outil: string | number | undefined;
}) {
  const formRef = useRef<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isOutFormOpen, setIsOutFormOpen] = useState(false);
  const [isReturnFormOpen, setIsReturnFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentInstance, setCurrentInstance] =
    useState<ProductInstance | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  // const [searchTerm, setSearchTerm] = useState("");
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

  const handleOnReturn = (instance: ProductInstance) => {
    setCurrentInstance(instance);
    setIsReturnFormOpen(true);
  };

  const handleOnOut = (instance: ProductInstance) => {
    setCurrentInstance(instance);
    setIsOutFormOpen(true);
  };
  const handleFormSuccess = () => {
    toast.success(
      isEditMode
        ? "Exemplaire modifié avec succès"
        : `Exemplaire "${formRef.current.getValues(
            "num_serie"
          )}" ajouté avec succès`,
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

  return (
    <div className="container mx-auto py-6 space-y-6">
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
          onOut={handleOnOut}
          onReturn={handleOnReturn}
        />
      )}

      <Dialog open={isReturnFormOpen} onOpenChange={setIsReturnFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Retourner un outil</DialogTitle>
          </DialogHeader>
          <RetourForms
            sortieData={{
              id_exemplaire: currentInstance?.id_exemplaire ?? "",
              id_employes: "",
              but_usage: "",
              etat_avant: currentInstance?.etat_vente ?? "",
              date_de_sortie: "",
              site_intervention: "",
              commentaire: "",
            }}
            defaultValues={{
              id_exemplaire: currentInstance?.id_exemplaire ?? "",
              id_employes: "",
              etat_apres: currentInstance?.etat_vente ?? "",
              date_de_retour: "",
              commentaire: "",
            }}
            onSubmit={() => {}} // TODO: implement submit logic
            onCancel={() => setIsReturnFormOpen(false)}
            isEditMode={false}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={isOutFormOpen} onOpenChange={setIsOutFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter une sortie d'outil</DialogTitle>
          </DialogHeader>
          <ExemplaireSortieForm
            onSubmit={() => {}}
            onCancel={() => setIsOutFormOpen(false)}
            defaultValues={{
              id_exemplaire: Number(currentInstance?.id_produit),
              id_employes: 0,
              but_usage: "",
              etat_avant: "",
              date_de_sortie: "",
              site_intervention: "",
              commentaire: "",
            }}
            isEditMode={false}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Modifier un exemplaire" : "Ajouter un exemplaire"}
            </DialogTitle>
          </DialogHeader>
          <ProductInstanceForm
            ref={formRef}
            initialData={
              currentInstance || {
                id_produit: String(id_outil),
                etat_vente: "bon",
              }
            }
            onSuccess={handleFormSuccess}
            onCancel={closeForm}
            isEditMode={isEditMode}
            isTools={true}
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
