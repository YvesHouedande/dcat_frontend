import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Search,
  Plus,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/Layout";

// Type pour le statut d'approbation
type ApprobationStatus = "en attente" | "approuvé" | "rejeté" | "révisions requises";

// Interface pour un livrable
interface Livrable {
  id_livrable: number;
  libelle_livrable: string;
  date: string;
  approbation: ApprobationStatus;
  id_projet: number;
  projet_nom: string;
}

// Interface pour un projet
interface Projet {
  id: number;
  nom: string;
}

const LivrablesPage: React.FC = () => {
  const navigate = useNavigate();
  const [livrables, setLivrables] = useState<Livrable[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtres
  const [filters, setFilters] = useState({
    approbation: "" as ApprobationStatus | "",
    projet: "",
  });

  // Chargement des données
  useEffect(() => {
    const fetchLivrables = async () => {
      try {
        setLoading(true);
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simule un temps de chargement

        const mockData: Livrable[] = [
          {
            id_livrable: 1,
            libelle_livrable: "Rapport final",
            date: "2023-06-15",
            approbation: "approuvé",
            id_projet: 1,
            projet_nom: "Projet Alpha",
          },
          {
            id_livrable: 2,
            libelle_livrable: "Cahier des charges",
            date: "2023-05-20",
            approbation: "en attente",
            id_projet: 2,
            projet_nom: "Projet Beta",
          },
          {
            id_livrable: 3,
            libelle_livrable: "Maquettes UI",
            date: "2023-07-10",
            approbation: "révisions requises",
            id_projet: 1,
            projet_nom: "Projet Alpha",
          },
          {
            id_livrable: 4,
            libelle_livrable: "Documentation technique",
            date: "2023-08-05",
            approbation: "rejeté",
            id_projet: 3,
            projet_nom: "Projet Gamma",
          },
        ];

        setLivrables(mockData);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors du chargement des livrables");
      } finally {
        setLoading(false);
      }
    };

    fetchLivrables();
  }, []);

  // Liste des projets pour le filtre
  const projets: Projet[] = [
    { id: 1, nom: "Projet Alpha" },
    { id: 2, nom: "Projet Beta" },
    { id: 3, nom: "Projet Gamma" },
  ];

  // Filtrage et recherche
  const filteredLivrables = livrables.filter((livrable) => {
    const matchesSearch =
      livrable.libelle_livrable.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livrable.projet_nom.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesApproval = filters.approbation
      ? livrable.approbation === filters.approbation
      : true;

    const matchesProject = filters.projet
      ? livrable.id_projet.toString() === filters.projet
      : true;

    return matchesSearch && matchesApproval && matchesProject;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredLivrables.length / itemsPerPage));
  const paginatedLivrables = filteredLivrables.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Réinitialiser la page courante si elle devient invalide après filtrage
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Suppression d'un livrable
  const handleDelete = async (id: number) => {
    try {
      // Simulation de suppression
      await new Promise(resolve => setTimeout(resolve, 500)); // Simule un temps de requête
      setLivrables(livrables.filter((livrable) => livrable.id_livrable !== id));
      toast.success("Livrable supprimé avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  // Obtenir le variant du badge en fonction du statut
  const getBadgeVariant = (status: ApprobationStatus) => {
    switch (status) {
      case "approuvé":
        return "success";
      case "rejeté":
        return "destructive";
      case "révisions requises":
        return "secondary"; // or another valid variant if "secondary" is not appropriate
      default:
        return "secondary"; // or another valid variant
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <CardTitle className="text-2xl">Gestion des Livrables</CardTitle>
              <Button
                onClick={() => navigate("/technique/livrable/nouveau")}
                className="w-full md:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Livrable
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Barre de recherche et filtres */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou projet..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
                  }}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Statut</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilters({...filters, approbation: ""})}>
                      Tous les statuts
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters({...filters, approbation: "en attente"})}>
                      En attente
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters({...filters, approbation: "approuvé"})}>
                      Approuvé
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters({...filters, approbation: "rejeté"})}>
                      Rejeté
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters({...filters, approbation: "révisions requises"})}>
                      Révisions requises
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Projet</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilters({...filters, projet: ""})}>
                      Tous les projets
                    </DropdownMenuItem>
                    {projets.map((projet) => (
                      <DropdownMenuItem
                        key={projet.id}
                        onClick={() => {
                          setFilters({...filters, projet: projet.id.toString()});
                          setCurrentPage(1);
                        }}
                      >
                        {projet.nom}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Tableau des livrables */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Libellé</TableHead>
                    <TableHead className="min-w-[150px]">Projet</TableHead>
                    <TableHead className="min-w-[120px]">Date</TableHead>
                    <TableHead className="min-w-[150px]">Statut</TableHead>
                    <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    // Squelette de chargement
                    Array.from({ length: itemsPerPage }).map((_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : paginatedLivrables.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Aucun livrable trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedLivrables.map((livrable) => (
                      <TableRow key={livrable.id_livrable}>
                        <TableCell className="font-medium">
                          {livrable.libelle_livrable}
                        </TableCell>
                        <TableCell>{livrable.projet_nom}</TableCell>
                        <TableCell>
                          {format(new Date(livrable.date), "dd MMM yyyy", {
                            locale: fr,
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getBadgeVariant(livrable.approbation)}>
                            {livrable.approbation}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/technique/livrable/${livrable.id_livrable}/details`)
                                }
                              >
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/technique/livrable/${livrable.id_livrable}/editer`)
                                }
                              >
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(livrable.id_livrable)}
                              >
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {!loading && filteredLivrables.length > 0 && (
              <div className="flex items-center justify-between px-2 py-4">
                <div className="text-sm text-muted-foreground">
                  {filteredLivrables.length} résultat{filteredLivrables.length > 1 ? 's' : ''}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LivrablesPage;
