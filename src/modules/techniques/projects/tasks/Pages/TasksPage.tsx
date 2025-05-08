// src/techniques/projects/tasks/pages/TasksPage.tsx
import { useTasks } from "../hooks/useTasks";
import { KPICard } from "../../components/gestions/KPICard";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "../../components/gestions/StatusBadge";
import { PlusIcon, SearchIcon } from "lucide-react";
import { TaskForm } from "../../components/forms/TaskForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useProjects } from "../../projet/hooks/useProjects";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Task } from "../../types/types";
import Layout from "@/components/Layout";

export const TasksPage = () => {
  const { tasks, stats, error, createTask } = useTasks();
  const { projects } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredTasks = tasks.filter(task =>
    task.nom_tache.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assigne_a?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.desc_tache?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProjectName = (id: string) => {
    return projects.find(p => p.id_projet === id)?.nom_projet || id;
  };

  const handleCreateTask = async (task: Omit<Task, 'id_tache'>) => {
    try {
      await createTask(task);
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <div>Erreur: {error}</div>;

  const btnTask =() =>{
    return(
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer transition ease-in-out duration-300 active:scale-95" variant={"outline"}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Nouvelle Tâche
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
        />
      </DialogContent>
    </Dialog>
  );
}

  return (
    <Layout autre={btnTask}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestion des Tâches</h1>
          
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard 
            title="Total des tâches" 
            value={stats?.total || 0} 
          />
          <KPICard 
            title="Tâches terminées" 
            value={stats?.completed || 0} 
          />
          <KPICard 
            title="Tâches en cours" 
            value={stats?.byStatus['en cours'] || 0} 
          />
          <KPICard 
            title="Tâches en retard" 
            value={stats?.overdue || 0} 
          />
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des tâches..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tasks table */}
        <Card>
          <CardHeader>
            <CardTitle>Toutes les tâches</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Projet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Date fin</TableHead>
                  <TableHead>Assigné à</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map(task => (
                  <TableRow key={task.id_tache}>
                    <TableCell className="font-medium">
                      <Link 
                        to={`/technique/taches/${task.id_tache}`}
                        className="hover:underline"
                      >
                        {task.nom_tache}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link 
                        to={`/technique/Projets/${task.id_projet}`}
                        className="hover:underline"
                      >
                        {getProjectName(task.id_projet)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={task.statut} />
                    </TableCell>
                    <TableCell>
                      <div className={cn(
                        "text-xs px-2 py-0.5 rounded-full inline-block",
                        task.priorite === 'faible' && "bg-green-100 text-green-800",
                        task.priorite === 'moyenne' && "bg-yellow-100 text-yellow-800",
                        task.priorite === 'haute' && "bg-orange-100 text-orange-800",
                        task.priorite === 'critique' && "bg-red-100 text-red-800",
                      )}>
                        {task.priorite}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(task.date_fin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{task.assigne_a || '-'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/technique/taches/${task.id_tache}/modifier`}>
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