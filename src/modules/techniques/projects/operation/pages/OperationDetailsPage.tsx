import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOperationById, getTachesByOperation } from "../api/operation";
import { Operation, Tache, Employe, CreateTachePayload } from "../../types/types";
import OperationTasksTable from "../components/OperationTasksTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import TacheForm from "../../tasks/components/TacheForm";
import { useEmployesApi } from "../../projet/api/employes";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createTache, assignEmployeToTache } from "../../tasks/api/taches";

interface OperationDetailsPageProps {
  embedded?: boolean;
}

const OperationDetailsPage: React.FC<OperationDetailsPageProps> = ({ embedded = false }) => {
  const { id, operationId } = useParams<{ id?: string; operationId?: string }>();
  const navigate = useNavigate();
  const [operation, setOperation] = useState<Operation | null>(null);
  const [taches, setTaches] = useState<Tache[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getEmployes } = useEmployesApi();
  useEffect(() => {
    const opId = operationId || id;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      if (!opId) {
        setError("ID de l'opération manquant.");
        setLoading(false);
        return;
      }
      const opIdNum = Number(opId);
      if (isNaN(opIdNum)) {
        setError("ID d'opération invalide.");
        setLoading(false);
        return;
      }
      try {
        const [operationData, tachesData] = await Promise.all([
          getOperationById(opIdNum),
          getTachesByOperation(opIdNum),
        ]);
        setOperation(operationData);
        setTaches(Array.isArray(tachesData.data) ? tachesData.data : []);
      } catch {
        setError("Impossible de charger les détails de l'opération.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
    getEmployes({ limit: 100, page: 1 }).then(setEmployes).catch(() => setEmployes([]));
  }, [id, operationId, getEmployes]);

  // Handler pour création de tâche
  const handleCreateTache = async (formData: CreateTachePayload, employesIds: number[]) => {
    setIsSubmitting(true);
    try {
      const nouvelleTache = await createTache(formData);
      const validEmployeIds = employesIds.filter((id: number) => typeof id === 'number' && !isNaN(id));
      await Promise.all(
        validEmployeIds.map((employeId: number) => assignEmployeToTache(nouvelleTache.id_tache, employeId))
      );
      toast.success(`Tâche "${formData.nom_tache}" créée avec succès !`);
      setShowCreateTask(false);
      // Rafraîchir la liste des tâches
      const opId = operationId || id;
      if (opId) {
        const tachesData = await getTachesByOperation(Number(opId));
        setTaches(Array.isArray(tachesData.data) ? tachesData.data : []);
      }
    } catch {
      toast.error("Erreur lors de la création de la tâche");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    if (operation) {
      navigate(`/gestion-des-projets/projets/operations/${operation.id_operation}/editer`, { state: { fromDetails: true } });
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement des détails de l'opération...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!operation) {
    return <div className="p-8 text-center text-red-500">Opération introuvable.</div>;
  }

  const detailContent = (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4 flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <span className="font-semibold text-lg">Détail de l'opération</span>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{operation.nom_operation}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div><span className="font-medium">Description :</span> {operation.desc_operation || "-"}</div>
              <div><span className="font-medium">Statut :</span> {operation.statut}</div>
              <div><span className="font-medium">Priorité :</span> {operation.priorite}</div>
            </div>
            <div>
              <div><span className="font-medium">Date début :</span> {operation.date_debut}</div>
              <div><span className="font-medium">Date fin :</span> {operation.date_fin}</div>
              <div><span className="font-medium">Projet :</span> {operation.id_projet}</div>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={handleEdit} className="ml-2">
              <Edit className="w-4 h-4 mr-1" /> Modifier
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tâches associées à cette opération</CardTitle>
          <Sheet open={showCreateTask} onOpenChange={setShowCreateTask}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Nouvelle tâche
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Créer une nouvelle tâche</SheetTitle>
              </SheetHeader>
              <TacheForm
                onSave={handleCreateTache}
                onCancel={() => setShowCreateTask(false)}
                employesDisponibles={employes}
                operationsDisponibles={[operation]}
                idOperation={operation.id_operation}
                isSubmitting={isSubmitting}
                operationDates={{ date_debut: operation.date_debut, date_fin: operation.date_fin }}
              />
              <SheetFooter />
            </SheetContent>
          </Sheet>
        </CardHeader>
        <CardContent>
          <OperationTasksTable
            taches={taches}
            onEdit={(tache) => navigate(`/gestion-des-projets/projets/taches/${tache.id_tache}/editer`)}
            onDelete={undefined} // À brancher si besoin
          />
        </CardContent>
      </Card>
    </div>
  );

  return embedded ? detailContent : <Layout>{detailContent}</Layout>;
};

export default OperationDetailsPage;
