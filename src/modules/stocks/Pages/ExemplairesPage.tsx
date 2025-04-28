import { useState } from "react";
import { useExemplaires } from "../exemplaires-manager/hooks/useExemplaires";
import { ExemplairesStats } from "../exemplaires-manager/components/ExemplairesStats";
import { ExemplairesFilters } from "../exemplaires-manager/components/ExemplairesFilters";
import { ExemplairesTable } from "../exemplaires-manager/components/ExemplairesTable";
import { ExemplairesForm } from "../exemplaires-manager/components/ExemplairesForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Package } from "lucide-react";
import { Exemplaire } from "../exemplaires-manager/types/exemplaires";
import { ExemplaireFormValues } from "../exemplaires-manager/schemas/exemplaires";

export const ExemplairesManager = () => {
  const {
    exemplaires,
    produits,
    commandes,
    livraisons,
    filteredExemplaires,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    generateExemplaireId,
    addExemplaire,
    updateExemplaire,
    deleteExemplaire,
  } = useExemplaires();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExemplaire, setCurrentExemplaire] = useState<Exemplaire | null>(
    null
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleCreate = () => {
    setCurrentExemplaire(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (exemplaire: Exemplaire) => {
    setCurrentExemplaire(exemplaire);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: ExemplaireFormValues) => {
    if (currentExemplaire) {
      updateExemplaire(data as Exemplaire);
    } else {
      addExemplaire({
        ...data,
        id_exemplaire: generateExemplaireId(),
      } as Exemplaire);
    }
    setIsDialogOpen(false);
  };

  const stats = {
    total: exemplaires.length,
    available: exemplaires.filter(
      (ex) => ex.etat_disponible_indisponible_ === "disponible"
    ).length,
    unavailable: exemplaires.filter(
      (ex) => ex.etat_disponible_indisponible_ === "indisponible"
    ).length,
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Package className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Gestion des Exemplaires</h1>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1 bg-blue-500 hover:bg-blue-500" />
          Ajouter un exemplaire
        </Button>
      </div>

      <ExemplairesStats {...stats} />

      <ExemplairesFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={() => {
          setSearchTerm("");
          setStatusFilter("all");
        }}
      />

      <Card>
        <CardContent className="p-0">
          <ExemplairesTable
            exemplaires={filteredExemplaires}
            produits={produits}
            onEdit={handleEdit}
            onDelete={deleteExemplaire}
            selectedIds={selectedIds}
            onSelectedChange={setSelectedIds}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {currentExemplaire
                ? `Modifier l'exemplaire ${currentExemplaire.id_exemplaire}`
                : "Ajouter un nouvel exemplaire"}
            </DialogTitle>
            <DialogDescription>
              {currentExemplaire
                ? "Modifiez les informations de l'exemplaire ci-dessous."
                : "Complétez le formulaire pour ajouter un nouvel exemplaire."}
            </DialogDescription>
          </DialogHeader>

          <ExemplairesForm
            initialData={currentExemplaire || undefined}
            produits={produits}
            commandes={commandes}
            livraisons={livraisons}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isEdit={!!currentExemplaire}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExemplairesManager;
