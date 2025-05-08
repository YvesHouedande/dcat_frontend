// src/techniques/projects/projet/pages/ProjectsPage.tsx
import { useProjects } from "../hooks/useProjects";
import { KPICard } from "../../components/gestions/KPICard";
import { ProjectCard } from "../../components/gestions/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "../../components/gestions/StatusBadge";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ProjectForm } from "../../components/forms/ProjectForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Project } from "../../types/types";

export const ProjectsPage = () => {
  const { projects, stats, error, createProject } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredProjects = projects.filter(
    (project) =>
      project.nom_projet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.type_projet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = async (project: Omit<Project, "id_projet">) => {
    try {
      await createProject(project);
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const btnproject = () => {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="cursor-pointer transition ease-in-out duration-300 active:scale-95"
            variant={"outline"}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouveau Projet
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau projet</DialogTitle>
          </DialogHeader>
          <ProjectForm onSubmit={handleCreateProject} />
        </DialogContent>
      </Dialog>
    );
  };

  if (error) return <div>Erreur: {error}</div>;

  return (
    <Layout autre={btnproject}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestion des Projets</h1>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard title="Total des projets" value={stats?.total || 0} />
          <KPICard
            title="Projets terminés"
            value={stats?.byStatus["terminé"] || 0}
          />
          <KPICard
            title="Projets en cours"
            value={stats?.byStatus["en cours"] || 0}
          />
          <KPICard title="Projets en retard" value={stats?.delayed || 0} />
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des projets..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Projects grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.slice(0, 3).map((project) => (
            <ProjectCard
              key={project.id_projet}
              project={project}
              progress={Math.random() * 100}
              tasksCount={Math.floor(Math.random() * 20)}
            />
          ))}
        </div>

        {/* Projects table */}
        <Card>
          <CardHeader>
            <CardTitle>Tous les projets</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id_projet}>
                    <TableCell className="font-medium">
                      <Link
                        to={`/technique/Projets/${project.id_projet}`}
                        className="hover:underline"
                      >
                        {project.nom_projet}
                      </Link>
                    </TableCell>
                    <TableCell>{project.type_projet}</TableCell>
                    <TableCell>
                      <StatusBadge status={project.etat} />
                    </TableCell>
                    <TableCell>
                      {new Date(project.date_debut).toLocaleDateString()} -{" "}
                      {new Date(project.date_fin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{project.responsable}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          to={`/technique/Projets/${project.id_projet}/modifier`}
                        >
                          Éditer
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
