import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Calendar as CalendarIcon,
  ArrowLeft,
  Save,
  Upload,
  AlertCircle,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface Contrat {
  id_contrat: string;
  nom_contrat: string;
  duree_Contrat: string;
  date_debut: string;
  date_fin: string;
  Id_partenaire: string;
  fichier: string;
  nomPartenaire: string;
}

const AjoutAvenant: React.FC = () => {
  const navigate = useNavigate();
  const { idContrat } = useParams<{ idContrat: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [contratBase, setContratBase] = useState<Contrat | null>(null);
  const [loading, setLoading] = useState(true);

  // États du formulaire
  const [formData, setFormData] = useState({
    titre_avenant: "",
    description: "",
    motif: "",
    date_effet: undefined as Date | undefined,
    modifie_duree: false,
    nouvelle_duree: "",
    nouvelle_date_fin: undefined as Date | undefined,
    documents: null as File | null,
  });

  // Types de motifs d'avenant
  const motifsAvenant = [
    "Prolongation de durée",
    "Ajustement financier",
    "Modification de périmètre",
    "Changement de conditions",
    "Ajout de services/produits",
    "Modification de contacts",
    "Autres modifications",
  ];


  // Simuler la récupération des données du contrat
  useEffect(() => {
    // Simulation d'un appel API pour récupérer les détails du contrat
    const fetchContrat = async () => {
      setLoading(true);
      try {
        // Habituellement, il y aurait un appel API ici
        // Simulons une attente réseau
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Exemple de données pour le contrat correspondant à l'ID
        const contratExemple: Contrat = {
          id_contrat: idContrat || "C001",
          nom_contrat: "Accord de service informatique",
          duree_Contrat: "12 mois",
          date_debut: "2025-01-15",
          date_fin: "2026-01-14",
          Id_partenaire: "P001",
          fichier: "contrat_service_info.pdf",
          nomPartenaire: "Systèmes IT Pro",
        };

        setContratBase(contratExemple);
      } catch (error) {
        console.error("Erreur lors de la récupération du contrat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContrat();
  }, [idContrat]);

  // Gérer les changements des champs de texte
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Gérer le changement de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        documents: e.target.files[0],
      });
    }
  };

  // Gérer le switch de modification de durée
  const handleDureeToggle = (checked: boolean) => {
    setFormData({
      ...formData,
      modifie_duree: checked,
    });
  };

  // Calculer automatiquement la nouvelle date de fin
  const updateEndDate = (duree: string) => {
    if (!contratBase || !formData.date_effet) return;

    const durationMatch = duree.match(/(\d+)/);
    if (!durationMatch) return;

    const months = parseInt(durationMatch[1]);
    const effectDate = new Date(formData.date_effet);
    const endDate = new Date(effectDate);
    endDate.setMonth(effectDate.getMonth() + months);

    setFormData({
      ...formData,
      nouvelle_date_fin: endDate,
    });
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuler une soumission API
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      // Rediriger après affichage du message de succès
      setTimeout(() => {
        navigate(`/administration/contrats/details/${idContrat}`);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() =>
              navigate(`/administration/contrats/details/${idContrat}`)
            }
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour au contrat
          </Button>

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Ajouter un avenant
            </h1>
          </div>
        </div>

        {/* Message de succès */}
        {showSuccess && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              L'avenant a été créé avec succès. Redirection en cours...
            </AlertDescription>
          </Alert>
        )}

        {/* Détails du contrat de base */}
        {loading ? (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : contratBase ? (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Contrat de référence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Nom du contrat
                  </p>
                  <p className="text-gray-800">{contratBase.nom_contrat}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Partenaire
                  </p>
                  <p className="text-gray-800">{contratBase.nomPartenaire}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Durée actuelle
                  </p>
                  <p className="text-gray-800">{contratBase.duree_Contrat}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Période</p>
                  <p className="text-gray-800">
                    {format(new Date(contratBase.date_debut), "dd/MM/yyyy", {
                      locale: fr,
                    })}{" "}
                    -{" "}
                    {format(new Date(contratBase.date_fin), "dd/MM/yyyy", {
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <FileText size={16} className="text-gray-400 mr-2" />
                <p className="text-sm text-gray-500">{contratBase.fichier}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Impossible de trouver le contrat de référence.
            </AlertDescription>
          </Alert>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Informations de base */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Informations de l'avenant
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="titre_avenant">
                        Titre de l'avenant{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="titre_avenant"
                        name="titre_avenant"
                        placeholder="Entrez le titre de l'avenant"
                        value={formData.titre_avenant}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Décrivez le contenu de l'avenant..."
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="motif">
                        Motif de l'avenant{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData({ ...formData, motif: value })
                        }
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un motif" />
                        </SelectTrigger>
                        <SelectContent>
                          {motifsAvenant.map((motif) => (
                            <SelectItem key={motif} value={motif}>
                              {motif}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_effet">
                        Date d'effet <span className="text-red-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date_effet ? (
                              format(formData.date_effet, "dd MMMM yyyy", {
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
                            selected={formData.date_effet}
                            onSelect={(date) => {
                              if (date) {
                                setFormData({ ...formData, date_effet: date });
                                if (
                                  formData.modifie_duree &&
                                  formData.nouvelle_duree
                                ) {
                                  updateEndDate(formData.nouvelle_duree);
                                }
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Modification de durée */}
                <div className="space-y-4">
                  <div className="border-b pb-2 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-700">
                      Modification de durée
                    </h2>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="modifie_duree"
                        checked={formData.modifie_duree}
                        onCheckedChange={handleDureeToggle}
                      />
                      <Label htmlFor="modifie_duree" className="cursor-pointer">
                        {formData.modifie_duree ? (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            Activé
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                            Désactivé
                          </Badge>
                        )}
                      </Label>
                    </div>
                  </div>

                  {formData.modifie_duree && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="nouvelle_duree">
                          Nouvelle durée <span className="text-red-500">*</span>
                        </Label>
                        <Input
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            nouvelle_duree: e.target.value,
                          });
                          if (formData.date_effet) {
                            updateEndDate(e.target.value);
                          }
                        }}
                        type="number"
                        required
                      ></Input>
                        <p className="text-xs text-gray-500 italic">
                          la durée du contract doit s'exprimer en mois
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nouvelle_date_fin">
                          Nouvelle date de fin
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                              disabled
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.nouvelle_date_fin ? (
                                format(
                                  formData.nouvelle_date_fin,
                                  "dd MMMM yyyy",
                                  { locale: fr }
                                )
                              ) : (
                                <span>Calculée automatiquement</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.nouvelle_date_fin}
                              onSelect={(date) =>
                                date &&
                                setFormData({
                                  ...formData,
                                  nouvelle_date_fin: date,
                                })
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <p className="text-xs text-gray-500 italic">
                          La nouvelle date de fin est calculée à partir de la
                          date d'effet et de la nouvelle durée
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Document */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Document de l'avenant
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="documents">
                        Document de l'avenant (PDF){" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="documents"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="w-full"
                          onChange={handleFileChange}
                          required
                        />
                        <Button type="button" variant="outline" size="icon">
                          <Upload size={16} />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Formats acceptés: PDF, DOC, DOCX (max. 10 MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="mt-6 flex space-x-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(`/administration/contrats/details/${idContrat}`)
              }
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              <Save size={16} className="mr-2" />
              {isSubmitting ? "Enregistrement..." : "Enregistrer l'avenant"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjoutAvenant;
