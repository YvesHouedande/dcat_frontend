import { useState, useEffect, useCallback } from "react";
import { Project, ProjectStats } from "../../types/types";
import { mockProjects } from "../../data/mockdonne"; // Ajustez le chemin selon votre structure

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ProjectStats | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      
      // Utilisez les données mock au lieu de fetch
      // Simuler un délai pour imiter un vrai appel API
      setTimeout(() => {
        setProjects(mockProjects);
        
        // Calculer les statistiques
        const stats: ProjectStats = {
          total: mockProjects.length,
          byStatus: mockProjects.reduce((acc: Record<string, number>, project: Project) => {
            acc[project.etat] = (acc[project.etat] || 0) + 1;
            return acc;
          }, {}),
          byFamily: mockProjects.reduce((acc: Record<string, number>, project: Project) => {
            acc[project.id_famille] = (acc[project.id_famille] || 0) + 1;
            return acc;
          }, {}),
          onTime: mockProjects.filter((p: Project) => 
            p.etat === 'terminé' && new Date(p.date_fin) <= new Date()
          ).length,
          delayed: mockProjects.filter((p: Project) => 
            p.etat === 'terminé' && new Date(p.date_fin) > new Date()
          ).length,
        };
        setStats(stats);
        setLoading(false);
      }, 500); // Simuler un délai de 500ms
      
    } catch (err) {
      setError("Erreur lors du chargement des projets");
      console.error(err);
      setLoading(false);
    }
  }, []);

  // Modifiez aussi les autres fonctions pour utiliser des données mockées
  const createProject = async (project: Omit<Project, 'id_projet'>) => {
    try {
      // Simuler l'ajout d'un projet
      const newProject = {
        ...project,
        id_projet: (Math.random() * 1000).toString() // ID aléatoire
      };
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      // Simuler la mise à jour d'un projet
      const updatedProject = projects.find(p => p.id_projet === id);
      if (!updatedProject) throw new Error("Projet non trouvé");
      
      const updated = { ...updatedProject, ...updates };
      setProjects(prev => 
        prev.map(p => p.id_projet === id ? updated : p)
      );
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      // Simuler la suppression d'un projet
      setProjects(prev => prev.filter(p => p.id_projet !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    stats,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refresh: fetchProjects,
  };
};