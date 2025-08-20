import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Plus,
  FileText,
  Trash2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner"; // Import toast for messages
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit, X } from "lucide-react";

// Import Shadcn Sheet components
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";

// Import types
import {
  Livrable,
  Projet,
  CreateLivrablePayload,
  CreateDocumentTextPayload,
  Nature, // Using 'Nature' now as per updated types
  TypeLivrable,
  isFullLivrableType,
} from "../../types/types";

// Import API functions for nature CRUD
import {
  getAllNatureDocuments,
  createNatureDocument,
  updateNatureDocument,
  deleteNatureDocument,
} from "../api/livrables";
import Layout from "@/components/Layout"; // Assuming Layout handles global layout

// Ajout d'une interface pour les partenaires
interface PartenaireOption {
  id_partenaire: number;
  nom_partenaire: string;
}

// Interface pour les documents temporaires en attente d'association
interface PendingDocument {
  id: string; // ID temporaire unique
  file: File;
  textPayload: CreateDocumentTextPayload;
}

interface LivrableFormProps {
  initialData?: Livrable; // Pour l'édition
  onSave: (
    livrable:
      | CreateLivrablePayload
      | Partial<Omit<Livrable, "documents" | "id_livrable">>,
    pendingDocuments?: PendingDocument[] // Documents à associer après création
  ) => Promise<void>;
  onCancel: () => void;
  projetsDisponibles: Projet[];
  onSaveDocument?: (
    livrableId: number,
    documentFile: File,
    textPayload: CreateDocumentTextPayload
  ) => Promise<void>;
  natureDocumentsDisponibles: Nature[]; // Using 'Nature' now as per updated types
  partenairesDisponibles: PartenaireOption[]; // Liste de tous les partenaires
  embedded?: boolean; // Indique si le formulaire est intégré dans une autre page
}

export const LivrableForm: React.FC<LivrableFormProps> = ({
  initialData,
  onSave,
  onCancel,
  projetsDisponibles,
  partenairesDisponibles,
  onSaveDocument,
  natureDocumentsDisponibles, // Destructure new prop
  embedded = false, // Par défaut false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDocumentSheet, setShowDocumentSheet] = useState(false); // State for sheet visibility

  // États pour la gestion des natures
  const [newNatureLibelle, setNewNatureLibelle] = useState("");
  const [editingNature, setEditingNature] = useState<number | null>(null);
  const [editNatureLibelle, setEditNatureLibelle] = useState("");

  const queryClient = useQueryClient();

  // Hooks TanStack Query pour les natures
  const { data: natures = [] } = useQuery({
    queryKey: ['natures'],
    queryFn: async () => {
      const response = await getAllNatureDocuments();
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }
      return [];
    },
  });

  const createNatureMutation = useMutation({
    mutationFn: createNatureDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['natures'] });
      toast.success("Nature créée avec succès !");
      setNewNatureLibelle("");
    },
    onError: (error) => {
      console.error("Erreur lors de la création de la nature:", error);
      toast.error("Erreur lors de la création de la nature");
    },
  });

  const updateNatureMutation = useMutation({
    mutationFn: ({ id, libelle }: { id: number; libelle: string }) => updateNatureDocument(id, libelle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['natures'] });
      toast.success("Nature modifiée avec succès !");
      setEditingNature(null);
      setEditNatureLibelle("");
    },
    onError: (error) => {
      console.error("Erreur lors de la modification de la nature:", error);
      toast.error("Erreur lors de la modification de la nature");
    },
  });

  const deleteNatureMutation = useMutation({
    mutationFn: deleteNatureDocument,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['natures'] });
        toast.success("Nature supprimée avec succès !");
      } else {
        toast.info(result.message || "Nature non supprimée");
      }
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de la nature:", error);
      // Ne pas afficher de toast d'erreur car la gestion est faite dans le service
    },
  });

  // État pour les partenaires filtrés selon le projet sélectionné
  const [partenairesProjet, setPartenairesProjet] = useState<
    PartenaireOption[]
  >([]);

  // État pour les documents temporaires (pendant la création)
  const [pendingDocuments, setPendingDocuments] = useState<PendingDocument[]>(
    []
  );

  // Form data for the Livrable itself
  const [formData, setFormData] = useState<Livrable>(
    initialData || {
      id_livrable: 0, // Will be omitted for CreateLivrablePayload
      libelle_livrable: "",
      date: "",
      realisations: "",
      reserves: "",
      approbation: "en attente", // Default status
      recommandation: "",
      type_livrable: "Procès-verbal de réalisation", // Valeur par défaut
      client: "", // ID du partenaire
      id_projet: 0, // Default to 0, expecting user selection
      documents: [], // Ensure documents array is present, but will be omitted for payload
    }
  );

  // Form data for the Document to be uploaded
  const [documentFormData, setDocumentFormData] = useState<
    CreateDocumentTextPayload & { file: File | null }
  >({
    libelle_document: "",
    date_document: "",
    id_nature_document: 0,
    etat_document: "Actif",
    file: null, // To hold the actual file object
  });

  // Pré-remplir id_projet si un seul projet est disponible
  React.useEffect(() => {
    if (projetsDisponibles && projetsDisponibles.length === 1) {
      setFormData((prev) => ({
        ...prev,
        id_projet: projetsDisponibles[0].id_projet,
      }));
    }
  }, [projetsDisponibles]);

  // Filtrer les partenaires selon le projet sélectionné
  React.useEffect(() => {
    if (
      formData.id_projet > 0 &&
      projetsDisponibles &&
      Array.isArray(projetsDisponibles)
    ) {
      const projetSelectionne = projetsDisponibles.find(
        (p) => p.id_projet === formData.id_projet
      );

      if (
        projetSelectionne &&
        projetSelectionne.id_partenaire &&
        Array.isArray(projetSelectionne.id_partenaire) &&
        projetSelectionne.id_partenaire.length > 0
      ) {
        const partenairesFiltrés = (partenairesDisponibles || []).filter(
          (partenaire) =>
            projetSelectionne.id_partenaire.includes(partenaire.id_partenaire)
        );
        setPartenairesProjet(partenairesFiltrés);

        // Auto-sélectionner si un seul partenaire
        if (partenairesFiltrés.length === 1 && !formData.client) {
          setFormData((prev) => ({
            ...prev,
            client: String(partenairesFiltrés[0].id_partenaire),
          }));
        }
      } else if (
        projetSelectionne &&
        (!projetSelectionne.id_partenaire ||
          !Array.isArray(projetSelectionne.id_partenaire))
      ) {
        // Si id_partenaire n'est pas défini ou n'est pas un tableau, récupérer via API

        // Import dynamique pour éviter les dépendances circulaires
        import("../../projet/api/projets").then(
          ({ getProjetAssociatedPartenaires }) => {
            getProjetAssociatedPartenaires(projetSelectionne.id_projet)
              .then((partenairesIds: number[]) => {
                if (partenairesIds && partenairesIds.length > 0) {
                  const partenairesFiltrés = (
                    partenairesDisponibles || []
                  ).filter((partenaire) =>
                    partenairesIds.includes(partenaire.id_partenaire)
                  );

                  setPartenairesProjet(partenairesFiltrés);

                  // Auto-sélectionner si un seul partenaire
                  if (partenairesFiltrés.length === 1 && !formData.client) {
                    setFormData((prev) => ({
                      ...prev,
                      client: String(partenairesFiltrés[0].id_partenaire),
                    }));
                  }
                } else {
                  setPartenairesProjet([]);
                  setFormData((prev) => ({ ...prev, client: "" }));
                }
              })
              .catch((error) => {
                console.error(
                  "Erreur lors de la récupération des partenaires via API:",
                  error
                );
                setPartenairesProjet([]);
                setFormData((prev) => ({ ...prev, client: "" }));
              });
          }
        );
      } else {
        setPartenairesProjet([]);
        setFormData((prev) => ({ ...prev, client: "" }));
      }
    } else {
      setPartenairesProjet([]);
      setFormData((prev) => ({ ...prev, client: "" }));
    }
  }, [formData.id_projet, projetsDisponibles, partenairesDisponibles]);

  // --- Livrable Form Handlers ---

  // Handles changes for text inputs (libelle, realisations, reserves, recommandation)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handles changes for select inputs (approbation, id_projet)
  const handleSelectChange = (name: keyof Livrable, value: string) => {
    const newValue = name === "id_projet" ? Number(value) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };


  // --- Document Form Handlers ---

  const handleDocumentInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDocumentFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDocumentSelectChange = (
    name: keyof CreateDocumentTextPayload,
    value: string
  ) => {
    const newValue = name === "id_nature_document" ? Number(value) : value;
    setDocumentFormData((prev) => ({
      ...prev,
      [name]: newValue as string, // Type assertion as value could be string from select
    }));
  };

  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocumentFormData((prev) => ({
        ...prev,
        file: e.target.files![0], // Get the first file
      }));
    } else {
      setDocumentFormData((prev) => ({
        ...prev,
        file: null,
      }));
    }
  };


  // --- Form Submission Logic ---

  // Main Livrable form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic client-side validation for required fields
    if (!formData.libelle_livrable.trim()) {
      toast.error("Veuillez entrer le libellé du livrable.");
      setIsSubmitting(false);
      return;
    }
    
    // Validation pour la date (toujours requise)
    if (!formData.date) {
      toast.error("Veuillez sélectionner une date pour le livrable.");
      setIsSubmitting(false);
      return;
    }
    
    // Validation conditionnelle pour le client (seulement pour Procès-verbal)
    if (isFullLivrableType(formData.type_livrable)) {
      if (!formData.client) {
        toast.error("Veuillez sélectionner un client pour le livrable.");
        setIsSubmitting(false);
        return;
      }
    }
    
    if (formData.id_projet === 0) {
      toast.error("Veuillez sélectionner un projet parent pour ce livrable.");
      setIsSubmitting(false);
      return;
    }

    // Prepare the payload based on whether it's a new livrable or an update
    const payload:
      | CreateLivrablePayload
      | Partial<Omit<Livrable, "documents" | "id_livrable">> = {
      libelle_livrable: formData.libelle_livrable,
      type_livrable: formData.type_livrable,
      id_projet: formData.id_projet,
      date: formData.date, // Date toujours incluse
    };

    // Ajouter les champs conditionnels seulement pour "Procès-verbal de réalisation"
    if (isFullLivrableType(formData.type_livrable)) {
      Object.assign(payload, {
        realisations: formData.realisations,
        reserves: formData.reserves,
        approbation: formData.approbation,
        recommandation: formData.recommandation,
        client: formData.client,
      });
    }

    try {
      // Passer les documents temporaires au parent (pour le mode création)
      await onSave(payload, initialData ? undefined : pendingDocuments);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du livrable:", error);
      toast.error("Échec de l'enregistrement du livrable.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Document upload form submission
  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentFormData.file) {
      toast.error("Veuillez sélectionner un fichier à télécharger.");
      return;
    }
    if (!documentFormData.libelle_document.trim()) {
      toast.error("Veuillez entrer le libellé du document.");
      return;
    }
    if (documentFormData.id_nature_document === 0) {
      toast.error("Veuillez sélectionner la nature du document.");
      return;
    }

    // Validate file size (e.g., max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    if (documentFormData.file.size > MAX_FILE_SIZE) {
      toast.error("La taille du fichier ne doit pas dépasser 5 Mo.");
      return;
    }

    // Si le livrable existe déjà (mode édition), utiliser l'ancienne logique
    if (initialData?.id_livrable && onSaveDocument) {
      try {
        await onSaveDocument(initialData.id_livrable, documentFormData.file, {
          libelle_document: documentFormData.libelle_document,
          date_document: documentFormData.date_document,
          id_nature_document: documentFormData.id_nature_document,
          etat_document: documentFormData.etat_document,
        });
        toast.success("Document ajouté avec succès !");
        setShowDocumentSheet(false); // Close the sheet on success
        // Reset document form data
        setDocumentFormData({
          libelle_document: "",
          date_document: "",
          id_nature_document: 0,
          etat_document: "Actif",
          file: null,
        });
      } catch (error) {
        console.error("Erreur lors de l'ajout du document:", error);
        toast.error("Échec de l'ajout du document.");
      }
    } else {
      // Mode création : ajouter le document à la liste temporaire
      const newPendingDocument: PendingDocument = {
        id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // ID temporaire unique
        file: documentFormData.file,
        textPayload: {
          libelle_document: documentFormData.libelle_document,
          date_document: documentFormData.date_document,
          id_nature_document: documentFormData.id_nature_document,
          etat_document: documentFormData.etat_document,
        },
      };

      setPendingDocuments((prev) => [...prev, newPendingDocument]);
      toast.success(
        "Document ajouté temporairement ! Il sera associé au livrable lors de la sauvegarde."
      );
      setShowDocumentSheet(false); // Close the sheet on success

      // Reset document form data
              setDocumentFormData({
          libelle_document: "",
          date_document: "",
          id_nature_document: 0,
          etat_document: "Actif",
          file: null,
        });
    }
  };

  // Fonction pour supprimer un document temporaire
  const removePendingDocument = (documentId: string) => {
    setPendingDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    toast.success("Document retiré de la liste temporaire.");
  };

  // Handlers pour la gestion des natures
  const handleCreateNature = async () => {
    if (!newNatureLibelle.trim()) {
      toast.error("Veuillez entrer un libellé pour la nature.");
      return;
    }
    createNatureMutation.mutate(newNatureLibelle.trim());
  };

  const handleUpdateNature = async () => {
    if (!editingNature || !editNatureLibelle.trim()) {
      toast.error("Veuillez entrer un libellé pour la nature.");
      return;
    }
    updateNatureMutation.mutate({
      id: editingNature,
      libelle: editNatureLibelle.trim()
    });
  };

  const handleDeleteNature = async (natureId: number) => {
    deleteNatureMutation.mutate(natureId);
  };

  const handleStartEdit = (nature: Nature) => {
    setEditingNature(nature.id_nature_document);
    setEditNatureLibelle(nature.libelle);
  };

  // --- Rendu du formulaire ---
  const formContent = (
    <div className={embedded ? "p-0" : "bg-gray-50 p-6 min-h-screen"}>
      <div className={embedded ? "max-w-4xl mx-auto" : "max-w-3xl mx-auto"}>
        {/* Header */}
        {!embedded && (
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                {initialData
                  ? "Modifier le Livrable"
                  : "Ajouter un nouveau Livrable"}
              </h1>
              <Sheet
                open={showDocumentSheet}
                onOpenChange={setShowDocumentSheet}
              >
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {initialData
                      ? "Associer un document"
                      : "Ajouter un document"}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:max-w-md overflow-y-auto"
                >
                  <SheetHeader>
                    <SheetTitle>Associer un Document</SheetTitle>
                    <SheetDescription>
                      Téléchargez un document et associez-le à ce livrable.
                    </SheetDescription>
                  </SheetHeader>
                  <form
                    onSubmit={handleDocumentSubmit}
                    className="grid gap-4 py-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="documentFile">
                        Fichier du document{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="documentFile"
                        type="file"
                        onChange={handleDocumentFileChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="libelle_document">
                        Libellé du document{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="libelle_document"
                        name="libelle_document"
                        value={documentFormData.libelle_document}
                        onChange={handleDocumentInputChange}
                        placeholder="Entrez le libellé du document"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_document">Date du document</Label>
                      <Input
                        type="date"
                        value={documentFormData.date_document || ""}
                        onChange={(e) => {
                          setDocumentFormData({
                            ...documentFormData,
                            date_document: e.target.value,
                          });
                        }}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="id_nature_document">
                        Nature du document{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleDocumentSelectChange(
                            "id_nature_document",
                            value
                          )
                        }
                        value={
                          documentFormData.id_nature_document
                            ? String(documentFormData.id_nature_document)
                            : ""
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une nature" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Sélectionnez une nature</SelectItem>
                          {natures && natures.length > 0 ? (
                            natures
                              .filter(nature => nature && nature.id_nature_document && nature.libelle)
                              .map((nature: Nature) => {
                                const natureId = nature.id_nature_document!;
                                const isEditing = editingNature === natureId;
                                
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
                                          disabled={updateNatureMutation.isLoading}
                                          className="h-8 px-2"
                                        >
                                          {updateNatureMutation.isLoading ? "..." : "✓"}
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
                                              handleDeleteNature(nature.id_nature_document);
                                            }}
                                            disabled={deleteNatureMutation.isLoading}
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
                              <SelectItem value="1">Rapport</SelectItem>
                              <SelectItem value="2">Photo</SelectItem>
                              <SelectItem value="3">Plan</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      
                      {/* Popover pour créer une nouvelle nature */}
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
                                placeholder="Ex: Rapport technique"
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
                                disabled={!newNatureLibelle.trim() || createNatureMutation.isLoading}
                                className="flex-1"
                              >
                                {createNatureMutation.isLoading ? "Création..." : "Créer"}
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="etat_document">
                        État du document{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleDocumentSelectChange(
                            "etat_document",
                            value
                          )
                        }
                        value={documentFormData.etat_document}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un état" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Actif">Actif</SelectItem>
                          <SelectItem value="Archivé">Archivé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <SheetFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" /> Enregistrer Document
                      </Button>
                    </SheetFooter>
                  </form>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        )}
        {/* Main Livrable Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* General Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Informations générales
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="libelle_livrable">
                        Libellé du livrable{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="libelle_livrable"
                        name="libelle_livrable"
                        placeholder="Entrez le libellé du livrable"
                        value={formData.libelle_livrable}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Type de livrable */}
                    <div className="space-y-2">
                      <Label htmlFor="type_livrable">
                        Type de livrable <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value: TypeLivrable) =>
                          handleSelectChange("type_livrable", value)
                        }
                        value={formData.type_livrable}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Procès-verbal de réalisation">
                            Procès-verbal de réalisation
                          </SelectItem>
                          <SelectItem value="Rapport de réalisation">
                            Rapport de réalisation
                          </SelectItem>
                          <SelectItem value="Attestation de bonne exécution">
                            Attestation de bonne exécution
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Select Projet Parent */}
                    <div className="space-y-2">
                      <Label htmlFor="id_projet">
                        Projet <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("id_projet", value)
                        }
                        value={
                          formData.id_projet ? String(formData.id_projet) : ""
                        }
                        required
                        disabled={(projetsDisponibles || []).length === 1} // Désactive si un seul projet
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un projet" />
                        </SelectTrigger>
                        <SelectContent>
                          {(projetsDisponibles || []).map((projet) => (
                            <SelectItem
                              key={projet.id_projet}
                              value={String(projet.id_projet)}
                            >
                              {projet.nom_projet}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Client/Partenaire - Seulement pour Procès-verbal */}
                    {isFullLivrableType(formData.type_livrable) && (
                      <div className="space-y-2">
                        <Label htmlFor="client">
                          Client <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) => handleSelectChange("client", value)}
                          value={formData.client}
                          required
                          disabled={(partenairesProjet || []).length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={
                              formData.id_projet === 0 
                                ? "Sélectionnez d'abord un projet"
                                : (partenairesProjet || []).length === 0
                                ? "Aucun partenaire pour ce projet"
                                : "Sélectionnez un partenaire"
                            } />
                          </SelectTrigger>
                          <SelectContent>
                            {(partenairesProjet || []).map((partenaire) => (
                              <SelectItem
                                key={partenaire.id_partenaire}
                                value={String(partenaire.id_partenaire)}
                              >
                                {partenaire.nom_partenaire}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Date du livrable - Toujours visible */}
                    <div className="space-y-2">
                      <Label htmlFor="date">
                        Date du livrable <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={formData.date || ""}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            date: e.target.value,
                          });
                        }}
                        className="w-full"
                        required
                      />
                    </div>
                  </div>

                  {/* Approbation Select - Seulement pour Procès-verbal */}
                  {isFullLivrableType(formData.type_livrable) && (
                    <div className="space-y-2">
                      <Label htmlFor="approbation">
                        Approbation <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("approbation", value)
                        }
                        value={formData.approbation}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un statut d'approbation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en attente">En attente</SelectItem>
                          <SelectItem value="approuvé">Approuvé</SelectItem>
                          <SelectItem value="rejeté">Rejeté</SelectItem>
                          <SelectItem value="révisions requises">
                            Révisions requises
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Detailed Information - Seulement pour Procès-verbal */}
                {isFullLivrableType(formData.type_livrable) && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                      Détails du livrable
                    </h2>

                    <div className="space-y-2">
                      <Label htmlFor="realisations">Réalisations</Label>
                      <Textarea
                        id="realisations"
                        name="realisations"
                        placeholder="Décrivez les réalisations de ce livrable..."
                        rows={4}
                        value={formData.realisations}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reserves">Réserves</Label>
                      <Textarea
                        id="reserves"
                        name="reserves"
                        placeholder="Décrivez les réserves ou points en suspens..."
                        rows={4}
                        value={formData.reserves}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recommandation">Recommandation</Label>
                      <Textarea
                        id="recommandation"
                        name="recommandation"
                        placeholder="Entrez des recommandations pour le livrable..."
                        rows={4}
                        value={formData.recommandation}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documents temporaires (mode création uniquement) */}
          {!initialData && pendingDocuments.length > 0 && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Documents en attente d'association (
                    {pendingDocuments.length})
                  </h2>
                  <div className="space-y-3">
                    {pendingDocuments.map((doc) => {
                      const natureName =
                        natureDocumentsDisponibles.find(
                          (n) =>
                            n.id_nature_document ===
                            doc.textPayload.id_nature_document
                        )?.libelle || "Nature inconnue";

                      return (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {doc.textPayload.libelle_document}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {doc.file.name} • {natureName}
                                  {doc.textPayload.date_document && (
                                    <>
                                      {" "}
                                      •{" "}
                                                                        {format(
                                    parseISO(doc.textPayload.date_document),
                                    "dd/MM/yyyy"
                                  )}
                                    </>
                                  )}
                                </p>

                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePendingDocument(doc.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    💡 Ces documents seront automatiquement associés au livrable
                    après sa création.
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <div className="mt-6 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return embedded ? formContent : <Layout>{formContent}</Layout>;
};
