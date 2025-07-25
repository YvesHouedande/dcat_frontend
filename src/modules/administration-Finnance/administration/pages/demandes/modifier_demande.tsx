import React, { useEffect, useState } from "react";
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
import { Calendar as CalendarIcon, Save, X, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate, useParams } from "react-router-dom";
import { useDemande, useEmployes, useUpdateDemande } from "../../../hooks/useDemandes";
import { CreateDemandeData } from "../../../services/demandeService";

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
}

type FormField = keyof DemandeFormData;
type FormErrors = Partial<Record<FormField, string>>;

const ModifierDemandePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { data: demande, isLoading: loadingDemande, error } = useDemande(Number(id));
  const { data: employes, isLoading: loadingEmployes } = useEmployes();
  const updateDemande = useUpdateDemande();

  // Pré-remplir le formulaire à la réception de la demande
  useEffect(() => {
    if (demande) {
      setFormData({
        motif: demande.motif || "",
        date_absence: demande.date_absence ? parseISO(demande.date_absence) : undefined,
        heure_debut: demande.heure_debut || "",
        heure_fin: demande.heure_fin || "",
        date_retour: demande.date_retour ? parseISO(demande.date_retour) : undefined,
        duree: demande.duree || "",
        type_demande: demande.type_demande || "",
        status: demande.status || "En attente",
        id_employes: demande.id_employes,
      });
    }
  }, [demande]);

  const handleChange = <K extends FormField>(field: K, value: DemandeFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.type_demande) errors.type_demande = "Le type de demande est obligatoire.";
    if (!formData.id_employes) errors.id_employes = "L'employé concerné est obligatoire.";
    if (!formData.motif || formData.motif.trim() === "") errors.motif = "Le motif est obligatoire.";
    if (!formData.date_absence) errors.date_absence = "La date d'absence est obligatoire.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm() || !id) return;
    try {
      const demandeData: Partial<CreateDemandeData> = {
        motif: formData.motif,
        date_absence: formData.date_absence ? format(formData.date_absence, "yyyy-MM-dd") : "",
        heure_debut: formData.heure_debut || "",
        heure_fin: formData.heure_fin || "",
        date_retour: formData.date_retour ? format(formData.date_retour, "yyyy-MM-dd") : "",
        duree: formData.duree || "",
        type_demande: formData.type_demande,
        status: formData.status,
        id_employes: formData.id_employes!,
      };
      console.log("formData au submit", formData);
      await updateDemande.mutateAsync({ id: Number(id), data: demandeData });
      setShowSuccessDialog(true);
    } catch {
      // Erreur déjà gérée par le hook
    }
  };

  const isFormComplete = (): boolean => {
    return !!(
      formData.type_demande &&
      formData.motif &&
      formData.motif.trim() !== "" &&
      formData.id_employes &&
      formData.date_absence
    );
  };

  const handleCancel = () => {
    if (isFormComplete()) {
      setShowCancelDialog(true);
    } else {
      navigate("/administration/demandes");
    }
  };

  const confirmCancel = () => {
    navigate("/administration/demandes");
  };

  const isLoading = loadingDemande || loadingEmployes || updateDemande.isLoading;

  if (loadingDemande) {
    return <div className="flex justify-center items-center h-96">Chargement...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-center py-8">Erreur : {String(error)}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Modifier la Demande RH
          </CardTitle>
          <CardDescription>
            Modifiez la demande de ressources humaines
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Type de demande */}
            <div className="space-y-2">
              <Label htmlFor="type_demande">Type de demande *</Label>
              <Select
                value={formData.type_demande}
                onValueChange={(value) => handleChange('type_demande', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Congé">Congé</SelectItem>
                  <SelectItem value="Absence">Absence</SelectItem>
                  <SelectItem value="Formation">Formation</SelectItem>
                  <SelectItem value="Mission">Mission</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.type_demande && (
                <p className="text-sm text-red-500">{formErrors.type_demande}</p>
              )}
            </div>
            {/* Employé */}
            <div className="space-y-2">
              <Label htmlFor="id_employes">Employé concerné *</Label>
              <Select
                value={formData.id_employes?.toString() || ""}
                onValueChange={(value) => {
                  console.log("Sélection employé :", value, typeof value);
                  handleChange('id_employes', Number(value));
                }}
                disabled={loadingEmployes}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingEmployes ? "Chargement..." : "Sélectionnez un employé"} />
                </SelectTrigger>
                <SelectContent>
                  {employes?.map((employe) => (
                    <SelectItem key={employe.id_employes} value={String(employe.id_employes)}>
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
              <Label htmlFor="motif">Motif *</Label>
              <Textarea
                id="motif"
                value={formData.motif}
                onChange={(e) => handleChange('motif', e.target.value)}
                placeholder="Décrivez le motif de votre demande..."
                rows={3}
              />
              {formErrors.motif && (
                <p className="text-sm text-red-500">{formErrors.motif}</p>
              )}
            </div>
            {/* Date d'absence */}
            <div className="space-y-2">
              <Label htmlFor="date_absence">Date d'absence *</Label>
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
                    onSelect={(date) => handleChange('date_absence', date)}
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
              <Label htmlFor="date_retour">Date de retour</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
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
                    onSelect={(date) => handleChange('date_retour', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* Heures début/fin */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heure_debut">Heure de début</Label>
                <Input
                  id="heure_debut"
                  type="time"
                  value={formData.heure_debut}
                  onChange={(e) => handleChange('heure_debut', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heure_fin">Heure de fin</Label>
                <Input
                  id="heure_fin"
                  type="time"
                  value={formData.heure_fin}
                  onChange={(e) => handleChange('heure_fin', e.target.value)}
                />
              </div>
            </div>
            {/* Durée */}
            <div className="space-y-2">
              <Label htmlFor="duree">Durée</Label>
              <Input
                id="duree"
                value={formData.duree}
                onChange={(e) => handleChange('duree', e.target.value)}
                placeholder="ex: 2 jours, 1 semaine..."
              />
            </div>
            {/* Statut */}
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
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
            <Button
              type="submit"
              disabled={!isFormComplete() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Modification...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Modifier la demande
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
            <AlertDialogTitle>Demande modifiée avec succès</AlertDialogTitle>
            <AlertDialogDescription>
              Les modifications ont bien été enregistrées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate("/administration/demandes")}>Retour à la liste</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Dialogue de confirmation d'annulation */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la modification</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler ? Toutes les modifications seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuer l'édition</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>Annuler et quitter</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ModifierDemandePage;
