// src/techniques/projects/livrables/hooks/useLivrables.ts
import { useState, useEffect, useCallback } from "react";
import { Livrable, LivrableStats } from "../../types/types";
import { mockLivrables } from "../../data/mockdonne"; // Ajustez le chemin selon votre structure

export const useLivrables = (projectId?: string) => {
  const [livrables, setLivrables] = useState<Livrable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<LivrableStats | null>(null);

  const fetchLivrables = useCallback(async () => {
    try {
      setLoading(true);
      // Simuler un délai pour imiter un vrai appel API
      setTimeout(() => {
        // Filtrer les livrables si un projectId est spécifié
        const filteredLivrables = projectId 
          ? mockLivrables.filter(livrable => livrable.id_projet === projectId)
          : mockLivrables;
        
        setLivrables(filteredLivrables);
        
        // Calculer les statistiques
        const stats: LivrableStats = {
          total: filteredLivrables.length,
          byStatus: filteredLivrables.reduce((acc: Record<string, number>, livrable: Livrable) => {
            acc[livrable.Approbation] = (acc[livrable.Approbation] || 0) + 1;
            return acc;
          }, {}),
          byProject: filteredLivrables.reduce((acc: Record<string, number>, livrable: Livrable) => {
            if (livrable.id_projet) {
              acc[livrable.id_projet] = (acc[livrable.id_projet] || 0) + 1;
            }
            return acc;
          }, {}),
          lastUpdated: filteredLivrables
            .sort((a: Livrable, b: Livrable) => 
              new Date(b.Date_).getTime() - new Date(a.Date_).getTime()
            )
            .slice(0, 5),
        };
        setStats(stats);
        setLoading(false);
      }, 500); // Simuler un délai de 500ms
      
    } catch (err) {
      setError("Erreur lors du chargement des livrables");
      console.error(err);
      setLoading(false);
    }
  }, [projectId]);

  const createLivrable = async (livrable: Omit<Livrable, 'Id_Livrable'>) => {
    try {
      // Simuler l'ajout d'un livrable
      const newLivrable = {
        ...livrable,
        Id_Livrable: Math.floor(Math.random() * 1000) // ID aléatoire
      };
      setLivrables(prev => [...prev, newLivrable]);
      return newLivrable;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateLivrable = async (id: number, updates: Partial<Livrable>) => {
    try {
      // Simuler la mise à jour d'un livrable
      const updatedLivrable = livrables.find(l => l.Id_Livrable === id);
      if (!updatedLivrable) throw new Error("Livrable non trouvé");
      
      const updated = { ...updatedLivrable, ...updates };
      setLivrables(prev => 
        prev.map(l => l.Id_Livrable === id ? updated : l)
      );
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteLivrable = async (id: number) => {
    try {
      // Simuler la suppression d'un livrable
      setLivrables(prev => prev.filter(l => l.Id_Livrable !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateLivrableStatus = async (id: number, newStatus: Livrable['Approbation']) => {
    return updateLivrable(id, { Approbation: newStatus });
  };

  useEffect(() => {
    fetchLivrables();
  }, [fetchLivrables]);

  return {
    livrables,
    stats,
    loading,
    error,
    createLivrable,
    updateLivrable,
    deleteLivrable,
    updateLivrableStatus,
    refresh: fetchLivrables,
  };
};