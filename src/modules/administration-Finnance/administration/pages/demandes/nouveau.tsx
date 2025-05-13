import React, { useState } from "react";
import { useForm } from "react-hook-form";
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

// Types pour le formulaire
interface DemandeFormData {
  type_demande: string;
  date_debut: Date | undefined;
  date_fin: Date | undefined;
  motif: string;
  Id_employes: number;
}

// Type pour les employés
interface Employe {
  Id_employes: number;
  nom: string;
  prenom: string;
  departement: string;
}

// Type pour les fichiers joints
interface FichierJoint {
  id: number;
  nom: string;
  taille: string;
  type: string;
}

// Données d'exemple pour les employés
const employes: Employe[] = [
  {
    Id_employes: 101,
    nom: "Dubois",
    prenom: "Thomas",
    departement: "Marketing",
  },
  {
    Id_employes: 102,
    nom: "Dupont",
    prenom: "Marie",
    departement: "Informatique",
  },
  {
    Id_employes: 103,
    nom: "Martin",
    prenom: "Sophie",
    departement: "Ressources Humaines",
  },
  { Id_employes: 104, nom: "Bernard", prenom: "Lucas", departement: "Finance" },
  { Id_employes: 105, nom: "Petit", prenom: "Emma", departement: "Ventes" },
];

const NouvelleDemandePage: React.FC = () => {
  // États du formulaire
  const [dateDebut, setDateDebut] = useState<Date | undefined>(undefined);
  const [dateFin, setDateFin] = useState<Date | undefined>(undefined);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [fichiers, setFichiers] = useState<FichierJoint[]>([]);
  const navigate = useNavigate();

  // Initialiser le formulaire
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DemandeFormData>({
    defaultValues: {
      type_demande: "",
      date_debut: undefined,
      date_fin: undefined,
      motif: "",
      Id_employes: 0,
    },
  });

  // Surveiller les valeurs pour validation
  const typeDemandeValue = watch("type_demande");
  const motifValue = watch("motif");
  const employeValue = watch("Id_employes");

  // Fonction pour soumettre le formulaire
  const onSubmit = (data: DemandeFormData) => {
    console.log("Données soumises:", data);
    console.log("Fichiers joints:", fichiers);
    // Vous implémenteriez ici l'appel API pour enregistrer la demande
    setShowSuccessDialog(true);
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    reset();
    setDateDebut(undefined);
    setDateFin(undefined);
    setFichiers([]);
    setShowCancelDialog(false);
  };

  // Fonction pour vérifier si le formulaire est complet
  const isFormComplete = () => {
    return (
      typeDemandeValue && dateDebut && dateFin && motifValue && employeValue > 0
    );
  };

  // Fonction pour gérer l'upload de fichiers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Ajouter les nouveaux fichiers à la liste
      const newFiles: FichierJoint[] = Array.from(e.target.files).map(
        (file, index) => {
          return {
            id: Date.now() + index,
            nom: file.name,
            taille: formatFileSize(file.size),
            type: file.type,
          };
        }
      );

      setFichiers((prev) => [...prev, ...newFiles]);
    }
  };

  // Fonction pour supprimer un fichier
  const supprimerFichier = (id: number) => {
    setFichiers((prev) => prev.filter((fichier) => fichier.id !== id));
  };

  // Fonction pour formater la taille des fichiers
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " octets";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " Ko";
    else return (bytes / 1048576).toFixed(1) + " Mo";
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Type de demande */}
            <div className="space-y-2">
              <Label htmlFor="type_demande" className="text-base">
                Type de demande <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("type_demande", value)}
                value={typeDemandeValue}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un type de demande" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Congé">Congé</SelectItem>
                  <SelectItem value="Congé maladie">Congé maladie</SelectItem>
                  <SelectItem value="Formation">Formation</SelectItem>
                  <SelectItem value="Télétravail">Télétravail</SelectItem>
                  <SelectItem value="Autres">Autres</SelectItem>
                </SelectContent>
              </Select>
              {errors.type_demande && (
                <p className="text-sm text-red-500">Ce champ est obligatoire</p>
              )}
            </div>

            {/* Sélection de l'employé */}
            <div className="space-y-2">
              <Label htmlFor="Id_employes" className="text-base">
                Employé concerné <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) =>
                  setValue("Id_employes", parseInt(value))
                }
                value={employeValue ? employeValue.toString() : ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employes.map((employe) => (
                    <SelectItem
                      key={employe.Id_employes}
                      value={employe.Id_employes.toString()}
                    >
                      {employe.prenom} {employe.nom} - {employe.departement}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.Id_employes && (
                <p className="text-sm text-red-500">Ce champ est obligatoire</p>
              )}
            </div>

            {/* Sélection des dates */}
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
                      {dateDebut ? (
                        format(dateDebut, "dd MMMM yyyy", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateDebut}
                      onSelect={(date) => {
                        setDateDebut(date);
                        setValue("date_debut", date);
                      }}
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
                      {dateFin ? (
                        format(dateFin, "dd MMMM yyyy", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFin}
                      onSelect={(date) => {
                        setDateFin(date);
                        setValue("date_fin", date);
                      }}
                      disabled={(date) =>
                        dateDebut?.getTime() !== undefined && date < dateDebut
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {dateDebut && dateFin && (
                  <p className="text-sm text-gray-500">
                    Durée:{" "}
                    {Math.ceil(
                      (dateFin.getTime() - dateDebut.getTime()) /
                        (1000 * 60 * 60 * 24)
                    ) + 1}{" "}
                    jours
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
                {...register("motif", { required: "Ce champ est obligatoire" })}
              />
              {errors.motif && (
                <p className="text-sm text-red-500">{errors.motif.message}</p>
              )}
              <p className="text-sm text-gray-500">
                {motifValue ? motifValue.length : 0}/500 caractères
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
                    multiple
                  />
                  <Label
                    htmlFor="file-upload"
                    className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    Ajouter des fichiers
                  </Label>
                </div>
              </div>

            
              {/* Liste des fichiers joints */}
              <div className="space-y-2">
                {fichiers.length > 0 ? (
                  fichiers.map((fichier) => (
                    <div
                      key={fichier.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <Paperclip className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{fichier.nom}</p>
                          <p className="text-xs text-gray-500">
                            {fichier.taille} • {fichier.type.split("/")[1]}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => supprimerFichier(fichier.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Aucun fichier joint. Vous pouvez ajouter des documents à
                    votre demande.
                  </p>
                )}
              </div>
            </div>

            {/* Explication des champs obligatoires */}
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
              Enregistrer la demande
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Dialogue de confirmation d'annulation */}
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
            <AlertDialogAction onClick={()=>{resetForm(); navigate(-1)}}>
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
    </div>
  );
};

export default NouvelleDemandePage;
