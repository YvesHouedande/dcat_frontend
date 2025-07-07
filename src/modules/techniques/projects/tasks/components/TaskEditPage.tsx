// src/pages/EditerTachePage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TacheForm from '../components/TacheForm';
// Importez TacheWithAssignedEmployes et CreateTachePayload du fichier de types partagé
import { Projet, Employe, TacheWithAssignedEmployes, CreateTachePayload } from '../../types/types'; 
import { 
  getTacheById, 
  updateTache, 
  getEmployesAssignes,
  assignEmployeToTache,
  removeEmployeFromTache 
} from '../api/taches';
// Vérifiez si fetchAllProjets et getEmployes sont les bons noms pour vos API
import { fetchAllProjets } from '../../projet/api/projets'; 
import { getEmployes } from '../../projet/api/employes';
import { toast } from 'sonner';
import Layout from '@/components/Layout';

const EditerTachePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // L'état 'tache' doit pouvoir stocker TacheWithAssignedEmployes pour la prop initialData du formulaire
  const [tache, setTache] = useState<TacheWithAssignedEmployes | null>(null); 
  const [projets, setProjets] = useState<Projet[]>([]);
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [employesAssignes, setEmployesAssignes] = useState<Employe[]>([]); // Garder pour la logique de diff.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const [tacheData, projetsResponse, employesData, employesAssignesData] = await Promise.all([
          getTacheById(tacheId), // Retourne Tache (sans id_assigne_a)
          fetchAllProjets(),
          getEmployes(),
          getEmployesAssignes(tacheId) // Retourne Employe[]
        ]);

        if (!tacheData) {
          setError("Tâche introuvable.");
          toast.error("Tâche introuvable.");
          setLoading(false); // S'assurer que le loading est arrêté même en cas de 404
          return;
        }

        // Combinaison des données pour former le type TacheWithAssignedEmployes pour le formulaire
        setTache({ 
          ...tacheData,
          id_assigne_a: employesAssignesData 
        });
        // Extraire les données de l'ApiResponse
        const projetsData = projetsResponse.data || [];
        setProjets(projetsData);
        setEmployes(employesData);
        setEmployesAssignes(employesAssignesData); // Stocker les assignations actuelles
      } catch (err) {
        // L'intercepteur Axios loggue déjà l'erreur. Ici, on gère l'affichage pour l'utilisateur.
        const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue lors du chargement.";
        setError(`Échec du chargement: ${errorMessage}`);
        toast.error(`Échec du chargement: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]); // Dépendance à 'id' pour recharger si l'ID de la tâche change

  const handleSaveTache = async (formData: CreateTachePayload, selectedEmployeesIds: number[]) => {
    if (!id) {
      toast.error("ID manquant pour la mise à jour.");
      return;
    }

    const tacheId = Number(id);
    
    try {
      // 1. Mettre à jour les données de la tâche (sans les assignations)
      // formData est déjà de type CreateTachePayload (Omit<Tache, 'id_tache'>), ce qui est correct pour updateTache
      await updateTache(tacheId, formData);

      // 2. Gérer les assignations : déterminer ce qui doit être ajouté/supprimé
      const currentEmployeesIds = employesAssignes.map(emp => emp.id_employes);
      const employeesToAdd = selectedEmployeesIds.filter(id => !currentEmployeesIds.includes(id));
      const employeesToRemove = currentEmployeesIds.filter(id => !selectedEmployeesIds.includes(id));

      // 3. Exécuter les opérations d'ajout et de suppression en parallèle avec Promise.all
      const assignPromises = employeesToAdd.map(employeId => 
        assignEmployeToTache(tacheId, employeId)
      );
      const removePromises = employeesToRemove.map(employeId => 
        removeEmployeFromTache(tacheId, employeId)
      );

      await Promise.all([...assignPromises, ...removePromises]);

      toast.success("Tâche mise à jour avec succès !");
      navigate('/technique/projets/taches'); // Rediriger après succès
    } catch (err) {
      // L'intercepteur Axios loggue déjà l'erreur. Ici, on gère l'affichage pour l'utilisateur.
      const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue lors de la mise à jour.";
      toast.error(`Échec de la mise à jour: ${errorMessage}`);
      throw err; // Re-throw l'erreur pour que TacheForm puisse gérer son état de soumission (isSubmitting)
    }
  };

  if (loading) {
    return <div className="text-center p-8">Chargement en cours...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  // Vérifier explicitement que tache est non-null avant de le passer à TacheForm
  if (!tache) { 
    return <div className="text-center p-8">Tâche non trouvée ou erreur de chargement.</div>;
  }

  return (
    <Layout>
      <TacheForm
        initialData={tache} // tache est maintenant de type TacheWithAssignedEmployes
        onSave={handleSaveTache}
        onCancel={() => navigate('/taches')}
        projetsDisponibles={projets}
        employesDisponibles={employes}
      />
    </Layout>
  );
};

export default EditerTachePage;