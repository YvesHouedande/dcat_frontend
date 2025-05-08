// src/techniques/projects/tasks/hooks/useTasks.ts
import { useState, useEffect, useCallback } from "react";
import { Task, TaskStats } from "../../types/types";
import { mockTasks } from "../../data/mockdonne"; // Ajustez le chemin selon votre structure

export const useTasks = (projectId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<TaskStats | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      // Simuler un délai pour imiter un vrai appel API
      setTimeout(() => {
        // Filtrer les tâches si un projectId est spécifié
        const filteredTasks = projectId 
          ? mockTasks.filter(task => task.id_projet === projectId)
          : mockTasks;
        
        setTasks(filteredTasks);
        
        // Calculer les statistiques
        const now = new Date();
        const stats: TaskStats = {
          total: filteredTasks.length,
          byStatus: filteredTasks.reduce((acc: Record<string, number>, task: Task) => {
            acc[task.statut] = (acc[task.statut] || 0) + 1;
            return acc;
          }, {}),
          byPriority: filteredTasks.reduce((acc: Record<string, number>, task: Task) => {
            acc[task.priorite] = (acc[task.priorite] || 0) + 1;
            return acc;
          }, {}),
          completed: filteredTasks.filter((t: Task) => t.statut === 'terminé').length,
          overdue: filteredTasks.filter((t: Task) => 
            new Date(t.date_fin) < now && t.statut !== 'terminé'
          ).length,
          upcomingDeadlines: filteredTasks
            .filter((t: Task) => 
              new Date(t.date_fin) > now && 
              new Date(t.date_fin) < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) &&
              t.statut !== 'terminé'
            )
            .sort((a: Task, b: Task) => 
              new Date(a.date_fin).getTime() - new Date(b.date_fin).getTime()
            )
            .slice(0, 5),
        };
        setStats(stats);
        setLoading(false);
      }, 500); // Simuler un délai de 500ms
      
    } catch (err) {
      setError("Erreur lors du chargement des tâches");
      console.error(err);
      setLoading(false);
    }
  }, [projectId]);

  const createTask = async (task: Omit<Task, 'id_tache'>) => {
    try {
      // Simuler l'ajout d'une tâche
      const newTask = {
        ...task,
        id_tache: `TSK-${Math.floor(Math.random() * 10000)}` // ID aléatoire
      };
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      // Simuler la mise à jour d'une tâche
      const updatedTask = tasks.find(t => t.id_tache === id);
      if (!updatedTask) throw new Error("Tâche non trouvée");
      
      const updated = { ...updatedTask, ...updates };
      setTasks(prev => 
        prev.map(t => t.id_tache === id ? updated : t)
      );
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      // Simuler la suppression d'une tâche
      setTasks(prev => prev.filter(t => t.id_tache !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateTaskStatus = async (id: string, newStatus: Task['statut']) => {
    return updateTask(id, { statut: newStatus });
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    stats,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    refresh: fetchTasks,
  };
};