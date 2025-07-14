import React, { useState, useMemo } from "react";
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
  Trash2,
  Edit,
  FileText
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Contrat, Partenaires, MutationError } from "../../types/interfaces";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchContrats, fetchContratsByType, deleteContrat } from '../../../services/contratService';
import { fetchPartners } from '../../../services/partenaireService';
import { toast } from 'sonner';


const ModernContractGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [contractToDelete, setContractToDelete] = useState<Contrat | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingContractId, setDeletingContractId] = useState<number | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Récupération des contrats
  const { data: contrats, isLoading, isError, refetch } = useQuery({
    queryKey: ['contrats', selectedType],
    queryFn: () => selectedType && selectedType !== "all" ? fetchContratsByType(selectedType) : fetchContrats(),
  });

  // Récupération des partenaires pour affichage du nom
  const { data: partenaires } = useQuery({
    queryKey: ['partenaires'],
    queryFn: fetchPartners,
  });



  // Mutation pour supprimer un contrat
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteContrat(id),
    onMutate: (id: number) => {
      setDeletingContractId(id);
    },
    onSuccess: () => {
      toast.success('Contrat supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['contrats'] });
      setIsDeleteDialogOpen(false);
      setContractToDelete(null);
      setDeletingContractId(null);
    },
    onError: (error: MutationError) => {
      toast.error('Erreur lors de la suppression du contrat', {
        description: error.message || 'Une erreur inattendue s\'est produite',
      });
      setIsDeleteDialogOpen(false);
      setContractToDelete(null);
      setDeletingContractId(null);
    },
  });

  // Utilitaire pour obtenir le nom du partenaire
  const getPartenaireNom = (id_partenaire?: number) => {
    if (!id_partenaire || !partenaires) return "-";
    const partenaire = partenaires.find((p: Partenaires) => p.id_partenaire === id_partenaire);
    return partenaire ? partenaire.nom_partenaire : "-";
  };

  // Filtrage
  const filteredContrats = useMemo(() => {
    if (!Array.isArray(contrats)) return [];
    return searchQuery
      ? contrats.filter(
          (contrat: Contrat) =>
            contrat.nom_contrat.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (contrat.id_partenaire ? getPartenaireNom(contrat.id_partenaire).toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
            (contrat.duree_contrat || "").toLowerCase().includes(searchQuery.toLowerCase())
        )
      : contrats;
  }, [contrats, searchQuery, partenaires]);

  // Types de contrats disponibles (basés sur les données existantes)
  const contractTypes = useMemo(() => {
    if (!Array.isArray(contrats)) return [];
    const types = new Set(contrats.map((contrat: Contrat) => contrat.type_de_contrat).filter(Boolean));
    return Array.from(types).sort();
  }, [contrats]);

  // Fonction utilitaire pour calculer la durée
  const calculateDuration = (dateDebut: string, dateFin: string) => {
    if (!dateDebut || !dateFin) return "Non calculée";
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    if (isNaN(debut.getTime()) || isNaN(fin.getTime())) return "Non calculée";
    const diffTime = Math.abs(fin.getTime() - debut.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.ceil(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;
    if (diffYears > 0) {
      let result = `${diffYears} an${diffYears > 1 ? 's' : ''}`;
      if (remainingMonths > 0) {
        result += ` et ${remainingMonths} mois`;
      }
      return result;
    } else {
      return `${diffMonths} mois`;
    }
  };

  const handleClick = () => {
    navigate("/administration/contrats/nouveau");
  };

  const handleClickVoirContrat = (id: number) => {
    navigate(`/administration/contrats/${id}/details`);
  };

  const handleClickEditerContrat = (id: number) => {
    navigate(`/administration/contrats/${id}/editer`);
  };

  const handleDeleteClick = (contrat: Contrat) => {
    setContractToDelete(contrat);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (contractToDelete) {
      deleteMutation.mutate(contractToDelete.id_contrat);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setContractToDelete(null);
  };



  // Statut visuel simplifié
  const getContractStatus = (dateFin: string) => {
    const today = new Date();
    const endDate = new Date(dateFin);
    const timeDiff = endDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (daysDiff < 0) {
      return {
        status: "expired",
        label: "Expiré",
        color: "bg-gray-100 text-gray-700 border border-gray-200",
      };
    } else if (daysDiff <= 30) {
      return {
        status: "expiring",
        label: `Expire dans ${daysDiff} jours`,
        color: "bg-orange-50 text-orange-700 border border-orange-200",
      };
    } else {
      return {
        status: "active",
        label: "Actif",
        color: "bg-blue-50 text-blue-700 border border-blue-200",
      };
    }
  };

  // Couleur de bordure simplifiée
  const getBorderColor = (id: number) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-gray-500 to-gray-600",
      "from-slate-500 to-slate-600",
      "from-zinc-500 to-zinc-600",
    ];
    const colorIndex = id % colors.length;
    return colors[colorIndex];
  };

  // Loader amusant
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="relative">
          {/* Animation de documents qui se superposent */}
          <div className="relative w-24 h-32">
            <div className="absolute inset-0 bg-white border-2 border-gray-200 rounded-lg shadow-lg animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="absolute inset-0 bg-white border-2 border-gray-200 rounded-lg shadow-lg animate-bounce" style={{ animationDelay: '150ms', transform: 'translateY(-2px)' }}></div>
            <div className="absolute inset-0 bg-white border-2 border-gray-200 rounded-lg shadow-lg animate-bounce" style={{ animationDelay: '300ms', transform: 'translateY(-4px)' }}></div>
            <div className="absolute inset-0 bg-white border-2 border-gray-200 rounded-lg shadow-lg animate-bounce" style={{ animationDelay: '450ms', transform: 'translateY(-6px)' }}></div>
          </div>
          {/* Icône de document au centre */}
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
        </div>
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Chargement des contrats</h3>
          <p className="text-gray-500">Préparation de vos documents...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Erreur
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-6">Impossible de charger les contrats pour le moment.</p>
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header moderne */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gestion des contrats
            </h1>
            <p className="text-gray-600">
              Consultez, gérez et suivez tous les contrats avec vos partenaires
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              onClick={handleClick}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white shadow-sm"
            >
              <PlusCircle size={16} className="mr-2" />
              Nouveau contrat
            </Button>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-8 space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Rechercher par nom de contrat, partenaire ou durée..."
              className="pl-10 py-4 border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filtres */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Type de contrat :</span>
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Tous les types de contrats" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {contractTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Indicateur de filtres et résultats */}
        {(selectedType !== "all" || searchQuery) && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Filtres actifs :
                  {selectedType !== "all" && (
                    <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                      Type: {selectedType}
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                      Recherche: "{searchQuery}"
                    </Badge>
                  )}
                </span>
              </div>
              <div className="text-sm text-blue-600">
                {filteredContrats.length} contrat{filteredContrats.length > 1 ? 's' : ''} trouvé{filteredContrats.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        )}

        {/* Grille de contrats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContrats.map((contrat: Contrat) => {
            const contractStatus = getContractStatus(contrat.date_fin);
            return (
              <Card
                key={contrat.id_contrat}
                className={`overflow-hidden hover:shadow-lg transition-all duration-200 group relative border border-gray-200 hover:border-blue-300 bg-white ${
                  deletingContractId === contrat.id_contrat ? 'opacity-50 scale-95' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 line-clamp-2 max-w-xs" title={contrat.nom_contrat}>
                        {contrat.nom_contrat}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Partenaire : <span className="font-medium text-gray-700">{getPartenaireNom(contrat.id_partenaire)}</span>
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100 disabled:opacity-50"
                          disabled={deletingContractId === contrat.id_contrat}
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => handleClickVoirContrat(contrat.id_contrat)}
                          className="cursor-pointer"
                        >
                          <Eye size={16} className="mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleClickEditerContrat(contrat.id_contrat)}
                          className="cursor-pointer"
                        >
                          <Edit size={16} className="mr-2" />
                          Modifier
                        </DropdownMenuItem>

                        <DropdownMenuItem className="cursor-pointer">
                          <Download size={16} className="mr-2" />
                          Télécharger PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(contrat)}
                          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={deletingContractId === contrat.id_contrat}
                        >
                          <Trash2 size={16} className="mr-2" />
                          {deletingContractId === contrat.id_contrat ? "Suppression..." : "Supprimer"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock size={14} className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Durée</p>
                        <p className="text-sm">{
                          contrat.duree_contrat || calculateDuration(contrat.date_debut, contrat.date_fin)
                        }</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Période</p>
                        <p className="text-sm">
                          {format(new Date(contrat.date_debut), "dd MMM yyyy", { locale: fr })} - {format(new Date(contrat.date_fin), "dd MMM yyyy", { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <File size={14} className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Type de contrat</p>
                        <p className="text-sm">{contrat.type_de_contrat}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Statut</p>
                      <Badge className={`mt-1 font-normal ${contractStatus.color}`}>
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
                    className="text-gray-600 text-xs cursor-pointer hover:text-gray-800 hover:bg-gray-100"
                    onClick={() => handleClickVoirContrat(contrat.id_contrat)}
                  >
                    <Eye size={14} className="mr-1" />
                    Voir détails
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 text-xs hover:text-blue-700 hover:bg-blue-50"
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
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun résultat trouvé</h3>
              <p className="text-gray-600 mb-6">
                {selectedType !== "all" && searchQuery ? (
                  <>Aucun contrat de type "{selectedType}" ne correspond à votre recherche "{searchQuery}"</>
                ) : selectedType !== "all" ? (
                  <>Aucun contrat de type "{selectedType}" trouvé</>
                ) : searchQuery ? (
                  <>Aucun contrat ne correspond à votre recherche "{searchQuery}"</>
                ) : (
                  "Aucun contrat disponible"
                )}
              </p>
              <div className="flex gap-2 justify-center">
                {(selectedType !== "all" || searchQuery) && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedType("all");
                    }}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer le contrat{" "}
              <span className="font-semibold text-gray-800">
                "{contractToDelete?.nom_contrat}"
              </span>
              ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleCancelDelete}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


    </div>
  );
};

export default ModernContractGrid;
