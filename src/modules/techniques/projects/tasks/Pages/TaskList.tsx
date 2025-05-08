// src/techniques/projects/tasks/components/TaskList.tsx
import { Task } from "../../types/types";
import { TaskItem } from "../../components/gestions/TaskItem";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useTasks } from "../hooks/useTasks";
import { useProjects } from "../../projet/hooks/useProjects";
import { TaskForm } from "../../components/forms/TaskForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type TaskListProps = {
  projectId?: string;
};

export const TaskList = ({ projectId }: TaskListProps) => {
  const { tasks, loading, error, createTask, updateTaskStatus } = useTasks(projectId);
  const { projects } = useProjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateTask = async (task: Omit<Task, 'id_tache'>) => {
    try {
      await createTask(task);
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );

  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tâches</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Nouvelle tâche
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle tâche</DialogTitle>
            </DialogHeader>
            <TaskForm 
              onSubmit={handleCreateTask} 
              projects={projects.map(p => ({ 
                id_projet: p.id_projet, 
                nom_projet: p.nom_projet 
              }))}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucune tâche trouvée
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => (
            <TaskItem 
              key={task.id_tache} 
              task={task} 
              onStatusChange={updateTaskStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};