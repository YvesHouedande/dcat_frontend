// src/pages/DetailsTachePage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
// IMPORTS MIS À JOUR POUR LES TYPES : Utilise TacheWithAssignedEmployes
import { Projet, TacheWithAssignedEmployes } from '../../types/types'; 
// IMPORTS MIS À JOUR POUR LES API : Ajout de getEmployesAssignes
import { getTacheById, getEmployesAssignes } from '../api/taches'; 
import { fetchAllProjets } from '../../projet/api/projets'; 
import { Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,      // For Dates
  User,       // For Assignee
  ArrowLeft,  // For back navigation
  Edit,       // For edit button
  Info        // For description icon
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner'; // Pour les notifications

interface TaskDetailProps {
  // Props optionnelles pour utiliser le composant de manière flexible
  tacheId?: number; // Si fourni, charge la tâche directement
  tache?: TacheWithAssignedEmployes; // Si fourni, utilise directement cette tâche
  projets?: Projet[]; // Si fourni, utilise directement cette liste
  isEmbedded?: boolean; // Si true, n'affiche pas le Layout et les boutons de navigation
  onClose?: () => void; // Callback pour fermer si utilisé en mode embedded
  onEdit?: (tacheId: number) => void; // Callback pour l'édition si utilisé en mode embedded
}

const TaskDetail: React.FC<TaskDetailProps> = ({
  tacheId,
  tache: initialTache,
  projets: initialProjets,
  isEmbedded = false,
  onEdit
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // MODIFICATION ICI : L'état 'tache' doit être de type TacheWithAssignedEmployes
  const [tache, setTache] = useState<TacheWithAssignedEmployes | undefined>(initialTache); 
  const [projets, setProjets] = useState<Projet[]>(initialProjets || []);
  const [loading, setLoading] = useState(!initialTache);
  const [error, setError] = useState<string | null>(null);

  // Déterminer l'ID de la tâche à charger
  const targetTacheId = tacheId || (id ? Number(id) : null);

  useEffect(() => {
    // Si on a déjà une tâche fournie, ne pas charger
    if (initialTache) {
      setTache(initialTache);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);

      if (!targetTacheId) {
        setError("ID de tâche manquant pour l'affichage des détails.");
        toast.error("ID de tâche manquant."); // Ajout d'une toast pour le cas manquant
        setLoading(false);
        return;
      }

      if (isNaN(targetTacheId)) {
        setError("ID de tâche invalide.");
        toast.error("ID de tâche invalide."); // Ajout d'une toast pour le cas invalide
        setLoading(false);
        return;
      }

      try {
        // MODIFICATION ICI : Récupérer la tâche, les projets ET les employés assignés en parallèle
        const [fetchedTache, fetchedProjetsResponse, fetchedAssignedEmployes] = await Promise.all([
          getTacheById(targetTacheId), // Retourne une Tache (sans id_assigne_a)
          initialProjets ? Promise.resolve({ data: initialProjets }) : fetchAllProjets(),
          getEmployesAssignes(targetTacheId) // Retourne un tableau d'Employe
        ]);
        
        if (!fetchedTache) {
          setError("Tâche introuvable.");
          toast.error("Tâche introuvable.");
          setLoading(false); 
          return;
        }

        // MODIFICATION ICI : Combiner la tâche et les employés assignés pour l'état du composant
        setTache({
          ...fetchedTache,
          id_assigne_a: fetchedAssignedEmployes // Maintenant, id_assigne_a est un tableau d'Employe[]
        });
        // Extraire les données de l'ApiResponse
        const projetsData = fetchedProjetsResponse.data || [];
        setProjets(projetsData);

      } catch (err) {
        console.error("Erreur lors du chargement des données de la tâche :", err);
        const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
        setError(`Impossible de charger les détails de la tâche: ${errorMessage}`);
        toast.error(`Erreur de chargement: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [targetTacheId, initialTache, initialProjets]); // Dépendances mises à jour

  // Helper pour obtenir le nom du projet par ID (inchangé, fonctionne toujours)
  const getProjectName = (projectId: number): string => {
    if (!projets || projets.length === 0) return `Chargement... (ID: ${projectId})`;
    return projets.find(p => p.id_projet === projectId)?.nom_projet || `Inconnu (ID: ${projectId})`;
  };


  // Helpers pour les badges de statut et de priorité
  // MODIFICATION CLÉ ICI : Ajouter une vérification de nullité/undefined pour 'statut' et 'priorite'
  const getStatutBadgeClass = (statut: string | undefined): string => {
    if (!statut) { // Si statut est undefined, null ou une chaîne vide
      console.warn("Statut de tâche est undefined ou nul. Utilisation de la classe par défaut.");
      return 'bg-gray-100 text-gray-800'; // Classe par défaut
    }
    switch (statut.toLowerCase()) {
      case 'à faire': return 'bg-gray-100 text-gray-800';
      case 'en cours': return 'bg-blue-100 text-blue-800';
      case 'en revue': return 'bg-purple-100 text-purple-800';
      case 'terminé': return 'bg-green-100 text-green-800';
      case 'bloqué': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeClass = (priorite: string | undefined): string => {
    if (!priorite) { // Si priorite est undefined, null ou une chaîne vide
      console.warn("Priorité de tâche est undefined ou nulle. Utilisation de la classe par défaut.");
      return 'bg-gray-100 text-gray-800'; // Classe par défaut
    }
    switch (priorite.toLowerCase()) {
      case 'basse': return 'bg-green-100 text-green-800';
      case 'moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'haute': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handlers pour les actions
  const handleEdit = () => {
    if (onEdit && tache) {
      onEdit(tache.id_tache);
    } else if (tache) {
      navigate(`/technique/projets/taches/${tache.id_tache}/editer`);
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        Chargement des détails de la tâche...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-32 text-red-500 text-xl font-semibold">
        Erreur: {error}
      </div>
    );
  }

  // Vérification de l'existence de la tâche avant le rendu final
  if (!tache) {
    return (
      <div className="flex justify-center items-center h-32 text-red-500 text-xl font-semibold">
        Tâche introuvable !
      </div>
    );
  }

  // Contenu principal du composant
  const content = (
    <div className={isEmbedded ? "" : "bg-gray-50 p-6 min-h-screen"}>
      <div className={isEmbedded ? "" : "max-w-3xl mx-auto"}>
        {/* Header contextuel */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/technique/projets/taches`)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </Button>
            <span className="hidden sm:inline">/</span>
            <span className="font-medium text-gray-700">Projet :</span>
            <span className="font-semibold text-blue-700">{getProjectName(tache.id_projet)}</span>
            <span>/</span>
            <span className="font-medium text-gray-700">Tâche :</span>
            <span className="font-semibold text-indigo-700">{tache.nom_tache}</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleEdit} size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
              <Edit className="mr-2 h-4 w-4" /> Modifier
            </Button>
          </div>
        </div>

        {/* Carte synthétique */}
        <Card className="mb-6 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={`text-base px-3 py-1 rounded-full ${getStatutBadgeClass(tache.statut)}`}>{tache.statut}</Badge>
                <Badge className={`text-base px-3 py-1 rounded-full ${getPriorityBadgeClass(tache.priorite)}`}>{tache.priorite}</Badge>
                <span className="flex items-center gap-1 text-gray-600"><Clock className="h-4 w-4" /> {tache.date_debut ? format(new Date(tache.date_debut), 'dd MMM yyyy', { locale: fr }) : 'N/A'} → {tache.date_fin ? format(new Date(tache.date_fin), 'dd MMM yyyy', { locale: fr }) : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-700">Assignés :</span>
                {tache.id_assigne_a && tache.id_assigne_a.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tache.id_assigne_a.map(emp => (
                      <span key={emp.id_employes} className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-medium border border-blue-200">
                        {emp.prenom_employes?.charAt(0)}{emp.nom_employes?.charAt(0)}
                        <span className="ml-1">{emp.prenom_employes} {emp.nom_employes}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="italic text-gray-400 ml-2">Aucun</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="mb-6 border-blue-100">
          <CardHeader className="bg-blue-50 border-b">
            <CardTitle className="flex items-center gap-2 text-blue-700 text-lg">
              <Info className="h-5 w-5" /> Description de la tâche
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-gray-800 text-base">
              {tache.desc_tache || <span className="italic text-gray-400">Aucune description fournie.</span>}
            </div>
          </CardContent>
        </Card>

        {/* Section employés assignés détaillée */}
        {tache.id_assigne_a && tache.id_assigne_a.length > 0 && (
          <Card className="mb-6 border-green-100">
            <CardHeader className="bg-green-50 border-b">
              <CardTitle className="flex items-center gap-2 text-green-700 text-lg">
                <User className="h-5 w-5" /> Détail des employés assignés
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tache.id_assigne_a.map((employe) => (
                  <div key={employe.id_employes} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100 shadow-sm">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-700 font-bold text-lg">
                      {employe.prenom_employes?.charAt(0)}{employe.nom_employes?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{employe.prenom_employes} {employe.nom_employes}</p>
                      <p className="text-sm text-gray-500">{employe.email_employes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  // Retourner avec ou sans Layout selon le mode
  if (isEmbedded) {
    return content;
  }

  return (
    <Layout>
      {content}
    </Layout>
  );
};

export default TaskDetail;

// Composant de page pour les détails de tâche (utilise le composant TaskDetail)
export const DetailsTachePage: React.FC = () => {
  return <TaskDetail />;
};