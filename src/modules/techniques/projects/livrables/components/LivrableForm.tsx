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
import { Calendar as CalendarIcon, Save, Plus } from "lucide-react"; // Import Plus icon
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner"; // Import toast for messages

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
  UpdateLivrablePayload,
  CreateDocumentTextPayload,
  Nature, // Using 'Nature' now as per updated types
} from "../../types/types";
import Layout from "@/components/Layout"; // Assuming Layout handles global layout

interface LivrableFormProps {
  initialData?: Livrable; // For existing livrables
  // onSave now expects a payload type, not the full Livrable object
  onSave: (
    livrable: CreateLivrablePayload | UpdateLivrablePayload
  ) => Promise<void>; // Make it return a Promise<void> for async handling
  onCancel: () => void;
  projetsDisponibles: Projet[]; // List of available projects for selection
  // New prop for document save (will be handled by parent page's API calls)
  onSaveDocument?: (
    livrableId: number,
    documentFile: File,
    textPayload: CreateDocumentTextPayload
  ) => Promise<void>;
  natureDocumentsDisponibles: Nature[]; // New prop for available document natures - using 'Nature'
  embedded?: boolean; // Nouvelle prop pour mode intégré
}

export const LivrableForm: React.FC<LivrableFormProps> = ({
  initialData,
  onSave,
  onCancel,
  projetsDisponibles,
  onSaveDocument,
  natureDocumentsDisponibles, // Destructure new prop
  embedded = false, // Par défaut false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDocumentSheet, setShowDocumentSheet] = useState(false); // State for sheet visibility

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
      id_projet: 0, // Default to 0, expecting user selection
      documents: [], // Ensure documents array is present, but will be omitted for payload
    }
  );

  // Form data for the Document to be uploaded
  const [documentFormData, setDocumentFormData] = useState<CreateDocumentTextPayload & { file: File | null }>({
    libelle_document: "",
    classification_document: "",
    date_document: "",
    id_nature_document: 0,
    file: null, // To hold the actual file object
  });

  // Pré-remplir id_projet si un seul projet est disponible
  React.useEffect(() => {
    if (projetsDisponibles.length === 1) {
      setFormData((prev) => ({
        ...prev,
        id_projet: projetsDisponibles[0].id_projet,
      }));
    }
  }, [projetsDisponibles]);

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

  // Handles date changes
  const handleDateChange = (name: keyof Livrable, date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date ? format(date, "yyyy-MM-dd") : "",
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

  const handleDocumentSelectChange = (name: keyof CreateDocumentTextPayload, value: string) => {
    const newValue = name === "id_nature_document" ? Number(value) : value;
    setDocumentFormData((prev) => ({
      ...prev,
      [name]: newValue as any, // Type assertion as value could be string from select
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

  const handleDocumentDateChange = (date: Date | undefined) => {
    setDocumentFormData((prev) => ({
      ...prev,
      date_document: date ? format(date, "yyyy-MM-dd") : "",
    }));
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
    if (!formData.date) {
      toast.error("Veuillez sélectionner une date pour le livrable.");
      setIsSubmitting(false);
      return;
    }
    if (formData.id_projet === 0) {
      toast.error("Veuillez sélectionner un projet parent pour ce livrable.");
      setIsSubmitting(false);
      return;
    }

    // Prepare the payload based on whether it's a new livrable or an update
    const payload: CreateLivrablePayload | UpdateLivrablePayload = {
      libelle_livrable: formData.libelle_livrable,
      date: formData.date,
      realisations: formData.realisations,
      reserves: formData.reserves,
      approbation: formData.approbation,
      recommandation: formData.recommandation,
      id_projet: formData.id_projet,
    };

    try {
      await onSave(payload); // Call the onSave prop from the parent
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

    if (!initialData?.id_livrable) {
      toast.error("Le livrable doit être enregistré avant d'ajouter des documents.");
      return;
    }

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

    if (onSaveDocument) {
      try {
        await onSaveDocument(
          initialData.id_livrable,
          documentFormData.file,
          {
            libelle_document: documentFormData.libelle_document,
            classification_document: documentFormData.classification_document,
            date_document: documentFormData.date_document,
            id_nature_document: documentFormData.id_nature_document,
          }
        );
        toast.success("Document ajouté avec succès !");
        setShowDocumentSheet(false); // Close the sheet on success
        // Optionally reset document form data
        setDocumentFormData({
          libelle_document: "",
          classification_document: "",
          date_document: "",
          id_nature_document: 0,
          file: null,
        });
      } catch (error) {
        console.error("Erreur lors de l'ajout du document:", error);
        toast.error("Échec de l'ajout du document.");
      }
    } else {
      toast.error("La fonction d'enregistrement du document n'est pas disponible.");
    }
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
                {initialData ? "Modifier le Livrable" : "Ajouter un nouveau Livrable"}
              </h1>
              {initialData && (
                <Sheet open={showDocumentSheet} onOpenChange={setShowDocumentSheet}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Associer un document
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Associer un Document</SheetTitle>
                      <SheetDescription>
                        Téléchargez un document et associez-le à ce livrable.
                      </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleDocumentSubmit} className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="documentFile">Fichier du document <span className="text-red-500">*</span></Label>
                        <Input
                          id="documentFile"
                          type="file"
                          onChange={handleDocumentFileChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="libelle_document">Libellé du document <span className="text-red-500">*</span></Label>
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
                        <Label htmlFor="classification_document">Classification</Label>
                        <Input
                          id="classification_document"
                          name="classification_document"
                          value={documentFormData.classification_document}
                          onChange={handleDocumentInputChange}
                          placeholder="Ex: Confidentiel, Public"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date_document">Date du document</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {documentFormData.date_document ? (
                                format(parseISO(documentFormData.date_document), "dd MMMM yyyy", { // Corrected format string
                                  locale: fr,
                                })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={documentFormData.date_document ? parseISO(documentFormData.date_document) : undefined}
                              onSelect={handleDocumentDateChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="id_nature_document">Nature du document <span className="text-red-500">*</span></Label>
                        <Select
                          onValueChange={(value) =>
                            handleDocumentSelectChange("id_nature_document", value)
                          }
                          value={documentFormData.id_nature_document ? String(documentFormData.id_nature_document) : ""}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une nature" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Populate select options with fetched Nature data */}
                            {natureDocumentsDisponibles.map((nature) => (
                              <SelectItem key={nature.id_nature_document} value={String(nature.id_nature_document)}>
                                {nature.libelle}
                              </SelectItem>
                            ))}
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
              )}
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
                        Libellé du livrable <span className="text-red-500">*</span>
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
                    {/* Select Projet Parent */}
                    <div className="space-y-2">
                      <Label htmlFor="id_projet">
                        Projet Parent <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) => handleSelectChange("id_projet", value)}
                        value={formData.id_projet ? String(formData.id_projet) : ""}
                        required
                        disabled={projetsDisponibles.length === 1} // Désactive si un seul projet
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un projet" />
                        </SelectTrigger>
                        <SelectContent>
                          {projetsDisponibles.map((projet) => (
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

                    {/* Date of Livrable */}
                    <div className="space-y-2">
                      <Label htmlFor="date">
                        Date du livrable <span className="text-red-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date ? (
                              format(parseISO(formData.date), "dd MMMM yyyy", { // Corrected format string
                                locale: fr,
                              })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.date ? parseISO(formData.date) : undefined}
                            onSelect={(date) =>
                              handleDateChange("date", date)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Approbation Select */}
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
                        <SelectItem value="révisions requises">Révisions requises</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Detailed Information */}
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
              </div>
            </CardContent>
          </Card>

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