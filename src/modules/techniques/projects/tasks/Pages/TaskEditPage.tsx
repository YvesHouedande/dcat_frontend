import { TaskForm } from "../../components/forms/TaskForm";
import { useParams } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { useProjects } from "../../projet/hooks/useProjects";
import { Card } from "@/components/ui/card";
import { Task } from "../../types/types";
import Layout from "@/components/Layout";

export const TaskEditPage = () => {
  const { id } = useParams<{ id?: string }>();
  const { tasks, updateTask, createTask } = useTasks();
  const { projects } = useProjects();

  const task = id ? tasks.find((t: { id_tache: string; }) => t.id_tache === id) : undefined;

  const handleSubmit = (values: Omit<Task, 'id_tache'>) => {
    if (id) {
      updateTask(id, values);
    } else {
      createTask(values);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            {id ? "Modifier la tâche" : "Créer une nouvelle tâche"}
          </h1>
          <TaskForm 
            task={task} 
            projects={projects.map((p: { id_projet: any; nom_projet: any; }) => ({ 
              id_projet: p.id_projet, 
              nom_projet: p.nom_projet 
            }))}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </Layout>
  );
};