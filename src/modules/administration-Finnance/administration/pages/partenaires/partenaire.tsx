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
  MapPin,
  Building,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";

interface PartenaireProfile {
  id_partenaire: number;
  nom_partenaire: string;
  telephone_partenaire: string;
  email_partenaire: string;
  specialite: string;
  localisation: string;
  type_partenaire: string;
  entite: string;
  initials: string;
}

const ModernPartenaireGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  // Données d'exemple pour les partenaires
  const partenaires: PartenaireProfile[] = [
    {
      id_partenaire: 1,
      nom_partenaire: "Tech Solutions",
      telephone_partenaire: "01 23 45 67 89",
      email_partenaire: "contact@techsolutions.fr",
      specialite: "Développement Web",
      localisation: "Paris",
      type_partenaire: "Technique",
      entite: "SARL",
      initials: "TS",
    },
    {
      id_partenaire: 2,
      nom_partenaire: "Marketing Pro",
      telephone_partenaire: "01 98 76 54 32",
      email_partenaire: "info@marketingpro.fr",
      specialite: "Marketing Digital",
      localisation: "Lyon",
      type_partenaire: "Marketing",
      entite: "SAS",
      initials: "MP",
    },
    {
      id_partenaire: 3,
      nom_partenaire: "Design Studio",
      telephone_partenaire: "03 45 67 89 01",
      email_partenaire: "hello@designstudio.fr",
      specialite: "UI/UX Design",
      localisation: "Bordeaux",
      type_partenaire: "Créatif",
      entite: "EURL",
      initials: "DS",
    },
    {
      id_partenaire: 4,
      nom_partenaire: "Logistique Express",
      telephone_partenaire: "04 56 78 90 12",
      email_partenaire: "contact@logistique-express.fr",
      specialite: "Logistique",
      localisation: "Marseille",
      type_partenaire: "Logistique",
      entite: "SA",
      initials: "LE",
    },
    {
      id_partenaire: 5,
      nom_partenaire: "Finance Conseil",
      telephone_partenaire: "05 67 89 01 23",
      email_partenaire: "info@finance-conseil.fr",
      specialite: "Comptabilité",
      localisation: "Lille",
      type_partenaire: "Finance",
      entite: "SAS",
      initials: "FC",
    },
    {
      id_partenaire: 6,
      nom_partenaire: "Formation Plus",
      telephone_partenaire: "06 78 90 12 34",
      email_partenaire: "contact@formation-plus.fr",
      specialite: "Formation Professionnelle",
      localisation: "Toulouse",
      type_partenaire: "Formation",
      entite: "Association",
      initials: "FP",
    },
    {
      id_partenaire: 7,
      nom_partenaire: "Conseil RH",
      telephone_partenaire: "07 89 01 23 45",
      email_partenaire: "contact@conseil-rh.fr",
      specialite: "Ressources Humaines",
      localisation: "Nantes",
      type_partenaire: "Conseil",
      entite: "SARL",
      initials: "CR",
    },
    {
      id_partenaire: 8,
      nom_partenaire: "Promo Events",
      telephone_partenaire: "08 90 12 34 56",
      email_partenaire: "info@promo-events.fr",
      specialite: "Événementiel",
      localisation: "Strasbourg",
      type_partenaire: "Événementiel",
      entite: "SAS",
      initials: "PE",
    },
  ];

  // Filtrage des partenaires basé sur la recherche
  const filteredPartenaires = searchQuery
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
            .includes(searchQuery.toLowerCase())
      )
    : partenaires;

  // Obtenir la couleur de l'avatar basée sur l'ID
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

    // Utiliser l'ID pour attribuer une couleur de manière cohérente
    const colorIndex = (id - 1) % colors.length;
    return colors[colorIndex];
  };

  // Obtenir la couleur du badge selon le type de partenaire
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

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header avec titre et actions */}
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

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Rechercher par nom, spécialité, localisation ou type..."
              className="pl-10 py-6 border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Grille de partenaires */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPartenaires.map((partenaire) => (
            <Card
              key={partenaire.id_partenaire}
              className="overflow-hidden hover:shadow-md transition-all duration-200 group"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Avatar
                      className={`h-12 w-12 ${getAvatarColor(
                        partenaire.id_partenaire
                      )}`}
                    >
                      <AvatarFallback
                        className={` ${getAvatarColor(
                          partenaire.id_partenaire
                        )}`}
                      >
                        {partenaire.initials}
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
                    <p>{partenaire.entite}</p>
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
        </div>

        {/* Message si aucun résultat */}
        {filteredPartenaires.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600 mb-4">
              Aucun partenaire ne correspond à votre recherche
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

export default ModernPartenaireGrid;
