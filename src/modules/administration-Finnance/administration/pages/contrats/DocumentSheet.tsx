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
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Upload, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ContratDocument, NatureDocument } from "../../types/interfaces";
import { addDocumentToContrat, fetchNaturesDocument } from "../../../services/contratService";
import { toast } from "sonner";
import { useQuery } from '@tanstack/react-query';

interface DocumentSheetProps {
  contratId?: number;
  onDocumentAdded?: () => void;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DocumentSheet: React.FC<DocumentSheetProps> = ({ 
  contratId, 
  onDocumentAdded,
  trigger,
  isOpen,
  onOpenChange
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Utiliser les props externes si fournies, sinon utiliser l'état interne
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState<Omit<ContratDocument, 'id_documents' | 'id_contrat'>>({
    libelle_document: "",
    classification_document: "",
    date_document: new Date().toISOString().split('T')[0],
    lien_document: "",
    etat_document: "actif",
    id_nature_document: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Récupérer les natures de document depuis l'API
  const { data: naturesDocument } = useQuery({
    queryKey: ['natures-document'],
    queryFn: fetchNaturesDocument,
  });

  // Options pour les selects
  const classifications = [
    "Contrat principal",
    "Annexe technique",
    "Annexe financière",
    "Bon de commande",
    "Facture",
    "Devis",
    "Document légal",
    "Autre"
  ];

  const etats = [
    "actif",
    "inactif",
    "archivé",
    "en révision"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Nettoyer l'erreur si elle existe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-remplir le libellé avec le nom du fichier
      setFormData(prev => ({ 
        ...prev, 
        libelle_document: file.name,
        lien_document: file.name 
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.libelle_document.trim()) {
      newErrors.libelle_document = "Le libellé du document est obligatoire";
    }

    if (!formData.classification_document) {
      newErrors.classification_document = "La classification est obligatoire";
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
      await addDocumentToContrat(contratId, formData, selectedFile);

      toast.success("Document ajouté avec succès !");
      setOpen(false);
      
      // Réinitialiser le formulaire
      setFormData({
        libelle_document: "",
        classification_document: "",
        date_document: new Date().toISOString().split('T')[0],
        lien_document: "",
        etat_document: "actif",
        id_nature_document: 1,
      });
      setSelectedFile(null);
      setErrors({});

      // Callback pour rafraîchir la liste des documents
      if (onDocumentAdded) {
        onDocumentAdded();
      }
      
      // Rediriger vers la page principale après un délai
      setTimeout(() => {
        window.location.href = "/administration/contrats";
      }, 1000);
    } catch (error: unknown) {
      console.error("Erreur lors de l'ajout du document:", error);
      let errorMessage = "Erreur lors de l'ajout du document";
      if (typeof error === "object" && error !== null && "response" in error && typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string") {
        errorMessage = (error as { response: { data: { message: string } } }).response.data.message;
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
      classification_document: "",
      date_document: new Date().toISOString().split('T')[0],
      lien_document: "",
      etat_document: "actif",
      id_nature_document: 1,
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
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Ajouter un document</SheetTitle>
          <SheetDescription>
            Remplissez les informations du document à associer au contrat.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Sélection du fichier */}
          <div className="space-y-2">
            <Label htmlFor="file">Fichier <span className="text-red-500">*</span></Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-500 font-medium">
                  {selectedFile ? "Fichier sélectionné" : "Cliquez pour sélectionner un fichier"}
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
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
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

          {/* Classification */}
          <div className="space-y-2">
            <Label htmlFor="classification_document">
              Classification <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.classification_document}
              onValueChange={(value) => handleSelectChange("classification_document", value)}
            >
              <SelectTrigger className={errors.classification_document ? "border-red-500" : ""}>
                <SelectValue placeholder="Sélectionner une classification" />
              </SelectTrigger>
              <SelectContent>
                {classifications.map((classification) => (
                  <SelectItem key={classification} value={classification}>
                    {classification}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.classification_document && (
              <p className="text-red-500 text-sm">{errors.classification_document}</p>
            )}
          </div>

          {/* Nature du document */}
          <div className="space-y-2">
            <Label htmlFor="id_nature_document">
              Nature du document <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.id_nature_document?.toString()}
              onValueChange={(value) => handleSelectChange("id_nature_document", parseInt(value))}
            >
              <SelectTrigger className={errors.id_nature_document ? "border-red-500" : ""}>
                <SelectValue placeholder="Sélectionner une nature" />
              </SelectTrigger>
              <SelectContent>
                {naturesDocument?.map((nature: NatureDocument) => (
                  <SelectItem key={nature.id_nature_document} value={nature.id_nature_document.toString()}>
                    {nature.libelle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.id_nature_document && (
              <p className="text-red-500 text-sm">{errors.id_nature_document}</p>
            )}
          </div>

          {/* Date du document */}
          <div className="space-y-2">
            <Label htmlFor="date_document">
              Date du document <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${errors.date_document ? "border-red-500" : ""}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date_document ? (
                    format(new Date(formData.date_document), "dd MMMM yyyy", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date_document ? new Date(formData.date_document) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      handleSelectChange("date_document", format(date, "yyyy-MM-dd"));
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date_document && (
              <p className="text-red-500 text-sm">{errors.date_document}</p>
            )}
          </div>

          {/* État du document */}
          <div className="space-y-2">
            <Label htmlFor="etat_document">État du document</Label>
            <Select
              value={formData.etat_document}
              onValueChange={(value) => handleSelectChange("etat_document", value)}
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