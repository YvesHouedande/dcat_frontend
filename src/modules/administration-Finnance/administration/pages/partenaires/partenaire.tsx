import React, { useState, useEffect } from "react";
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
  MapPin,
  Building,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { Partenaires } from "../../types/interfaces";
import { fetchPartners } from "@/modules/administration-Finnance/services/partenaireService";
import { useApiCall } from "@/hooks/useAPiCall";

const getInitials = (name: string) => {
  if (!name) return "";

  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const ModernPartenaireGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Use the useApiCall hook to fetch partners
  const { data: partenaires, error, call } = useApiCall<Partenaires[]>(fetchPartners);

  useEffect(() => {
    call();
  }, [call]);

  const filteredPartenaires = searchQuery && partenaires
    ? partenaires.filter(
        (partenaire) =>
          partenaire.nom_partenaire
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          partenaire.specialite
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          partenaire.localisation
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          partenaire.type_partenaire
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          partenaire.interlocuteurs.some(
            (interlocuteur) =>
              `${interlocuteur.prenom_interlocuteur} ${interlocuteur.nom_interlocuteur}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
      )
    : partenaires || [];

  const getAvatarColor = (id: number) => {
    const colors = [
      "bg-blue-500 text-white",
      "bg-indigo-500 text-white",
      "bg-purple-500 text-white",
      "bg-pink-500 text-white",
      "bg-red-500 text-white",
      "bg-orange-500 text-white",
      "bg-amber-500 text-white",
      "bg-teal-500 text-white",
      "bg-emerald-500 text-white",
      "bg-cyan-500 text-white",
    ];

    const colorIndex = (id - 1) % colors.length;
    return colors[colorIndex];
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "technique":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "marketing":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "créatif":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "logistique":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "finance":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
      case "formation":
        return "bg-rose-100 text-rose-800 hover:bg-rose-100";
      case "conseil":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100";
      case "événementiel":
        return "bg-pink-100 text-pink-800 hover:bg-pink-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleClickVoirProfile = (id: string | number) => {
    navigate(`/administration/partenaires/profil/${id}`);
  };

  const renderPartenairesList = () => {
    if (error) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <p className="text-red-600 mb-4">
            Une erreur est survenue lors du chargement des partenaires
          </p>
          <Button variant="outline" onClick={() => call()}>
            Réessayer
          </Button>
        </div>
      );
    }

    if (filteredPartenaires.length === 0) {
      const message = searchQuery 
        ? "Aucun partenaire ne correspond à votre recherche" 
        : "Aucun partenaire disponible pour le moment";
      
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <p className="text-gray-600 mb-4">{message}</p>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Réinitialiser la recherche
            </Button>
          )}
          <Button 
            onClick={() => navigate("/administration/partenaires/ajouter")}
            className="bg-blue-600 hover:bg-blue-700 mt-4" 
          >
            <UserPlus size={16} className="mr-2" />
            Ajouter un partenaire
          </Button>
        </div>
      );
    }

    return (
      <>
        {filteredPartenaires.map((partenaire) => (
          <Card
            key={partenaire.id_partenaire}
            className="overflow-hidden hover:shadow-md transition-all duration-200 group"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Avatar
                    className={`h-12 w-12 ${getAvatarColor(partenaire.id_partenaire)}`}
                  >
                    <AvatarFallback
                      className={`${getAvatarColor(partenaire.id_partenaire)}`}
                    >
                      {getInitials(partenaire.nom_partenaire)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <h3
                      onClick={() =>
                        handleClickVoirProfile(partenaire.id_partenaire)
                      }
                      className="font-semibold text-gray-800 hover:underline cursor-pointer"
                    >
                      {partenaire.nom_partenaire}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {partenaire.specialite}
                    </p>
                  </div>
                </div>
                <div className="relative">
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
                        onClick={() =>
                          handleClickVoirProfile(partenaire.id_partenaire)
                        }
                        className="cursor-pointer"
                      >
                        <Eye size={16} className="mr-2" />
                        Voir profil
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Mail size={16} className="mr-2" />
                        <Link to={`mailto:${partenaire.email_partenaire}`}>
                          Envoyer un email
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Phone size={16} className="mr-2" />
                        <Link to={`tel:${partenaire.telephone_partenaire}`}>
                          Appeler
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <MapPin size={14} className="mr-2 text-gray-500" />
                  <p>{partenaire.localisation}</p>
                </div>
                <div className="flex items-center text-sm">
                  <Building size={14} className="mr-2 text-gray-500" />
                  <p>{partenaire.id_entite}</p>
                </div>
                <div className="flex items-center text-sm">
                  <Users size={14} className="mr-2 text-gray-500" />
                  <p>
                    {partenaire.interlocuteurs.length} interlocuteur
                    {partenaire.interlocuteurs.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div>
                  <Badge
                    className={`mt-1 font-normal ${getTypeColor(
                      partenaire.type_partenaire
                    )}`}
                  >
                    {partenaire.type_partenaire}
                  </Badge>
                </div>
              </div>

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t p-3 flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 text-xs"
              >
                <Phone size={14} className="mr-1" />
                <Link to={`tel:${partenaire.telephone_partenaire}`}>
                  {partenaire.telephone_partenaire}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 text-xs"
              >
                <Mail size={14} className="mr-1" />
                <Link to={`mailto:${partenaire.email_partenaire}`}>
                  Contacter
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </>
    );
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Annuaire des partenaires
            </h1>
            <p className="text-gray-500">
              Consultez les profils et contactez nos partenaires
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="text-gray-700 border-gray-300">
              <Filter size={16} className="mr-2" />
              Filtres
            </Button>
            <Button
              onClick={() => navigate("/administration/partenaires/ajouter")}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              <UserPlus size={16} className="mr-2" />
              Ajouter
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Rechercher par nom, spécialité, localisation, type ou interlocuteur..."
              className="pl-10 py-6 border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {renderPartenairesList()}
        </div>
      </div>
    </div>
  );
};

export default ModernPartenaireGrid;