import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebouncedCallback } from "use-debounce";
import { Truck, Plus, Edit3, Trash2, Save, X, Search } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  useLivraisonData,
  useLivraisonMutations,
} from "@/modules/stocks/livraison/hooks/useLivraison";
import { LivraisonFormValues } from "@/modules/stocks/livraison/pages";
import { toast } from "sonner";
import { NewDatePicket } from "@/components/NewDatePicket";

// Types pour nos paramètres

// Données de démonstration

export default function ParametersManager() {
  const { livraisons, errorLivraisons, isLoading } = useLivraisonData();
  const { createMutation, updateMutation, deleteMutation } =
    useLivraisonMutations();
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [editValue, setEditValue] = useState<LivraisonFormValues>();
  const [newParam, setNewParam] = useState<LivraisonFormValues>();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Création de la fonction debounced avec useCallback pour éviter les re-créations inutiles
  const debouncedSetSearchTerm = useDebouncedCallback((value: string) => {
    setDebouncedSearchTerm(value);
  }, 300);

  // Gestionnaire pour la recherche avec debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value); // Mise à jour immédiate pour l'affichage
    debouncedSetSearchTerm(value); // Mise à jour debounced pour le filtrage
  };

  // Utilisation de useMemo pour optimiser le filtrage
  const filteredParameters = useMemo(() => {
    return livraisons?.filter((param) => {
      const matchesSearch = String(
        param.reference_livraison.toLowerCase()
      ).includes(debouncedSearchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [livraisons, debouncedSearchTerm]);

  // Démarrer l'édition
  const startEditing = (param: LivraisonFormValues) => {
    setEditingId(param.id_livraison);
    setEditValue(param);
  };

  // Sauvegarder les modifications
  const saveEdit = () => {
    updateMutation.mutate(
      {
        id_livraison: editingId!,
        ...editValue,
      },
      {
        onSuccess: () => {
          setEditingId(undefined);
          setEditValue(undefined);
        },
        onError: (error) => {
          toast.error(
            "Erreur lors de la mise à jour de la livraison: " + error
          );
        },
      }
    );
    setEditingId(undefined);
    setEditValue(undefined);
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingId(undefined);
    setEditValue(undefined);
  };

  // Supprimer un paramètre
  const deleteParameter = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Livraison supprimée avec succès");
      },
      onError: (error) => {
        toast.error("Erreur lors de la suppression de la livraison: " + error);
      },
    });
  };

  // Ajouter un nouveau paramètre
  const addParameter = () => {
    if (!newParam?.reference_livraison.trim()) return;
    const newParameter: LivraisonFormValues = {
      reference_livraison: newParam.reference_livraison,
      qteProduits: newParam.qteProduits,
      date_livraison: newParam.date_livraison,
      frais_divers: newParam.frais_divers,
      Commentaire: newParam.Commentaire,
    };

    createMutation.mutate(newParameter, {
      onSuccess: () => {
        setNewParam({
          reference_livraison: "",
          qteProduits: 1,
          date_livraison: "",
          Commentaire: "",
          frais_divers: 0,
        });
      },
      onError: (error) => {
        toast.error("Erreur lors de l'ajout de la livraison: " + error);
      },
    });

    setNewParam(undefined);
    setShowAddForm(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Truck size={18} /> Livraison
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="w-full max-w-6xl mx-auto p-6">
          <SheetHeader>
            {/* En-tête */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <SheetTitle>
                    <h1 className="text-lg font-bold text-gray-900">
                      Gestion des Livraisons
                    </h1>
                  </SheetTitle>
                  <SheetDescription>
                    <p className="text-gray-600">
                      Configurez les paramètres de livraison
                    </p>
                  </SheetDescription>
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Barre de recherche avec debounce */}
          <div className="flex gap-4 mb-6 p-4 rounded-xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher une livraison..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
                disabled={isLoading}
              />
              {/* Indicateur visuel optionnel pour montrer que la recherche est active */}
              {searchTerm !== debouncedSearchTerm && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-auto max-h-[60vh]">
            {/* Formulaire d'ajout */}
            {showAddForm && (
              <div className="mb-6 p-2 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-blue-900">
                  Ajouter une nouvelle livraison
                </h3>
                <div className="w-full space-y-4">
                  <div>
                    <Label htmlFor="param-divers" className="block mb-2">
                      Frais divers
                    </Label>
                    <Input
                      id="param-divers"
                      value={newParam?.frais_divers}
                      onChange={(e) =>
                        setNewParam((prev) => ({
                          ...prev!,
                          frais_divers: Number(e.target.value),
                        }))
                      }
                      placeholder="Ex: 5.00"
                      type="number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="param-name" className="block mb-2">
                      Nom de la livraison
                    </Label>
                    <Input
                      id="param-name"
                      value={newParam?.reference_livraison}
                      onChange={(e) =>
                        setNewParam((prev) => ({
                          ...prev!,
                          reference_livraison: e.target.value,
                        }))
                      }
                      placeholder="Ex: livraison standard"
                    />
                  </div>
                  <div>
                    <Label htmlFor="param-qte" className="block mb-2">
                      Quantié de produits
                    </Label>
                    <Input
                      id="param-qte"
                      value={newParam?.qteProduits}
                      onChange={(e) =>
                        setNewParam((prev) => ({
                          ...prev!,
                          qteProduits: Number(e.target.value),
                        }))
                      }
                      type="number"
                      min={1}
                    />
                  </div>

                  <div>
                    <NewDatePicket
                      onChange={(date: Date | undefined) => {
                        setNewParam((prev) => ({
                          ...prev!,
                          date_livraison: String(date),
                        }));
                      }}
                      label="date de livraison"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={addParameter}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewParam(undefined);
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}

            {/* Liste des paramètres */}
            <div className="space-y-3">
              {filteredParameters?.map((param) => (
                <div
                  key={param.id_livraison}
                  className="group rounded-xl p-2 hover:shadow-sm transition-all "
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {editingId === param.id_livraison ? (
                        <div className="flex items-center flex-col gap-2 shadow-sm p-2 rounded-lg">
                          <div className="w-full space-y-4">
                            <div>
                              <Label
                                htmlFor="param-divers"
                                className="block mb-2"
                              >
                                Frais divers
                              </Label>
                              <Input
                                id="param-divers"
                                value={editValue?.frais_divers}
                                onChange={(e) =>
                                  setEditValue((prev) => ({
                                    ...prev!,
                                    frais_divers: Number(e.target.value),
                                  }))
                                }
                                placeholder="Ex: 5.00"
                                type="number"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="param-name"
                                className="block mb-2"
                              >
                                Nom de la livraison
                              </Label>
                              <Input
                                id="param-name"
                                value={editValue?.reference_livraison}
                                onChange={(e) =>
                                  setEditValue((prev) => ({
                                    ...prev!,
                                    reference_livraison: e.target.value,
                                  }))
                                }
                                placeholder="Ex: livraison standard"
                                autoFocus
                              />
                            </div>
                            <div>
                              <Label htmlFor="param-qte" className="block mb-2">
                                Quantié de produits
                              </Label>
                              <Input
                                id="param-qte"
                                value={editValue?.qteProduits}
                                onChange={(e) =>
                                  setEditValue((prev) => ({
                                    ...prev!,
                                    qteProduits: Number(e.target.value),
                                  }))
                                }
                                type="number"
                                min={1}
                              />
                            </div>

                            <div>
                              <NewDatePicket
                                onChange={(date: Date | undefined) => {
                                  setEditValue((prev) => ({
                                    ...prev!,
                                    date_livraison: String(date),
                                  }));
                                }}
                                label="date de livraison"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 w-full">
                            <Button
                              size="sm"
                              onClick={saveEdit}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Sauvegarder
                              <Save className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                            >
                              Annuler
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Label className="w-full font-mono inline-block">
                            {param.reference_livraison}
                          </Label>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditing(param)}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                deleteParameter(Number(param.id_livraison))
                              }
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : errorLivraisons ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-red-900 mb-2">
                Erreur de chargement
              </h3>
              <p className="text-red-600">
                Impossible de charger les livraisons. Veuillez réessayer plus
                tard.
              </p>
            </div>
          ) : (
            livraisons?.length == 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune livraison disponible
                </h3>
                <p className="text-gray-600">
                  Vous n'avez pas encore de livraisons. Ajoutez-en une pour
                  commencer.
                </p>
              </div>
            )
          )}
          {filteredParameters?.length === 0 && livraisons?.length !== 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune livraison trouvée
              </h3>
              <div className="text-gray-600">
                <p>Aucun résultat pour "{debouncedSearchTerm}"</p>
                <p>
                  Essayez de modifier vos critères de recherche ou ajoutez une
                  nouvelle livraison.
                </p>
              </div>
            </div>
          )}
        </div>
        <SheetFooter>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvelle Livraison
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Fermer</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
