"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { initialTasks } from "../data/mockData";

export default function TaskDisplay() {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [priorityFilter, setPriorityFilter] = useState("tous");
  const [missionFilter, setMissionFilter] = useState("tous");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // Extraire les missions uniques pour le filtre
  const uniqueMissions = Array.from(new Set(tasks.map(task => task.missionId)))
    .map(missionId => {
      const task = tasks.find(t => t.missionId === missionId);
      return {
        id: missionId,
        title: task?.missionTitle || "Sans mission"
      };
    });

  // Filtrer les tâches
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "tous" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "tous" || task.priority === priorityFilter;
    const matchesMission = missionFilter === "tous" || task.missionId === missionFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesMission;
  });

  // Pagination des tâches filtrées
  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Navigation de pagination
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Changer le statut
  const handleStatusChange = (id: number, newStatus: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  // Formater la date
  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Traduire les statuts pour l'affichage
  const getStatusLabel = (status: string) => {
    const statusMap: {[key: string]: string} = {
      "todo": "À faire",
      "in-progress": "En cours",
      "review": "En révision",
      "blocked": "Bloquée",
      "completed": "Terminée"
    };
    return statusMap[status] || status;
  };

  // Rendu des tags
  const renderTags = (tags: string) => {
    if (!tags) return null;
    
    return tags.split(',').map((tag, index) => (
      <Badge key={index} variant="outline" className="mr-1">
        {tag.trim()}
      </Badge>
    ));
  };

  const boutonAdd = () => {
    return (
      <div>
        <Button
          className="cursor-pointer transition ease-in-out duration-300 active:scale-95"
          variant={"outline"}
        >
          <Link className="flex items-center space-x-2" to={"tache"}>
            Ajouter une tâche <Plus />
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <Layout autre={boutonAdd}>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Gestion des Tâches</h1>
        
        {/* Barre de filtres */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Input
            placeholder="Rechercher par titre, description ou assigné..."
            className="w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue>Statut: {statusFilter === "tous" ? "Tous" : getStatusLabel(statusFilter)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous statuts</SelectItem>
              <SelectItem value="todo">À faire</SelectItem>
              <SelectItem value="in-progress">En cours</SelectItem>
              <SelectItem value="review">En révision</SelectItem>
              <SelectItem value="blocked">Bloquée</SelectItem>
              <SelectItem value="completed">Terminée</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue>Priorité: {priorityFilter === "tous" ? "Toutes" : 
                priorityFilter === "high" ? "Haute" : 
                priorityFilter === "medium" ? "Moyenne" : "Basse"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Toutes</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={missionFilter} onValueChange={setMissionFilter}>
            <SelectTrigger className="w-56">
              <SelectValue>Mission: {missionFilter === "tous" ? "Toutes" : 
                uniqueMissions.find(m => m.id === missionFilter)?.title}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Toutes missions</SelectItem>
              {uniqueMissions.map((mission) => (
                <SelectItem key={mission.id as string} value={mission.id as string}>
                  {mission.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("tous");
              setPriorityFilter("tous");
              setMissionFilter("tous");
            }}
          >
            Réinitialiser
          </Button>
        </div>
        
        {/* Tableau */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Mission</TableHead>
                <TableHead>Assigné à</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">
                    <div>{task.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{task.description}</div>
                  </TableCell>
                  <TableCell>{task.missionTitle}</TableCell>
                  <TableCell>{task.assignedTo}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === "high" ? "bg-red-100 text-red-800" :
                      task.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {task.priority === "high" ? "Haute" : 
                       task.priority === "medium" ? "Moyenne" : "Basse"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={task.status}
                      onValueChange={(value) => handleStatusChange(task.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue>{getStatusLabel(task.status)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">À faire</SelectItem>
                        <SelectItem value="in-progress">En cours</SelectItem>
                        <SelectItem value="review">En révision</SelectItem>
                        <SelectItem value="blocked">Bloquée</SelectItem>
                        <SelectItem value="completed">Terminée</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div>{formatDate(task.dueDate)}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {Number(task.estimatedHours)} heures estimées
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {renderTags(task.tags)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Navigation de pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>Lignes par page</span>
            <Select value={rowsPerPage.toString()} onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setCurrentPage(1); // Retour à la première page lors du changement de lignes par page
            }}>
              <SelectTrigger className="w-16">
                <SelectValue>{rowsPerPage}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} sur {totalPages || 1}
            </span>
            <div className="flex items-center space-x-1 ml-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-4 flex flex-wrap justify-between text-sm text-muted-foreground">
          <div>{filteredTasks.length} tâche(s) trouvée(s)</div>
          <div>Total heures estimées: {filteredTasks.reduce((sum, task) => sum + Number(task.estimatedHours), 0)}</div>
        </div>
      </div>
    </Layout>
  );
}