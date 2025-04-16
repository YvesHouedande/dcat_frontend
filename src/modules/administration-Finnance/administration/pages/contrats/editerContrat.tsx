import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Save,
  Upload,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
const EditerContrat: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États du formulaire
  const [formData, setFormData] = useState({
    nom_contrat: "",
    Id_partenaire: "",
    duree_Contrat: "",
    date_debut: undefined as Date | undefined,
    date_fin: undefined as Date | undefined,
    notes: "",
    fichier: null as File | null,
  });

  // Liste des partenaires (à remplacer par une vraie API)
  const partenaires = [
    { id: "P001", nom: "Systèmes IT Pro" },
    { id: "P002", nom: "TechSupport Plus" },
    { id: "P003", nom: "ConseilJuridique SA" },
    { id: "P004", nom: "FourniPro SARL" },
    { id: "P005", nom: "AgenceCom Digital" },
    { id: "P006", nom: "SoftwareSolutions" },
    { id: "P007", nom: "PartenairesAssociés" },
    { id: "P008", nom: "DistribExpress" },
  ];


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
        fichier: e.target.files[0],
      });
    }
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuler une soumission API
    setTimeout(() => {
      setIsSubmitting(false);

      // Rediriger après affichage du message de succès
      setTimeout(() => {
        navigate("/administration/contrats");
      }, 1500);
    }, 1000);
  };

  // Calculer automatiquement la date de fin en fonction de la date de début et de la durée
  const updateEndDate = (duree: string, startDate: Date) => {
    if (!startDate) return;

    const durationMatch = duree.match(/(\d+)/);
    if (!durationMatch) return;

    const months = parseInt(durationMatch[1]);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);

    setFormData({
      ...formData,
      date_fin: endDate,
    });
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Modifier les informations d'un contrat
            </h1>
          </div>
        </div>
        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Informations de base */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Informations générales
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom_contrat">
                        Nom du contrat <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nom_contrat"
                        name="nom_contrat"
                        placeholder="Entrez le nom du contrat"
                        value={formData.nom_contrat}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="partenaire">
                        Partenaire <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData({ ...formData, Id_partenaire: value })
                        }
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un partenaire" />
                        </SelectTrigger>
                        <SelectContent>
                          {partenaires.map((partenaire) => (
                            <SelectItem
                              key={partenaire.id}
                              value={partenaire.id}
                            >
                              {partenaire.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duree">
                        Durée du contrat <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            duree_Contrat: e.target.value,
                          });
                          if (formData.date_debut) {
                            updateEndDate(e.target.value, formData.date_debut);
                          }
                        }}
                        type="number"
                        required
                      ></Input>
                      <p className="text-xs text-gray-500 italic">
                        la durée du contract doit s'exprimer en mois
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date_debut">
                        Date de début <span className="text-red-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date_debut ? (
                              format(formData.date_debut, "dd MMMM yyyy", {
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
                            selected={formData.date_debut}
                            onSelect={(date) => {
                              if (date) {
                                setFormData({ ...formData, date_debut: date });
                                if (formData.duree_Contrat) {
                                  updateEndDate(formData.duree_Contrat, date);
                                }
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_fin">Date de fin</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            disabled
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date_fin ? (
                              format(formData.date_fin, "dd MMMM yyyy", {
                                locale: fr,
                              })
                            ) : (
                              <span>Calculée automatiquement</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.date_fin}
                            onSelect={(date) =>
                              date &&
                              setFormData({ ...formData, date_fin: date })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-gray-500 italic">
                        La date de fin est calculée à partir de la date de début
                        et de la durée
                      </p>
                    </div>
                  </div>
                </div>

                {/* Document */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Document du contrat
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fichier">
                        Fichier du contrat (PDF){" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="fichier"
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

                {/* Notes */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Informations complémentaires
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes ou commentaires</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Ajoutez des notes ou commentaires sur ce contrat..."
                        rows={4}
                        value={formData.notes}
                        onChange={handleInputChange}
                      />
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
              className=" cursor-pointer"
              onClick={() => navigate(-1)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              disabled={isSubmitting}
            >
              <Save size={16} className="mr-2" />
              {isSubmitting ? "Modification en cours..." : "Modifier le contrat"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditerContrat;
