import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  PlusCircle,
  MoreHorizontal,
  Eye,
  Download,
  Calendar,
  File,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Contrat {
  id_contrat: string;
  nom_contrat: string;
  duree_Contrat: string;
  date_debut: string;
  date_fin: string;
  Id_partenaire: string;
  fichier: string;
  nomPartenaire: string; // Ajout pour afficher le nom du partenaire
}

const ModernContractGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Données d'exemple pour les contrats
  const contrats: Contrat[] = [
    {
      id_contrat: "C001",
      nom_contrat: "Accord de service informatique",
      duree_Contrat: "12 mois",
      date_debut: "2025-01-15",
      date_fin: "2026-01-14",
      Id_partenaire: "P001",
      fichier: "contrat_service_info.pdf",
      nomPartenaire: "Systèmes IT Pro",
    },
    {
      id_contrat: "C002",
      nom_contrat: "Contrat de maintenance",
      duree_Contrat: "24 mois",
      date_debut: "2024-11-01",
      date_fin: "2026-10-31",
      Id_partenaire: "P002",
      fichier: "maintenance_annuelle.pdf",
      nomPartenaire: "TechSupport Plus",
    },
    {
      id_contrat: "C003",
      nom_contrat: "Accord de confidentialité",
      duree_Contrat: "36 mois",
      date_debut: "2025-02-20",
      date_fin: "2028-02-19",
      Id_partenaire: "P003",
      fichier: "nda_confidentiel.pdf",
      nomPartenaire: "ConseilJuridique SA",
    },
    {
      id_contrat: "C004",
      nom_contrat: "Contrat de fourniture",
      duree_Contrat: "6 mois",
      date_debut: "2025-03-01",
      date_fin: "2025-08-31",
      Id_partenaire: "P004",
      fichier: "fourniture_materiel.pdf",
      nomPartenaire: "FourniPro SARL",
    },
    {
      id_contrat: "C005",
      nom_contrat: "Contrat publicitaire",
      duree_Contrat: "12 mois",
      date_debut: "2024-12-01",
      date_fin: "2025-11-30",
      Id_partenaire: "P005",
      fichier: "campagne_pub.pdf",
      nomPartenaire: "AgenceCom Digital",
    },
    {
      id_contrat: "C006",
      nom_contrat: "Licence logiciel",
      duree_Contrat: "24 mois",
      date_debut: "2025-01-01",
      date_fin: "2026-12-31",
      Id_partenaire: "P006",
      fichier: "licence_logiciel.pdf",
      nomPartenaire: "SoftwareSolutions",
    },
    {
      id_contrat: "C007",
      nom_contrat: "Contrat de partenariat",
      duree_Contrat: "18 mois",
      date_debut: "2025-02-01",
      date_fin: "2026-07-31",
      Id_partenaire: "P007",
      fichier: "partenariat_strategique.pdf",
      nomPartenaire: "PartenairesAssociés",
    },
    {
      id_contrat: "C008",
      nom_contrat: "Accord de distribution",
      duree_Contrat: "12 mois",
      date_debut: "2025-04-01",
      date_fin: "2026-03-31",
      Id_partenaire: "P008",
      fichier: "distribution_produits.pdf",
      nomPartenaire: "DistribExpress",
    },
  ];

  // Filtrage des contrats basé sur la recherche
  const filteredContrats = searchQuery
    ? contrats.filter(
        (contrat) =>
          contrat.nom_contrat
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          contrat.nomPartenaire
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          contrat.duree_Contrat
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : contrats;

  const handleClick = () => {
    navigate("/administration/contrats/nouveau_contrat");
  };

  const handleClickVoirContrat = (id: string) => {
    navigate(`/administration/contrats/details/${id}`);
  };

  // Fonction pour déterminer le statut du contrat
  const getContractStatus = (dateFin: string) => {
    const today = new Date();
    const endDate = new Date(dateFin);

    // Calculer la différence en jours
    const timeDiff = endDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return {
        status: "expired",
        label: "Expiré",
        color: "bg-red-100 text-red-800 hover:bg-red-100",
      };
    } else if (daysDiff <= 30) {
      return {
        status: "expiring",
        label: `Expire dans ${daysDiff} jours`,
        color: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      };
    } else {
      return {
        status: "active",
        label: "Actif",
        color: "bg-green-100 text-green-800 hover:bg-green-100",
      };
    }
  };

  // Formatter les dates au format français
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  // Obtenir une couleur pour le bord supérieur en fonction de l'ID
  const getBorderColor = (id: string) => {
    const colors = [
      "from-blue-500 to-indigo-600",
      "from-emerald-500 to-teal-600",
      "from-purple-500 to-indigo-600",
      "from-amber-500 to-orange-600",
      "from-rose-500 to-pink-600",
      "from-sky-500 to-blue-600",
      "from-green-500 to-emerald-600",
      "from-red-500 to-rose-600",
    ];

    const colorIndex = parseInt(id.replace(/[^0-9]/g, "")) % colors.length;
    return colors[colorIndex];
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header avec titre et actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Gestion des contrats
            </h1>
            <p className="text-gray-500">
              Consultez, gérez et suivez tous les contrats avec vos partenaires
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
              <PlusCircle size={16} className="mr-2" />
              Nouveau contrat
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
              placeholder="Rechercher par nom de contrat, partenaire ou durée..."
              className="pl-10 py-6 border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Grille de contrats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredContrats.map((contrat) => {
            const contractStatus = getContractStatus(contrat.date_fin);

            return (
              <Card
                key={contrat.id_contrat}
                className="overflow-hidden hover:shadow-md transition-all duration-200 group"
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 truncate max-w-xs">
                        {contrat.nom_contrat}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {contrat.nomPartenaire}
                      </p>
                    </div>
                    <div>
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
                              handleClickVoirContrat(contrat.id_contrat)
                            }
                            className="cursor-pointer"
                          >
                            <Eye size={16} className="mr-2" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Download size={16} className="mr-2" />
                            Télécharger PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock size={14} className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Durée</p>
                        <p className="text-sm">{contrat.duree_Contrat}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Calendar size={14} className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Période</p>
                        <p className="text-sm">
                          {formatDate(contrat.date_debut)} -{" "}
                          {formatDate(contrat.date_fin)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <File size={14} className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Document</p>
                        <p className="text-sm truncate max-w-xs">
                          {contrat.fichier}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Statut</p>
                      <Badge
                        className={`mt-1 font-normal ${contractStatus.color}`}
                      >
                        {contractStatus.label}
                      </Badge>
                    </div>
                  </div>

                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getBorderColor(
                      contrat.id_contrat
                    )} opacity-0 group-hover:opacity-100 transition-opacity`}
                  ></div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t p-3 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 text-xs cursor-pointer"
                    onClick={() => handleClickVoirContrat(contrat.id_contrat)}
                  >
                    <Eye size={14} className="mr-1" />
                    Voir détails
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 text-xs"
                  >
                    <Download size={14} className="mr-1" />
                    Télécharger
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Message si aucun résultat */}
        {filteredContrats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600 mb-4">
              Aucun contrat ne correspond à votre recherche
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

export default ModernContractGrid;
