import { ProjectForm } from "../../components/forms/ProjectForm";
import { useParams } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";
import { Card } from "@/components/ui/card";
import { Project } from "../../types/types";
import Layout from "@/components/Layout";

export const ProjectEditPage = () => {
  const { id } = useParams<{ id?: string }>();
  const { projects, updateProject, createProject } = useProjects();

  const project = id ? projects.find((p: { id_projet: string; }) => p.id_projet === id) : undefined;

  const handleSubmit = (values: Omit<Project, 'id_projet'>) => {
    if (id) {
      updateProject(id, values);
    } else {
      createProject(values);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            {id ? "Modifier le projet" : "Créer un nouveau projet"}
          </h1>
          <ProjectForm 
            project={project} 
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </Layout>
  );
};