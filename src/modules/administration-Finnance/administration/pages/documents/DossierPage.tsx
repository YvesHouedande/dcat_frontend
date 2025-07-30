import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  PlusCircle,
  Eye,
  FileText,
  Edit,
  Trash2,
  MoreHorizontal,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useNavigate } from "react-router-dom";

import { useDebounce } from "@/modules/stocks/entree/utils/helpers";
import {
  useCreateDossier,
  useDossiersByType,
  useDeleteDossier,
  useUpdateDossier,
} from "@/modules/administration-Finnance/dossier/hooks/useDosier";
import { DossierType } from "@/modules/administration-Finnance/dossier/types/dossierType";

// Ajoute un type local pour la structure de réponse API attendue

const DossierPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();
  const [dossiers, setDossiers] = useState<DossierType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nomDossier, setNomDossier] = useState("");
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<DossierType | null>(
    null
  );
  const [nouveauNom, setNouveauNom] = useState("");

  const debouncedSearchTerm = useDebounce(searchQuery, 300);
  // Déterminer l'onglet actif basé sur la route

  const {
    dossiersByType,
    isLoadingDossiersByType,
    isErrorDossiersByType,
    refetchDossiersByType,
    fetchNextDossiersByType,
    hasNextPageDossiersByType,
    isFetchingNextPageDossiersByType,
  } = useDossiersByType("contrat", {
    libelle_dossier: debouncedSearchTerm,
  });
  const { createDossier } = useCreateDossier();
  const { deleteDossierAsync, isDeletingDossier } = useDeleteDossier();
  const { updateDossierAsync, isUpdatingDossier } = useUpdateDossier();

  useEffect(() => {
    refetchDossiersByType();
    setDossiers(dossiersByType?.pages.flatMap((page) => page.data) || []);
  }, [refetchDossiersByType, dossiersByType]); // L'effet se déclenchera uniquement lorsque l'onglet change

  // Fonction pour extraire le type de fichier à partir de l'extension

  // Filtrage des documents basé sur la recherche

  const handleCreateDossier = () => {
    setIsDialogOpen(true);
  };

  const handleValidateCreateDossier = () => {
    if (nomDossier.trim()) {
      try {
        createDossier({
          libelle_dossier: nomDossier.trim(),
          type_dossier: "contrat",
        });
        setIsDialogOpen(false);
        setNomDossier("");
      } catch (error) {
        console.error("Erreur lors de la création du dossier:", error);
      }
    }
  };

  const handleRenameDossier = (dossier: DossierType) => {
    setSelectedDossier(dossier);
    setNouveauNom(dossier.libelle_dossier);
    setIsRenameDialogOpen(true);
  };

  const handleValidateRename = () => {
    if (selectedDossier && nouveauNom.trim()) {
      try {
        updateDossierAsync({
          id: selectedDossier.id_dossier.toString(),
          dossier: {
            libelle_dossier: nouveauNom.trim(),
          },
        });
        setIsRenameDialogOpen(false);
        setSelectedDossier(null);
        setNouveauNom("");
      } catch (error) {
        console.error("Erreur lors du renommage du dossier:", error);
      }
    }
  };

  const handleDeleteDossier = (dossier: DossierType) => {
    setSelectedDossier(dossier);
    setIsDeleteDialogOpen(true);
  };

  const handleValidateDelete = () => {
    if (selectedDossier) {
      try {
        deleteDossierAsync(selectedDossier.id_dossier.toString());
        setIsDeleteDialogOpen(false);
        setSelectedDossier(null);
      } catch (error) {
        console.error("Erreur lors de la suppression du dossier:", error);
      }
    }
  };

  if (isErrorDossiersByType) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        Erreur lors du chargement des dossiers
      </div>
    );
  }

  // Vérification de sécurité supplémentaire
  if (!Array.isArray(dossiers)) {
    console.error("dossiers n'est pas un tableau:", dossiers);
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        Erreur de format de données
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header avec titre et actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Gestion des Dossiers contrats
            </h1>
            <p className="text-sm text-gray-500">
              {dossiers.length} dossier
              {dossiers.length !== 1 ? "s" : ""} disponible
              {dossiers.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="rounded-none h-8"
                onClick={() => setViewMode("grid")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-none h-8"
                onClick={() => setViewMode("list")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </Button>
            </div>

            <Button
              onClick={handleCreateDossier}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer h-8"
              size="sm"
            >
              <PlusCircle size={14} className="mr-1" />
              Ajouter un dossier
            </Button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="mb-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <Input
              placeholder="Rechercher par le libellé du dossier"
              className="pl-9 py-2 h-10 border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoadingDossiersByType ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              /* Grille compacte de documents */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-8 gap-y-10 px-4">
                {dossiers?.map((dossier) => (
                  <div
                    key={dossier.id_dossier}
                    className="flex flex-col items-center group w-[190px] relative"
                  >
                    {/* Menu d'actions - Toujours visible avec opacité réduite */}
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 bg-white/90 hover:bg-gray-100 border border-gray-300 shadow-md"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(
                                `/gestion-administrative/contrats/dossier/${dossier.id_dossier}`
                              )
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ouvrir
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRenameDossier(dossier)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Renommer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteDossier(dossier)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <span
                      className="inline-block cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/gestion-administrative/contrats/dossier/${dossier.id_dossier}`
                        )
                      }
                    >
                      <svg
                        width="180"
                        height="120"
                        viewBox="0 0 100 80"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transition-transform group-hover:scale-105"
                      >
                        <path
                          d="M10 20 H90 A5 5 0 0 1 95 25 V70 A10 10 0 0 1 85 80 H15 A10 10 0 0 1 5 70 V25 A5 5 0 0 1 10 20 Z"
                          fill="#FFD54F"
                        />
                        <path
                          d="M10 20 A5 5 0 0 1 15 15 H45 A5 5 0 0 1 50 20 H90 A5 5 0 0 1 95 25 V25 H10 Z"
                          fill="#FFB300"
                        />
                      </svg>
                    </span>
                    <div className="mt-2 w-full">
                      <span className="text-[13px] font-medium text-gray-700 text-center truncate block">
                        {dossier.libelle_dossier}
                      </span>
                    
                    </div>
                  </div>
                ))}
                {hasNextPageDossiersByType && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchNextDossiersByType()}
                  >
                    {isFetchingNextPageDossiersByType
                      ? "Chargement..."
                      : "Charger plus"}
                  </Button>
                )}
              </div>
            ) : (
              /* Vue liste compacte */
              <div className="border rounded-lg overflow-hidden bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left p-3 text-xs font-medium text-gray-500">
                        Dossier
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-500">
                        Libellé
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-500 hidden md:table-cell">
                        Type
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-500 hidden sm:table-cell">
                        Date
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-500 hidden lg:table-cell">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dossiers?.map((dossier) => (
                      <tr key={dossier.id_dossier}>
                        <td>
                          <svg
                            width="60"
                            height="30"
                            viewBox="0 0 100 80"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 20 H90 A5 5 0 0 1 95 25 V70 A10 10 0 0 1 85 80 H15 A10 10 0 0 1 5 70 V25 A5 5 0 0 1 10 20 Z"
                              fill="#FFD54F"
                            />

                            <path
                              d="M10 20 A5 5 0 0 1 15 15 H45 A5 5 0 0 1 50 20 H90 A5 5 0 0 1 95 25 V25 H10 Z"
                              fill="#FFB300"
                            />
                          </svg>
                        </td>
                        <td>{dossier.libelle_dossier}</td>
                        <td>{dossier.type_dossier}</td>
                        <td>{dossier.created_at}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/gestion-administrative/contrats/dossier/${dossier.id_dossier}`
                                )
                              }
                            >
                              <Eye size={14} className="mr-1" />
                              Voir
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleRenameDossier(dossier)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Renommer
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteDossier(dossier)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {hasNextPageDossiersByType && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchNextDossiersByType()}
                  >
                    {isFetchingNextPageDossiersByType
                      ? "Chargement..."
                      : "Charger plus"}
                  </Button>
                )}
              </div>
            )}

            {/* Message si aucun résultat */}
            {dossiers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 bg-white rounded-lg border mt-4">
                <FileText size={48} className="text-gray-300 mb-2" />
                <p className="text-gray-600 mb-2">
                  {searchQuery
                    ? "Aucun document ne correspond à votre recherche"
                    : `Aucun document ${"de contrat"} n'a encore été ajouté`}
                </p>
                {searchQuery ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                  >
                    Réinitialiser la recherche
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleCreateDossier}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusCircle size={14} className="mr-1" />
                    Ajouter le premier dossier
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Dialogue pour créer un dossier */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Créer un nouveau dossier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="nom-dossier">Nom du dossier</Label>
              <Input
                id="nom-dossier"
                value={nomDossier}
                onChange={(e) => setNomDossier(e.target.value)}
                placeholder="Saisir le nom du dossier"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleValidateCreateDossier();
                  }
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleValidateCreateDossier}
                disabled={!nomDossier.trim()}
              >
                Créer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogue de renommage */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Renommer le dossier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="nouveau-nom">Nouveau nom du dossier</Label>
              <Input
                id="nouveau-nom"
                value={nouveauNom}
                onChange={(e) => setNouveauNom(e.target.value)}
                placeholder="Saisir le nouveau nom"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleValidateRename();
                  }
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsRenameDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleValidateRename}
                disabled={!nouveauNom.trim() || isUpdatingDossier}
              >
                {isUpdatingDossier ? "Renommage..." : "Renommer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogue de suppression avec alerte */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Supprimer le dossier
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Êtes-vous sûr de vouloir supprimer le dossier{" "}
                <strong>"{selectedDossier?.libelle_dossier}"</strong> ?
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">⚠️ Attention :</p>
                    <p>
                      Si des fichiers sont présents dans ce dossier, ils seront
                      également supprimés définitivement. Cette action est
                      irréversible.
                    </p>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleValidateDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeletingDossier}
            >
              {isDeletingDossier
                ? "Suppression..."
                : "Supprimer définitivement"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DossierPage;
