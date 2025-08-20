import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { Textarea } from "@/components/ui/textarea";
import { Upload, Plus, Edit, X } from "lucide-react";
import { ContratDocument, NatureDocument } from "../../types/interfaces";
import { useContratsApi } from "../../../services/contratService";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DossierCombobox } from "@/components/combobox/DossierCombobox";
import useDocumentsApi from "@/modules/administration-Finnance/services/finance_comptaService";

interface DocumentSheetProps {
  contratId?: number;
  onDocumentAdded?: () => void;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Clés de requête pour TanStack Query
const natureKeys = {
  all: ["natures"] as const,
  lists: () => [...natureKeys.all, "list"] as const,
  list: () => [...natureKeys.lists()] as const,
  details: () => [...natureKeys.all, "detail"] as const,
  detail: (id: number) => [...natureKeys.details(), id] as const,
};

const DocumentSheet: React.FC<DocumentSheetProps> = ({
  contratId,
  onDocumentAdded,
  trigger,
  isOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { fetchNaturesDocument, createNature: createNatureApi, updateNature: updateNatureApi, deleteNature: deleteNatureApi } = useContratsApi();
  
  // Utiliser les props externes si fournies, sinon utiliser l'état interne
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { createDocument } = useDocumentsApi();
  
  // États pour la création de nature
  const [newNatureLibelle, setNewNatureLibelle] = useState("");
  
  // États pour la modification de nature
  const [editingNature, setEditingNature] = useState<{ id: number; libelle: string } | null>(null);
  const [editNatureLibelle, setEditNatureLibelle] = useState("");

  const [formData, setFormData] = useState<
    Omit<ContratDocument, "id_documents" | "id_employes">
  >({
    libelle_document: "",
    date_document: new Date().toISOString().split("T")[0],
    lien_document: "",
    etat_document: "actif",
    id_nature_document: 1,
    id_dossier: 0,
    id_contrat: Number(contratId),// Valeur par défaut
   
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hook pour récupérer les natures
  const { data: natures, isLoading: naturesLoading, error: naturesError } = useQuery({
    queryKey: natureKeys.list(),
    queryFn: async () => {
      console.log("🔍 Récupération des natures...");
      const result = await fetchNaturesDocument();
      console.log("📋 Natures récupérées:", result);
      return result;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
    retryDelay: 1000,
  });

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

  const etats = ["actif", "archivé"];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Nettoyer l'erreur si elle existe
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-remplir le libellé avec le nom du fichier
      setFormData((prev) => ({
        ...prev,
        libelle_document: file.name,
        lien_document: file.name,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.libelle_document.trim()) {
      newErrors.libelle_document = "Le libellé du document est obligatoire";
    }



    if (!formData.date_document) {
      newErrors.date_document = "La date du document est obligatoire";
    }

    if (!selectedFile) {
      newErrors.file = "Veuillez sélectionner un fichier";
    }

    if (!formData.id_nature_document) {
      newErrors.id_nature_document = "La nature du document est obligatoire";
    }
    if (!formData.id_dossier) {
      newErrors.id_dossier = "Le dossier est obligatoire";
    }

    // Validation de la taille du fichier (10MB max)
    if (selectedFile) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        newErrors.file = "Le fichier est trop volumineux (max 10MB)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!contratId) {
        toast.error("ID du contrat manquant");
        return;
      }

      // Validation de la taille du fichier (10MB max comme dans les interventions)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        toast.error("Le fichier est trop volumineux (max 10MB)");
        return;
      }

      // Appel au service pour ajouter le document
      // await addDocumentToContrat(contratId, formData, selectedFile);
      await createDocument({
        ...formData,
        document: selectedFile,
        id_contrat: contratId.toString(),
        id_dossier: Number(formData.id_dossier)
      });

      // console.log(JSON.stringify(formData))

      toast.success("Document ajouté avec succès !");
      setOpen(false);

      // Réinitialiser le formulaire
      setFormData({
        libelle_document: "",
        date_document: new Date().toISOString().split("T")[0],
        lien_document: "",
        etat_document: "actif",
        id_nature_document: 1,
        id_dossier: 0,
        id_contrat: contratId, // Ajout du champ manquant pour correspondre au type ContratDocument sans id_documents
      });
      setSelectedFile(null);
      setErrors({});

      // Callback pour rafraîchir la liste des documents
      if (onDocumentAdded) {
        onDocumentAdded();
      }
      
      // Rediriger vers la page principale après un délai
      
    } catch (error: unknown) {
      console.error("Erreur lors de l'ajout du document:", error);
      let errorMessage = "Erreur lors de l'ajout du document";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } })
          .response?.data?.message === "string"
      ) {
        errorMessage = (error as { response: { data: { message: string } } })
          .response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      libelle_document: "",
      date_document: new Date().toISOString().split("T")[0],
      lien_document: "",
      etat_document: "actif",
      id_nature_document: 1,
      id_dossier: 0,
      id_contrat: Number(contratId),
    });
    setSelectedFile(null);
    setErrors({});
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus size={16} className="mr-2" />
            Ajouter un document
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]  overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Ajouter un document</SheetTitle>
          <SheetDescription>
            Remplissez les informations du document à associer au contrat.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6 px-2">
          {/* Sélection du fichier */}
          <div className="space-y-2">
            <Label htmlFor="file">
              Fichier <span className="text-red-500">*</span>
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-500 font-medium">
                  {selectedFile
                    ? "Fichier sélectionné"
                    : "Cliquez pour sélectionner un fichier"}
                </span>
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-2">
                  {selectedFile.name} (
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                PDF, DOC, DOCX, JPG, PNG, XLS, XLSX (max 10MB par fichier)
              </p>
            </div>
            {errors.file && (
              <p className="text-red-500 text-sm">{errors.file}</p>
            )}
          </div>

          {/* Libellé du document */}
          <div className="space-y-2">
            <Label htmlFor="libelle_document">
              Libellé du document <span className="text-red-500">*</span>
            </Label>
            <Input
              id="libelle_document"
              name="libelle_document"
              value={formData.libelle_document}
              onChange={handleInputChange}
              placeholder="Nom du document"
              className={errors.libelle_document ? "border-red-500" : ""}
            />
            {errors.libelle_document && (
              <p className="text-red-500 text-sm">{errors.libelle_document}</p>
            )}
          </div>

          {/* Nature du document */}
          <div className="space-y-2">
            <Label htmlFor="id_nature_document">
              Nature du document <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Select
                value={formData.id_nature_document?.toString()}
                onValueChange={(value) =>
                  handleSelectChange("id_nature_document", parseInt(value))
                }
              >
                <SelectTrigger
                  className={errors.id_nature_document ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Sélectionner une nature" />
                </SelectTrigger>
                <SelectContent>
                  {naturesLoading ? (
                    <SelectItem value="" disabled>Chargement...</SelectItem>
                  ) : naturesError ? (
                    <SelectItem value="" disabled>Erreur: {String(naturesError)}</SelectItem>
                  ) : natures && Array.isArray(natures) && natures.length > 0 ? (
                    (natures as NatureDocument[])
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
                      <SelectItem value="1">Contrat</SelectItem>
                      <SelectItem value="2">Facture</SelectItem>
                      <SelectItem value="3">Rapport</SelectItem>
                      <SelectItem value="4">CV</SelectItem>
                      <SelectItem value="5">Procédure</SelectItem>
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
                    +
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
                        placeholder="Ex: Contrat de travail"
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
            {errors.id_nature_document && (
              <p className="text-red-500 text-sm">
                {errors.id_nature_document}
              </p>
            )}
          </div>

          {/* Date du document */}
          <div className="space-y-2">
            <Label htmlFor="date_document">
              Date du document <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={typeof formData.date_document === 'string' ? formData.date_document : ''}
              onChange={(e) => {
                handleSelectChange("date_document", e.target.value);
              }}
              className={`w-full ${errors.date_document ? "border-red-500" : ""}`}
              required
            />
            {errors.date_document && (
              <p className="text-red-500 text-sm">{errors.date_document}</p>
            )}
          </div>

          {/* État du document */}
          <div className="space-y-2">
            <Label htmlFor="etat_document">État du document</Label>
            <Select
              value={formData.etat_document}
              onValueChange={(value) =>
                handleSelectChange("etat_document", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un état" />
              </SelectTrigger>
              <SelectContent>
                {etats.map((etat) => (
                  <SelectItem key={etat} value={etat}>
                    {etat.charAt(0).toUpperCase() + etat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dossier */}
          <div className="space-y-2">
            <Label htmlFor="dossier">Dossier *</Label>
            <DossierCombobox
              value={formData.id_dossier}
              onChange={(value) => handleSelectChange("id_dossier", value)}
              type={"contrat"}
            />
            {errors.id_dossier && (
              <p className="text-red-500 text-sm">{errors.id_dossier}</p>
            )}
          </div>

          {/* Description/Notes */}
          <div className="space-y-2">
            <Label htmlFor="description">Description ou notes</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Ajoutez une description ou des notes sur ce document..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Ajout en cours..." : "Ajouter le document"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default DocumentSheet;
