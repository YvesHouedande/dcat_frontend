import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { Employe } from "../../administration/types/interfaces";
import { useEmployesApi } from "../../services/employeService";
import { fetchFonctionById } from "../../services/fonctionService";
import { toast } from "sonner";
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

const ModernProfileGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("tous");
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobTitles, setJobTitles] = useState<Record<number, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const navigate = useNavigate();
  const { fetchEmployes, deleteEmploye } = useEmployesApi();
  
  // États pour la suppression
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeToDelete, setEmployeToDelete] = useState<Employe | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const loadEmployes = async () => {
      try {
        console.log("Début du chargement des employés..."); // Debug log
        const response = await fetchEmployes(currentPage, 10);
        console.log("Employés chargés avec succès:", response); // Debug log
        setEmployes(response.data);
        setPagination(response.pagination);

        // Charger les titres des postes pour chaque employé
        const titles: Record<number, string> = {};
        try {
          console.log("Début du chargement des fonctions..."); // Debug log
          await Promise.all(
            response.data.map(async (employe) => {
              if (employe.id_fonction) {
                try {
                  const fonctionData = await fetchFonctionById(
                    employe.id_fonction
                  );
                  titles[employe.id_fonction] = fonctionData.nom_fonction;
                } catch (error) {
                  console.warn(
                    `Erreur lors du chargement de la fonction ${employe.id_fonction}:`,
                    error
                  );
                  titles[employe.id_fonction] = "Non spécifié";
                }
              }
            })
          );
          console.log("Fonctions chargées avec succès:", titles); // Debug log
        } catch (error) {
          console.warn(
            "Erreur lors du chargement des fonctions, mais on continue:",
            error
          );
          // On ne fait pas échouer tout le processus si les fonctions ne se chargent pas
        }

        setJobTitles(titles);
        setLoading(false);
        console.log("Chargement terminé avec succès"); // Debug log
      } catch (error) {
        console.error("Erreur lors du chargement des employés:", error); // Debug log
        setError("Erreur lors du chargement des employés");
        setLoading(false);
      }
    };

    loadEmployes();
  }, [fetchEmployes, currentPage]);

  // Filter profiles based on search query and status
  const filteredProfiles = employes.filter((profile) => {
    // Filtre par recherche textuelle
    const matchesSearch = searchQuery
      ? profile.nom_employes
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        profile.prenom_employes
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        profile.email_employes
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        profile.adresse_employes
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;

    // Filtre par statut
    const matchesStatus =
      statusFilter === "tous" || profile.status_employes === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleClickVoirProfile = (id_employes: number) => {
    // Debug log
    if (!id_employes || isNaN(id_employes)) {
      return;
    }
    const profileUrl = `/resources-humaines/employes/${id_employes}`;
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

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("tous");
    setCurrentPage(1);
  };

  const getFilterCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (statusFilter !== "tous") count++;
    return count;
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Fonctions de gestion de la suppression
  const handleDeleteClick = (employe: Employe) => {
    setEmployeToDelete(employe);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeToDelete) return;

    setIsDeleting(true);
    try {
      await deleteEmploye(employeToDelete.id_employes);
      toast.success("Employé supprimé avec succès");
      
      // Recharger la liste des employés
      const response = await fetchEmployes(currentPage, 10);
      setEmployes(response.data);
      setPagination(response.pagination);
      
      // Si c'était le dernier employé de la page et qu'il y a une page précédente
      if (response.data.length === 0 && currentPage > 1) {
        const prevPageResponse = await fetchEmployes(currentPage - 1, 10);
        setEmployes(prevPageResponse.data);
        setPagination(prevPageResponse.pagination);
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression de l'employé");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setEmployeToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEmployeToDelete(null);
  };

  const getPhotoUrl = (photoPath: string | null | undefined): string | undefined => {
    if (!photoPath) {
      console.log('Pas de photo pour cet employé');
      return undefined;
    }
    
    console.log('Photo path reçu:', photoPath);
    
    // Si c'est déjà une URL complète, on la retourne
    if (photoPath.startsWith('http')) {
      console.log('URL complète détectée:', photoPath);
      return photoPath;
    }
    
    // Construire l'URL correcte pour les images
    // Enlever /api/ de l'URL de base car les images sont servies directement
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const baseUrl = API_URL.replace('/api', ''); // Enlever /api/ de l'URL
    const fullUrl = `${baseUrl}/${photoPath}`;
    console.log('URL construite:', fullUrl);
    
    // Test rapide de l'accessibilité de l'image
    const img = new Image();
    img.onload = () => {
      console.log('✅ Image accessible:', fullUrl);
    };
    img.onerror = () => {
      console.log('❌ Image non accessible:', fullUrl);
    };
    img.src = fullUrl;
    
    return fullUrl;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les statuts</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="depart">Départ</SelectItem>
              </SelectContent>
            </Select>
            {getFilterCount() > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="text-gray-700 border-gray-300"
              >
                <X size={16} className="mr-2" />
                Effacer ({getFilterCount()})
              </Button>
            )}
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
                  <div className="flex items-start flex-1 min-w-0">
                    {profile.photo_employes ? (
                      <div className="relative flex-shrink-0">
                        <Avatar
                          className={`h-10 w-10 ${getAvatarColor(
                            profile.id_employes
                          )}`}
                        >
                          <AvatarImage 
                            src={getPhotoUrl(profile.photo_employes)} 
                            alt={`${profile.nom_employes} ${profile.prenom_employes}`}
                            onError={(e) => {
                              console.log('❌ Erreur de chargement image pour:', profile.nom_employes);
                              console.log('URL qui a échoué:', getPhotoUrl(profile.photo_employes));
                              console.log('Erreur:', e);
                            }}
                            onLoad={() => {
                              console.log('✅ Image chargée avec succès pour:', profile.nom_employes);
                            }}
                          />
                          <AvatarFallback>
                            {profile.nom_employes.charAt(0) +
                              profile.prenom_employes.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ) : (
                      <Avatar
                        className={`h-10 w-10 flex-shrink-0 ${getAvatarColor(
                          profile.id_employes
                        )}`}
                      >
                        <AvatarFallback>
                          {profile.nom_employes.charAt(0) +
                            profile.prenom_employes.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                   <div className="ml-3 min-w-0 flex-1">
                     <h3
                       onClick={() =>
                         handleClickVoirProfile(profile.id_employes)
                       }
                       className="font-semibold text-gray-800 cursor-pointer hover:underline truncate"
                       title={`${profile.nom_employes} ${profile.prenom_employes}`}
                     >
                       {profile.nom_employes} {profile.prenom_employes}
                     </h3>
                     <p
                       className="text-xs text-gray-500 truncate"
                       title={profile.email_employes}
                     >
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
                          onClick={() =>
                            handleClickVoirProfile(profile.id_employes)
                          }
                          className="cursor-pointer"
                        >
                          <Eye size={16} className="mr-2" />
                          Voir profil
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          key={`email-${profile.id_employes}`}
                          className="cursor-pointer"
                        >
                          <Mail size={16} className="mr-2" />
                          <Link to={`mailto:${profile.email_employes}`}>
                            Envoyer un email
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          key={`phone-${profile.id_employes}`}
                          className="cursor-pointer"
                        >
                          <Phone size={16} className="mr-2" />
                          <Link to={`tel:${profile.contact_employes}`}>
                            Appeler
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          key={`delete-${profile.id_employes}`}
                          onClick={() => handleDeleteClick(profile)}
                          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Adresse</p>
                    <p
                      className="text-sm truncate"
                      title={profile.adresse_employes}
                    >
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
                    <p
                      className="text-sm truncate"
                      title={jobTitles[profile.id_fonction] || "Non spécifié"}
                    >
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
                    <Link to={`mailto:${profile.email_employes}`}>
                      Contacter
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Message if no results */}
        {filteredProfiles.length === 0 && employes.length > 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600 mb-4">
              Aucun profil ne correspond à vos critères de recherche
            </p>
            <Button variant="outline" onClick={resetFilters}>
              Réinitialiser tous les filtres
            </Button>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Précédent
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="flex items-center gap-1"
            >
              Suivant
              <ChevronRight size={16} />
            </Button>
          </div>
        )}

        {/* Pagination info */}
        {pagination.total > 0 && (
          <div className="text-center text-sm text-gray-500 mt-4">
            Affichage de {((currentPage - 1) * pagination.limit) + 1} à {Math.min(currentPage * pagination.limit, pagination.total)} sur {pagination.total} employés
          </div>
        )}

        {/* Dialog de confirmation de suppression */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer l'employé{" "}
                <strong>
                  {employeToDelete?.prenom_employes} {employeToDelete?.nom_employes}
                </strong>
                ? Cette action est irréversible et supprimera définitivement toutes les données associées à cet employé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleDeleteCancel} disabled={isDeleting}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Suppression...
                  </>
                ) : (
                  "Supprimer définitivement"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ModernProfileGrid;
