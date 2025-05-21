import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  ArrowUpDown,
  BarChart3,
  CheckCircle,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Layout from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Projet } from "../types/types";

// Export mockProjets
export const mockProjets: Projet[] = [
  {
    "id_projet": 1,
    "nom_projet": "Installation vidéosurveillance bureau",
    "type_projet": "Sécurité",
    "devis_estimatif": 1200000,
    "date_debut": "2024-01-10",
    "date_fin": "2024-03-15",
    "duree_prevu_projet": "2",
    "description_projet": "Installation d'un système de vidéosurveillance pour un bureau à Abidjan",
    "etat": "en cours",
    "lieu": "Abidjan",
    "id_employe": 3,
    "site": "Siège client",
    "id_famille": 1
  },
  {
    "id_projet": 2,
    "nom_projet": "Domotisation maison résidentielle",
    "type_projet": "Domotique",
    "devis_estimatif": 950000,
    "date_debut": "2023-11-01",
    "date_fin": "2024-01-30",
    "duree_prevu_projet": "3",
    "description_projet": "Automatisation de l'éclairage et sécurité d'une résidence",
    "etat": "terminé",
    "lieu": "Cocody",
    "id_employe": 4,
    "site": "Maison client",
    "id_famille": 2
  },
  {
    "id_projet": 3,
    "nom_projet": "Mise en place contrôle d'accès",
    "type_projet": "Sécurité",
    "devis_estimatif": 400000,
    "date_debut": "2024-02-01",
    "date_fin": "2024-03-01",
    "duree_prevu_projet": "1",
    "description_projet": "Installation de badge d'accès au bâtiment",
    "etat": "planifié",
    "lieu": "Yopougon",
    "id_employe": 5,
    "site": "Usine locale",
    "id_famille": 1
  },
  {
    "id_projet": 4,
    "nom_projet": "Audit sécurité entreprise",
    "type_projet": "Audit",
    "devis_estimatif": 300000,
    "date_debut": "2024-01-15",
    "date_fin": "2024-02-15",
    "duree_prevu_projet": "1",
    "description_projet": "Évaluation des systèmes de sécurité existants",
    "etat": "en cours",
    "lieu": "Treichville",
    "id_employe": 1,
    "site": "Bâtiment administratif",
    "id_famille": 3
  },
  {
    "id_projet": 5,
    "nom_projet": "Rénovation domotique villa",
    "type_projet": "Domotique",
    "devis_estimatif": 105000,
    "date_debut": "2024-03-01",
    "date_fin": "2024-05-15",
    "duree_prevu_projet": "2.5",
    "description_projet": "Ajout de volets roulants automatiques et contrôle centralisé",
    "etat": "planifié",
    "lieu": "Riviera",
    "id_employe": 2,
    "site": "Villa privée",
    "id_famille": 2
  },
  {
    "id_projet": 6,
    "nom_projet": "Installation alarme intrusion",
    "type_projet": "Sécurité",
    "devis_estimatif": 60000,
    "date_debut": "2024-01-10",
    "date_fin": "2024-01-25",
    "duree_prevu_projet": "0.5",
    "description_projet": "Système d’alarme et capteurs de mouvement",
    "etat": "terminé",
    "lieu": "Marcory",
    "id_employe": 6,
    "site": "Boutique client",
    "id_famille": 1
  },
  {
    "id_projet": 7,
    "nom_projet": "Câblage réseau intelligent",
    "type_projet": "Informatique",
    "devis_estimatif": 80000,
    "date_debut": "2023-12-01",
    "date_fin": "2024-02-01",
    "duree_prevu_projet": "2",
    "description_projet": "Infrastructure réseau pour un immeuble de bureaux",
    "etat": "en cours",
    "lieu": "Plateau",
    "id_employe": 7,
    "site": "Immeuble Kourouma",
    "id_famille": 3
  },
  {
    "id_projet": 8,
    "nom_projet": "Vidéo interphone immeuble",
    "type_projet": "Sécurité",
    "devis_estimatif": 4200000,
    "date_debut": "2024-03-01",
    "date_fin": "2024-04-01",
    "duree_prevu_projet": "1",
    "description_projet": "Installation de systèmes vidéo-interphonie dans un immeuble",
    "etat": "planifié",
    "lieu": "Angré",
    "id_employe": 3,
    "site": "Résidence Cocody Luxe",
    "id_famille": 2
  },
  {
    "id_projet": 9,
    "nom_projet": "Installation réseau caméra IP",
    "type_projet": "Sécurité",
    "devis_estimatif": 6700000,
    "date_debut": "2024-02-20",
    "date_fin": "2024-03-30",
    "duree_prevu_projet": "1.5",
    "description_projet": "Installation de caméras IP extérieures et intérieures",
    "etat": "en cours",
    "lieu": "Abobo",
    "id_employe": 8,
    "site": "Hôpital public",
    "id_famille": 1
  },
  {
    "id_projet": 10,
    "nom_projet": "Réseau intelligent pour hôtel",
    "type_projet": "Domotique",
    "devis_estimatif": 15000000,
    "date_debut": "2024-04-01",
    "date_fin": "2024-07-01",
    "duree_prevu_projet": "3",
    "description_projet": "Contrôle centralisé de l’éclairage, climatisation et sécurité",
    "etat": "planifié",
    "lieu": "Grand-Bassam",
    "id_employe": 9,
    "site": "Hôtel Étoile",
    "id_famille": 3
  },
  {
    "id_projet": 11,
    "nom_projet": "Sécurisation entrepôt logistique",
    "type_projet": "Sécurité",
    "devis_estimatif": 130000,
    "date_debut": "2024-05-01",
    "date_fin": "2024-06-15",
    "duree_prevu_projet": "1.5",
    "description_projet": "Caméras thermiques, alarmes et capteurs de mouvement pour entrepôt",
    "etat": "planifié",
    "lieu": "Port-Bouët",
    "id_employe": 5,
    "site": "Zone industrielle",
    "id_famille": 1
  },
  {
    "id_projet": 12,
    "nom_projet": "Installation domotique résidence diplomatique",
    "type_projet": "Domotique",
    "devis_estimatif": 20000000,
    "date_debut": "2024-03-15",
    "date_fin": "2024-06-15",
    "duree_prevu_projet": "3",
    "description_projet": "Gestion centralisée de la maison (lumière, climatisation, sécurité)",
    "etat": "en cours",
    "lieu": "Bingerville",
    "id_employe": 6,
    "site": "Résidence diplomatique",
    "id_famille": 2
  },
  {
    "id_projet": 13,
    "nom_projet": "Mise en place système anti-incendie",
    "type_projet": "Sécurité",
    "devis_estimatif": 8500000,
    "date_debut": "2024-01-05",
    "date_fin": "2024-02-05",
    "duree_prevu_projet": "1",
    "description_projet": "Détection incendie et déclenchement automatique d'extincteurs",
    "etat": "terminé",
    "lieu": "Adjamé",
    "id_employe": 7,
    "site": "Magasin gros",
    "id_famille": 1
  },
  {
    "id_projet": 14,
    "nom_projet": "Contrôle d'accès campus universitaire",
    "type_projet": "Sécurité",
    "devis_estimatif": 170000,
    "date_debut": "2024-04-10",
    "date_fin": "2024-07-10",
    "duree_prevu_projet": "3",
    "description_projet": "Badges étudiants et contrôle des portails principaux",
    "etat": "planifié",
    "lieu": "Abidjan",
    "id_employe": 3,
    "site": "Université Côte d'Ivoire",
    "id_famille": 3
  },
  {
    "id_projet": 15,
    "nom_projet": "Modernisation système sécurité ambassade",
    "type_projet": "Sécurité",
    "devis_estimatif": 250000,
    "date_debut": "2024-02-01",
    "date_fin": "2024-05-01",
    "duree_prevu_projet": "3",
    "description_projet": "Systèmes de vidéosurveillance avancés et détection biométrique",
    "etat": "en cours",
    "lieu": "Plateau",
    "id_employe": 8,
    "site": "Ambassade Étrangère",
    "id_famille": 1
  },
  {
    "id_projet": 16,
    "nom_projet": "Installation réseau fibre entreprise",
    "type_projet": "Informatique",
    "devis_estimatif": 60000,
    "date_debut": "2024-01-20",
    "date_fin": "2024-02-20",
    "duree_prevu_projet": "1",
    "description_projet": "Connexion fibre optique et points d'accès internes",
    "etat": "terminé",
    "lieu": "Zone 4",
    "id_employe": 9,
    "site": "Entreprise tech",
    "id_famille": 3
  },
  {
    "id_projet": 17,
    "nom_projet": "Rénovation réseau informatique mairie",
    "type_projet": "Informatique",
    "devis_estimatif": 7500000,
    "date_debut": "2024-03-10",
    "date_fin": "2024-04-25",
    "duree_prevu_projet": "1.5",
    "description_projet": "Câblage, onduleurs, bornes wifi et serveurs locaux",
    "etat": "en cours",
    "lieu": "Bouaké",
    "id_employe": 1,
    "site": "Hôtel de Ville",
    "id_famille": 3
  },
  {
    "id_projet": 18,
    "nom_projet": "Domotique immeuble haut standing",
    "type_projet": "Domotique",
    "devis_estimatif": 18000000,
    "date_debut": "2024-05-15",
    "date_fin": "2024-08-15",
    "duree_prevu_projet": "3",
    "description_projet": "Éclairage, stores automatiques et contrôle vocal dans 20 appartements",
    "etat": "planifié",
    "lieu": "Cocody Danga",
    "id_employe": 4,
    "site": "Résidence Le Prestige",
    "id_famille": 2
  },
  {
    "id_projet": 19,
    "nom_projet": "Déploiement alarmes périmétriques",
    "type_projet": "Sécurité",
    "devis_estimatif": 5400000,
    "date_debut": "2024-02-01",
    "date_fin": "2024-03-01",
    "duree_prevu_projet": "1",
    "description_projet": "Système d'alarme avec barrière infrarouge pour grande propriété",
    "etat": "terminé",
    "lieu": "Assinie",
    "id_employe": 2,
    "site": "Villa bord de mer",
    "id_famille": 1
  },
  {
    "id_projet": 20,
    "nom_projet": "Audit cybersécurité site web entreprise",
    "type_projet": "Audit",
    "devis_estimatif": 2800000,
    "date_debut": "2024-03-05",
    "date_fin": "2024-03-20",
    "duree_prevu_projet": "0.5",
    "description_projet": "Vérification des vulnérabilités et recommandations de sécurité",
    "etat": "terminé",
    "lieu": "En ligne",
    "id_employe": 10,
    "site": "Site web client",
    "id_famille": 3
  }
];

const ProjetsPage = () => {
  const navigate = useNavigate();
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEtat, setFilterEtat] = useState<string>("tous");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string>("nom_projet");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const projetsPerPage = 8;

  // Sample data - à remplacer par un appel API réel
  useEffect(() => {
    const fetchProjets = async () => {
      // Simulation de chargement
      setTimeout(() => {
        setProjets(mockProjets);
        setLoading(false);
      }, 1000);
    };

    fetchProjets();
  }, []);

  // Calcul des KPIs
  const kpis = {
    totalProjets: projets.length,
    totalBudget: projets.reduce((sum, p) => sum + p.devis_estimatif, 0),
    projetsPlanifies: projets.filter(p => p.etat === "planifié").length,
    projetsEnCours: projets.filter(p => p.etat === "en cours").length,
    projetsTermines: projets.filter(p => p.etat === "terminé").length,
    projetsAnnules: projets.filter(p => p.etat === "annulé").length,
    budgetPlanifie: projets
      .filter(p => p.etat === "planifié")
      .reduce((sum, p) => sum + p.devis_estimatif, 0),
    budgetEnCours: projets
      .filter(p => p.etat === "en cours")
      .reduce((sum, p) => sum + p.devis_estimatif, 0),
  };

  // Fonction de tri
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Si on clique sur la même colonne, on inverse l'ordre
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Sinon, on trie par la nouvelle colonne en ordre ascendant
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Filtrer les projets selon la recherche et les filtres
  const filteredProjets = projets.filter((projet) => {
    const matchesSearch =
      projet.nom_projet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.type_projet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.lieu.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEtat = filterEtat === "tous" || projet.etat === filterEtat;

    return matchesSearch && matchesEtat;
  });

  // Tri des projets
  const sortedProjets = [...filteredProjets].sort((a, b) => {
    if (sortColumn === "nom_projet") {
      return sortDirection === "asc"
        ? a.nom_projet.localeCompare(b.nom_projet)
        : b.nom_projet.localeCompare(a.nom_projet);
    } else if (sortColumn === "type_projet") {
      return sortDirection === "asc"
        ? a.type_projet.localeCompare(b.type_projet)
        : b.type_projet.localeCompare(a.type_projet);
    } else if (sortColumn === "devis_estimatif") {
      return sortDirection === "asc"
        ? a.devis_estimatif - b.devis_estimatif
        : b.devis_estimatif - a.devis_estimatif;
    } else if (sortColumn === "date_debut") {
      return sortDirection === "asc"
        ? new Date(a.date_debut).getTime() - new Date(b.date_debut).getTime()
        : new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime();
    } else if (sortColumn === "lieu") {
      return sortDirection === "asc"
        ? a.lieu.localeCompare(b.lieu)
        : b.lieu.localeCompare(a.lieu);
    }
    return 0;
  });

  // Pagination
  const indexOfLastProjet = currentPage * projetsPerPage;
  const indexOfFirstProjet = indexOfLastProjet - projetsPerPage;
  const currentProjets = sortedProjets.slice(indexOfFirstProjet, indexOfLastProjet);
  const totalPages = Math.ceil(sortedProjets.length / projetsPerPage);

  // Gestion du badge d'état
  const getEtatBadge = (etat: string) => {
    switch (etat) {
      case "planifié":
        return <Badge variant="secondary">Planifié</Badge>;
      case "en cours":
        return <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>;
      case "terminé":
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case "annulé":
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge>{etat}</Badge>;
    }
  };

  // Suppression d'un projet (simulée)
  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      setProjets(projets.filter(projet => projet.id_projet !== id));
    }
  };

  // Composant pour l'en-tête de colonne triable
  const SortableHeader = ({ column, title }: { column: string, title: string }) => (
    <TableHead>
      <div className="flex items-center cursor-pointer" onClick={() => handleSort(column)}>
        {title}
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </div>
    </TableHead>
  );

  return (
    <Layout>
      <div className="bg-gray-50 p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Projets</h1>
            <Button onClick={() => navigate("/technique/projets/nouveau")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouveau Projet
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Projets</p>
                  <h2 className="text-3xl font-bold">{kpis.totalProjets}</h2>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Budget Total</p>
                  <h2 className="text-3xl font-bold">{kpis.totalBudget.toLocaleString()} FCFA</h2>
                </div>
                <span className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-800 font-bold">F</span>
                </span>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Projets en cours</p>
                  <h2 className="text-3xl font-bold">{kpis.projetsEnCours}</h2>
                  <p className="text-xs text-gray-500">Budget: {kpis.budgetEnCours.toLocaleString()} FCFA</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Projets terminés</p>
                  <h2 className="text-3xl font-bold">{kpis.projetsTermines}</h2>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </CardContent>
            </Card>
          </div>

          {/* Tableau des projets avec filtres intégrés */}
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Barre de recherche intégrée au tableau */}
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher un projet..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="w-full md:w-48">
                      <Select onValueChange={setFilterEtat} value={filterEtat}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filtrer par état" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tous">Tous les états</SelectItem>
                          <SelectItem value="planifié">Planifié</SelectItem>
                          <SelectItem value="en cours">En cours</SelectItem>
                          <SelectItem value="terminé">Terminé</SelectItem>
                          <SelectItem value="annulé">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Nombre de résultats */}
                  <div className="flex items-center mb-2 text-sm text-gray-500">
                    <Filter className="h-4 w-4 mr-1" />
                    {sortedProjets.length} projet(s) trouvé(s)
                  </div>

                  {sortedProjets.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Aucun projet trouvé</p>
                      <Button
                        variant="ghost"
                        className="mt-4"
                        onClick={() => {
                          setSearchTerm("");
                          setFilterEtat("tous");
                        }}
                      >
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <SortableHeader column="nom_projet" title="Nom du Projet" />
                          <SortableHeader column="type_projet" title="Type" />
                          <SortableHeader column="devis_estimatif" title="Devis" />
                          <SortableHeader column="date_debut" title="Dates" />
                          <TableHead>
                            <div className="flex items-center">
                              État
                              <DropdownMenu>
                                <DropdownMenuTrigger className="ml-1">
                                  <Filter className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem onClick={() => setFilterEtat("tous")}>
                                    Tous
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setFilterEtat("planifié")}>
                                    Planifié
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setFilterEtat("en cours")}>
                                    En cours
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setFilterEtat("terminé")}>
                                    Terminé
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setFilterEtat("annulé")}>
                                    Annulé
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableHead>
                          <SortableHeader column="lieu" title="Lieu" />
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentProjets.map((projet) => (
                          <TableRow key={projet.id_projet}>
                            <TableCell className="font-medium">
                              {projet.nom_projet}
                            </TableCell>
                            <TableCell>{projet.type_projet}</TableCell>
                            <TableCell>{projet.devis_estimatif.toLocaleString()} FCFA</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>
                                  {format(new Date(projet.date_debut), "dd/MM/yy", { locale: fr })}
                                </span>
                                <span className="text-xs text-gray-500">
                                  au {format(new Date(projet.date_fin), "dd/MM/yy", { locale: fr })}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getEtatBadge(projet.etat)}
                            </TableCell>
                            <TableCell>{projet.lieu}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => navigate(`/technique/projets/${projet.id_projet}`)}
                                  title="Voir les détails"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => navigate(`/technique/projets/${projet.id_projet}/editer`)}
                                  title="Éditer"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(projet.id_projet)}
                                  title="Supprimer"
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-4 flex justify-between items-center">
                      <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Précédent
                      </Button>
                      <span className="text-sm text-gray-500">
                        Page {currentPage} sur {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Suivant
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProjetsPage;