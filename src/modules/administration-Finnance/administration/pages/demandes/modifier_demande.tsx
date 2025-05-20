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
import { useNavigate } from "react-router-dom";
import { Demande, Document } from "../../types/interfaces";
import { naturesDocuments, employes } from "./data";

const ModifierDemandePage: React.FC = () => {
  const [dateDebut, setDateDebut] = useState<Date | undefined>(undefined);
  const [dateFin, setDateFin] = useState<Date | undefined>(undefined);
  const [dateAbsence, setDateAbsence] = useState<Date | undefined>(undefined);
  const [dateRetour, setDateRetour] = useState<Date | undefined>(undefined);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentNature, setDocumentNature] = useState<number | undefined>(undefined);
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false);
  const [currentDemande, setCurrentDemande] = useState<Partial<Demande>>({
    status: "En attente",
    type_demande: "",
    motif: "",
    duree: "",
    id_employe: undefined,
    documents: []
  });
  const navigate = useNavigate();

  // Valeurs observées pour le formulaire
  const typeDemandeValue = currentDemande.type_demande;
  const motifValue = currentDemande.motif || "";
  const employeValue = currentDemande.id_employe;
  const statusValue = currentDemande.status;

  // Calcul de la durée lorsque les dates changent
  const calculerDuree = (): number | null => {
    if (dateDebut && dateFin) {
      const diffTime = dateFin.getTime() - dateDebut.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setCurrentDemande(prev => ({...prev, duree: diffDays.toString()}));
      return diffDays;
    }
    return null;
  };

  // Mise à jour de la durée lorsqu'une des dates change
  useEffect(() => {
    calculerDuree();
  }, [dateDebut, dateFin]);

  // Fonction pour charger les données existantes de la demande à modifier
  useEffect(() => {
    const loadExistingData = async () => {
      console.log("Chargement des données existantes...");
      const existingData: Partial<Demande> = {
        Id_demandes: 1,
        status: "En attente",
        type_demande: "Congé",
        motif: "Demande de congé annuel",
        duree: "5",
        id_employe: 102,
        date_debut: new Date(2023, 11, 15),
        date_fin: new Date(2023, 11, 19),
        date_absence: new Date(2023, 11, 15),
        date_retour: new Date(2023, 11, 20),
        documents: [
          {
            id_document: 1,
            libele_document: "Document 1",
            id_nature_document: 1,
            lien_document: "",
          },
        ],
      };
      console.log("Données existantes chargées:", existingData);
      setCurrentDemande(existingData);
      setDateDebut(existingData.date_debut);
      setDateFin(existingData.date_fin);
      setDateAbsence(existingData.date_absence);
      setDateRetour(existingData.date_retour);
      if (existingData.documents) {
        setDocuments(existingData.documents);
      }
    };

    loadExistingData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const demandeComplete: Partial<Demande> = {
      ...currentDemande,
      date_debut: dateDebut,
      date_fin: dateFin,
      date_absence: dateAbsence,
      date_retour: dateRetour,
      duree: calculerDuree()?.toString() || "",
      documents: documents
    };

    console.log("Demande modifiée:", demandeComplete);
    setShowSuccessDialog(true);
  };

  const resetForm = () => {
    setCurrentDemande({
      status: "En attente",
      type_demande: "",
      motif: "",
      duree: "",
      id_employe: undefined,
      documents: []
    });
    setDateDebut(undefined);
    setDateFin(undefined);
    setDateAbsence(undefined);
    setDateRetour(undefined);
    setDocuments([]);
    setShowCancelDialog(false);
  };

  const isFormComplete = (): boolean => {
    return (
      !!currentDemande.type_demande &&
      !!currentDemande.motif &&
      currentDemande.motif.trim() !== "" &&
      !!currentDemande.id_employe &&
      !!dateDebut &&
      !!dateFin
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
    if (selectedFile && documentName.trim() !== "") {
      const nouveauDocument: Document = {
        id_document: Date.now(),
        libele_document: documentName.trim(),
        id_nature_document: documentNature,
        lien_document: "",
      };

      setDocuments((prev) => [...prev, nouveauDocument]);
      setCurrentDemande(prev => ({
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
    const newDocuments = documents.filter((doc) => doc.id_document !== id_document);
    setDocuments(newDocuments);
    setCurrentDemande(prev => ({...prev, documents: newDocuments}));
  };

  const formatDate = (date: Date | undefined): string => {
    return date ? format(date, "dd MMMM yyyy", { locale: fr }) : "Sélectionner une date";
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Modifier la demande</CardTitle>
          <CardDescription>
            Modifiez les informations de la demande existante
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
                onValueChange={(value) =>
                  setCurrentDemande(prev => ({...prev, type_demande: value}))
                }
                value={typeDemandeValue}
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
              {!typeDemandeValue && (
                <p className="text-sm text-red-500">Ce champ est obligatoire</p>
              )}
            </div>

            <input type="hidden" value={statusValue} />

            {/* Sélection de l'employé */}
            <div className="space-y-2">
              <Label htmlFor="id_employe" className="text-base">
                Employé concerné <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) =>
                  setCurrentDemande(prev => ({...prev, id_employe: parseInt(value)}))
                }
                value={employeValue?.toString() || ""}
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
              {!employeValue && (
                <p className="text-sm text-red-500">Ce champ est obligatoire</p>
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
                      !dateAbsence && "text-gray-400"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(dateAbsence)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateAbsence}
                    onSelect={setDateAbsence}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
                      !dateRetour && "text-gray-400"
                    }`}
                    disabled={!dateAbsence}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(dateRetour)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRetour}
                    onSelect={setDateRetour}
                    disabled={(date) =>
                      !dateAbsence || date < dateAbsence
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
                        !dateDebut && "text-gray-400"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(dateDebut)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateDebut}
                      onSelect={setDateDebut}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
                        !dateFin && "text-gray-400"
                      }`}
                      disabled={!dateDebut}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(dateFin)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFin}
                      onSelect={setDateFin}
                      disabled={(date) =>
                        !dateDebut || date < dateDebut
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {dateDebut && dateFin && (
                  <p className="text-sm text-gray-500">
                    Durée: {calculerDuree()} jours
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
                value={motifValue}
                onChange={(e) =>
                  setCurrentDemande(prev => ({...prev, motif: e.target.value}))
                }
                maxLength={500}
              />
              {!motifValue && (
                <p className="text-sm text-red-500">Ce champ est obligatoire</p>
              )}
              <p className="text-sm text-gray-500">
                {motifValue.length}/500 caractères
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
                {documents.length > 0 ? (
                  documents.map((document) => (
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
              onClick={() => setShowCancelDialog(true)}
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
              Enregistrer les modifications
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Dialogues */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler les modifications ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler ? Toutes les modifications non enregistrées seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuer la modification</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              resetForm();
              navigate(-1);
            }}>
              Oui, annuler
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialogue de confirmation de succès */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Demande modifiée</AlertDialogTitle>
            <AlertDialogDescription>
              Votre demande a été modifiée avec succès.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowSuccessDialog(false);
                navigate(-1); // Retour à la page précédente après modification
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
            <AlertDialogAction onClick={ajouterDocument} disabled={!selectedFile || documentName.trim() === ""}>
              Ajouter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ModifierDemandePage;
