// src/pages/EditerTachePage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TacheForm from '../components/TacheForm';
// Importez TacheWithAssignedEmployes, CreateTachePayload, Employe, Operation
import { Employe, TacheWithAssignedEmployes, CreateTachePayload, Operation } from '../../types/types'; 
import {getTacheById, updateTache, getEmployesAssignes, assignEmployeToTache, removeEmployeFromTache} from '../api/taches';
import { getAllOperations } from '../../operation/api/operation'; 
import { useEmployesApi } from '../../projet/api/employes'; // Supposons que getEmployes est encore valide pour tous les employés
import { toast } from 'sonner';
import Layout from '@/components/Layout';

const EditerTachePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tache, setTache] = useState<TacheWithAssignedEmployes | null>(null); 
  // Remplacer 'projets' par 'operations'
  const [operations, setOperations] = useState<Operation[]>([]); 
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [employesAssignes, setEmployesAssignes] = useState<Employe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getEmployes } = useEmployesApi();
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      if (!id) {
        setError("ID de tâche manquant.");
        toast.error("ID de tâche manquant.");
        setLoading(false);
        return;
      }

      const tacheId = Number(id);
      if (isNaN(tacheId)) {
        setError("ID de tâche invalide.");
        toast.error("ID de tâche invalide.");
        setLoading(false);
        return;
      }

      try {
        // Appeler getAllOperations au lieu de fetchAllProjets
        const [tacheData, operationsResponse, employesData, employesAssignesData] = await Promise.all([
          getTacheById(tacheId), 
          getAllOperations(), // <-- Récupérer toutes les opérations
          getEmployes({limit: 100, page: 1}),
          getEmployesAssignes(tacheId) 
        ]);

        if (!tacheData) {
          setError("Tâche introuvable.");
          toast.error("Tâche introuvable.");
          setLoading(false); 
          return;
        }

        setTache({ 
          ...tacheData,
          id_assigne_a: employesAssignesData 
        });
        
        // Extraire les données des opérations de l'ApiResponse et les stocker
        setOperations(operationsResponse.data || []); 
        setEmployes(employesData);
        setEmployesAssignes(employesAssignesData); 
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue lors du chargement.";
        setError(`Échec du chargement: ${errorMessage}`);
        toast.error(`Échec du chargement: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, getEmployes]); 

  const handleSaveTache = async (formData: CreateTachePayload, selectedEmployeesIds: number[]) => {
    if (!id) {
      toast.error("ID manquant pour la mise à jour.");
      return;
    }

    const tacheId = Number(id);
    
    try {
      await updateTache(tacheId, formData);

      const currentEmployeesIds = employesAssignes.map(emp => emp.id_employes);
      const employeesToAdd = selectedEmployeesIds.filter(id => !currentEmployeesIds.includes(id));
      const employeesToRemove = currentEmployeesIds.filter(id => !selectedEmployeesIds.includes(id));

      const assignPromises = employeesToAdd.map(employeId => 
        assignEmployeToTache(tacheId, employeId)
      );
      const removePromises = employeesToRemove.map(employeId => 
        removeEmployeFromTache(tacheId, employeId)
      );

      await Promise.all([...assignPromises, ...removePromises]);

      toast.success("Tâche mise à jour avec succès !");
      navigate('/gestion-des-projets/projets/taches'); // Rediriger après succès
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue lors de la mise à jour.";
      toast.error(`Échec de la mise à jour: ${errorMessage}`);
      throw err; 
    }
  };

  if (loading) {
    return <div className="text-center p-8">Chargement en cours...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (!tache) { 
    return <div className="text-center p-8">Tâche non trouvée ou erreur de chargement.</div>;
  }

  // Trouver l'opération associée à la tâche pour limiter les dates
  const operationAssociee = operations.find(op => op.id_operation === tache?.id_operation);
  const operationDates = operationAssociee ? { date_debut: operationAssociee.date_debut, date_fin: operationAssociee.date_fin } : undefined;

  return (
    <Layout>
      <TacheForm
        initialData={tache}
        onSave={handleSaveTache}
        onCancel={() => navigate('/gestion-des-projets/projets/taches')}
        operationsDisponibles={operations} 
        employesDisponibles={employes}
        operationDates={operationDates}
        // 'projetsDisponibles' est retiré
      />
    </Layout>
  );
};

export default EditerTachePage;
