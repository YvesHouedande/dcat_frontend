import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Intervention } from '../interface/interface';
import { getInterventionById } from '../api/intervention';
import { InterventionDetails } from '../components/InterventionDetails';

export const InterventionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadIntervention = useCallback(async () => {
    if (!id) return;
  
    try {
      const response = await getInterventionById(parseInt(id));
      if (response.data) {
        setIntervention(response.data);
      } else {
        toast.error('Intervention non trouvée');
        navigate('/technique/interventions');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'intervention:', error);
      toast.error('Erreur lors du chargement de l\'intervention');
      navigate('/technique/interventions');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]); // important : inclure toutes les dépendances utilisées
  
  useEffect(() => {
    loadIntervention();
  }, [loadIntervention]);

  const handleDocumentAdded = () => {
    loadIntervention(); // Recharger l'intervention pour avoir les documents à jour
  };

  const handleDocumentDeleted = () => {
    loadIntervention(); // Recharger l'intervention pour avoir les documents à jour
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-center h-64">
            <p>Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!intervention) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <InterventionDetails
          intervention={intervention}
          onDocumentAdded={handleDocumentAdded}
          onDocumentDeleted={handleDocumentDeleted}
        />
      </div>
    </Layout>
  );
}; 