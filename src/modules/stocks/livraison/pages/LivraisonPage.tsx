// pages/LivraisonPage.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LivraisonFormValues } from "../schema/schema";
import LivraisonForm from "../components/LivraisonForm";
import LivraisonTable from "../components/LivraisonTable";
import AlertDeleteDialog from "@/components/AlertDeleteDialog";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useLivraisonData, useLivraisonMutations } from "../hooks/useLivraison";
import { useDeleteDialog, useDialogState } from "../hooks/useDialog";
import { useSearch } from "../hooks/useSearch";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

const LivraisonPage: React.FC = () => {
  // Extraire les données et l'état de chargement
  const { livraisons, partenaires, partenaireDict, isLoading } =
    useLivraisonData();

  // Gestion du dialogue (création/édition)
  const {
    dialogOpen,
    setDialogOpen,
    currentLivraison,
    isEditing,
    handleEdit,
    handleCreate,
    handleClose,
  } = useDialogState();

  // Gestion des mutations (création, mise à jour, suppression)
  const { submitLivraison, removeLivraison, isSubmitting, isDeleting } =
    useLivraisonMutations();

  // Gestion de la recherche et du filtrage
  const { searchQuery, setSearchQuery, filteredLivraisons, resetSearch } =
    useSearch(livraisons, partenaireDict);

  // Gestion du dialogue de suppression
  const {
    showDeleteDialog,
    setShowDeleteDialog,
    idDelete,
    deleteError,
    setDeleteError,
    handleDeleteRequest,
    resetDeleteState,
  } = useDeleteDialog();

  // Gérer la soumission du formulaire
  const handleSubmit = async (values: LivraisonFormValues) => {
    await submitLivraison(values, currentLivraison);
    handleClose();
  };

  // Confirmer la suppression
  const confirmDelete = async () => {
    if (idDelete === null) return;
    setDeleteError(null);

    try {
      await removeLivraison(idDelete);
      resetDeleteState();
    } catch (error) {
      setDeleteError("La suppression a échoué. Veuillez réessayer.");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Achats</h1>
        <Button variant={"blue"} onClick={handleCreate}>
          {" "}
          <Plus className="mr-2 h-4 w-4" />
          Nouvel Achat
        </Button>
      </div>

      {/* Section de recherche unifiée */}
      <div className="p-4 rounded-lg mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5" />
          </div>
          <Input
            type="search"
            placeholder="Rechercher par référence ou partenaire..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute inset-y-0 right-0 pr-3"
              onClick={resetSearch}
            >
              Effacer
            </Button>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {filteredLivraisons.length} résultat(s) trouvé(s)
        </div>
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <LivraisonTable
          livraisons={filteredLivraisons}
          partenaires={partenaires}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {currentLivraison ? "Modifier l'achat" : "Nouvel achat"}
            </DialogTitle>
          </DialogHeader>
          <LivraisonForm
            defaultValues={currentLivraison as LivraisonFormValues}
            partenaires={partenaires}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isEditing={isEditing}
          />
        </DialogContent>
      </Dialog>

      <AlertDeleteDialog
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        message={`Êtes-vous sûr de vouloir supprimer l'achat avec l'ID ${idDelete} ? Cette action est irréversible.`}
        id={idDelete ?? ""}
        handleSupprimer={confirmDelete}
        isDeleting={isDeleting}
        deleteError={deleteError}
      />
    </div>
  );
};

export default LivraisonPage;
