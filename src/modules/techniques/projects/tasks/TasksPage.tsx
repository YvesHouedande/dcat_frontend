import React, { useState } from "react";
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
import { MoreVertical, Search, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";


export interface Tache {
  id_tache: number;
  nom_tache: string;
  desc_tache: string;
  statut: "à faire" | "en cours" | "en revue" | "terminé" | "bloqué";
  date_debut: string;
  date_fin: string;
  priorite: "faible" | "moyenne" | "haute";
  id_projet: number;
  nom_projet: string;
  assigne_a: string;
}

export interface Projet {
  id_projet: number;
  nom_projet: string;
  description: string;
  date_debut: string;
  date_fin: string;
}

const ProjetsTachesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("tous");
  const [priorityFilter, setPriorityFilter] = useState<string>("tous");
  const [projectFilter, setProjectFilter] = useState<string>("tous");

  // Données mockées
  const projets: Projet[] = [
    {
      id_projet: 1,
      nom_projet: "Site E-commerce",
      description: "Développement d'une plateforme de vente en ligne",
      date_debut: "2023-01-15",
      date_fin: "2023-06-30",
    },
    {
      id_projet: 2,
      nom_projet: "Application Mobile",
      description: "Création d'une appli de gestion de tâches",
      date_debut: "2023-03-01",
      date_fin: "2023-08-15",
    },
  ];

  const taches: Tache[] = [
    {
      id_tache: 1,
      nom_tache: "Conception UI",
      desc_tache: "Maquettes des pages principales",
      statut: "terminé",
      date_debut: "2023-01-20",
      date_fin: "2023-02-10",
      priorite: "haute",
      id_projet: 1,
      nom_projet: "Site E-commerce",
      assigne_a: "Jean Dupont",
    },
    {
      id_tache: 2,
      nom_tache: "API Produits",
      desc_tache: "Développement des endpoints produits",
      statut: "en cours",
      date_debut: "2023-02-15",
      date_fin: "2023-03-20",
      priorite: "haute",
      id_projet: 1,
      nom_projet: "Site E-commerce",
      assigne_a: "Marie Martin",
    },
    {
      id_tache: 3,
      nom_tache: "Authentification",
      desc_tache: "Système de connexion utilisateur",
      statut: "à faire",
      date_debut: "2023-03-05",
      date_fin: "2023-04-15",
      priorite: "moyenne",
      id_projet: 2,
      nom_projet: "Application Mobile",
      assigne_a: "Pierre Lambert",
    },
  ];

  // Filtrer les tâches
  const filteredTaches = taches.filter((tache) => {
    const matchesSearch = tache.nom_tache.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tache.desc_tache.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tache.nom_projet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tache.assigne_a.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "tous" || tache.statut === statusFilter;
    const matchesPriority = priorityFilter === "tous" || tache.priorite === priorityFilter;
    const matchesProject = projectFilter === "tous" || tache.id_projet.toString() === projectFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  // Gérer la suppression
  const handleDelete = (id: number) => {
    // Ici vous implémenteriez la logique de suppression réelle
    console.log(`Suppression de la tâche ${id}`);
    // Dans une vraie app, vous feriez un appel API puis rafraîchiriez les données
  };

  // Obtenir la classe de couleur en fonction du statut
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "terminé":
        return "bg-green-100 text-green-800";
      case "en cours":
        return "bg-blue-100 text-blue-800";
      case "à faire":
        return "bg-gray-100 text-gray-800";
      case "en revue":
        return "bg-purple-100 text-purple-800";
      case "bloqué":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Obtenir la classe de couleur en fonction de la priorité
  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case "haute":
        return "bg-red-100 text-red-800";
      case "moyenne":
        return "bg-yellow-100 text-yellow-800";
      case "faible":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestion des Projets et Tâches</h1>
          <Button onClick={() => navigate("/technique/taches/nouvelle")}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Tâche
          </Button>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tâches Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taches.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tâches en Cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {taches.filter(t => t.statut === "en cours").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Projets Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projets.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher tâches, projets, assignés..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous statuts</SelectItem>
                    <SelectItem value="à faire">À faire</SelectItem>
                    <SelectItem value="en cours">En cours</SelectItem>
                    <SelectItem value="en revue">En revue</SelectItem>
                    <SelectItem value="terminé">Terminé</SelectItem>
                    <SelectItem value="bloqué">Bloqué</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Toutes priorités</SelectItem>
                    <SelectItem value="haute">Haute</SelectItem>
                    <SelectItem value="moyenne">Moyenne</SelectItem>
                    <SelectItem value="faible">Faible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Projet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous projets</SelectItem>
                    {projets.map((projet) => (
                      <SelectItem key={projet.id_projet} value={projet.id_projet.toString()}>
                        {projet.nom_projet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des tâches */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tâche</TableHead>
                <TableHead>Projet</TableHead>
                <TableHead>Assigné à</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Date de fin</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTaches.length > 0 ? (
                filteredTaches.map((tache) => (
                  <TableRow key={tache.id_tache}>
                    <TableCell className="font-medium">{tache.nom_tache}</TableCell>
                    <TableCell>{tache.nom_projet}</TableCell>
                    <TableCell>{tache.assigne_a}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(tache.statut)}>
                        {tache.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(tache.priorite)}>
                        {tache.priorite}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(tache.date_fin).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/technique/taches/details/${tache.id_tache}`)}
                          >
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/technique/taches/edit/${tache.id_tache}`)}
                          >
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(tache.id_tache)}
                          >
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Aucune tâche trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </Layout>
  );
};

export default ProjetsTachesPage;





