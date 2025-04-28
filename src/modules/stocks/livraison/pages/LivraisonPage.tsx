// pages/LivraisonPage.tsx
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Livraison, Partenaire } from "../types/types";
import { LivraisonFormValues } from "../schema/schema";
import LivraisonForm from "../components/LivraisonForm";
import LivraisonTable from "../components/LivraisonTable";
import {
  fetchLivraisons,
  fetchPartenaires,
  createLivraison,
  updateLivraison,
  deleteLivraison,
} from "../services/livraison.service";
import AlertDeleteDialog from "@/components/AlertDeleteDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";

const LivraisonPage: React.FC = () => {
  const [livraisons, setLivraisons] = useState<Livraison[]>([]);
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentLivraison, setCurrentLivraison] = useState<Livraison | null>(
    null
  );

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [idDelete, setIdDelete] = useState<number | null>(null);
  // Ajout d'un état pour gérer le mode édition
  const [isEditing, setIsEditing] = useState(false);
  
  // Ajout d'un état pour la recherche unifiée
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLivraisons, setFilteredLivraisons] = useState<Livraison[]>([]);

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      try {
        const [livraisonsData, partenairesData] = await Promise.all([
          fetchLivraisons(),
          fetchPartenaires(),
        ]);
        setLivraisons(livraisonsData);
        setFilteredLivraisons(livraisonsData); // Initialiser les livraisons filtrées
        setPartenaires(partenairesData);
      } catch (error) {
        toast("Erreur", {
          description: "Impossible de charger les données",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Créer un dictionnaire des partenaires pour faciliter l'accès par ID
  const partenaireDict = React.useMemo(() => {
    const dict: { [key: number]: Partenaire } = {};
    partenaires.forEach(partenaire => {
      dict[partenaire.id_partenaire] = partenaire;
    });
    return dict;
  }, [partenaires]);

  // Effet pour filtrer les livraisons en fonction de la recherche unifiée
  useEffect(() => {
    if (!searchQuery.trim()) {
      // Si la recherche est vide, afficher toutes les livraisons
      setFilteredLivraisons(livraisons);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = livraisons.filter((livraison) => {
      // Vérifier si la référence contient la recherche
      const matchReference = livraison.reference?.toLowerCase().includes(query);
      
      // Vérifier si le nom du partenaire contient la recherche
      const partenaire = partenaireDict[livraison.id_partenaire];
      const matchPartenaire = partenaire?.nom_partenaire?.toLowerCase().includes(query);
      
      // Retourner true si l'un des deux correspond
      return matchReference || matchPartenaire;
    });
    
    setFilteredLivraisons(filtered);
  }, [searchQuery, livraisons, partenaireDict]);

  // Gérer la création/édition
  const handleSubmit = async (values: LivraisonFormValues) => {
    setIsSubmitting(true);
    try {
      if (currentLivraison) {
        // Mise à jour
        const updatedLivraison = await updateLivraison({
          ...currentLivraison,
          ...values,
        });
        setLivraisons(
          livraisons.map((l) =>
            l.id_livraison === updatedLivraison.id_livraison
              ? updatedLivraison
              : l
          )
        );
        toast("Succès", {
          description: "L'achat mise à jour avec succès",
        });
      } else {
        // Création
        const newLivraison = await createLivraison(values as Livraison);
        setLivraisons([...livraisons, newLivraison]);
        toast("Succès", {
          description: "L'achat créée avec succès",
        });
      }
      setDialogOpen(false);
      setCurrentLivraison(null);
    } catch (error) {
      toast("Erreur", {
        description: "Une erreur est survenue lors de l'enregistrement",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteRequest = (id: number) => {
    setIdDelete(id);
    setShowDeleteDialog(true);
  };

  // Gérer la suppression
  const confirmDelete = async () => {
    if (idDelete === undefined || idDelete === null) return;
    setIsDeleting(true);
    setDeleteError(null);
    if (!idDelete) return;

    // Ajouter un petit délai pour l'animation de succès
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      await deleteLivraison(idDelete);
      setLivraisons(livraisons.filter((l) => l.id_livraison !== idDelete));
      toast("Succès", { description: "L'achat supprimée avec succès" });
      setShowDeleteDialog(false);
      setIdDelete(null);
    } catch (error) {
      setDeleteError("La suppression a échoué. Veuillez réessayer.");
      toast("Erreur", { description: "Impossible de supprimer l'achat" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Ouvrir le formulaire d'édition
  const handleEdit = (livraison: Livraison) => {
    setCurrentLivraison(livraison);
    setIsEditing(true);
    setDialogOpen(true);
  };

  // Ouvrir le formulaire de création
  const handleCreate = () => {
    setIsEditing(false);
    setCurrentLivraison(null);
    setDialogOpen(true);
  };

  // Réinitialiser la recherche
  const resetSearch = () => {
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">Chargement en cours...</div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Achats</h1>
        <Button variant={"blue"} onClick={handleCreate}> <Plus className="mr-2 h-4 w-" />Nouvel Achats</Button>
      </div>

      {/* Section de recherche unifiée */}
      <div className=" p-4 rounded-lg mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 " />
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

      <LivraisonTable
        livraisons={filteredLivraisons}
        partenaires={partenaires}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {currentLivraison
                ? "Modifier l'achat"
                : "Nouvel achat"}
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