// src/techniques/projects/projet/pages/ProjectDetail.tsx
import { useParams } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";
import { ProjectCard } from "../../components/gestions/ProjectCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { TaskList } from "../../tasks/Pages/TaskList";
import { DocumentList } from "../../documents/Pages/DocumentList";
import { LivrableList } from "../../livrables/Pages/LivrableList";
import SettingsLoader from "@/components/loader/settingsLoader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, error, loading } = useProjects();

  if (error) return <div>Erreur: {error}</div>;

  const project = projects.find((p) => p.id_projet === id);
  if (loading) {
    return (
      <Layout>
        <SettingsLoader />
      </Layout>
    );
  } else if (error) {
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>;
  }
  if (!project)
    return (
      <Layout>
        <div>Projet non trouvé</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/Projets">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{project.nom_projet}</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <ProjectCard
              project={project}
              className="sticky top-4"
              progress={75}
              tasksCount={12}
            />
          </div>
          <div className="md:col-span-2">
            <Tabs defaultValue="tasks">
              <TabsList>
                <TabsTrigger value="tasks">Tâches</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="livrables">Livrables</TabsTrigger>
                <TabsTrigger value="settings">Paramètres</TabsTrigger>
              </TabsList>
              <TabsContent value="tasks">
                <TaskList projectId={id} />
              </TabsContent>
              <TabsContent value="documents">
                <DocumentList projectId={id} />
              </TabsContent>
              <TabsContent value="livrables">
                <LivrableList projectId={id} />
              </TabsContent>
              <TabsContent value="settings">
                <div className="p-4">
                  <h3 className="text-lg font-medium">Paramètres du projet</h3>
                  <p className="text-sm text-muted-foreground">
                    Configurez les paramètres avancés du projet ici.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};
