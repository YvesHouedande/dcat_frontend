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
  Save,
  X,
  Loader2,
  Upload,
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
import { useCreateDemande, useEmployes } from "../../hooks/useDemandes";
import { CreateDemandeData } from "../../services/demandeService";
import { DossierCombobox } from "@/components/combobox/DossierCombobox";
import useDocumentsApi from "../../services/finance_comptaService";
import { toast } from "sonner";
import { TypeDemandes } from "./enum";

// Type strict pour le formulaire local
interface DemandeFormData {
  motif: string;
  date_absence: Date | undefined;
  heure_debut: string;
  heure_fin: string;
  date_retour: Date | undefined;
  duree: string;
  type_demande: string;
  status: string;
  id_employes: number | undefined;
  id_dossier: string | undefined;
}

type FormField = keyof DemandeFormData;

type FormErrors = Partial<Record<FormField, string>>;

const NouvelleDemandePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DemandeFormData>({
    motif: "",
    date_absence: undefined,
    heure_debut: "",
    heure_fin: "",
    date_retour: undefined,
    duree: "",
    type_demande: "",
    status: "En attente",
    id_employes: undefined,
    id_dossier: undefined,
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const createDemande = useCreateDemande();
  const { data: employes, isLoading: loadingEmployes } = useEmployes();
  const { createDocument } = useDocumentsApi();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setFormData((prev) => ({
        ...prev,
        lien_document: file.name,
        libelle_document: file.name,
        date_document: new Date().toISOString(),
      }));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileName("");
    setFormData((prev) => ({ ...prev, lien_document: "" }));
  };

  // Fonction pour extraire le nombre de jours depuis la durée
  const extractDaysFromDuration = (duration: string): number => {
    if (!duration) return 0;
    const match = duration.match(/(\d+)\s*jour[s]?/i);
    return match ? parseInt(match[1]) : 0;
  };

  // Calculer automatiquement la date de retour basée sur la durée
  useEffect(() => {
    if (formData.date_absence && formData.duree) {
      const days = extractDaysFromDuration(formData.duree);
      if (days > 0) {
        const returnDate = new Date(formData.date_absence);
        returnDate.setDate(returnDate.getDate() + days);
        setFormData((prev) => ({ ...prev, date_retour: returnDate }));
      }
    }
  }, [formData.date_absence, formData.duree]);

  const handleChange = <K extends FormField>(
    field: K,
    value: DemandeFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.type_demande)
      errors.type_demande = "Le type de demande est obligatoire.";
    if (!formData.id_employes)
      errors.id_employes = "L'employé concerné est obligatoire.";
    if (!formData.motif || formData.motif.trim() === "")
      errors.motif = "Le motif est obligatoire.";
    if (!formData.date_absence)
      errors.date_absence = "La date d'absence est obligatoire.";

    // Validation des heures pour les absences d'une journée (0 jour)
    if (formData.duree && extractDaysFromDuration(formData.duree) === 0) {
      const now = new Date();
      const currentTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");
      const isToday =
        formData.date_absence &&
        formData.date_absence.toDateString() === now.toDateString();

      if (
        formData.heure_debut &&
        isToday &&
        formData.heure_debut < currentTime
      ) {
        errors.heure_debut =
          "L'heure de début ne peut pas être antérieure à l'heure actuelle pour une absence aujourd'hui.";
      }

      if (
        formData.heure_debut &&
        formData.heure_fin &&
        formData.heure_fin <= formData.heure_debut
      ) {
        errors.heure_fin =
          "L'heure de fin doit être postérieure à l'heure de début.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log("formData au submit", formData);
    if (!formData.id_dossier && selectedFile)
      return toast.error("Veuillez sélectionner un dossier");
    try {
      const demandeData: CreateDemandeData = {
        motif: formData.motif,
        date_absence: formData.date_absence
          ? format(formData.date_absence, "yyyy-MM-dd")
          : "",
        heure_debut: formData.heure_debut || "",
        heure_fin: formData.heure_fin || "",
        date_retour: formData.date_retour
          ? format(formData.date_retour, "yyyy-MM-dd")
          : "",
        duree: formData.duree || "",
        type_demande: formData.type_demande,
        status: formData.status,
        id_employes: formData.id_employes!, // Champ avec S partout
      };
      const demande = await createDemande.mutateAsync({ data: demandeData });
      setShowSuccessDialog(true);
      if (selectedFile) {
        await createDocument({
          lien_document: selectedFile.name,
          libelle_document: selectedFile.name,
          date_document: new Date().toISOString(),
          id_dossier: Number(formData.id_dossier),
          id_nature_document: 0,
          classification_document: "demande rh",
          etat_document: "En attente",
          id_demandes: String(demande.id_demandes),
        });
      }
    } catch {
      // L'erreur est déjà gérée par le hook avec toast
    }
  };

  const isFormComplete = (): boolean => {
    const baseComplete = !!(
      formData.type_demande &&
      formData.motif &&
      formData.motif.trim() !== "" &&
      formData.id_employes &&
      formData.date_absence
    );

    // Si la durée est "0 jour", vérifier que les heures sont renseignées
    if (formData.duree && extractDaysFromDuration(formData.duree) === 0) {
      return baseComplete && !!(formData.heure_debut && formData.heure_fin);
    }

    return baseComplete;
  };

  const handleCancel = () => {
    if (isFormComplete()) {
      setShowCancelDialog(true);
    } else {
      navigate(-1);
    }
  };

  const confirmCancel = () => {
    navigate(-1);
  };

  const isLoading = loadingEmployes || createDemande.isLoading;

  return (
    <div className="container mx-auto py-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Nouvelle Demande RH
          </CardTitle>
          <CardDescription>
            Créez une nouvelle demande de ressources humaines
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Type de demande */}
            <div className="space-y-2">
              <Label htmlFor="type_demande">Type de demande  <span className="text-red-500"> *</span></Label>
              <Select
                value={formData.type_demande}
                onValueChange={(value) => handleChange("type_demande", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TypeDemandes).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.type_demande && (
                <p className="text-sm text-red-500">
                  {formErrors.type_demande}
                </p>
              )}
            </div>
            {/* Employé */}
            <div className="space-y-2">
              <Label htmlFor="id_employes">Employé concerné  <span className="text-red-500"> *</span></Label>
              <Select
                value={formData.id_employes ? String(formData.id_employes) : ""}
                onValueChange={(value) =>
                  handleChange("id_employes", Number(value))
                }
                disabled={loadingEmployes}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingEmployes
                        ? "Chargement..."
                        : "Sélectionnez un employé"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {employes?.map((employe) => (
                    <SelectItem
                      key={employe.id_employes}
                      value={String(employe.id_employes)}
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
            {/* Motif */}
            <div className="space-y-2">
              <Label htmlFor="motif">Motif  <span className="text-red-500"> *</span></Label>
              <Textarea
                id="motif"
                value={formData.motif}
                onChange={(e) => handleChange("motif", e.target.value)}
                placeholder="Décrivez le motif de votre demande..."
                rows={3}
              />
              {formErrors.motif && (
                <p className="text-sm text-red-500">{formErrors.motif}</p>
              )}
            </div>
            {/* Date d'absence */}
            <div className="space-y-2">
              <Label htmlFor="date_absence">Date d'absence  <span className="text-red-500"> *</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date_absence ? (
                      format(formData.date_absence, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionnez une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date_absence}
                    onSelect={(date) => handleChange("date_absence", date)}
                    initialFocus
                    fromDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
              {formErrors.date_absence && (
                <p className="text-sm text-red-500">
                  {formErrors.date_absence}
                </p>
              )}
            </div>
            {/* Date de retour */}
            <div className="space-y-2">
              <Label htmlFor="date_retour">
                Date de retour
                <span className="text-xs text-blue-600 ml-2">
                  (calculée automatiquement)
                </span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={true}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date_retour ? (
                      format(formData.date_retour, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionnez une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date_retour}
                    onSelect={(date) => handleChange("date_retour", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formData.duree &&
                extractDaysFromDuration(formData.duree) > 0 && (
                  <p className="text-xs text-blue-600">
                    Date calculée automatiquement basée sur la durée de{" "}
                    {extractDaysFromDuration(formData.duree)} jour(s)
                  </p>
                )}
            </div>
            {/* Durée */}
            <div className="space-y-2">
              <Label htmlFor="duree">Durée</Label>
              <Input
                id="duree"
                value={formData.duree}
                onChange={(e) => handleChange("duree", e.target.value)}
                placeholder="ex: 0 jour (pour une absence partielle), 2 jours, 1 semaine..."
              />
              <p className="text-xs text-gray-500">
                Si vous saisissez "0 jour", vous devrez préciser les heures de
                début et fin. La date de retour sera calculée automatiquement
                selon la durée. Veuillez prévicer la durée en jours suivis de (jour) ou (jours)
              </p>
            </div>
            {/* Heures début/fin */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heure_debut">
                  Heure de début
                  {formData.duree &&
                    extractDaysFromDuration(formData.duree) === 0 && (
                      <span className="text-red-500"> *</span>
                    )}
                </Label>
                <Input
                  id="heure_debut"
                  type="time"
                  value={formData.heure_debut}
                  onChange={(e) => handleChange("heure_debut", e.target.value)}
                />
                {formErrors.heure_debut && (
                  <p className="text-sm text-red-500">
                    {formErrors.heure_debut}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="heure_fin">
                  Heure de fin
                  {formData.duree &&
                    extractDaysFromDuration(formData.duree) === 0 && (
                      <span className="text-red-500"> *</span>
                    )}
                </Label>
                <Input
                  id="heure_fin"
                  type="time"
                  value={formData.heure_fin}
                  onChange={(e) => handleChange("heure_fin", e.target.value)}
                />
                {formErrors.heure_fin && (
                  <p className="text-sm text-red-500">{formErrors.heure_fin}</p>
                )}
              </div>
            </div>
            {/* Statut */}
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Approuvée">Approuvée</SelectItem>
                  <SelectItem value="Refusée">Refusée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedFile && (
              <div className="space-y-2 mb-8">
                <Label htmlFor="dossier">Dossier  <span className="text-red-500"> *</span></Label>
                <DossierCombobox
                  value={formData.id_dossier || undefined}
                  onChange={(value) =>
                    handleChange("id_dossier", String(value))
                  }
                  type={"demandes RH"}
                />
              </div>
            )}

            {/* Upload de fichier */}
            <div className="space-y-2">
              <Label htmlFor="file">Fichier  <span className="text-red-500"> *</span></Label>
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button type="submit" disabled={!isFormComplete() || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Créer la demande
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      {/* Dialogue de succès */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Demande créée avec succès</AlertDialogTitle>
            <AlertDialogDescription>
              Votre demande a été enregistrée et sera traitée par l'équipe RH.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => navigate("/administration/demandes")}
            >
              Retour à la liste
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Dialogue de confirmation d'annulation */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la création</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler ? Toutes les données saisies
              seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuer l'édition</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>
              Annuler et quitter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NouvelleDemandePage;
