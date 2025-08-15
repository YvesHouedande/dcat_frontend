import React, { useState, useEffect } from "react";
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
import { Save, X } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Assurez-vous que l'importation inclut le nouveau type TacheWithAssignedEmployes
import { Employe,TacheWithAssignedEmployes, CreateTachePayload, Operation } from "../../types/types";
import { toast } from 'sonner';


interface TacheFormProps {
  // initialData peut maintenant inclure les employés assignés pour l'édition
  initialData?: TacheWithAssignedEmployes; 
  // onSave reçoit le payload de création/mise à jour et les IDs des employés séparément
  onSave: (tachePayload: CreateTachePayload, employesIds: number[]) => Promise<void>;
  onCancel: () => void;
  employesDisponibles: Employe[];
  operationsDisponibles: Operation[];
  isSubmitting?: boolean;
  idOperation?: number; // <-- nouvelle prop optionnelle
  operationDates?: { date_debut: string; date_fin: string };
  onOperationChange?: (id: number) => void;
}

const TacheForm: React.FC<TacheFormProps> = ({
  initialData,
  onSave,
  onCancel,
  employesDisponibles,
  operationsDisponibles,
  isSubmitting = false,
  idOperation,
  operationDates,
  onOperationChange,
}) => {
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [dateError, setDateError] = useState<string | null>(null);

  const dateToString = (date: string | Date | null): string => {
    if (!date) return "";
    if (typeof date === "string") return date;
    return format(date, "yyyy-MM-dd");
  };

  // Liste des statuts autorisés pour CreateTachePayload
  const STATUTS = ["planifié", "en cours", "terminé", "annulé", "bloqué"] as const;
  type StatutType = typeof STATUTS[number];
  function toValidStatut(val: unknown): StatutType {
    return STATUTS.includes(val as StatutType) ? (val as StatutType) : "planifié";
  }

  // Initialisation de formData avec le type CreateTachePayload
  const [formData, setFormData] = useState<CreateTachePayload>(initialData ? {
    nom_tache: initialData.nom_tache,
    date_debut: dateToString(initialData.date_debut),
    date_fin: dateToString(initialData.date_fin),
    id_operation: idOperation ?? initialData.id_operation,
    desc_tache: initialData.desc_tache || "",
    statut: toValidStatut(initialData.statut),
    priorite: initialData.priorite || "moyenne",
  } : {
    nom_tache: "",
    date_debut: "",
    date_fin: "",
    id_operation: idOperation ?? 0,
    desc_tache: "",
    statut: "planifié",
    priorite: "moyenne",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom_tache: initialData.nom_tache,
        date_debut: dateToString(initialData.date_debut),
        date_fin: dateToString(initialData.date_fin),
        id_operation: idOperation ?? initialData.id_operation,
        desc_tache: initialData.desc_tache || "",
        statut: toValidStatut(initialData.statut),
        priorite: initialData.priorite || "moyenne",
      });
      setSelectedEmployees(initialData.id_assigne_a?.map(emp => emp.id_employes) || []);
    } else if (idOperation) {
      setFormData((prev) => ({ ...prev, id_operation: idOperation }));
    }
  }, [initialData, idOperation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value as string,
    });
    // Validation immédiate des dates si operationDates est fourni
    if (operationDates && (name === 'date_debut' || name === 'date_fin')) {
      const opStart = new Date(operationDates.date_debut);
      const opEnd = new Date(operationDates.date_fin);
      const tacheStart = name === 'date_debut' ? new Date(value) : new Date(formData.date_debut);
      const tacheEnd = name === 'date_fin' ? new Date(value) : new Date(formData.date_fin);
      if (tacheStart < opStart || tacheEnd > opEnd) {
        setDateError(`Les dates de la tâche doivent être comprises entre ${operationDates.date_debut} et ${operationDates.date_fin}.`);
      } else {
        setDateError(null);
      }
    }
  };


  const handleNumberSelectChange = (name: keyof CreateTachePayload, value: string) => {
    setFormData({
      ...formData,
      [name]: name === "id_operation" ? (value === "none" ? 0 : Number(value)) : value,
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
    if (formData.id_operation === 0) {
      toast.error("Opération requise. Veuillez sélectionner une opération associée.");
      return;
    }
    if (selectedEmployees.length === 0) {
      toast.error("Assignation requise. Veuillez sélectionner au moins un employé.");
      return;
    }

    if (operationDates) {
      const opStart = new Date(operationDates.date_debut);
      const opEnd = new Date(operationDates.date_fin);
      const tacheStart = new Date(formData.date_debut);
      const tacheEnd = new Date(formData.date_fin);
      if (tacheStart < opStart || tacheEnd > opEnd) {
        setDateError(`Les dates de la tâche doivent être comprises entre ${operationDates.date_debut} et ${operationDates.date_fin}.`);
        toast.error("Les dates de la tâche doivent être comprises dans la plage de l'opération.");
        return;
      } else {
        setDateError(null);
      }
    }

    try {
      await onSave(formData, selectedEmployees);
    } catch (error) {
      toast.error(`Erreur lors de l'enregistrement de la tâche : ${error instanceof Error ? error.message : "Une erreur inconnue est survenue"}`);
    }
  };


  // Helpers pour min/max date
  const minDate = operationDates?.date_debut ? new Date(operationDates.date_debut) : undefined;
  const maxDate = operationDates?.date_fin ? new Date(operationDates.date_fin) : undefined;

  const handleCancel = () => {
    onCancel();
  };

  // Lors du changement d'opération dans le select, notifier le parent
  const handleOperationChange = (value: string) => {
    const id = Number(value);
    setFormData(prev => ({ ...prev, id_operation: id }));
    if (onOperationChange) {
      onOperationChange(id);
    }
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
                    <div className="space-y-2">
                      <Label htmlFor="desc_tache">Description</Label>
                      <textarea
                        id="desc_tache"
                        name="desc_tache"
                        placeholder="Entrez la description de la tâche"
                        value={formData.desc_tache}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2 min-h-[60px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date_debut">
                        Date de début <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={formData.date_debut}
                          onChange={(e) => handleDateChange("date_debut", e.target.value ? new Date(e.target.value) : undefined)}
                          className={`flex-1 ${dateError ? 'border-red-500 focus:border-red-500' : ''}`}
                          min={minDate?.toISOString().split('T')[0]}
                          max={maxDate?.toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_fin">
                        Date de fin <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={formData.date_fin}
                          onChange={(e) => handleDateChange("date_fin", e.target.value ? new Date(e.target.value) : undefined)}
                          className={`flex-1 ${dateError ? 'border-red-500 focus:border-red-500' : ''}`}
                          min={minDate?.toISOString().split('T')[0]}
                          max={maxDate?.toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sélecteur d'opération ou champ masqué si imposé */}
                  {idOperation ? (
                    <input type="hidden" name="id_operation" value={idOperation} />
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="id_operation">
                        Opération associée <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={handleOperationChange}
                        value={String(formData.id_operation)}
                        disabled={!!idOperation} // masquer si idOperation fourni (cas opération pré-remplie)
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner une opération" />
                        </SelectTrigger>
                        <SelectContent>
                          {operationsDisponibles.map((op) => (
                            <SelectItem key={op.id_operation} value={String(op.id_operation)}>
                              {op.nom_operation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="statut">Statut</Label>
                      <Select
                        onValueChange={(value) => handleNumberSelectChange("statut", value)}
                        value={formData.statut || "planifié"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUTS.map((statut) => (
                            <SelectItem key={statut} value={statut}>{statut.charAt(0).toUpperCase() + statut.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priorite">Priorité</Label>
                      <Select
                        onValueChange={(value) => handleNumberSelectChange("priorite", value)}
                        value={formData.priorite || "moyenne"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une priorité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basse">Basse</SelectItem>
                          <SelectItem value="moyenne">Moyenne</SelectItem>
                          <SelectItem value="haute">Haute</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
        {dateError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="text-sm text-red-600 font-medium">Erreur de validation des dates :</div>
            <div className="text-sm text-red-500 mt-1">{dateError}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TacheForm;