import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { ArrowLeft, Upload, Save, X, Edit, Plus } from "lucide-react";
import { NatureDocument } from "../administration/types/interfaces";
import useDocumentsApi from "../services/finance_comptaService";
import { useDemandesApi } from "../services/demandeService";
import { DossierCombobox } from "@/components/combobox/DossierCombobox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Clés de requête pour TanStack Query
const natureKeys = {
  all: ["natures"] as const,
  lists: () => [...natureKeys.all, "list"] as const,
  list: () => [...natureKeys.lists()] as const,
  details: () => [...natureKeys.all, "detail"] as const,
  detail: (id: number) => [...natureKeys.details(), id] as const,
};

const AddFinanceCompta: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getAllNatureDocument, createDocument } = useDocumentsApi();
  const { createNature: createNatureApi, updateNature: updateNatureApi, deleteNature: deleteNatureApi } = useDemandesApi();

  const [formData, setFormData] = useState({
    libelle_document: "",
    lien_document: "",
    date_document: "",
    id_nature_document: 0,
    etat_document: "",
    id_dossier: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  // États pour la création de nature
  const [newNatureLibelle, setNewNatureLibelle] = useState("");
  
  // États pour la modification de nature
  const [editingNature, setEditingNature] = useState<{ id: number; libelle: string } | null>(null);
  const [editNatureLibelle, setEditNatureLibelle] = useState("");

  // Hook pour récupérer les natures
  const { data: allNatures, isLoading: naturesLoading, error: naturesError } = useQuery({
    queryKey: natureKeys.list(),
    queryFn: async () => {
      console.log("🔍 Récupération des natures...");
      const result = await getAllNatureDocument();
      console.log("📋 Natures récupérées:", result);
      return result;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
    retryDelay: 1000,
  });

  // Filtrer les natures selon le type (finance ou comptabilité)
  const natures = allNatures?.filter(
    (n) => n.libelle === "Comptabilité" || n.libelle === "Finance"
  ) || [];

  // Hook pour créer une nature
  const createNature = useMutation({
    mutationFn: (libelle: string) => createNatureApi(libelle),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: natureKeys.list(),
      });
      toast.success("Nature créée avec succès");
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la création de la nature:", error);
      toast.error(`Erreur lors de la création de la nature: ${error.message}`);
    },
  });

  // Hook pour mettre à jour une nature
  const updateNature = useMutation({
    mutationFn: ({ id, libelle }: { id: number; libelle: string }) => updateNatureApi(id, libelle),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: natureKeys.list(),
      });
      toast.success("Nature mise à jour avec succès");
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la mise à jour de la nature:", error);
      toast.error(`Erreur lors de la mise à jour de la nature: ${error.message}`);
    },
  });

  // Hook pour supprimer une nature
  const deleteNature = useMutation({
    mutationFn: (id: number) => deleteNatureApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: natureKeys.list(),
      });
      toast.success("Nature supprimée avec succès");
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la suppression de la nature:", error);
      const errorMessage = error.message;
      
      if (errorMessage.includes("utilisée") || errorMessage.includes("utilisé")) {
        toast.info(errorMessage, {
          style: {
            background: '#dbeafe',
            color: '#1e40af',
            border: '1px solid #3b82f6',
          },
          icon: 'ℹ️',
        });
      } else {
        toast.error(errorMessage);
      }
    },
  });

  // Handler pour créer une nouvelle nature
  const handleCreateNature = async () => {
    if (!newNatureLibelle.trim()) return;
    
    try {
      const newNature = await createNature.mutateAsync(newNatureLibelle);
      // Gérer le cas où l'API retourne id_nature_document
      const natureId = (newNature as NatureDocument).id_nature_document;
      if (natureId) {
        setFormData(prev => ({ ...prev, id_nature_document: natureId }));
      }
      setNewNatureLibelle("");
    } catch (error) {
      console.error("Erreur lors de la création de la nature:", error);
    }
  };

  // Handler pour modifier une nature
  const handleUpdateNature = async () => {
    if (!editingNature || !editNatureLibelle.trim()) return;
    
    try {
      await updateNature.mutateAsync({
        id: editingNature.id,
        libelle: editNatureLibelle.trim()
      });
      setEditingNature(null);
      setEditNatureLibelle("");
    } catch (error) {
      console.error("Erreur lors de la modification de la nature:", error);
    }
  };

  // Handler pour supprimer une nature
  const handleDeleteNature = async (natureId: number) => {
    try {
      await deleteNature.mutateAsync(natureId);
    } catch (error) {
      console.error("Erreur lors de la suppression de la nature:", error);
    }
  };

  // Handler pour commencer l'édition d'une nature
  const handleStartEdit = (nature: NatureDocument) => {
    const id = nature.id_nature_document;
    if (id) {
      setEditingNature({ id, libelle: nature.libelle });
      setEditNatureLibelle(nature.libelle);
    }
  };

  const type_dossier = natures
    .find((n) => n.id_nature_document === formData.id_nature_document)
    ?.libelle?.toLowerCase();

  useEffect(() => {
    // Pré-sélectionner la nature selon le type (finance ou comptabilite)
    if (type === "finance" && allNatures) {
      const financeNature = allNatures.find(
        (n) =>
          n.libelle &&
          (n.libelle.toLowerCase().includes("finance") ||
            n.libelle.toLowerCase().includes("financier"))
      );
      if (financeNature) {
        setFormData((prev) => ({
          ...prev,
          id_nature_document: financeNature.id_nature_document,
        }));
      }
    } else if (type === "comptabilite" && allNatures) {
      const comptabiliteNature = allNatures.find(
        (n) =>
          n.libelle &&
          (n.libelle.toLowerCase().includes("comptabilite") ||
            n.libelle.toLowerCase().includes("comptable") ||
            n.libelle.toLowerCase().includes("compta"))
      );
      if (comptabiliteNature) {
        setFormData((prev) => ({
          ...prev,
          id_nature_document: comptabiliteNature.id_nature_document,
        }));
      }
    }
  }, [type, allNatures]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setFormData((prev) => ({
        ...prev,
        lien_document: file.name,
      }));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileName("");
    setFormData((prev) => ({
      ...prev,
      lien_document: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.libelle_document.trim()) {
      toast.error("Le titre du document est requis");
      return;
    }
    if (!formData.id_nature_document) {
      toast.error("Veuillez sélectionner un type de document");
      return;
    }

    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    if (!formData.id_dossier) {
      toast.error("Veuillez sélectionner un dossier");
      return;
    }

    setLoading(true);

    try {
      await createDocument({
        ...formData,
        document: selectedFile,
      });

      toast.success("Document ajouté avec succès");

      // Rediriger vers la liste
      // navigate(-1);
      navigate(
        `/finance-et-compatibilite/${
          type_dossier?.toLowerCase() === "comptabilité"
            ? "comptabilite"
            : "finance"
        }/dossier/${formData.id_dossier}`
      );
    } catch (error: unknown) {
      console.error("Erreur lors de l'ajout du document:", error);
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        console.error("Réponse backend:", err.response?.data);
        toast.error(
          err.response?.data?.message || "Impossible d'ajouter le document"
        );
      } else {
        toast.error("Impossible d'ajouter le document");
      }
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    return type === "finance"
      ? "Ajouter un Document Finance"
      : "Ajouter un Document Comptabilité";
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">{getTitle()}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations du document</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Titre du document */}
              <div className="space-y-2">
                <Label htmlFor="libelle_document">Titre du document *</Label>
                <Input
                  id="libelle_document"
                  value={formData.libelle_document}
                  onChange={(e) =>
                    handleInputChange("libelle_document", e.target.value)
                  }
                  placeholder="Entrez le titre du document"
                  required
                />
              </div>

              {/* Type de document */}
              <div className="space-y-2">
                <Label htmlFor="nature">Type de document *</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.id_nature_document.toString()}
                    onValueChange={(value) =>
                      handleInputChange("id_nature_document", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sélectionnez un type</SelectItem>
                      {naturesLoading ? (
                        <SelectItem value="loading" disabled>Chargement...</SelectItem>
                      ) : naturesError ? (
                        <SelectItem value="error" disabled>Erreur: {String(naturesError)}</SelectItem>
                      ) : natures && natures.length > 0 ? (
                        natures
                          .filter(nature => nature && nature.id_nature_document && nature.libelle)
                          .map((nature) => {
                            const natureId = nature.id_nature_document!;
                            const isEditing = editingNature?.id === natureId;
                            
                            return (
                              <div key={natureId} className="relative">
                                {isEditing ? (
                                  <div className="flex items-center gap-2 p-2">
                                    <Input
                                      value={editNatureLibelle}
                                      onChange={(e) => setEditNatureLibelle(e.target.value)}
                                      className="flex-1 h-8 text-sm"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          handleUpdateNature();
                                        } else if (e.key === 'Escape') {
                                          setEditingNature(null);
                                          setEditNatureLibelle("");
                                        }
                                      }}
                                    />
                                    <Button
                                      size="sm"
                                      onClick={handleUpdateNature}
                                      disabled={updateNature.isLoading}
                                      className="h-8 px-2"
                                    >
                                      {updateNature.isLoading ? "..." : "✓"}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setEditingNature(null);
                                        setEditNatureLibelle("");
                                      }}
                                      className="h-8 px-2"
                                    >
                                      ✕
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between p-2 hover:bg-gray-50">
                                    <SelectItem 
                                      value={natureId.toString()}
                                      className="flex-1 cursor-pointer"
                                    >
                                      {nature.libelle}
                                    </SelectItem>
                                    <div className="flex items-center gap-1 ml-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleStartEdit(nature);
                                        }}
                                        className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                      >
                                        <Edit size={12} />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleDeleteNature(natureId);
                                        }}
                                        disabled={deleteNature.isLoading}
                                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        title="Supprimer cette nature"
                                      >
                                        <X size={12} />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                      ) : (
                        <>
                          <SelectItem value="1">Comptabilité</SelectItem>
                          <SelectItem value="2">Finance</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="px-3"
                      >
                        <Plus size={16} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium leading-none">Créer une nouvelle nature</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Créez un nouveau type de document pour l'utiliser immédiatement.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nature-libelle">Libellé de la nature</Label>
                          <Input
                            id="nature-libelle"
                            value={newNatureLibelle}
                            onChange={(e) => setNewNatureLibelle(e.target.value)}
                            placeholder="Ex: Comptabilité générale"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleCreateNature();
                              }
                            }}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setNewNatureLibelle("")}
                            className="flex-1"
                          >
                            Annuler
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleCreateNature}
                            disabled={!newNatureLibelle.trim() || createNature.isLoading}
                            className="flex-1"
                          >
                            {createNature.isLoading ? "Création..." : "Créer"}
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Date du document */}
              <div className="space-y-2">
                <Label htmlFor="date_document">Date du document</Label>
                <Input
                  id="date_document"
                  type="date"
                  value={formData.date_document}
                  onChange={(e) =>
                    handleInputChange("date_document", e.target.value)
                  }
                />
              </div>

              
              {/* État du document */}
              <div className="space-y-2">
                <Label htmlFor="etat_document">État du document</Label>
                <Input
                  id="etat_document"
                  value={formData.etat_document}
                  onChange={(e) =>
                    handleInputChange("etat_document", e.target.value)
                  }
                  placeholder="Ex: actif, archivé..."
                />
              </div>
              {/* Dossier */}
              {type_dossier && (
                <div className="space-y-2">
                  <Label htmlFor="dossier">Dossier *</Label>
                  <DossierCombobox
                    value={formData.id_dossier || undefined}
                    onChange={(value) => handleInputChange("id_dossier", value)}
                    type={type_dossier}
                  />
                </div>
              )}

              {/* Upload de fichier */}
              <div className="space-y-2">
                <Label htmlFor="file">Fichier *</Label>
                {!selectedFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("file-input")?.click()
                        }
                      >
                        Sélectionner un fichier
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      PDF, DOCX, XLSX, PPTX ou images acceptés
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Upload className="h-5 w-5 text-gray-500" />
                        <span className="text-sm font-medium">{fileName}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                )}
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png"
                />
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save size={16} />
                  )}
                  {loading ? "Ajout en cours..." : "Ajouter le document"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddFinanceCompta;
