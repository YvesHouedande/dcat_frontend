import React, { useState, useEffect } from "react";
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
import { Calendar as CalendarIcon, Save, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
// Assurez-vous que l'importation inclut le nouveau type TacheWithAssignedEmployes
import { Employe, Projet, TacheWithAssignedEmployes, CreateTachePayload } from "../../types/types";
import { toast } from 'sonner';


interface TacheFormProps {
  // initialData peut maintenant inclure les employés assignés pour l'édition
  initialData?: TacheWithAssignedEmployes; 
  // onSave reçoit le payload de création/mise à jour et les IDs des employés séparément
  onSave: (tachePayload: CreateTachePayload, employesIds: number[]) => Promise<void>;
  onCancel: () => void;
  projetsDisponibles: Projet[];
  employesDisponibles: Employe[];
  isSubmitting?: boolean;
}

const TacheForm: React.FC<TacheFormProps> = ({
  initialData,
  onSave,
  onCancel,
  projetsDisponibles,
  employesDisponibles,
  isSubmitting = false,
}) => {
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  const dateToString = (date: string | Date | null): string => {
    if (!date) return "";
    if (typeof date === "string") return date;
    return format(date, "yyyy-MM-dd");
  };

  // Initialisation de formData avec le type CreateTachePayload
  const [formData, setFormData] = useState<CreateTachePayload>(initialData ? {
    nom_tache: initialData.nom_tache,
    desc_tache: initialData.desc_tache,
    statut: initialData.statut,
    date_debut: dateToString(initialData.date_debut),
    date_fin: dateToString(initialData.date_fin),
    priorite: initialData.priorite,
    id_projet: initialData.id_projet,
  } : {
    nom_tache: "",
    desc_tache: "",
    statut: "à faire",
    date_debut: "",
    date_fin: "",
    priorite: "",
    id_projet: 0, // Ou une valeur par défaut appropriée
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom_tache: initialData.nom_tache,
        desc_tache: initialData.desc_tache,
        statut: initialData.statut,
        date_debut: dateToString(initialData.date_debut),
        date_fin: dateToString(initialData.date_fin),
        priorite: initialData.priorite,
        id_projet: initialData.id_projet,
      });

      // Maintenant, initialData.id_assigne_a est garanti d'exister si TacheWithAssignedEmployes est utilisé
      setSelectedEmployees(initialData.id_assigne_a?.map(emp => emp.id_employes) || []);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: keyof CreateTachePayload, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberSelectChange = (name: keyof CreateTachePayload, value: string) => {
    setFormData({
      ...formData,
      [name]: value === "none" ? 0 : Number(value), // Assurez-vous que 0 est une valeur valide pour "aucun projet" si c'est l'intention
    });
  };

  const handleDateChange = (name: "date_debut" | "date_fin", date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [name]: date ? format(date, "yyyy-MM-dd") : "",
    }));
  };

  const handleAddEmployee = (employeId: string) => {
    const id = Number(employeId);
    if (id && !selectedEmployees.includes(id)) {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const handleRemoveEmployee = (employeId: number) => {
    setSelectedEmployees(selectedEmployees.filter(id => id !== employeId));
  };

  const getEmployeeName = (employeId: number): string => {
    if (!Array.isArray(employesDisponibles)) {
      return `Employé ${employeId}`;
    }
    const employe = employesDisponibles.find(emp => emp.id_employes === employeId);
    return employe ? `${employe.prenom_employes} ${employe.nom_employes}` : `Employé ${employeId}`;
  };

  const getAvailableEmployees = () => {
    if (!Array.isArray(employesDisponibles)) {
      return [];
    }
    return employesDisponibles.filter(emp =>
      !selectedEmployees.includes(emp.id_employes) &&
      emp.nom_employes?.trim() && // Vérifie que nom_employes n'est pas vide ou seulement des espaces
      emp.prenom_employes?.trim() // Vérifie que prenom_employes n'est pas vide ou seulement des espaces
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations (ajustées pour être non-bloquantes si possible, ou messages plus précis)
    if (!formData.nom_tache.trim()) {
      toast.error("Nom de tâche requis.");
      return;
    }
    if (!formData.date_debut) {
      toast.error("Date de début requise.");
      return;
    }
    if (!formData.date_fin) {
      toast.error("Date de fin requise.");
      return;
    }
    if (formData.id_projet === 0) {
      toast.error("Projet requis. Veuillez sélectionner un projet associé.");
      return;
    }
    if (selectedEmployees.length === 0) {
      toast.error("Assignation requise. Veuillez sélectionner au moins un employé.");
      return;
    }

    try {
      await onSave(formData, selectedEmployees);
    } catch (error) {
      toast.error(`Erreur lors de l'enregistrement de la tâche : ${error instanceof Error ? error.message : "Une erreur inconnue est survenue"}`);
    }
  };

  const getDateForDisplay = (dateValue: string | Date | null): Date | undefined => {
    if (!dateValue) return undefined;
    try {
      if (typeof dateValue === 'string') {
        if (dateValue.trim() === '') return undefined;
        const parsed = parseISO(dateValue);
        return !isNaN(parsed.getTime()) ? parsed : undefined;
      } else {
        return !isNaN(dateValue.getTime()) ? dateValue : undefined;
      }
    } catch {
      return undefined;
    }
  };

  const parsedDateDebut = getDateForDisplay(formData.date_debut);
  const parsedDateFin = getDateForDisplay(formData.date_fin);

  const handleCancel = () => {
    toast.info("Opération annulée", {
      description: "Aucune modification n'a été enregistrée",
      action: {
        label: 'Continuer',
        onClick: () => onCancel()
      },
      cancel: {
        label: 'Rester',
        onClick: () => {}
      }
    });
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {initialData ? "Modifier la tâche" : "Créer une nouvelle tâche"}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Informations de la tâche
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
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desc_tache">Description</Label>
                    <Textarea
                      id="desc_tache"
                      name="desc_tache"
                      placeholder="Description de la tâche..."
                      rows={4}
                      value={formData.desc_tache}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="statut">Statut</Label>
                      <Select
                        onValueChange={(value) => handleSelectChange("statut", value)}
                        value={formData.statut}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un statut" />
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
                      <Label htmlFor="priorite">Priorité</Label>
                      <Select
                        onValueChange={(value) => handleSelectChange("priorite", value)}
                        value={formData.priorite}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une priorité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Basse">Basse</SelectItem>
                          <SelectItem value="Moyenne">Moyenne</SelectItem>
                          <SelectItem value="Haute">Haute</SelectItem>
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
                            {parsedDateDebut ? (
                              format(parsedDateDebut, "dd MMMM yyyy", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={parsedDateDebut}
                            onSelect={(date) => handleDateChange("date_debut", date)}
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
                            {parsedDateFin ? (
                              format(parsedDateFin, "dd MMMM yyyy", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={parsedDateFin}
                            onSelect={(date) => handleDateChange("date_fin", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="id_projet">
                      Projet associé <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) => handleNumberSelectChange("id_projet", value)}
                      value={formData.id_projet === 0 ? "none" : String(formData.id_projet)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un projet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sélectionnez un projet</SelectItem>
                        {(projetsDisponibles || []).map((projet) => (
                          <SelectItem key={projet.id_projet} value={String(projet.id_projet)}>
                            {projet.nom_projet}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-700 border-b pb-2">
                      Assignation des employés <span className="text-red-500">*</span>
                    </h3>

                    {selectedEmployees.length > 0 && (
                      <div className="space-y-2">
                        <Label>Employés assignés :</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedEmployees.map((employeId) => (
                            <Badge
                              key={employeId}
                              variant="secondary"
                              className="flex items-center gap-2"
                            >
                              {getEmployeeName(employeId)}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-red-100"
                                onClick={() => handleRemoveEmployee(employeId)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {getAvailableEmployees().length > 0 && (
                      <div className="space-y-2">
                        <Label>Ajouter un employé :</Label>
                        <div className="flex gap-2">
                          <Select onValueChange={handleAddEmployee}>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Sélectionnez un employé" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableEmployees().map((employe) => (
                                <SelectItem
                                  key={employe.id_employes}
                                  value={String(employe.id_employes)}
                                >
                                  {employe.prenom_employes} {employe.nom_employes}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {selectedEmployees.length === 0 && (
                      <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded">
                        Aucun employé assigné. Veuillez sélectionner au moins un employé.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TacheForm;