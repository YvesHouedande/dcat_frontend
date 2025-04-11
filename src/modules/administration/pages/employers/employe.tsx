import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  UserPlus,
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";

interface EmployeProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  status: "actif" | "absent" | "depart";
  initials: string;
}

interface DemandesInterface {
  id: string | number;
  name: string;
}

const ModernProfileGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Données d'exemple pour les profils
  const profiles: EmployeProfile[] = [
    {
      id: "1",
      name: "Thomas Dubois",
      role: "Développeur Frontend",
      department: "Technologie",
      status: "actif",
      initials: "TD",
    },
    {
      id: "2",
      name: "Marie Laurent",
      role: "Chef de Projet",
      department: "Gestion",
      status: "actif",
      initials: "ML",
    },
    {
      id: "3",
      name: "Alexandre Moreau",
      role: "Designer UX/UI",
      department: "Création",
      status: "absent",
      initials: "AM",
    },
    {
      id: "4",
      name: "Sophie Lefebvre",
      role: "Développeur Backend",
      department: "Technologie",
      status: "depart",
      initials: "SL",
    },
    {
      id: "5",
      name: "Lucas Bernard",
      role: "Ingénieur DevOps",
      department: "Infrastructure",
      status: "actif",
      initials: "LB",
    },
    {
      id: "6",
      name: "Emma Petit",
      role: "Responsable Marketing",
      department: "Marketing",
      status: "absent",
      initials: "EP",
    },
    {
      id: "7",
      name: "Julien Roux",
      role: "Analyste de Données",
      department: "Analytique",
      status: "actif",
      initials: "JR",
    },
    {
      id: "8",
      name: "Camille Dupont",
      role: "Responsable RH",
      department: "Ressources Humaines",
      status: "depart",
      initials: "CD",
    },
  ];

  // Donnée de demandes
  const demandes: DemandesInterface[] = [
    {
      id: "1",
      name: "En cours",
    },
    {
      id: "3",
      name: "Demande 3",
    },
    {
      id: "4",
      name: "Demande 4",
    },
    {
      id: "7",
      name: "Demande 3",
    },
    {
      id: "8",
      name: "Demande 4",
    },
  ];

  // Filtrage des profils basé sur la recherche
  const filteredProfiles = searchQuery
    ? profiles.filter(
        (profile) =>
          profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : profiles;

  const handleClick = () => {
    //   navigate(`/administration/employers/${id}`);
    navigate("/administration/employers/nouvel_employer");
  };

  const handleClickVoirProfile = (id: string) => {
    navigate(`/administration/employers/profil/${id}`);
  };
  const getStatusColor = (status: "actif" | "absent" | "depart") => {
    switch (status) {
      case "actif":
        return "bg-green-500";
      case "absent":
        return "bg-amber-500";
      case "depart":
        return "bg-gray-400";
    }
  };

  const getStatusLabel = (status: "actif" | "absent" | "depart") => {
    switch (status) {
      case "actif":
        return "Actif";
      case "absent":
        return "Absent";
      case "depart":
        return "Depart";
    }
  };

  const getAvatarColor = (id: string) => {
    const colors = [
      "bg-blue-500 text-white",
      "bg-indigo-500 text-white",
      "bg-purple-500 text-white",
      "bg-pink-500 text-white",
      "bg-red-500 text-white",
      "bg-orange-500 text-white",
      "bg-amber-500 text-white",
      "bg-teal-500 text-white",
    ];

    // Utiliser l'ID pour attribuer une couleur de manière cohérente
    const colorIndex = parseInt(id) % colors.length;
    return colors[colorIndex];
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header avec titre et actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Annuaire des employés
            </h1>
            <p className="text-gray-500">
              Consultez les profils et contactez les membres de l'équipe
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="text-gray-700 border-gray-300">
              <Filter size={16} className="mr-2" />
              Filtres
            </Button>
            <Button
              onClick={handleClick}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              <UserPlus size={16} className="mr-2" />
              Ajouter
            </Button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Rechercher par nom, rôle ou département..."
              className="pl-10 py-6 border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Grille de profils */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProfiles.map((profile) => (
            <Card
              key={profile.id}
              className="overflow-hidden hover:shadow-md transition-all duration-200 group"
            >
              <CardContent className="px-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Avatar
                      className={`h-12 w-12 ${getAvatarColor(profile.id)}`}
                    >
                      <AvatarFallback>{profile.initials}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <h3  onClick={() =>
                          handleClickVoirProfile(profile.id)
                        } className="font-semibold text-gray-800 cursor-pointer hover:underline">
                        {profile.name}
                      </h3>
                      <p className="text-sm text-gray-500">{profile.role}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${getStatusColor(
                        profile.status
                      )} absolute -top-1 -right-1`}
                    ></div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleClickVoirProfile(profile.id)}
                          className="cursor-pointer"
                        >
                          <Eye size={16} className="mr-2" />
                          Voir profil
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Mail size={16} className="mr-2" />
                          <Link to="mailto:contact@example.com">
                            Envoyer un email
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Phone size={16} className="mr-2" />
                          <Link to="tel:contact@example.com">Appeler</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Département</p>
                    <p className="text-sm">{profile.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Statut</p>
                    <Badge
                      className={`mt-1 font-normal ${
                        profile.status === "actif"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : profile.status === "absent"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {getStatusLabel(profile.status)}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-2">Demande</p>
                    <Badge
                      className={`mt-1 font-normal ${
                        profile.status === "actif"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : profile.status === "absent"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {getStatusLabel(profile.status)}
                    </Badge>
                  </div>
                </div>

                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </CardContent>
              <CardFooter className=" border-t flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 text-xs cursor-pointer"
                  onClick={() => handleClickVoirProfile(profile.id)}
                >
                  <Eye size={14} className="mr-1" />
                  Voir profil
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 text-xs"
                >
                  <Mail size={14} className="mr-1" />

                  <Link to="mailto:contact@example.com">Contacter</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredProfiles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600 mb-4">
              Aucun profil ne correspond à votre recherche
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Réinitialiser la recherche
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernProfileGrid;
