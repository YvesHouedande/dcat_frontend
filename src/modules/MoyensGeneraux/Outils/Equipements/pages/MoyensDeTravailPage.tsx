// Pages
// src/pages/MoyensDeTravailPage.tsx
import { useState } from "react";
import { useMoyensDeTravail } from "../hooks/useMoyensDeTravail";
import { MoyenDeTravailList } from "../components/MoyenDeTravailList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoyenDeTravailForm } from "../components/ui/MoyenDeTravailForm";
import { MoyenDeTravailFormValues } from "../schemas/moyenDeTravailSchema";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {AlertCircle, Plus } from "lucide-react";
import TableSkeleton from "@/components/skeleton/TableSkeleton";

export const MoyensDeTravailPage = () => {
  const {
    moyensQuery,
    getMoyenDeTravailQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useMoyensDeTravail();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    setSelectedId(id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedId(null);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (data: MoyenDeTravailFormValues) => {
    if (selectedId) {
      updateMutation.mutate(
        {
          id: selectedId,
          data,
        },
        {
          onSuccess: () => setIsDialogOpen(false),
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setIsDialogOpen(false),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      deleteMutation.mutate(selectedId, {
        onSuccess: () => setIsDeleteDialogOpen(false),
      });
    }
  };

  // Récupérer les détails du moyen de travail pour l'édition
  const selectedMoyenQuery = selectedId
    ? getMoyenDeTravailQuery(selectedId)
    : { data: undefined, isLoading: false };

  const isLoading = moyensQuery.isLoading || selectedMoyenQuery.isLoading;
  const isError = moyensQuery.isError;
  const mutationLoading =
    createMutation.isLoading ||
    updateMutation.isLoading ||
    deleteMutation.isLoading;

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Moyens de Travail</h1>
        <Button
          onClick={handleAdd}
          variant={"blue"}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <TableSkeleton />
        </div>
      )}

      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Une erreur est survenue lors du chargement des données.
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && moyensQuery.data && (
        <MoyenDeTravailList
          moyensDeTravail={moyensQuery.data}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedId
                ? "Modifier le moyen de travail"
                : "Ajouter un moyen de travail"}
            </DialogTitle>
          </DialogHeader>
          <MoyenDeTravailForm
            initialValues={selectedMoyenQuery.data}
            onSubmit={handleFormSubmit}
            isLoading={mutationLoading}
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
              Cette action est irréversible. Cela supprimera définitivement ce
              moyen de travail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
