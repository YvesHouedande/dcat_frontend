import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  CalendarIcon,
  FileUp,
  Paperclip,
  Save,
  X,
  XCircle,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Demande, Document } from "../../types/interfaces";
import { naturesDocuments, employes } from "./data";

// Définition du type pour les valeurs possibles dans handleChange
type DemandeValue = string | number | Date | Document[] | undefined;

const NouvelleDemandePage = () => {
  // State pour stocker les données du formulaire
  const [demande, setDemande] = useState<Partial<Demande>>({
    status: "En attente",
    documents: [],
  });

  // States pour gérer l'interface utilisateur
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentNature, setDocumentNature] = useState<number | undefined>(undefined);
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Mise à jour de la durée lorsqu'une des dates change
  useEffect(() => {
    if (demande.date_debut && demande.date_fin) {
      const diffTime = demande.date_fin.getTime() - demande.date_debut.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDemande(prev => ({ ...prev, duree: diffDays.toString() }));
    }
  }, [demande.date_debut, demande.date_fin]);

  // Gestion des changements de valeurs - Remplacé 'any' par 'DemandeValue'
  const handleChange = (field: keyof Demande, value: DemandeValue) => {
    setDemande(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur pour ce champ si elle existe
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!demande.type_demande) errors.type_demande = "Ce champ est obligatoire";
    if (!demande.id_employe) errors.id_employe = "Ce champ est obligatoire";
    if (!demande.motif || demande.motif.trim() === "") errors.motif = "Ce champ est obligatoire";
    if (!demande.date_debut) errors.date_debut = "Ce champ est obligatoire";
    if (!demande.date_fin) errors.date_fin = "Ce champ est obligatoire";
    if (!demande.date_absence) errors.date_absence = "Ce champ est obligatoire";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Demande soumise:", demande);
      setShowSuccessDialog(true);
    }
  };

  // Réinitialisation du formulaire
  const resetForm = () => {
    setDemande({
      status: "En attente",
      documents: [],
    });
    setFormErrors({});
    setShowCancelDialog(false);
  };

  // Vérifie si le formulaire est complet pour activer le bouton de soumission
  const isFormComplete = (): boolean => {
    return !!(
      demande.type_demande && 
      demande.motif && 
      demande.motif.trim() !== "" && 
      demande.id_employe &&
      demande.date_debut && 
      demande.date_fin &&
      demande.date_absence
    );
  };

  // Gestion des documents
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setDocumentName(file.name);
      setShowAddDocumentDialog(true);
    }
  };

  const ajouterDocument = () => {
    if (selectedFile && documentName.trim() !== "") {
      const nouveauDocument: Document = {
        id_document: Date.now(),
        libele_document: documentName.trim(),
        id_nature_document: documentNature,
        lien_document: URL.createObjectURL(selectedFile),
      };

      setDemande(prev => ({ 
        ...prev, 
        documents: [...(prev.documents || []), nouveauDocument] 
      }));
      
      setSelectedFile(null);
      setDocumentName("");
      setDocumentNature(undefined);
      setShowAddDocumentDialog(false);
    }
  };

  const supprimerDocument = (id_document: number) => {
    setDemande(prev => ({
      ...prev,
      documents: prev.documents?.filter(doc => doc.id_document !== id_document) || []
    }));
  };

  // Formater les dates pour l'affichage
  const formatDate = (date: Date | undefined): string => {
    return date ? format(date, "dd MMMM yyyy", { locale: fr }) : "Sélectionner une date";
  };

  // Annuler la navigation
  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  // Naviguer en arrière après annulation
  const confirmCancel = () => {
    resetForm();
    // Navigation en arrière serait ici si react-router était disponible
    console.log("Navigation en arrière");
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Nouvelle demande</CardTitle>
          <CardDescription>
            Remplissez ce formulaire pour soumettre une nouvelle demande
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Type de demande */}
            <div className="space-y-2">
              <Label htmlFor="type_demande" className="text-base">
                Type de demande <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => handleChange("type_demande", value)}
                value={demande.type_demande}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un type de demande" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Congé">Congé</SelectItem>
                  <SelectItem value="Formation">Formation</SelectItem>
                  <SelectItem value="Télétravail">Télétravail</SelectItem>
                  <SelectItem value="Remboursement">Remboursement</SelectItem>
                  <SelectItem value="Matériel">Matériel</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.type_demande && (
                <p className="text-sm text-red-500">{formErrors.type_demande}</p>
              )}
            </div>

            {/* Sélection de l'employé */}
            <div className="space-y-2">
              <Label htmlFor="id_employe" className="text-base">
                Employé concerné <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => handleChange("id_employe", parseInt(value))}
                value={demande.id_employe?.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employes.map((employe) => (
                    <SelectItem
                      key={employe.id_employe}
                      value={employe.id_employe.toString()}
                    >
                      {employe.prenom_employes} {employe.nom_employes}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.id_employe && (
                <p className="text-sm text-red-500">{formErrors.id_employe}</p>
              )}
            </div>

            {/* Date d'absence */}
            <div className="space-y-2">
              <Label className="text-base">
                Date d'absence <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !demande.date_absence && "text-gray-400"
                    }`}
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(demande.date_absence)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={demande.date_absence}
                    onSelect={(date) => date && handleChange("date_absence", date)}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formErrors.date_absence && (
                <p className="text-sm text-red-500">{formErrors.date_absence}</p>
              )}
            </div>

            {/* Date de retour */}
            <div className="space-y-2">
              <Label className="text-base">
                Date de retour
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !demande.date_retour && "text-gray-400"
                    }`}
                    disabled={!demande.date_absence}
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(demande.date_retour)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={demande.date_retour}
                    onSelect={(date) => date && handleChange("date_retour", date)}
                    disabled={(date) =>
                      !demande.date_absence || date < demande.date_absence
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Période de la demande */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-base">
                  Date de début <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !demande.date_debut && "text-gray-400"
                      }`}
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(demande.date_debut)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={demande.date_debut}
                      onSelect={(date) => date && handleChange("date_debut", date)}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {formErrors.date_debut && (
                  <p className="text-sm text-red-500">{formErrors.date_debut}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base">
                  Date de fin <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !demande.date_fin && "text-gray-400"
                      }`}
                      disabled={!demande.date_debut}
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(demande.date_fin)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={demande.date_fin}
                      onSelect={(date) => date && handleChange("date_fin", date)}
                      disabled={(date) =>
                        !demande.date_debut || date < demande.date_debut
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {formErrors.date_fin && (
                  <p className="text-sm text-red-500">{formErrors.date_fin}</p>
                )}
                {demande.date_debut && demande.date_fin && (
                  <p className="text-sm text-gray-500">
                    Durée: {demande.duree} jours
                  </p>
                )}
              </div>
            </div>

            {/* Motif de la demande */}
            <div className="space-y-2">
              <Label htmlFor="motif" className="text-base">
                Motif <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="motif"
                placeholder="Décrivez le motif de votre demande..."
                className="min-h-32 resize-none"
                value={demande.motif || ""}
                onChange={(e) => handleChange("motif", e.target.value)}
                maxLength={500}
              />
              {formErrors.motif && (
                <p className="text-sm text-red-500">{formErrors.motif}</p>
              )}
              <p className="text-sm text-gray-500">
                {(demande.motif?.length || 0)}/500 caractères
              </p>
            </div>

            {/* Section pour les pièces jointes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Pièces jointes</Label>
                <div className="relative">
                  <Input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Label
                    htmlFor="file-upload"
                    className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    Ajouter un fichier
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                {demande.documents && demande.documents.length > 0 ? (
                  demande.documents.map((document) => (
                    <div
                      key={document.id_document}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <Paperclip className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{document.libele_document}</p>
                          <p className="text-xs text-gray-500">
                            {document.id_nature_document && (
                              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                {naturesDocuments.find(n => n.id_nature_document === document.id_nature_document)?.libelle_td || 'Non défini'}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => supprimerDocument(document.id_document)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Aucun document joint. Vous pouvez ajouter des documents à
                    votre demande si nécessaire.
                  </p>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <span className="text-red-500">*</span> Champs obligatoires
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!isFormComplete()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="mr-2 h-4 w-4" />
              Enregistrer la demande
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Dialogues */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la saisie ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler ? Toutes les informations saisies
              seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuer la saisie</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>
              Oui, annuler
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialogue de confirmation de succès */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Demande enregistrée</AlertDialogTitle>
            <AlertDialogDescription>
              Votre demande a été enregistrée avec succès. Elle sera traitée
              dans les plus brefs délais.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowSuccessDialog(false);
                resetForm();
              }}
            >
              Fermer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialogue d'ajout de document */}
      <AlertDialog open={showAddDocumentDialog} onOpenChange={setShowAddDocumentDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ajouter un document</AlertDialogTitle>
            <AlertDialogDescription>
              Veuillez saisir les informations du document
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="documentName">Nom du document</Label>
              <Input
                id="documentName"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Entrez un nom pour ce document"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="documentType">Type de document</Label>
              <Select
                onValueChange={(value) => setDocumentNature(Number(value))}
                value={documentNature?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type de document" />
                </SelectTrigger>
                <SelectContent>
                  {naturesDocuments.map((nature) => (
                    <SelectItem
                      key={nature.id_nature_document}
                      value={nature.id_nature_document.toString()}
                    >
                      {nature.libelle_td}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedFile && (
              <div className="text-sm text-gray-500">
                Fichier sélectionné: {selectedFile.name}
              </div>
            )}
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setSelectedFile(null);
              setDocumentName("");
              setDocumentNature(undefined);
              setShowAddDocumentDialog(false);
            }}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={ajouterDocument} 
              disabled={!selectedFile || documentName.trim() === "" || !documentNature}
            >
              Ajouter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NouvelleDemandePage;