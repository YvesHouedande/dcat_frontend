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
  Users,
  Loader2,
  ArrowDown
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { Interlocuteur } from "../../types/interfaces";
import { usePartenaireApi } from "@/modules/administration-Finnance/services/partenaireService";
import { useCommonApi } from "@/modules/administration-Finnance/services/commonService";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

// Interface pour les entités

// Supprimer le singleton PartenairesStore et ses usages

const getInitials = (name: string) => {
  if (!name) return "";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const ModernPartenaireGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const { deletePartner } = usePartenaireApi();
  const { fetchPartnersPaginated } = useCommonApi();
  
  // Charger les partenaires avec React Query
  const {
    data,
    isLoading: loading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["partenaires"],
    queryFn: ({ pageParam = 1 }) => fetchPartnersPaginated(pageParam, 16),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.pagination.page;
      const totalPages = lastPage.pagination.totalPages;
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined; // Plus de pages à charger
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: 1000,
  });


  // Charger les entités avec React Query
 
  const partenaires = data?.pages.flatMap((page) => page.data);


  // Gestionnaire de suppression de partenaire
  const handleDeletePartner = async (id: number) => {
    try {
      const result = await deletePartner(id);
      
      if (result.success) {
        toast.success(result.message);
        
        // Mettre à jour le cache immédiatement pour une UI plus réactive
        queryClient.setQueryData(["partenaires"], (oldData: unknown) => {
          if (!oldData || typeof oldData !== 'object' || !('pages' in oldData)) return oldData;
          
          const typedOldData = oldData as { 
            pages: Array<{ 
              data: Array<{ id_partenaire: number }>,
              pagination: { total: number }
            }> 
          };
          
          // Calculer le nouveau total après suppression
          const newTotal = typedOldData.pages.reduce((acc, page) => {
            return acc + page.data.filter((partenaire) => partenaire.id_partenaire !== id).length;
          }, 0);
          
          return {
            ...typedOldData,
            pages: typedOldData.pages.map((page) => ({
              ...page,
              data: page.data.filter((partenaire) => partenaire.id_partenaire !== id),
              pagination: {
                ...page.pagination,
                total: newTotal
              }
            }))
          };
        });
        
        // Invalider les requêtes liées aux partenaires et interlocuteurs
        await queryClient.invalidateQueries({ 
          queryKey: ["partenaires"],
          exact: false 
        });
        
        // Invalider aussi les requêtes d'interlocuteurs si elles existent
        await queryClient.invalidateQueries({ 
          queryKey: ["interlocuteurs"],
          exact: false 
        });
        
      } else {
        toast.info(result.message);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du partenaire:", error);
      toast.info("Une erreur inattendue est survenue lors de la suppression du partenaire.");
    } finally {
      setConfirmDeleteId(null);
    }
  };



  
  const filteredPartenaires =
    searchQuery && partenaires
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

            (partenaire.interlocuteurs &&
              partenaire.interlocuteurs.some((interlocuteur) =>
                `${interlocuteur.prenom_interlocuteur} ${interlocuteur.nom_interlocuteur}`
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              ))
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "actif":
        return "bg-green-100 text-green-800";
      case "inactif":
        return "bg-red-100 text-red-800";
      case "en attente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleClickVoirProfile = (id: string | number) => {
    navigate(`/gestion-administrative/partenaires/${id}`);
  };

  // Fonction pour forcer le rechargement des données
  const handleRefresh = async () => {
    try {
      await queryClient.invalidateQueries({ 
        queryKey: ["partenaires"],
        exact: false 
      });
      await refetch();
      toast.success("Données actualisées");
    } catch (error) {
      console.error("Erreur lors de l'actualisation:", error);
      toast.error("Erreur lors de l'actualisation des données");
    }
  };

  // Fonction pour afficher les interlocuteurs dans une tooltip
  const renderInterlocuteursList = (
    interlocuteurs: Interlocuteur[] | undefined
  ) => {
    if (!interlocuteurs || interlocuteurs.length === 0) {
      return "Aucun interlocuteur";
    }

    return (
      <div className="p-2">
        {interlocuteurs.map((interlocuteur, index) => (
          <div
            key={interlocuteur.id_interlocuteur}
            className={`${index > 0 ? "mt-2 pt-2 border-t" : ""}`}
          >
            <p className="font-medium">{`${interlocuteur.prenom_interlocuteur} ${interlocuteur.nom_interlocuteur}`}</p>
            <p className="text-sm text-gray-500">
              {interlocuteur.fonction_interlocuteur}
            </p>
          </div>
        ))}
      </div>
    );
  };

  // Rendu d'un squelette de chargement
  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <Card key={`skeleton-${index}`} className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-3">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t p-3 flex justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </CardFooter>
        </Card>
      ));
  };

  const renderPartenairesList = () => {
    if (error) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <p className="text-red-600 mb-4">
            Une erreur est survenue lors du chargement des partenaires
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              Réessayer
            </Button>
            <Button variant="outline" onClick={handleRefresh}>
              Actualiser
            </Button>
          </div>
        </div>
      );
    }

    if (loading && !partenaires) {
      return renderSkeletons();
    }

    if (!partenaires || filteredPartenaires.length === 0) {
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
            onClick={() =>
              navigate("/gestion-administrative/partenaires/ajouter")
            }
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
                    className={`h-12 w-12 ${getAvatarColor(
                      partenaire.id_partenaire
                    )}`}
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
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">
                        {partenaire.specialite}
                      </p>
                      <Badge className={getStatusColor(partenaire.statut)}>
                        {partenaire.statut}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 hover:bg-red-50"
                        onClick={() =>
                          setConfirmDeleteId(partenaire.id_partenaire)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Supprimer
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

                <div className="flex items-center text-sm group relative">
                  <Users size={14} className="mr-2 text-gray-500" />
                  <div className="group relative inline-block">
                    <p className="cursor-help">
                      {Array.isArray(partenaire.interlocuteurs) ? partenaire.interlocuteurs.length : 0} interlocuteur
                      {Array.isArray(partenaire.interlocuteurs) && partenaire.interlocuteurs.length > 1 ? "s" : ""}
                    </p>
                    <div className="invisible group-hover:visible absolute z-10 w-64 bg-white rounded-lg shadow-lg p-2 text-sm mt-1 left-0 border border-gray-200">
                      {renderInterlocuteursList(partenaire.interlocuteurs)}
                    </div>
                  </div>
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
        {/* AlertDialog global pour la suppression */}
        <AlertDialog
          open={!!confirmDeleteId}
          onOpenChange={(open) => {
            if (!open) setConfirmDeleteId(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce partenaire ? Cette action
                est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setConfirmDeleteId(null)}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  confirmDeleteId && handleDeletePartner(confirmDeleteId)
                }
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
              {filteredPartenaires.length} partenaire
              {filteredPartenaires.length > 1 ? "s" : ""} trouvé
              {filteredPartenaires.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="text-gray-700 border-gray-300"
              onClick={handleRefresh}
              disabled={loading}
            >
              <svg
                className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Actualiser
            </Button>
            <Button variant="outline" className="text-gray-700 border-gray-300">
              <Filter size={16} className="mr-2" />
              Filtres
            </Button>
            <Button
              onClick={() =>
                navigate("/gestion-administrative/entites")
              }
              variant="outline"
              className="text-gray-700 border-gray-300"
            >
              <Building size={16} className="mr-2" />
              Gérer les entités
            </Button>
            <Button
              onClick={() =>
                navigate("/gestion-administrative/partenaires/ajouter")
              }
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
              placeholder="Rechercher par nom, spécialité, localisation, type, entité ou interlocuteur..."
              className="pl-10 py-6 border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {renderPartenairesList()}
        </div>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            className="text-gray-700 border-gray-300"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <ArrowDown size={16} className="mr-2" />
            )}
            Charger plus de partenaires
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModernPartenaireGrid;
