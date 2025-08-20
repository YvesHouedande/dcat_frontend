import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  ExternalLink,
  Edit,
  FileText,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Trash2,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import {
  Employe,
  EmployeDocument
} from "../../administration/types/interfaces";
import { useEmployesApi } from "../../services/employeService";
import { fetchFonctionById } from "../../services/fonctionService";

import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import EmployeDocuments from "./EmployeDocuments";
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

const ModernUserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [userInfo, setUserInfo] = useState<Employe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState<string>("Non spécifié");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // const { downloadDocument, downloadDocumentByUrl } = useContratsApi();
  const { fetchEmployeById, uploadEmployePhoto, fetchEmployeDocuments, deleteEmploye } = useEmployesApi();

  // Fonction pour construire l'URL de la photo
  const getPhotoUrl = (photoPath: string | null | undefined): string | undefined => {
    if (!photoPath) {
      return undefined;
    }
    
    // Si c'est déjà une URL complète, on la retourne
    if (photoPath.startsWith('http')) {
      return photoPath;
    }
    
    // Construire l'URL correcte pour les images
    // Enlever /api/ de l'URL de base car les images sont servies directement
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const baseUrl = API_URL.replace('/api', ''); // Enlever /api/ de l'URL
    const fullUrl = `${baseUrl}/${photoPath}`;
    
    return fullUrl;
  };

  const {
    data: documentsData,
  } = useInfiniteQuery<{ data?: EmployeDocument[]; documents?: EmployeDocument[]; pagination?: { page: number; total: number } }>({
    queryKey: ["employe-documents", id],
    queryFn: ({ pageParam = 1 }) =>
      fetchEmployeDocuments(parseInt(String(id)), pageParam, 10),
    enabled: !!id,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.pagination?.page || 1;
      const totalPages = lastPage.pagination?.total || 1;
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined; // Plus de pages à charger
    },
    staleTime: 2 * 60 * 1000,
  });

  // Extract all documents from pages - gérer les différents formats de réponse API
  const documents = documentsData?.pages?.flatMap((page) => {
    console.log("Page de documents reçue:", page);
    // L'API peut retourner les documents dans différents formats
    if (page.data && Array.isArray(page.data)) {
      return page.data;
    } else if (page.documents && Array.isArray(page.documents)) {
      return page.documents;
    } else if (Array.isArray(page)) {
      return page;
    }
    return [];
  }).flat() || [];

  console.log("Documents extraits:", documents);

  useEffect(() => {
    const loadEmploye = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error("L'identifiant de l'employé est manquant dans l'URL");
        }

        const employeId = parseInt(id);
        if (isNaN(employeId) || employeId <= 0) {
          throw new Error("L'identifiant de l'employé est invalide");
        }

        // Charger les données de l'employé
        const data = await fetchEmployeById(employeId);

        // Vérifier les données reçues
        if (!data || !data.id_employes) {
          throw new Error(
            "Les données de l'employé sont invalides ou incomplètes"
          );
        }

        setUserInfo(data);

        // Charger le titre du poste si disponible
        if (data.id_fonction) {
          try {
            const fonctionData = await fetchFonctionById(data.id_fonction);
            setJobTitle(fonctionData?.nom_fonction || "Non spécifié");
          } catch (err) {
            console.error("Erreur lors du chargement de la fonction:", err);
            setJobTitle("Non spécifié");
          }
        }

        // Documents will be loaded by useInfiniteQuery
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur inattendue s'est produite"
        );
      } finally {
        setLoading(false);
      }
    };

    loadEmploye();
  }, [id, fetchEmployeById, fetchEmployeDocuments]); // Dépendance unique sur l'ID



  const handleClick = (id: string | number | undefined) => {
    if (!id) {
      console.error("ID manquant pour la modification");
      return;
    }
    navigate(`/resources-humaines/employes/${id}/editer`);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !id) return;

    // Validation du fichier
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Format de fichier non supporté. Utilisez JPEG, PNG ou GIF.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      toast.error("Fichier trop volumineux. Taille maximale : 5MB");
      return;
    }

    try {
      setIsUploadingPhoto(true);
      console.log("=== DÉBUT UPLOAD PHOTO ===");
      console.log("ID employé:", id, "Fichier:", file.name, "Taille:", file.size);
      
      const updatedEmploye = await uploadEmployePhoto(parseInt(id), file);
      
      console.log("Employé mis à jour:", updatedEmploye);
      
      if (updatedEmploye && updatedEmploye.id_employes) {
        console.log("Employé valide après upload, mise à jour de l'état");
        setUserInfo(updatedEmploye);
        toast.success("Photo de profil mise à jour avec succès");
      } else {
        console.error("Données d'employé invalides après upload:", updatedEmploye);
        toast.error("Erreur: données d'employé invalides après upload");
        
        // Essayer de récupérer les données de l'employé pour vérifier s'il existe toujours
        try {
          console.log("Tentative de récupération des données de l'employé...");
          const currentEmploye = await fetchEmployeById(parseInt(id));
          if (currentEmploye && currentEmploye.id_employes) {
            console.log("Employé existe toujours, mise à jour avec les données actuelles");
            setUserInfo(currentEmploye);
          } else {
            console.error("L'employé n'existe plus après l'upload de photo");
            setError("L'employé a été supprimé lors de l'upload de la photo");
          }
        } catch (recoveryError) {
          console.error("Erreur lors de la récupération de l'employé:", recoveryError);
          setError("Impossible de récupérer les données de l'employé après l'upload");
        }
      }
    } catch (error) {
      console.error("=== ERREUR UPLOAD PHOTO ===");
      console.error("Erreur complète:", error);
      console.error("Type d'erreur:", typeof error);
      console.error("Message d'erreur:", error instanceof Error ? error.message : "Erreur inconnue");
      
      if (error instanceof Error) {
        toast.error(`Erreur lors de l'upload de la photo: ${error.message}`);
      } else {
        toast.error("Erreur lors de l'upload de la photo");
      }
    } finally {
      setIsUploadingPhoto(false);
      console.log("=== FIN UPLOAD PHOTO ===");
    }
  };

  // Fonctions de gestion de la suppression
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      await deleteEmploye(parseInt(id));
      toast.success("Employé supprimé avec succès");
      navigate("/resources-humaines/employes");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression de l'employé");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="mb-4">Chargement...</div>
        <div className="text-sm text-gray-500">
          <div>ID dans l'URL: {id || "Non défini"}</div>
          <div>Chemin complet: {window.location.pathname}</div>
        </div>
      </div>
    );
  }

  if (error || !userInfo) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-500">
        <div className="mb-4">{error || "Employé non trouvé"}</div>
        <div className="text-sm">
          <div>ID dans l'URL: {id || "Non défini"}</div>
          <div>Chemin complet: {window.location.pathname}</div>
          <button
            onClick={() => navigate("/resources-humaines/employers")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with photo and name */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar className="w-24 h-24 border-4 border-white cursor-pointer">
                <AvatarImage 
                  src={getPhotoUrl(userInfo.photo_employes)} 
                  alt={`${userInfo.prenom_employes} ${userInfo.nom_employes}`}
                  className="w-full h-full object-cover"
                />
                <AvatarFallback className="bg-gray-800 text-xl">
                  {userInfo.nom_employes.charAt(0) +
                    userInfo.prenom_employes.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <label className="cursor-pointer text-white text-sm font-medium">
                  {isUploadingPhoto ? "Upload..." : "Changer"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={isUploadingPhoto}
                  />
                </label>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">
                {userInfo.prenom_employes} {userInfo.nom_employes}
              </h1>
              <p className="text-blue-100">{jobTitle}</p>
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className="bg-blue-500/20 text-white border-blue-200"
                >
                  {userInfo.status_employes}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="container mx-auto px-4 -mt-4 rounded-lg shadow-md">
        <Tabs defaultValue="profil" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profil">Profil</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>
          <TabsContent value="profil" className="p-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Informations personnelles
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-500 cursor-pointer"
                      onClick={() => handleClick(id)}
                    >
                      <Edit size={16} className="mr-2" />
                      Modifier
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Nom complet</p>
                        <p className="font-medium">
                          {userInfo.prenom_employes} {userInfo.nom_employes}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <Briefcase size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Poste</p>
                        <p className="font-medium">{jobTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date d'embauche</p>
                        <p className="font-medium">
                          {userInfo.date_embauche_employes}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Adresse</p>
                        <p className="font-medium">
                          {userInfo.adresse_employes}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <Mail size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{userInfo.email_employes}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium">
                          {userInfo.contact_employes}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="documents" className="p-6">
            <EmployeDocuments employeId={Number(id)} />
          </TabsContent>
          <TabsContent value="settings" className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Paramètres du compte
            </h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h3 className="font-medium">
                      Modification des infos personnelles
                    </h3>
                    <p className="text-sm text-gray-500">
                      Modifier vos informations de profil
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => handleClick(id)}>
                    <ExternalLink size={16} className="mr-2" />
                    Accéder
                  </Button>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h3 className="font-medium">Préférences de notification</h3>
                    <p className="text-sm text-gray-500">
                      Gérer vos préférences d'email et notifications
                    </p>
                  </div>
                  <Button disabled variant="outline">
                    <ExternalLink size={16} className="mr-2" />
                    Accéder
                  </Button>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h3 className="font-medium">Sécurité du compte</h3>
                    <p className="text-sm text-gray-500">
                      Modifier votre mot de passe et sécurité
                    </p>
                  </div>
                  <Button disabled variant="outline">
                    <ExternalLink size={16} className="mr-2" />
                    Accéder
                  </Button>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h3 className="font-medium text-red-600">
                      Suspension d'accès
                    </h3>
                    <p className="text-sm text-gray-500">
                      Suspendre temporairement l'accès
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      // TODO: Implémenter la logique de suspension
                      toast.info("Fonctionnalité en cours de développement");
                    }}
                  >
                    Suspendre
                  </Button>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h3 className="font-medium text-red-600">
                      Suppression définitive
                    </h3>
                    <p className="text-sm text-gray-500">
                      Supprimer définitivement cet employé et toutes ses données
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'employé{" "}
              <strong>
                {userInfo?.prenom_employes} {userInfo?.nom_employes}
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
  );
};

export default ModernUserProfile;
