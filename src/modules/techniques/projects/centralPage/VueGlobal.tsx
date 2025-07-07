import React, { useState, useEffect } from "react";
import Layout from "../../../../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { format, subDays, parseISO, isWithinInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { getInterventions } from "../../interventions/api/intervention";
import { fetchAllProjets } from "../projet/api/projets";
import { getTachesByProjet } from "../tasks/api/taches";
import { Intervention } from "../../interventions/interface/interface";
import { Projet, Tache } from "../types/types";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const VueGlobalPage: React.FC = () => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [projects, setProjects] = useState<Projet[]>([]);
  const [tasks, setTasks] = useState<Tache[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch interventions
        const interventionsResponse = await getInterventions(1, 100);
        setInterventions(interventionsResponse.data || []);

        // Fetch projects
        const projectsResponse = await fetchAllProjets();
        const projectsArray = projectsResponse.data || [];
        setProjects(projectsArray);

        // Fetch tasks for all projects
        const allTasks: Tache[] = [];
        for (const project of projectsArray) {
          const tasksResponse = await getTachesByProjet(project.id_projet);
          allTasks.push(...(tasksResponse.data || []));
        }
        setTasks(allTasks);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  // KPIs Calculation
  const last30DaysInterventions = interventions.filter((intervention) => {
    const interventionDate = parseISO(intervention.date_intervention);
    return isWithinInterval(interventionDate, {
      start: subDays(new Date(), 30),
      end: new Date(),
    });
  });

  const averageInterventionDuration =
    last30DaysInterventions.length > 0
      ? last30DaysInterventions.reduce(
          (acc, curr) => acc + parseFloat(curr.duree),
          0
        ) / last30DaysInterventions.length
      : 0;

  const urgentInterventions = last30DaysInterventions.filter((intervention) =>
    intervention.type_intervention.toLowerCase().includes("urgent")
  );
  const urgencyRate =
    last30DaysInterventions.length > 0
      ? (urgentInterventions.length / last30DaysInterventions.length) * 100
      : 0;

  const todayInterventions = interventions.filter(
    (intervention) =>
      format(parseISO(intervention.date_intervention), "yyyy-MM-dd") ===
      format(new Date(), "yyyy-MM-dd")
  );

  // Projects KPIs
  const activeProjects = projects.filter(
    (project) => project.etat === "en_cours"
  );
  const completedProjects = projects.filter(
    (project) => project.etat === "terminé"
  );
  const projectCompletionRate =
    projects.length > 0
      ? (completedProjects.length / projects.length) * 100
      : 0;

  // Tasks KPIs
  const completedTasks = tasks.filter((task) => task.statut === "terminé");
  const taskCompletionRate =
    tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  // Prepare data for charts
  const interventionsByType = last30DaysInterventions.reduce(
    (acc: { type: string; count: number }[], curr) => {
      const existingType = acc.find(
        (item) => item.type === curr.type_intervention
      );
      if (existingType) {
        existingType.count++;
      } else {
        acc.push({ type: curr.type_intervention, count: 1 });
      }
      return acc;
    },
    []
  );

  const projectsByStatus = projects.reduce(
    (acc: { count: number; status: string }[], curr) => {
      const existingStatus = acc.find((item) => item.status === curr.etat);
      if (existingStatus) {
        existingStatus.count++;
      } else {
        acc.push({ status: curr.etat, count: 1 });
      }
      return acc;
    },
    []
  );

  const tasksByStatus = tasks.reduce(
    (acc: { count: number; status: string }[], curr) => {
      const existingStatus = acc.find((item) => item.status === curr.statut);
      if (existingStatus) {
        existingStatus.count++;
      } else {
        acc.push({ status: curr.statut, count: 1 });
      }
      return acc;
    },
    []
  );

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Vue Globale Technique</h1>

        {/* KPIs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Interventions (30j)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {last30DaysInterventions.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Aujourd'hui: {todayInterventions.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Durée Moyenne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageInterventionDuration.toFixed(1)}h
              </div>
              <p className="text-xs text-muted-foreground">
                Taux d'urgence: {urgencyRate.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Projets Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects.length}</div>
              <Progress value={projectCompletionRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Taux d'achèvement: {projectCompletionRate.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tâches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
              <Progress value={taskCompletionRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Taux d'achèvement: {taskCompletionRate.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="interventions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="interventions">Interventions</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="tasks">Tâches</TabsTrigger>
          </TabsList>

          <TabsContent value="interventions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Types d'Interventions</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={interventionsByType}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="type" type="category" width={120} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Nombre">
                        {interventionsByType.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dernières Interventions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {interventions.slice(0, 5).map((intervention) => (
                      <div
                        key={intervention.id_intervention}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">
                            {intervention.type_intervention}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(
                              parseISO(intervention.date_intervention),
                              "dd/MM/yyyy",
                              { locale: fr }
                            )}
                          </p>
                        </div>
                        <Badge>{intervention.statut_intervention}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>État des Projets</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={projectsByStatus}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="status" type="category" width={80} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Nombre">
                        {projectsByStatus.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Projets en Cours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {activeProjects.slice(0, 5).map((project) => (
                      <div
                        key={project.id_projet}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{project.nom_projet}</p>
                          <p className="text-sm text-muted-foreground">
                            {project.responsable}
                          </p>
                        </div>
                        <Badge>{project.etat}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>État des Tâches</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={tasksByStatus}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="status" type="category" width={80} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Nombre">
                        {tasksByStatus.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tâches Récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tasks.slice(0, 5).map((task) => (
                      <div
                        key={task.id_tache}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{task.nom_tache}</p>
                          <p className="text-sm text-muted-foreground">
                            {task.priorite}
                          </p>
                        </div>
                        <Badge>{task.statut}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default VueGlobalPage;
