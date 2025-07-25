import React, { useEffect, useState } from "react";
import { Operation, Tache, CreateTachePayload, UpdateTachePayload } from "../../types/types";
import { getOperationsByProjet, getTachesByOperation, createOperation, deleteOperation } from "../api/operation";
import { createTache } from "../../tasks/api/taches";
import { updateTache, deleteTacheSafely } from "../../tasks/api/taches";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OperationForm from "./OperationForm";
import OperationPagination from "./OperationPagination";
import { useNavigate } from "react-router-dom";

interface OperationListProps {
  idProjet: number;
}

const defaultTache: Omit<CreateTachePayload, "id_operation" | "id_projet"> = {
  nom_tache: "",
  desc_tache: "",
  statut: "planifié",
  date_debut: "",
  date_fin: "",
  priorite: "moyenne",
};

type FormState = Omit<CreateTachePayload, "id_operation" | "id_projet">;

type EditState = {
  [tacheId: number]: boolean;
};

type EditFormState = {
  [tacheId: number]: UpdateTachePayload;
};

// Pour la gestion des opérations



const OperationList: React.FC<OperationListProps> = ({ idProjet }) => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tachesByOperation, setTachesByOperation] = useState<Record<number, Tache[]>>({});
  const [formState, setFormState] = useState<Record<number, FormState>>({});
  const [submitting, setSubmitting] = useState<Record<number, boolean>>({});
  const [formError, setFormError] = useState<Record<number, string | null>>({});
  const [editState, setEditState] = useState<EditState>({});
  const [editFormState, setEditFormState] = useState<EditFormState>({});
  const [editSubmitting, setEditSubmitting] = useState<Record<number, boolean>>({});
  const [editError, setEditError] = useState<Record<number, string | null>>({});
  // Pour opérations

  const [opSubmitting, setOpSubmitting] = useState(false);
  const [opError, setOpError] = useState<string | null>(null);
  const [opEditSubmitting, setOpEditSubmitting] = useState<Record<number, boolean>>({});
  const [opEditError, setOpEditError] = useState<Record<number, string | null>>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [serverPagination, setServerPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);

  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    getOperationsByProjet(idProjet, currentPage, itemsPerPage)
      .then((res) => {
        setOperations(res.data || []);
        if (res.pagination) setServerPagination(res.pagination);
      })
      .catch(() => {
        setError("Erreur lors du chargement des opérations");
        setOperations([]);
      })
      .finally(() => setLoading(false));
  }, [idProjet, currentPage]);

  useEffect(() => {
    // Charger les tâches pour chaque opération
    const fetchTaches = async () => {
      const tachesMap: Record<number, Tache[]> = {};
      await Promise.all(
        operations.map(async (op) => {
          try {
            const res = await getTachesByOperation(op.id_operation);
            tachesMap[op.id_operation] = res.data || [];
          } catch {
            tachesMap[op.id_operation] = [];
          }
        })
      );
      setTachesByOperation(tachesMap);
    };
    if (operations.length > 0) {
      fetchTaches();
    }
  }, [operations]);



  const handleCreateOperation = async (payload: Omit<Operation, "id_operation">) => {
    setOpSubmitting(true);
    setOpError(null);
    try {
      await createOperation(payload);
      const res = await getOperationsByProjet(idProjet);
      setOperations(res.data || []);
    } catch {
      setOpError("Erreur lors de la création de l'opération.");
    } finally {
      setOpSubmitting(false);
    }
  };

  // Remplacer handleOpEditClick pour naviguer vers la page d'édition
  const handleOpEditClick = (op: Operation) => {
    navigate(`/technique/projets/operations/${op.id_operation}/editer`);
  };

  const handleDeleteOperation = async (op: Operation) => {
    if (!window.confirm("Supprimer cette opération ?")) return;
    setOpEditSubmitting((prev) => ({ ...prev, [op.id_operation]: true }));
    try {
      await deleteOperation(op.id_operation);
      const res = await getOperationsByProjet(idProjet);
      setOperations(res.data || []);
    } catch {
      setOpEditError((prev) => ({ ...prev, [op.id_operation]: "Erreur lors de la suppression de l'opération." }));
    } finally {
      setOpEditSubmitting((prev) => ({ ...prev, [op.id_operation]: false }));
    }
  };

  // --- Gestion des tâches (inchangé) ---
  const handleInputChange = (opId: number, field: keyof FormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [opId]: {
        ...prev[opId],
        [field]: value,
      },
    }));
  };

  const handleCreateTache = async (opId: number) => {
    const tacheData = formState[opId];
    if (!tacheData || !tacheData.nom_tache || !tacheData.date_debut || !tacheData.date_fin) {
      setFormError((prev) => ({ ...prev, [opId]: "Veuillez remplir tous les champs obligatoires." }));
      return;
    }
    setSubmitting((prev) => ({ ...prev, [opId]: true }));
    setFormError((prev) => ({ ...prev, [opId]: null }));
    try {
      await createTache({ ...tacheData, id_operation: opId });
      const res = await getTachesByOperation(opId);
      setTachesByOperation((prev) => ({ ...prev, [opId]: res.data || [] }));
      setFormState((prev) => ({ ...prev, [opId]: { ...defaultTache } }));
    } catch {
      setFormError((prev) => ({ ...prev, [opId]: "Erreur lors de la création de la tâche." }));
    } finally {
      setSubmitting((prev) => ({ ...prev, [opId]: false }));
    }
  };

  // Edition de tâche
  const handleEditClick = (tache: Tache) => {
    setEditState((prev) => ({ ...prev, [tache.id_tache]: true }));
    setEditFormState((prev) => ({
      ...prev,
      [tache.id_tache]: {
        nom_tache: tache.nom_tache,
        date_debut: tache.date_debut,
        date_fin: tache.date_fin,
      },
    }));
  };

  const handleEditInputChange = (tacheId: number, field: keyof UpdateTachePayload, value: string) => {
    setEditFormState((prev) => ({
      ...prev,
      [tacheId]: {
        ...prev[tacheId],
        [field]: value,
      },
    }));
  };

  const handleEditSave = async (tache: Tache, opId: number) => {
    setEditSubmitting((prev) => ({ ...prev, [tache.id_tache]: true }));
    setEditError((prev) => ({ ...prev, [tache.id_tache]: null }));
    try {
      await updateTache(tache.id_tache, editFormState[tache.id_tache]);
      const res = await getTachesByOperation(opId);
      setTachesByOperation((prev) => ({ ...prev, [opId]: res.data || [] }));
      setEditState((prev) => ({ ...prev, [tache.id_tache]: false }));
    } catch {
      setEditError((prev) => ({ ...prev, [tache.id_tache]: "Erreur lors de la modification de la tâche." }));
    } finally {
      setEditSubmitting((prev) => ({ ...prev, [tache.id_tache]: false }));
    }
  };

  const handleEditCancel = (tacheId: number) => {
    setEditState((prev) => ({ ...prev, [tacheId]: false }));
    setEditError((prev) => ({ ...prev, [tacheId]: null }));
  };

  // Suppression de tâche
  const handleDeleteTache = async (tache: Tache, opId: number) => {
    if (!window.confirm("Supprimer cette tâche ?")) return;
    setEditSubmitting((prev) => ({ ...prev, [tache.id_tache]: true }));
    try {
      await deleteTacheSafely(tache.id_tache);
      const res = await getTachesByOperation(opId);
      setTachesByOperation((prev) => ({ ...prev, [opId]: res.data || [] }));
    } catch {
      setEditError((prev) => ({ ...prev, [tache.id_tache]: "Erreur lors de la suppression de la tâche." }));
    } finally {
      setEditSubmitting((prev) => ({ ...prev, [tache.id_tache]: false }));
    }
  };

  if (loading) {
    return <div>Chargement des opérations...</div>;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Utilisation du composant OperationForm pour la création */}
      <Card className="mb-6 border-0 shadow">
        <CardHeader>
          <CardTitle>Nouvelle opération</CardTitle>
        </CardHeader>
        <CardContent>
          <OperationForm
            idProjet={idProjet}
            onCreate={handleCreateOperation}
            loading={opSubmitting}
            error={opError}
          />
        </CardContent>
      </Card>
      {/* Liste des opérations ou message vide */}
      {operations.length === 0 ? (
        <Card className="shadow border-0">
          <CardContent>
            <div className="text-center text-gray-400 py-8">
              Aucune opération pour ce projet.
            </div>
          </CardContent>
        </Card>
      ) : (
        operations.map((op) => (
          <Card key={op.id_operation} className="shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {/* Suppression du rendu inline de OperationEditForm */}
                {op.nom_operation}
                <span className="text-xs text-gray-500">[{op.statut}]</span>
                <Button size="sm" variant="outline" onClick={() => handleOpEditClick(op)}>
                  Éditer
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteOperation(op)} disabled={opEditSubmitting[op.id_operation]}>
                  Supprimer
                </Button>
                {opEditError[op.id_operation] && <span className="text-xs text-red-500 ml-2">{opEditError[op.id_operation]}</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-700 mb-2">{op.desc_operation}</div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>Début : {op.date_debut}</span>
                <span>Fin : {op.date_fin}</span>
                <span>Priorité : {op.priorite}</span>
              </div>
              <div className="mt-4">
                <div className="font-semibold mb-1">Tâches de l'opération :</div>
                {tachesByOperation[op.id_operation] && tachesByOperation[op.id_operation].length > 0 ? (
                  <ul className="list-disc ml-6">
                    {tachesByOperation[op.id_operation].map((tache) => (
                      <li key={tache.id_tache} className="mb-1 flex items-center gap-2">
                        {editState[tache.id_tache] ? (
                          <>
                            <Input
                              type="text"
                              value={editFormState[tache.id_tache]?.nom_tache || ""}
                              onChange={(e) => handleEditInputChange(tache.id_tache, "nom_tache", e.target.value)}
                              className="w-28"
                            />
                            
                           
                            <Input
                              type="date"
                              value={editFormState[tache.id_tache]?.date_debut || ""}
                              onChange={(e) => handleEditInputChange(tache.id_tache, "date_debut", e.target.value)}
                              className="w-28"
                            />
                            <Input
                              type="date"
                              value={editFormState[tache.id_tache]?.date_fin || ""}
                              onChange={(e) => handleEditInputChange(tache.id_tache, "date_fin", e.target.value)}
                              className="w-28"
                            />
                          
                            <Button size="sm" className="bg-green-600 text-white" onClick={() => handleEditSave(tache, op.id_operation)} disabled={editSubmitting[tache.id_tache]}>
                              {editSubmitting[tache.id_tache] ? "Enregistrement..." : "Enregistrer"}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEditCancel(tache.id_tache)}>
                              Annuler
                            </Button>
                            {editError[tache.id_tache] && <span className="text-xs text-red-500 ml-2">{editError[tache.id_tache]}</span>}
                          </>
                        ) : (
                          <>
                            <span className="font-medium">{tache.nom_tache}</span>
                    
                            <span className="ml-2 text-xs">Début : {tache.date_debut}</span>
                            <span className="ml-2 text-xs">Fin : {tache.date_fin}</span>
                            <Button size="sm" variant="outline" onClick={() => handleEditClick(tache)}>
                              Éditer
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteTache(tache, op.id_operation)} disabled={editSubmitting[tache.id_tache]}>
                              Supprimer
                            </Button>
                            {editError[tache.id_tache] && <span className="text-xs text-red-500 ml-2">{editError[tache.id_tache]}</span>}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-xs text-gray-400">Aucune tâche pour cette opération.</div>
                )}
              </div>
              <div className="mt-4 border-t pt-4">
                <div className="font-semibold mb-2">Ajouter une tâche</div>
                <div className="flex flex-col md:flex-row gap-2 items-center">
                  <Input
                    placeholder="Nom de la tâche"
                    value={formState[op.id_operation]?.nom_tache || ""}
                    onChange={(e) => handleInputChange(op.id_operation, "nom_tache", e.target.value)}
                    className="w-48"
                  />
                  <Input
                    placeholder="Description"
                    value={formState[op.id_operation]?.desc_tache || ""}
                    onChange={(e) => handleInputChange(op.id_operation, "desc_tache", e.target.value)}
                    className="w-48"
                  />
                  <Select
                    value={formState[op.id_operation]?.statut || "à faire"}
                    onValueChange={(v) => handleInputChange(op.id_operation, "statut", v)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="à faire">À faire</SelectItem>
                      <SelectItem value="en cours">En cours</SelectItem>
                      <SelectItem value="en revue">En revue</SelectItem>
                      <SelectItem value="terminé">Terminé</SelectItem>
                      <SelectItem value="bloqué">Bloqué</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={formState[op.id_operation]?.date_debut || ""}
                    onChange={(e) => handleInputChange(op.id_operation, "date_debut", e.target.value)}
                    className="w-36"
                  />
                  <Input
                    type="date"
                    value={formState[op.id_operation]?.date_fin || ""}
                    onChange={(e) => handleInputChange(op.id_operation, "date_fin", e.target.value)}
                    className="w-36"
                  />
                  <Select
                    value={formState[op.id_operation]?.priorite || "moyenne"}
                    onValueChange={(v) => handleInputChange(op.id_operation, "priorite", v)}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basse">Basse</SelectItem>
                      <SelectItem value="moyenne">Moyenne</SelectItem>
                      <SelectItem value="haute">Haute</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    className="bg-blue-600 text-white"
                    onClick={() => handleCreateTache(op.id_operation)}
                    disabled={submitting[op.id_operation]}
                  >
                    {submitting[op.id_operation] ? "Ajout..." : "Ajouter"}
                  </Button>
                </div>
                {formError[op.id_operation] && (
                  <div className="text-xs text-red-500 mt-1">{formError[op.id_operation]}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
      {/* Pagination */}
      {serverPagination && (
        <OperationPagination
          currentPage={serverPagination.page}
          totalPages={serverPagination.totalPages}
          totalItems={serverPagination.total}
          itemsPerPage={serverPagination.limit}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default OperationList; 