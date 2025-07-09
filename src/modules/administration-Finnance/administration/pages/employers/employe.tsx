import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
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
import { fetchEmployes } from "../../../services/employeService";
import { fetchFonctionById } from "../../../services/fonctionService";

const ModernProfileGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobTitles, setJobTitles] = useState<Record<number, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadEmployes = async () => {
      try {
        const data = await fetchEmployes();
        setEmployes(data);
        
        // Charger les titres des postes pour chaque employé
        const titles: Record<number, string> = {};
        await Promise.all(
          data.map(async (employe) => {
            if (employe.id_fonction) {
              try {
                const fonctionData = await fetchFonctionById(employe.id_fonction);
                titles[employe.id_fonction] = fonctionData.nom_fonction;
              } catch {
                titles[employe.id_fonction] = "Non spécifié";
              }
            }
          })
        );
        setJobTitles(titles);
        
        setLoading(false);
      } catch {
        setError("Erreur lors du chargement des employés");
        setLoading(false);
      }
    };

    loadEmployes();
  }, []);

  // Filter profiles based on search query
  const filteredProfiles = searchQuery
    ? employes.filter(
        (profile) =>
          profile.nom_employes.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.prenom_employes.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.email_employes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.adresse_employes?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : employes;

  const handleClickVoirProfile = (id_employes: number) => {
    console.log("Navigation vers le profil - ID employé:", id_employes); // Debug log
    if (!id_employes || isNaN(id_employes)) {
      console.error("ID employé invalide pour la navigation:", id_employes);
      return;
    }
    const profileUrl = `/administration/employers/profil/${id_employes}`;
    console.log("URL de navigation:", profileUrl); // Debug log
    navigate(profileUrl);
  };

  const getStatusColor = (status_employes: string) => {
    switch (status_employes) {
      case "actif":
        return "bg-green-500";
      case "absent":
        return "bg-amber-500";
      case "depart":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusLabel = (status_employes: string) => {
    switch (status_employes) {
      case "actif":
        return "Actif";
      case "absent":
        return "Absent";
      case "depart":
        return "Départ";
      default:
        return "Non défini";
    }
  };

  const getAvatarColor = (id_employes: number) => {
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

    const colorIndex = id_employes % colors.length;
    return colors[colorIndex];
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
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

        {/* Profile grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProfiles.map((profile) => (
            <Card
              key={profile.id_employes}
              className="overflow-hidden hover:shadow-md transition-all duration-200 group flex flex-col h-full"
            >
              <CardContent className="px-5 py-4 flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <Avatar
                      className={`h-10 w-10 ${getAvatarColor(profile.id_employes)}`}
                    >
                      <AvatarFallback>
                        {profile.nom_employes.charAt(0) + profile.prenom_employes.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 max-w-full overflow-hidden">
                      <h3
                        onClick={() => handleClickVoirProfile(profile.id_employes)}
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
                        profile.status_employes
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
                          key={`view-${profile.id_employes}`}
                          onClick={() => handleClickVoirProfile(profile.id_employes)}
                          className="cursor-pointer"
                        >
                          <Eye size={16} className="mr-2" />
                          Voir profil
                        </DropdownMenuItem>
                        <DropdownMenuItem key={`email-${profile.id_employes}`} className="cursor-pointer">
                          <Mail size={16} className="mr-2" />
                          <Link to={`mailto:${profile.email_employes}`}>
                            Envoyer un email
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem key={`phone-${profile.id_employes}`} className="cursor-pointer">
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
                        profile.status_employes === "actif"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : profile.status_employes === "absent"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {getStatusLabel(profile.status_employes)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Poste</p>
                    <p className="text-sm truncate" title={jobTitles[profile.id_fonction] || "Non spécifié"}>
                      {jobTitles[profile.id_fonction] || "Non spécifié"}
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
                    onClick={() => handleClickVoirProfile(profile.id_employes)}
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
