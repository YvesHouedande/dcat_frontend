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
import { Calendar as CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
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

// Interface for Projet

const EditerProjet: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample data for employees and families
  const employees = [
    { id: 1, nom: "Jean Dupont" },
    { id: 2, nom: "Marie Martin" },
    // Add more employees as needed
  ];

  const families = [
    { id: 1, nom: "Famille A" },
    { id: 2, nom: "Famille B" },
    // Add more families as needed
  ];

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

  // Fetch project data based on ID
  useEffect(() => {
    // Simulate fetching project data
    const fetchProjectData = async () => {
      // Replace with actual API call
      const mockProjectData: Projet = {
        id_projet: parseInt(id || "0"),
        nom_projet: "Projet Exemple",
        type_projet: "Type Exemple",
        devis_estimatif: 10000,
        date_debut: "2023-10-01",
        date_fin: "2024-04-01",
        duree_prevu_projet: "6",
        description_projet: "Description du projet exemple",
        etat: "en cours",
        lieu: "Lieu Exemple",
        id_employe: 1,
        site: "Site Exemple",
        id_famille: 1,
      };
      setFormData(mockProjectData);
    };

    fetchProjectData();
  }, [id]);

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

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);

      // Redirect after showing success message
      setTimeout(() => {
        navigate("/technique/projets");
      }, 1500);
    }, 1000);
  };

  // Calculate end date based on start date and duration
  const updateEndDate = (duree: string, startDate: Date) => {
    if (!startDate) return;

    const durationMatch = duree.match(/(\d+)/);
    if (!durationMatch) return;

    const months = parseInt(durationMatch[1]);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);

    setFormData({
      ...formData,
      date_fin: format(endDate, "yyyy-MM-dd"),
    });
  };

  return (
    <Layout>
      <div className="bg-gray-50 p-6 min-h-screen">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Éditer le projet
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
                        <Input
                          id="type_projet"
                          name="type_projet"
                          placeholder="Entrez le type de projet"
                          value={formData.type_projet}
                          onChange={handleInputChange}
                          required
                        />
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
                          value={formData.devis_estimatif}
                          onChange={handleInputChange}
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
                              selected={new Date(formData.date_debut)}
                              onSelect={(date) => {
                                if (date) {
                                  setFormData({
                                    ...formData,
                                    date_debut: format(date, "yyyy-MM-dd"),
                                  });
                                  if (formData.duree_prevu_projet) {
                                    updateEndDate(formData.duree_prevu_projet, date);
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
                                format(new Date(formData.date_fin), "dd MMMM yyyy", {
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
                              selected={new Date(formData.date_fin)}
                              onSelect={(date) =>
                                date &&
                                setFormData({
                                  ...formData,
                                  date_fin: format(date, "yyyy-MM-dd"),
                                })
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
                          placeholder="Entrez la durée prévue du projet"
                          value={formData.duree_prevu_projet}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              duree_prevu_projet: e.target.value,
                            });
                            if (formData.date_debut) {
                              updateEndDate(
                                e.target.value,
                                new Date(formData.date_debut)
                              );
                            }
                          }}
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
                          value={formData.id_employe.toString()}
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
                          value={formData.id_famille.toString()}
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
                {isSubmitting ? "Mise à jour..." : "Mettre à jour le projet"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditerProjet;