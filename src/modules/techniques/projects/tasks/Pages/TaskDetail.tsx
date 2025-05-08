// src/techniques/projects/tasks/pages/TaskDetail.tsx
import { useParams } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "../../components/gestions/StatusBadge";
import { useProjects } from "../../projet/hooks/useProjects";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import SettingsLoader from "@/components/loader/settingsLoader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { tasks, error, updateTaskStatus, loading } = useTasks();
  const { projects } = useProjects();

  if (error) return <div>Erreur: {error}</div>;

  const task = tasks.find((t) => t.id_tache === id);
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
  if (!task)
    return (
      <Layout>
        <div>Tâche non trouvée</div>
      </Layout>
    );

  const project = projects.find((p) => p.id_projet === task.id_projet);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/taches">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{task.nom_tache}</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Détails de la tâche</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm text-muted-foreground">Statut</h3>
                    <div className="mt-1">
                      <StatusBadge status={task.statut} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Priorité</h3>
                    <div
                      className={cn(
                        "text-sm mt-1 px-2 py-1 rounded-full inline-block",
                        task.priorite === "faible" &&
                          "bg-green-100 text-green-800",
                        task.priorite === "moyenne" &&
                          "bg-yellow-100 text-yellow-800",
                        task.priorite === "haute" &&
                          "bg-orange-100 text-orange-800",
                        task.priorite === "critique" &&
                          "bg-red-100 text-red-800"
                      )}
                    >
                      {task.priorite}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">
                      Date de début
                    </h3>
                    <p className="text-sm mt-1">
                      {new Date(task.date_debut).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">
                      Date de fin
                    </h3>
                    <p className="text-sm mt-1">
                      {new Date(task.date_fin).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Assigné à</h3>
                    <p className="text-sm mt-1">
                      {task.assigne_a || "Non assigné"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Projet</h3>
                    <p className="text-sm mt-1">
                      <Link
                        to={`/technique/Projets/${task.id_projet}`}
                        className="hover:underline"
                      >
                        {project?.nom_projet || task.id_projet}
                      </Link>
                    </p>
                  </div>
                </div>
                {task.desc_tache && (
                  <div>
                    <h3 className="text-sm text-muted-foreground">
                      Description
                    </h3>
                    <p className="text-sm mt-1 whitespace-pre-line">
                      {task.desc_tache}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/technique/taches/${task.id_tache}/modifier`}>
                    Éditer la tâche
                  </Link>
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => updateTaskStatus(task.id_tache, "en cours")}
                    disabled={task.statut === "en cours"}
                  >
                    Commencer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => updateTaskStatus(task.id_tache, "terminé")}
                    disabled={task.statut === "terminé"}
                  >
                    Terminer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};
