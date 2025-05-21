import React, { useState, useEffect } from "react";
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
import { Calendar as CalendarIcon, Save } from "lucide-react";
import { format, addMonths, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Layout from "@/components/Layout";
import { Projet } from "../types/types";

const NouveauProjet: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Projet>({
    id_projet: 0,
    nom_projet: "",
    type_projet: "",
    devis_estimatif: 0,
    date_debut: "",
    date_fin: "",
    duree_prevu_projet: "",
    description_projet: "",
    etat: "planifié",
    lieu: "",
    id_employe: 0,
    site: "",
    id_famille: 0,
  });

  // Sample data for employees, families, and project types
  const employees = [
    { id: 1, nom: "Jean Dupont" },
    { id: 2, nom: "Marie Martin" },
    // Add more employees as needed
  ];

  const families = [
    { id: 1, nom: "Audiovisuel" },
    { id: 2, nom: "Informatique" },
    { id: 3, nom: "Domotique et TIC" },
    { id: 4, nom: "Sécurité électronique" },
    // Add more families as needed
  ];

  const projectTypes = [
    { id: 1, nom: "Externe" },
    { id: 2, nom: "Interne" },
    { id: 3, nom: "Mission" },
    // Add more project types as needed
  ];

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle numeric input changes
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "" ? "" : Number(value),
    });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    if (name === "id_employe" || name === "id_famille") {
      setFormData({
        ...formData,
        [name]: Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Update end date when start date or duration changes
  useEffect(() => {
    if (formData.date_debut && formData.duree_prevu_projet) {
      const durationMonths = parseInt(formData.duree_prevu_projet.toString());
      if (!isNaN(durationMonths)) {
        const startDate = parseISO(formData.date_debut);
        const endDate = addMonths(startDate, durationMonths);
        setFormData(prev => ({
          ...prev,
          date_fin: format(endDate, "yyyy-MM-dd")
        }));
      }
    }
  }, [formData.date_debut, formData.duree_prevu_projet]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Log the data being submitted
    console.log("Submitting project data:", formData);

    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);

      // Redirect after showing success message
      setTimeout(() => {
        navigate("/technique/projets");
      }, 1500);
    }, 1000);
  };

  return (
    <Layout>
      <div className="bg-gray-50 p-6 min-h-screen">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Ajouter un nouveau projet
              </h1>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* General Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                      Informations générales
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nom_projet">
                          Nom du projet <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="nom_projet"
                          name="nom_projet"
                          placeholder="Entrez le nom du projet"
                          value={formData.nom_projet}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="type_projet">
                          Type de projet <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange("type_projet", value)
                          }
                          value={formData.type_projet}
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner le type de projet" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectTypes.map((type) => (
                              <SelectItem
                                key={type.id}
                                value={type.nom}
                              >
                                {type.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="devis_estimatif">
                          Devis estimatif <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="devis_estimatif"
                          name="devis_estimatif"
                          type="number"
                          placeholder="Entrez le devis estimatif"
                          value={formData.devis_estimatif || ""}
                          onChange={handleNumberChange}
                          required
                        />
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
                                format(new Date(formData.date_debut), "dd MMMM yyyy", {
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
                              selected={formData.date_debut ? new Date(formData.date_debut) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  setFormData({
                                    ...formData,
                                    date_debut: format(date, "yyyy-MM-dd"),
                                  });
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
                                format(new Date(formData.date_fin), "dd MMMM yyyy", {
                                  locale: fr,
                                })
                              ) : (
                                <span>Calculée automatiquement</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                        </Popover>
                        <p className="text-xs text-gray-500 italic">
                          La date de fin est calculée à partir de la date de début
                          et de la durée
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duree_prevu_projet">
                          Durée prévue du projet (mois){" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="duree_prevu_projet"
                          name="duree_prevu_projet"
                          type="number"
                          min="1"
                          placeholder="Entrez la durée prévue du projet"
                          value={formData.duree_prevu_projet}
                          onChange={handleNumberChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                      Informations complémentaires
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="description_projet">Description</Label>
                        <Textarea
                          id="description_projet"
                          name="description_projet"
                          placeholder="Ajoutez une description du projet..."
                          rows={4}
                          value={formData.description_projet}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="etat">
                          État <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange("etat", value)
                          }
                          value={formData.etat}
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner l'état" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planifié">Planifié</SelectItem>
                            <SelectItem value="en cours">En cours</SelectItem>
                            <SelectItem value="terminé">Terminé</SelectItem>
                            <SelectItem value="annulé">Annulé</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lieu">Lieu</Label>
                        <Input
                          id="lieu"
                          name="lieu"
                          placeholder="Entrez le lieu du projet"
                          value={formData.lieu}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="site">Site</Label>
                        <Input
                          id="site"
                          name="site"
                          placeholder="Entrez le site du projet"
                          value={formData.site}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="id_employe">
                          Employé <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange("id_employe", value)
                          }
                          value={formData.id_employe ? formData.id_employe.toString() : ""}
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner un employé" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees.map((employee) => (
                              <SelectItem
                                key={employee.id}
                                value={employee.id.toString()}
                              >
                                {employee.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="id_famille">
                          Famille <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange("id_famille", value)
                          }
                          value={formData.id_famille ? formData.id_famille.toString() : ""}
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner une famille" />
                          </SelectTrigger>
                          <SelectContent>
                            {families.map((family) => (
                              <SelectItem
                                key={family.id}
                                value={family.id.toString()}
                              >
                                {family.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                className="cursor-pointer"
                onClick={() => navigate("/technique/projets")}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                disabled={isSubmitting}
              >
                <Save size={16} className="mr-2" />
                {isSubmitting ? "Enregistrement..." : "Enregistrer le projet"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NouveauProjet;