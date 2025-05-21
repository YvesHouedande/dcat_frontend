import React, { useEffect, useState } from "react";
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

export interface Tache {
  id_tache: number;
  nom_tache: string;
  desc_tache: string;
  statut: "à faire" | "en cours" | "en revue" | "terminé" | "bloqué";
  date_debut: string;
  date_fin: string;
  priorite: "faible" | "moyenne" | "haute";
  id_projet: number;
}

const EditerTache: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Tache>({
    id_tache: 0,
    nom_tache: "",
    desc_tache: "",
    statut: "à faire",
    date_debut: "",
    date_fin: "",
    priorite: "faible",
    id_projet: 0,
  });

  // Simulate fetching task data based on ID
  useEffect(() => {
    // In a real application, you would fetch the task data from an API
    const fetchTaskData = async () => {
      // Simulate API call
      const mockTaskData: Tache = {
        id_tache: parseInt(id || "0"),
        nom_tache: "Exemple de tâche",
        desc_tache: "Description de la tâche",
        statut: "à faire",
        date_debut: "2023-10-01",
        date_fin: "2023-10-31",
        priorite: "faible",
        id_projet: 1,
      };
      setFormData(mockTaskData);
    };

    fetchTaskData();
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);

      // Redirect after showing success message
      setTimeout(() => {
        navigate("/technique/taches");
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
                Modifier la tâche
              </h1>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                      Informations générales
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nom_tache">
                          Nom de la tâche <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="nom_tache"
                          name="nom_tache"
                          placeholder="Entrez le nom de la tâche"
                          value={formData.nom_tache}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="desc_tache">
                          Description de la tâche
                        </Label>
                        <Textarea
                          id="desc_tache"
                          name="desc_tache"
                          placeholder="Entrez la description de la tâche"
                          value={formData.desc_tache}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="statut">
                          Statut <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              statut: value as "à faire" | "en cours" | "en revue" | "terminé" | "bloqué",
                            })
                          }
                          value={formData.statut}
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="à faire">À faire</SelectItem>
                            <SelectItem value="en cours">En cours</SelectItem>
                            <SelectItem value="en revue">En revue</SelectItem>
                            <SelectItem value="terminé">Terminé</SelectItem>
                            <SelectItem value="bloqué">Bloqué</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priorite">
                          Priorité <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              priorite: value as "faible" | "moyenne" | "haute",
                            })
                          }
                          value={formData.priorite}
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner une priorité" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="faible">Faible</SelectItem>
                            <SelectItem value="moyenne">Moyenne</SelectItem>
                            <SelectItem value="haute">Haute</SelectItem>
                          </SelectContent>
                        </Select>
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
                              onSelect={(date) =>
                                date &&
                                setFormData({
                                  ...formData,
                                  date_debut: format(date, "yyyy-MM-dd"),
                                })
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date_fin">
                          Date de fin <span className="text-red-500">*</span>
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.date_fin ? (
                                format(new Date(formData.date_fin), "dd MMMM yyyy", {
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
                onClick={() => navigate("/technique/taches")}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                disabled={isSubmitting}
              >
                <Save size={16} className="mr-2" />
                {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditerTache;
