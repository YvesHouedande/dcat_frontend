// app/mission-display/page.tsx
import { useState } from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { initialMissions, Mission } from "../data/mockData";
import { Link } from "react-router-dom";
import { Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function MissionDisplay() {
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [priorityFilter, setPriorityFilter] = useState("tous");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // Filtrer les missions
  const filteredMissions = missions.filter(mission => {
    const matchesSearch = mission.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         mission.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.responsible.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "tous" || mission.status === statusFilter;
    const matchesPriority = priorityFilter === "tous" || mission.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination des tâches filtrées
  const totalPages = Math.ceil(filteredMissions.length / rowsPerPage);
  const paginatedMissions = filteredMissions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Navigation de pagination
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Changer le statut
  const handleStatusChange = (id: number, newStatus: Mission["status"]) => {
    setMissions(missions.map(mission => 
      mission.id === id ? { ...mission, status: newStatus } : mission
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

  const boutonAdd = () => {
    return (
      <div>
        <Button
          className="cursor-pointer transition ease-in-out duration-300 active:scale-95"
          variant={"outline"}
        >
          <Link className="flex items-center space-x-2" to={"mission"}>
            Ajouter une mission <Plus />
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <Layout autre={boutonAdd}>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Gestion des Missions</h1>
        
        {/* Barre de filtres */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Input
            placeholder="Rechercher..."
            className="w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue>Statut: {statusFilter}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous statuts</SelectItem>
              <SelectItem value="à faire">À faire</SelectItem>
              <SelectItem value="en cours">En cours</SelectItem>
              <SelectItem value="terminée">Terminée</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue>Priorité: {priorityFilter}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Toutes</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("tous");
              setPriorityFilter("tous");
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
                <TableHead>Projet</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>priorité</TableHead>
                <TableHead>statut</TableHead>
                <TableHead>début</TableHead>
                <TableHead>fin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMissions.map((mission) => (
                <TableRow key={mission.id}>
                  <TableCell className="font-medium">{mission.title}</TableCell>
                  <TableCell>{mission.project}</TableCell>
                  <TableCell>{mission.responsible}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      mission.priority === "high" ? "bg-red-100 text-red-800" :
                      mission.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {mission.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={mission.status}
                      onValueChange={(value: Mission["status"]) => handleStatusChange(mission.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue>{mission.status}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="à faire">À faire</SelectItem>
                        <SelectItem value="en cours">En cours</SelectItem>
                        <SelectItem value="terminée">Terminée</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{formatDate(mission.startTime)}</TableCell>
                  <TableCell>{formatDate(mission.endTime)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>Lignes par page</span>
            <Select value={rowsPerPage.toString()} onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setCurrentPage(1);
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
        <div className="mt-4 text-sm text-muted-foreground">
          {filteredMissions.length} mission(s) trouvée(s)
        </div>
      </div>
    </Layout>
  );
}