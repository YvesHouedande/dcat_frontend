import React, { useState, useEffect } from "react";
import { Operation } from "../../types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getTachesByOperation } from "../api/operation";
import { Info } from "lucide-react";

interface OperationFormProps {
  idProjet?: number;
  projetsDisponibles?: { id_projet: number; nom_projet: string }[];
  onCreate: (payload: Omit<Operation, "id_operation">) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  operationInitiale?: Operation;
}

const defaultOperation: Omit<Operation, "id_operation"> = {
  nom_operation: "",
  desc_operation: "",
  statut: "en cours",
  date_debut: "",
  date_fin: "",
  priorite: "moyenne",
  id_projet: 0,
};

const OperationForm: React.FC<OperationFormProps> = ({ idProjet, projetsDisponibles, onCreate, loading, error, operationInitiale }) => {
  // Initialisation du projet :
  const initialProjet = projetsDisponibles && projetsDisponibles.length > 0
    ? projetsDisponibles[0].id_projet
    : (idProjet ?? 0);

  const [form, setForm] = useState<Omit<Operation, "id_operation">>(operationInitiale ? {
    nom_operation: operationInitiale.nom_operation,
    desc_operation: operationInitiale.desc_operation,
    statut: operationInitiale.statut,
    date_debut: operationInitiale.date_debut,
    date_fin: operationInitiale.date_fin,
    priorite: operationInitiale.priorite,
    id_projet: operationInitiale.id_projet,
  } : { ...defaultOperation, id_projet: initialProjet });
  const [localError, setLocalError] = useState<string | null>(null);
  const [toutesTachesTerminees, setToutesTachesTerminees] = useState(true);

  // Si la liste des projets change, on réinitialise le projet sélectionné
  // Si la liste des projets change, on réinitialise le projet sélectionné
  useEffect(() => {
    if (operationInitiale) {
      setForm({
        nom_operation: operationInitiale.nom_operation,
        desc_operation: operationInitiale.desc_operation,
        statut: operationInitiale.statut,
        date_debut: operationInitiale.date_debut,
        date_fin: operationInitiale.date_fin,
        priorite: operationInitiale.priorite,
        id_projet: operationInitiale.id_projet,
      });
    } else if (projetsDisponibles && projetsDisponibles.length > 0) {
      setForm((prev) => ({ ...prev, id_projet: projetsDisponibles[0].id_projet }));
    } else if (idProjet) {
      setForm((prev) => ({ ...prev, id_projet: idProjet }));
    }
  }, [projetsDisponibles, idProjet, operationInitiale]);

  useEffect(() => {
    if (operationInitiale) {
      getTachesByOperation(operationInitiale.id_operation)
        .then((res) => {
          const toutesTerminees = (res.data || []).length > 0 && (res.data || []).every(t => t.statut === "terminé");
          setToutesTachesTerminees(toutesTerminees);
        })
        .catch(() => {
          setToutesTachesTerminees(true);
        })
        .finally(() => {
          // setLoadingTaches(false); // This line was removed as per the edit hint
        });
    }
  }, [operationInitiale]);

  const handleChange = (field: keyof Omit<Operation, "id_operation">, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom_operation || !form.date_debut || !form.date_fin) {
      setLocalError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (!form.id_projet || form.id_projet === 0) {
      setLocalError("Veuillez sélectionner un projet.");
      return;
    }
    setLocalError(null);
    await onCreate(form);
    setForm({ ...defaultOperation, id_projet: initialProjet });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {/* Sélecteur de projet si besoin */}
      {projetsDisponibles && projetsDisponibles.length > 0 && (
        <div>
          <Label htmlFor="id_projet">Projet concerné <span className="text-red-500">*</span></Label>
          <Select
            value={String(form.id_projet)}
            onValueChange={(v) => handleChange("id_projet", Number(v))}
          >
            <SelectTrigger id="id_projet" className="w-full mt-1">
              <SelectValue placeholder="Sélectionner un projet" />
            </SelectTrigger>
            <SelectContent>
              {projetsDisponibles.map((p) => (
                <SelectItem key={p.id_projet} value={String(p.id_projet)}>
                  {p.nom_projet}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div>
        <Label htmlFor="nom_operation">Nom de l'opération <span className="text-red-500">*</span></Label>
        <Input
          id="nom_operation"
          placeholder="Nom de l'opération"
          value={form.nom_operation}
          onChange={(e) => handleChange("nom_operation", e.target.value)}
          className="w-full mt-1"
        />
      </div>
      <div>
        <Label htmlFor="desc_operation">Description</Label>
        <Input
          id="desc_operation"
          placeholder="Description de l'opération"
          value={form.desc_operation}
          onChange={(e) => handleChange("desc_operation", e.target.value)}
          className="w-full mt-1"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="statut">Statut</Label>
          <Select
            value={form.statut}
            onValueChange={(v) => handleChange("statut", v)}
          >
            <SelectTrigger id="statut" className="w-full mt-1">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planifié">Planifié</SelectItem>
              <SelectItem value="en cours">En cours</SelectItem>
              <SelectItem value="terminé" disabled={!toutesTachesTerminees}>
                Terminé
              </SelectItem>
              <SelectItem value="annulé">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="priorite">Priorité</Label>
          <Select
            value={form.priorite}
            onValueChange={(v) => handleChange("priorite", v)}
          >
            <SelectTrigger id="priorite" className="w-full mt-1">
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basse">Basse</SelectItem>
              <SelectItem value="moyenne">Moyenne</SelectItem>
              <SelectItem value="haute">Haute</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="date_debut">Date de début <span className="text-red-500">*</span></Label>
          <Input
            id="date_debut"
            type="date"
            value={form.date_debut}
            onChange={(e) => handleChange("date_debut", e.target.value)}
            className="w-full mt-1"
            disabled={!!operationInitiale}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="date_fin">Date de fin <span className="text-red-500">*</span></Label>
          <Input
            id="date_fin"
            type="date"
            value={form.date_fin}
            onChange={(e) => handleChange("date_fin", e.target.value)}
            className="w-full mt-1"
            disabled={!!operationInitiale}
          />
        </div>
      </div>
      <Button
        size="sm"
        className="bg-blue-600 text-white mt-2"
        type="submit"
        disabled={loading}
      >
        {loading ? (operationInitiale ? "Modification..." : "Création...") : (operationInitiale ? "Modifier" : "Créer")}
      </Button>
      {(localError || error) && <div className="text-xs text-red-500 mt-1">{localError || error}</div>}
      {operationInitiale && !toutesTachesTerminees && (
        <div className="mt-2 flex items-center bg-blue-50 text-blue-700 rounded px-3 py-2 text-sm">
          <Info className="h-4 w-4 text-blue-500 mr-2" />
          Certaines tâches associées à cette opération ne sont pas encore terminées.
        </div>
      )}
    </form>
  );
};

export default OperationForm; 