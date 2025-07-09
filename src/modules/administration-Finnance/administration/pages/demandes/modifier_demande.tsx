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
  CheckCircle,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate, useParams } from "react-router-dom";
import { Demande, DemandeDocument, Employe, NatureDocument } from "../../types/interfaces";
import { fetchDemandeById, updateDemande, getAllEmployes, getAllNatureDocuments } from "../../../services/demandeService";

// Helper pour encoder un fichier en base64
// const toBase64 = (file: File): Promise<string> =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//   });

const ModifierDemandePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [demande, setDemande] = useState<Partial<Demande>>({});
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [naturesDocuments, setNaturesDocuments] = useState<NatureDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentNature, setDocumentNature] = useState<number | undefined>(undefined);
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false);
  const [newlyAddedFiles, setNewlyAddedFiles] = useState<{file: File; name: string; classification: string}[]>([]);
  
  // Chargement des données au montage
  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError("ID de demande manquant.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [demandeData, employesData, naturesData] = await Promise.all([
          fetchDemandeById(Number(id)),
          getAllEmployes(),
          getAllNatureDocuments(),
        ]);
        setDemande(demandeData);
        setEmployes(employesData);
        setNaturesDocuments(naturesData);
      } catch (err: unknown) {
        setError((typeof err === 'object' && err !== null && 'message' in err) ? (err as { message?: string }).message || "Erreur lors du chargement des données" : "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Handler générique pour les changements de champs
  const handleChange = (field: keyof Demande, value: unknown) => {
    setDemande(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: keyof Demande, date: Date | undefined) => {
    if (date) {
      handleChange(field, format(date, "yyyy-MM-dd"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      if (newlyAddedFiles.length > 0) {
        // Cas 1: Nouveaux fichiers ajoutés -> FormData avec PUT
        const formData = new FormData();
        
        const payload: Partial<Demande> = {
          type_demande: demande.type_demande,
          motif: demande.motif,
          duree: demande.duree,
          id_employes: demande.id_employes,
          date_absence: demande.date_absence,
          date_retour: demande.date_retour,
          heure_debut: demande.heure_debut,
          heure_fin: demande.heure_fin,
          status: demande.status,
        };

        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        
        // Ajouter le nouveau fichier et ses métadonnées
        const lastFile = newlyAddedFiles[newlyAddedFiles.length - 1];
        formData.append('document', lastFile.file);
        formData.append('libelle_document', lastFile.name);
        formData.append('classification_document', lastFile.classification);
        
        await updateDemande(Number(id), formData);
      } else {
        // Cas 2: Pas de nouveaux fichiers -> JSON avec PUT
        const payload: Partial<Demande> = {
          type_demande: demande.type_demande,
          motif: demande.motif,
          duree: demande.duree,
          id_employes: demande.id_employes,
          date_absence: demande.date_absence,
          date_retour: demande.date_retour,
          heure_debut: demande.heure_debut,
          heure_fin: demande.heure_fin,
          status: demande.status,
        };

        Object.keys(payload).forEach(key => {
          if (payload[key as keyof typeof payload] === undefined) {
            delete payload[key as keyof typeof payload];
          }
        });

        await updateDemande(Number(id), payload);
      }

      setShowSuccessDialog(true);
      setTimeout(() => {
        navigate("/administration/demandes");
      }, 2000);

    } catch (err: unknown) {
      console.error("Erreur détaillée lors de la soumission:", err);
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const errorObj = err as { response?: { data?: unknown } };
        console.error("Réponse de l'erreur API:", errorObj.response?.data);
      }
      setError((typeof err === 'object' && err !== null && 'message' in err) ? (err as { message?: string }).message || "Erreur lors de la modification de la demande" : "Erreur lors de la modification de la demande");
    }
  };

  const isFormComplete = (): boolean => {
    return !!(demande.type_demande && demande.motif?.trim() && demande.id_employes);
  };
  
  const formatDateForPicker = (dateString: string | undefined | null): Date | undefined => {
    return dateString ? parseISO(dateString) : undefined;
  };

  const ajouterDocument = () => {
    if (selectedFile && documentName.trim() !== "" && documentNature !== undefined) {
      const classification = "Standard"; // Basé sur le code existant
      const nouveauDocument: DemandeDocument = {
        id_documents: Date.now(), 
        libelle_document: documentName.trim(),
        classification_document: classification, 
        id_nature_document: documentNature,
        lien_document: URL.createObjectURL(selectedFile), 
        date_document: new Date().toISOString(),
        etat_document: "Actif"
      };

      handleChange("documents", [...(demande.documents || []), nouveauDocument]);
      // On sauvegarde le fichier et ses métadonnées pour la soumission
      setNewlyAddedFiles(prev => [...prev, { file: selectedFile, name: documentName.trim(), classification: classification }]);
      
      setSelectedFile(null);
      setDocumentName("");
      setDocumentNature(undefined);
      setShowAddDocumentDialog(false);
    }
  };

  const supprimerDocument = (id_document: number) => {
    const nouveauxDocuments = demande.documents?.filter(doc => doc.id_documents !== id_document) || [];
    handleChange("documents", nouveauxDocuments);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
  }

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
                  handleChange("type_demande", value)
                }
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
              {!demande.type_demande && (
                <p className="text-sm text-red-500">Ce champ est obligatoire</p>
              )}
            </div>

            <input type="hidden" value={demande.status} />

            {/* Sélection de l'employé */}
            <div className="space-y-2">
              <Label htmlFor="id_employe" className="text-base">
                Employé concerné <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) =>
                  handleChange("id_employes", parseInt(value))
                }
                value={demande.id_employes?.toString() || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employes.map((employe) => (
                    <SelectItem
                      key={employe.id_employes}
                      value={employe.id_employes.toString()}
                    >
                      {employe.prenom_employes} {employe.nom_employes}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!demande.id_employes && (
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
                      !demande.date_absence && "text-gray-400"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {demande.date_absence ? format(parseISO(demande.date_absence), "dd MMMM yyyy", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formatDateForPicker(demande.date_absence)}
                    onSelect={(date) => handleDateChange("date_absence", date)}
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
                      !demande.date_retour && "text-gray-400"
                    }`}
                    disabled={!demande.date_absence}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {demande.date_retour ? format(parseISO(demande.date_retour), "dd MMMM yyyy", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formatDateForPicker(demande.date_retour)}
                    onSelect={(date) => handleDateChange("date_retour", date)}
                    disabled={(date) =>
                      !demande.date_absence || date < parseISO(demande.date_absence)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Heures de début et fin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="heure_debut" className="text-base">
                  Heure de début
                </Label>
                <Input
                  id="heure_debut"
                  type="time"
                  value={demande.heure_debut || ""}
                  onChange={(e) => handleChange("heure_debut", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heure_fin" className="text-base">
                  Heure de fin
                </Label>
                <Input
                  id="heure_fin"
                  type="time"
                  value={demande.heure_fin || ""}
                  onChange={(e) => handleChange("heure_fin", e.target.value)}
                />
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
                onChange={(e) =>
                  handleChange("motif", e.target.value)
                }
                maxLength={500}
              />
              {!demande.motif && (
                <p className="text-sm text-red-500">Ce champ est obligatoire</p>
              )}
              <p className="text-sm text-gray-500">
                {demande.motif?.length}/500 caractères
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
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        setDocumentName(file.name);
                        setShowAddDocumentDialog(true);
                      }
                    }}
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
                {(demande.documents || []).length > 0 ? (
                  (demande.documents || []).map((document) => (
                    <div
                      key={document.id_documents}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <Paperclip className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{document.libelle_document}</p>
                          <p className="text-xs text-gray-500">
                            {document.id_nature_document && (
                              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                {naturesDocuments.find(n => n.id_nature_document === document.id_nature_document)?.libelle || 'Non défini'}
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

      {/* Dialogue de succès */}
      <AlertDialog open={showSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center">Modification réussie</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              La demande a été mise à jour avec succès. Vous allez être redirigé.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialogue d'annulation */}
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
              setDemande({});
              setShowCancelDialog(false);
              navigate("/administration/demandes");
            }}>
              Oui, annuler
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
