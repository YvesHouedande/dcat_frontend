// app/project-display/page.tsx
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
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout";
import { 
  initialProjects, 
  typeProjetOptions, 
  etatProjetOptions, 
  partenaireOptions 
} from "../data/mockData";
import { CalendarIcon, BarChart3, Users } from "lucide-react";

export default function ProjectDisplay() {
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("tous");
  const [etatFilter, setEtatFilter] = useState("tous");
  const [partenaireFilter, setPartenaireFilter] = useState("tous");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // Filtrer les projets
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "tous" || project.type === typeFilter;
    const matchesEtat = etatFilter === "tous" || project.etat === etatFilter;
    const matchesPartenaire = partenaireFilter === "tous" || project.partenaire === partenaireFilter;
    
    return matchesSearch && matchesType && matchesEtat && matchesPartenaire;
  });

  // Pagination des tâches filtrées
  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Navigation de pagination
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Changer l'état
  const handleStatusChange = (id: number, newStatus: string) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, etat: newStatus } : project
    ));
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Obtenir le label et la couleur pour l'état
  const getStatusInfo = (status: string) => {
    const statusInfo = etatProjetOptions.find(option => option.value === status);
    return statusInfo || { value: status, label: status, color: "bg-gray-100 text-gray-800" };
  };

  // Obtenir le label pour un type
  const getTypeLabel = (type: string) => {
    const typeInfo = typeProjetOptions.find(option => option.value === type);
    return typeInfo ? typeInfo.label : type;
  };

  // Obtenir le label pour un partenaire
  const getPartenaireLabel = (partenaire: string) => {
    const partenaireInfo = partenaireOptions.find(option => option.value === partenaire);
    return partenaireInfo ? partenaireInfo.label : partenaire;
  };

  // Calculer des statistiques
  const totalDevis = filteredProjects.reduce((sum, project) => sum + project.devis, 0);
  const projetsByType = typeProjetOptions.map(type => ({
    ...type,
    count: filteredProjects.filter(p => p.type === type.value).length
  }));
  const projetsByEtat = etatProjetOptions.map(etat => ({
    ...etat,
    count: filteredProjects.filter(p => p.etat === etat.value).length
  }));

  const boutonAdd = () => {
        return (
            <div>
                <Button
                    className="cursor-pointer transition ease-in-out duration-300 active:scale-95"
                    variant={"outline"}
                >
                    <Link className="flex items-center space-x-2" to={"projet"}>
                    Création de projet <Plus />
                    </Link>
                </Button>
            </div>
        );
    };

  return (
    <Layout autre={boutonAdd}>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Gestion des Projets</h1>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projets</p>
                <h3 className="text-2xl font-bold">{filteredProjects.length}</h3>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Total</p>
                <h3 className="text-2xl font-bold">{totalDevis.toLocaleString('fr-FR')} €</h3>
              </div>
              <CalendarIcon className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Projets en cours</p>
                <h3 className="text-2xl font-bold">
                  {filteredProjects.filter(p => p.etat === "en_cours").length}
                </h3>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </CardContent>
          </Card>
        </div>
        
        {/* Barre de filtres */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Input
            placeholder="Rechercher..."
            className="w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue>Type: {typeFilter === "tous" ? "Tous" : getTypeLabel(typeFilter)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous types</SelectItem>
              {typeProjetOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={etatFilter} onValueChange={setEtatFilter}>
            <SelectTrigger className="w-40">
              <SelectValue>État: {etatFilter === "tous" ? "Tous" : 
                etatProjetOptions.find(o => o.value === etatFilter)?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous états</SelectItem>
              {etatProjetOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={partenaireFilter} onValueChange={setPartenaireFilter}>
            <SelectTrigger className="w-40">
              <SelectValue>Partenaire: {partenaireFilter === "tous" ? "Tous" : 
                partenaireOptions.find(o => o.value === partenaireFilter)?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous partenaires</SelectItem>
              {partenaireOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("tous");
              setEtatFilter("tous");
              setPartenaireFilter("tous");
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
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Partenaire</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Devis</TableHead>
                <TableHead>État</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div>{project.nom}</div>
                    <div className="text-xs text-muted-foreground mt-1 max-w-md truncate">
                      {project.description}
                    </div>
                  </TableCell>
                  <TableCell>{getTypeLabel(project.type)}</TableCell>
                  <TableCell>{getPartenaireLabel(project.partenaire)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Début: {formatDate(project.dateDebut)}</span>
                      <span className="text-xs text-muted-foreground">Fin: {formatDate(project.dateFin)}</span>
                      <span className="text-xs font-medium mt-1">{project.duree}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{project.devis.toLocaleString('fr-FR')} €</div>
                    <Progress 
                      value={project.etat === "termine" ? 100 : project.etat === "en_cours" ? 50 : 20}
                      className="h-2 mt-2"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={project.etat}
                      onValueChange={(value) => handleStatusChange(project.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(project.etat).color}`}>
                          {getStatusInfo(project.etat).label}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {etatProjetOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Projets par type</h3>
              <div className="space-y-4">
                {projetsByType.map(type => (
                  <div key={type.value} className="flex items-center">
                    <span className="w-32">{type.label}</span>
                    <div className="flex-1 mx-2">
                      <Progress value={(type.count / Math.max(1, filteredProjects.length)) * 100} className="h-2" />
                    </div>
                    <span className="w-8 text-right">{type.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Projets par état</h3>
              <div className="space-y-4">
                {projetsByEtat.map(etat => (
                  <div key={etat.value} className="flex items-center">
                    <span className="w-32">{etat.label}</span>
                    <div className="flex-1 mx-2">
                      <Progress 
                        value={(etat.count / Math.max(1, filteredProjects.length)) * 100} 
                        className="h-2" 
                      />
                    </div>
                    <span className="w-8 text-right">{etat.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}