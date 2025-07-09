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
  Calendar as CalendarIcon,
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
import { useNavigate } from "react-router-dom";

// Importez les fonctions et interfaces depuis votre fichier demandeService.ts
// Assurez-vous que le chemin est correct pour vos services et interfaces
import { 
  createDemande, 
  getAllEmployes, 
  getAllNatureDocuments, 
} from "../../../services/demandeService"; 

// Importez les interfaces de votre fichier interface.ts
import { 
  Demande, 
  DemandeDocument, 
  Employe, 
  NatureDocument 
} from "../../types/interfaces"; 

// Type pour le state local du formulaire, qui utilise des objets Date pour les calendriers
type DemandeFormState = Omit<Partial<Demande>, 'date_absence' | 'date_retour'> & {
  date_absence?: Date;
  date_retour?: Date;
  heure_debut?: string;
  heure_fin?: string;
};

type DemandeValue = string | number | Date | DemandeDocument[] | undefined | null;

const NouvelleDemandePage = () => {
  const navigate = useNavigate();
  const [demande, setDemande] = useState<DemandeFormState>({
    status: "En attente",
    documents: [],
  });

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentClassification, setDocumentClassification] = useState("");
  const [documentNature, setDocumentNature] = useState<number | undefined>(undefined); // id_nature_document
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // États pour les données chargées depuis l'API
  const [fetchedNaturesDocuments, setFetchedNaturesDocuments] = useState<NatureDocument[]>([]);
  const [fetchedEmployes, setFetchedEmployes] = useState<Employe[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Effet pour charger les données des natures de documents et des employés
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingData(true);
      setDataError(null);
      try {
        const natures = await getAllNatureDocuments();
        setFetchedNaturesDocuments(natures);

        const employes = await getAllEmployes();
        setFetchedEmployes(employes);
      } catch (error) {
        console.error("Erreur lors du chargement des données initiales:", error);
        setDataError("Impossible de charger les données (employés ou types de documents).");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadInitialData();
  }, []); 

  const handleChange = (field: keyof Demande, value: DemandeValue) => {
    setDemande(prev => ({ ...prev, [field]: value }));
    
    // Supprime l'erreur du champ quand il est modifié
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!demande.type_demande) errors.type_demande = "Le type de demande est obligatoire.";
    if (!demande.id_employes) errors.id_employes = "L'employé concerné est obligatoire.";
    if (!demande.motif || demande.motif.trim() === "") errors.motif = "Le motif est obligatoire.";
    if (!demande.date_absence) errors.date_absence = "La date d'absence est obligatoire.";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Préparation des données pour l'API (sans id_demandes)
        const demandeData = {
          type_demande: demande.type_demande ?? undefined,
          status: demande.status ?? undefined,
          motif: demande.motif ?? undefined,
          duree: demande.duree ?? undefined,
          id_employes: demande.id_employes ?? undefined,
          date_debut: undefined,
          date_fin: undefined,
          date_absence: demande.date_absence ? format(demande.date_absence, "yyyy-MM-dd") : undefined,
          date_retour: demande.date_retour ? format(demande.date_retour, "yyyy-MM-dd") : undefined,
          heure_debut: demande.heure_debut ?? undefined,
          heure_fin: demande.heure_fin ?? undefined,
        };
        console.log("Demande soumise:", demandeData);
        await createDemande(demandeData);
        setShowSuccessDialog(true);
      } catch (error) {
        console.error("Erreur lors de la soumission de la demande:", error);
        alert("Une erreur est survenue lors de l'enregistrement de la demande.");
      }
    }
  };

  const resetForm = () => {
    setDemande({
      status: "En attente",
      documents: [],
    });
    setFormErrors({});
    setShowCancelDialog(false);
  };

  const isFormComplete = (): boolean => {
    return !!(
      demande.type_demande && 
      demande.motif && 
      demande.motif.trim() !== "" && 
      demande.id_employes &&
      demande.date_absence
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setDocumentName(file.name); 
      setShowAddDocumentDialog(true);
    }
  };

  const ajouterDocument = () => {
    if (selectedFile && documentName.trim() !== "" && documentNature !== undefined) { // S'assurer que documentNature est défini
      const nouveauDocument: DemandeDocument = {
        id_documents: Date.now(), 
        libelle_document: documentName.trim(),
        classification_document: documentClassification || "Standard", 
        id_nature_document: documentNature, // Utilisation de id_nature_document
        lien_document: URL.createObjectURL(selectedFile), 
        date_document: new Date().toISOString(),
        etat_document: "Actif"
      };

      setDemande(prev => ({ 
        ...prev, 
        documents: [...(prev.documents || []), nouveauDocument] 
      }));
      
      setSelectedFile(null);
      setDocumentName("");
      setDocumentClassification("");
      setDocumentNature(undefined);
      setShowAddDocumentDialog(false);
    }
  };

  const supprimerDocument = (id_documents: number) => { // id_documents
    setDemande(prev => ({
      ...prev,
      documents: prev.documents?.filter(doc => doc.id_documents !== id_documents) || []
    }));
  };

  const formatDate = (date: Date | undefined): string => {
    return date ? format(date, "dd MMMM yyyy", { locale: fr }) : "Sélectionner une date";
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    resetForm();
    navigate("/administration/demandes");
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Chargement des données...</p>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <p>{dataError}</p>
      </div>
    );
  }

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
              <Label htmlFor="id_employes" className="text-base">
                Employé concerné <span className="text-red-500">*</span>
              </Label>
              <Select
                // OnValueChange doit parser la valeur en nombre pour id_employes
                onValueChange={(value) => handleChange("id_employes", parseInt(value, 10))}
                value={demande.id_employes?.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un employé" />
                </SelectTrigger>
                <SelectContent>
                  {fetchedEmployes.map((employe) => (
                    <SelectItem
                      key={employe.id_employes}
                      value={employe.id_employes.toString()}
                    >
                      {employe.prenom_employes} {employe.nom_employes}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.id_employes && (
                <p className="text-sm text-red-500">{formErrors.id_employes}</p>
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

            {/* Champs heure_debut et heure_fin (conditionnels) */}
            {(demande.type_demande === "Télétravail" || demande.type_demande === "Autre") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="heure_debut" className="text-base">
                    Heure de début (optionnel)
                  </Label>
                  <Input
                    id="heure_debut"
                    type="time"
                    value={demande.heure_debut || ""}
                    onChange={(e) =>
                      handleChange("heure_debut", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heure_fin" className="text-base">
                    Heure de fin (optionnel)
                  </Label>
                  <Input
                    id="heure_fin"
                    type="time"
                    value={demande.heure_fin || ""}
                    onChange={(e) =>
                      handleChange("heure_fin", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

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

            {/* Section pour les pièces jointes (optionnelle) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Pièces jointes <span className="text-gray-500 text-sm">(optionnel)</span></Label>
                <div className="relative">
                  <Input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
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
                      key={document.id_documents}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <Paperclip className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{document.libelle_document}</p>
                          <p className="text-xs text-gray-500">
                            Classification: {document.classification_document}
                            {document.id_nature_document && (
                              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                {/* Utilise les natures de documents chargées depuis l'API */}
                                {fetchedNaturesDocuments.find(n => n.id_nature_document === document.id_nature_document)?.libelle || 'Non défini'}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => supprimerDocument(document.id_documents)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Paperclip className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">
                        Aucun document joint
                      </p>
                      <p className="text-xs text-gray-400">
                        Vous pouvez ajouter des documents à votre demande si nécessaire (optionnel)
                      </p>
                    </div>
                  </div>
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
              disabled={!isFormComplete() || isLoadingData} 
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
                navigate("/administration/demandes");
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
              <Label htmlFor="documentClassification">Classification du document</Label>
              <Input
                id="documentClassification"
                value={documentClassification}
                onChange={(e) => setDocumentClassification(e.target.value)}
                placeholder="Ex: Confidentiel, Public, Interne..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="documentType">Type de document</Label>
              <Select
                // Utilisation de Number(value) pour convertir la chaîne en nombre pour id_nature_document
                onValueChange={(value) => setDocumentNature(Number(value))}
                value={documentNature?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type de document" />
                </SelectTrigger>
                <SelectContent>
                  {fetchedNaturesDocuments.map((nature) => (
                    <SelectItem
                      key={nature.id_nature_document} // Utilisation de id_nature_document
                      value={nature.id_nature_document.toString()}
                    >
                      {nature.libelle}
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
              setDocumentClassification("");
              setDocumentNature(undefined);
              setShowAddDocumentDialog(false);
            }}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={ajouterDocument} 
              disabled={!selectedFile || documentName.trim() === "" || documentNature === undefined} // Vérification de undefined
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