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
import { Employe } from "../../types/interfaces";
import { getJobFunction} from "./UserProfile"

// Example data for profiles
export const profiles: Employe[] = [
  
    {
      "id_employe": 1,
      "nom_employes": "Coulibaly",
      "prenom_employes": "Torna",
      "email_employes": "torna.coulibaly@dcat.ci",
      "contact_employes": "0612345678",
      "adresse_employes": "Cocody",
      "status": "actif",
      "date_embauche_employes": "2020-01-15",
      "date_de_naissance": "1990-05-20",
      "contrats": "CDI",
      "id_fonction": 6
    },
    {
      "id_employe": 2,
      "nom_employes": "Diakité",
      "prenom_employes": "Cheick",
      "email_employes": "cheick.diakite@dcat.ci",
      "contact_employes": "0623456789",
      "adresse_employes": "cocody",
      "status": "actif",
      "date_embauche_employes": "2019-03-22",
      "date_de_naissance": "1988-11-10",
      "contrats": "CDI",
      "id_fonction": 3
    },
    {
      "id_employe": 3,
      "nom_employes": "Soro",
      "prenom_employes": "Samuel",
      "email_employes": "samuel.soro@dcat.ci",
      "contact_employes": "0634567890",
      "adresse_employes": "cocody",
      "status": "actif",
      "date_embauche_employes": "2021-06-10",
      "date_de_naissance": "1992-08-14",
      "contrats": "CDI",
      "id_fonction": 1
    },
    {
      "id_employe": 4,
      "nom_employes": "Adete",
      "prenom_employes": "Luc",
      "email_employes": "luc.adete@dcat.ci",
      "contact_employes": "0645678901",
      "adresse_employes": "yopougon",
      "status": "actif",
      "date_embauche_employes": "2022-01-05",
      "date_de_naissance": "1994-03-12",
      "contrats": "CDD",
      "id_fonction": 1
    },
    {
      "id_employe": 5,
      "nom_employes": "Yao",
      "prenom_employes": "Emmanuel",
      "email_employes": "emmanuel.yao@dcat.ci",
      "contact_employes": "0656789012",
      "adresse_employes": "Cocody",
      "status": "actif",
      "date_embauche_employes": "2020-09-15",
      "date_de_naissance": "1989-07-22",
      "contrats": "CDI",
      "id_fonction": 1
    },
    {
      "id_employe": 6,
      "nom_employes": "Houedande",
      "prenom_employes": "Yves",
      "email_employes": "yves.houedande@dcat.ci",
      "contact_employes": "0667890123",
      "adresse_employes": "Abobo",
      "status": "actif",
      "date_embauche_employes": "2018-11-30",
      "date_de_naissance": "1991-02-08",
      "contrats": "CDI",
      "id_fonction": 1
    },
    {
      "id_employe": 7,
      "nom_employes": "Traore",
      "prenom_employes": "Hamidou",
      "email_employes": "hamidou.traore@dcat.ci",
      "contact_employes": "0678901234",
      "adresse_employes": "Port-Bouët",
      "status": "actif",
      "date_embauche_employes": "2023-02-17",
      "date_de_naissance": "1993-12-25",
      "contrats": "CDD",
      "id_fonction": 2
    },
    {
      "id_employe": 8,
      "nom_employes": "Karidioula",
      "prenom_employes": "Salomon",
      "email_employes": "salomon.karidioula@dcat.ci",
      "contact_employes": "0689012345",
      "adresse_employes": "Cocody",
      "status": "actif",
      "date_embauche_employes": "2017-05-03",
      "date_de_naissance": "1987-04-19",
      "contrats": "CDI",
      "id_fonction": 2
    },
    {
      "id_employe": 9,
      "nom_employes": "N'guessan",
      "prenom_employes": "Axel",
      "email_employes": "axel.n'guessan@dcat.ci",
      "contact_employes": "0690123456",
      "adresse_employes": "Cocody",
      "status": "actif",
      "date_embauche_employes": "2021-10-12",
      "date_de_naissance": "1995-06-30",
      "contrats": "CDI",
      "id_fonction": 1
    },
    {
      "id_employe": 10,
      "nom_employes": "Messou",
      "prenom_employes": "Jacques",
      "email_employes": "jacques.messou@dcat.ci",
      "contact_employes": "0601234567",
      "adresse_employes": "Yopougon",
      "status": "actif",
      "date_embauche_employes": "2020-04-28",
      "date_de_naissance": "1986-09-17",
      "contrats": "CDD",
      "id_fonction": 1
    }
  
  
];

export const profilesList = profiles;


const ModernProfileGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Filter profiles based on search query
  const filteredProfiles = searchQuery
    ? profiles.filter(
        (profile) =>
          profile.nom_employes.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.prenom_employes.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.email_employes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.adresse_employes?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : profiles;

  const handleClick = () => {
    navigate("/administration/employers/nouvel_employer");
  };

  const handleClickVoirProfile = (id_employe: number) => {
    navigate(`/administration/employers/profil/${id_employe}`);
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
        return "Départ";
    }
  };

  const getAvatarColor = (id_employe: number) => {
    const colors = [
      "bg-blue-500 text-dark",
      "bg-indigo-500 text-dark",
      "bg-purple-500 text-dark",
      "bg-pink-500 text-dark",
      "bg-red-500 text-dark",
      "bg-orange-500 text-dark",
      "bg-amber-500 text-dark",
      "bg-teal-500 text-dark",
    ];

    const colorIndex = id_employe % colors.length;
    return colors[colorIndex];
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with title and actions */}
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

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Rechercher par nom, prénom, email ou adresse..."
              className="pl-10 py-6 border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Profile grid - Modified to fix card dimensions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProfiles.map((profile) => (
            <Card
              key={profile.id_employe}
              className="overflow-hidden hover:shadow-md transition-all duration-200 group flex flex-col h-full"
            >
              <CardContent className="px-5 py-4 flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <Avatar
                      className={`h-10 w-10 ${getAvatarColor(profile.id_employe)}`}
                    >
                      <AvatarFallback>
                        {profile.nom_employes.charAt(0) + profile.prenom_employes.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 max-w-full overflow-hidden">
                      <h3
                        onClick={() => handleClickVoirProfile(profile.id_employe)}
                        className="font-semibold text-gray-800 cursor-pointer hover:underline truncate max-w-full"
                        title={`${profile.nom_employes} ${profile.prenom_employes}`}
                      >
                        {profile.nom_employes} {profile.prenom_employes}
                      </h3>
                      <p className="text-xs text-gray-500 truncate max-w-full" title={profile.email_employes}>
                        {profile.email_employes}
                      </p>
                    </div>
                  </div>
                  <div className="relative flex-shrink-0 ml-2">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${getStatusColor(
                        profile.status || "actif"
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
                          onClick={() => handleClickVoirProfile(profile.id_employe)}
                          className="cursor-pointer"
                        >
                          <Eye size={16} className="mr-2" />
                          Voir profil
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Mail size={16} className="mr-2" />
                          <Link to={`mailto:${profile.email_employes}`}>
                            Envoyer un email
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Phone size={16} className="mr-2" />
                          <Link to={`tel:${profile.contact_employes}`}>Appeler</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Adresse</p>
                    <p className="text-sm truncate" title={profile.adresse_employes}>
                      {profile.adresse_employes}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Statut</p>
                    <Badge
                      className={`mt-1 font-normal ${
                        profile.status === "actif"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : profile.status === "absent"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {getStatusLabel(profile.status || "actif")}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Poste</p>
                    <p className="text-sm truncate" title={getJobFunction(profile.id_fonction)}>
                      {getJobFunction(profile.id_fonction)}
                    </p>
                  </div>
                </div>

                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </CardContent>
              <CardFooter className="border-t px-5 py-3 mt-auto">
                <div className="flex justify-between w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 text-xs p-1 h-8"
                    onClick={() => handleClickVoirProfile(profile.id_employe)}
                  >
                    <Eye size={14} className="mr-1" />
                    Voir profil
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 text-xs p-1 h-8"
                  >
                    <Mail size={14} className="mr-1" />
                    <Link to={`mailto:${profile.email_employes}`}>Contacter</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Message if no results */}
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
