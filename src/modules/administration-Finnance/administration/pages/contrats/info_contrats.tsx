import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  Edit,
  FileText,
  Calendar,
  Clock,
  Building,
  FileSignature,
  ChevronRight,
  AlarmClock,
  Plus,
  Trash2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchContratById } from '../../../services/contratService';
import { fetchPartnerById } from '../../../services/partenaireService';
import { ApiError, MutationError } from '../../types/interfaces';
import { deleteDocumentFromContrat } from '../../../services/contratService';
import { toast } from 'sonner';
import DocumentSheet from './DocumentSheet';

const InfoContract: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [showFilePreview, setShowFilePreview] = useState(false);

  // Récupération du contrat
  const { data: contrat, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['contrat', id],
    queryFn: () => fetchContratById(id!),
    enabled: !!id,
  });


  
  // Fonction pour calculer la durée si elle n'existe pas
  const calculateDuration = (dateDebut: string, dateFin: string) => {
    if (!dateDebut || !dateFin) return "Non calculée";
    
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    
    if (isNaN(debut.getTime()) || isNaN(fin.getTime())) return "Dates invalides";
    
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

  // Récupération du partenaire associé
  const { data: partenaire } = useQuery({
    queryKey: ['partenaire', contrat?.id_partenaire],
    queryFn: () => contrat?.id_partenaire ? fetchPartnerById(contrat.id_partenaire) : Promise.resolve(undefined),
    enabled: !!contrat?.id_partenaire,
  });

  // Mutation pour supprimer un document
  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: number) => deleteDocumentFromContrat(documentId),
    onSuccess: () => {
      toast.success('Document supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['contrat', id] });
    },
    onError: (error: MutationError) => {
      toast.error('Erreur lors de la suppression du document', {
        description: error.message || 'Une erreur inattendue s\'est produite',
      });
    },
  });

  const handleDeleteDocument = (documentId: number) => {
    deleteDocumentMutation.mutate(documentId);
  };

  // Get API_URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

  // Determine the base URL for static files (media, documents, etc.)
  // Assumes API_BASE_URL ends with /api (e.g., https://erpback.dcat.ci/api)
  // and static files are served from the root domain (e.g., https://erpback.dcat.ci/media/...)
  const STATIC_FILES_BASE_URL = API_BASE_URL.endsWith("/api")
    ? API_BASE_URL.slice(0, -4) // Remove '/api' from the end
    : API_BASE_URL; // Otherwise, use it as is



  // Loader global
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600 animate-pulse">Chargement du contrat...</div>
      </div>
    );
  }
  if (isError || !contrat) {
    // Gestion explicite du 404
    const is404 = (error as ApiError)?.response?.status === 404;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">
          {is404 ? "Contrat introuvable (404)." : "Erreur lors du chargement du contrat."}
        </p>
        <Button variant="outline" onClick={() => is404 ? navigate('/administration/contrats') : refetch()}>
          {is404 ? "Retour à la liste des contrats" : "Réessayer"}
        </Button>
      </div>
    );
  }

  // Calcul du pourcentage de progression du contrat
  const calculateProgress = () => {
    const startDate = new Date(contrat.date_debut);
    const endDate = new Date(contrat.date_fin);
    const today = new Date();
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedDuration = today.getTime() - startDate.getTime();
    if (elapsedDuration < 0) return 0;
    if (elapsedDuration > totalDuration) return 100;
    return Math.round((elapsedDuration / totalDuration) * 100);
  };
  const progress = calculateProgress();

  // Statut visuel
  const getStatusColor = (status: string) => {
    switch (status) {
      case "actif":
      case "Actif":
        return "bg-green-100 text-green-800";
      case "en_attente":
      case "En attente":
        return "bg-amber-100 text-amber-800";
      case "approuvé":
      case "Approuvé":
        return "bg-blue-100 text-blue-800";
      case "expiré":
      case "Expiré":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <FileSignature size={48} className="text-emerald-600" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">
                    {contrat.nom_contrat}
                  </h1>
                  <p className="text-emerald-100">
                    Référence: {contrat.reference || contrat.id_contrat}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`mt-2 md:mt-0 border-emerald-200 self-center ${getStatusColor(contrat.statut)}`}
                >
                  {contrat.statut}
                </Badge>
              </div>
              <div className="mt-4 flex flex-col md:flex-row gap-2 md:gap-6">
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2 text-emerald-200" />
                  <span>Début: {contrat.date_debut}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2 text-emerald-200" />
                  <span>Fin: {contrat.date_fin}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="mr-2 text-emerald-200" />
                  <span>Durée: {contrat.duree_contrat || calculateDuration(contrat.date_debut, contrat.date_fin)}</span>
                </div>
              </div>
            </div>
            <Button
              className="bg-white text-emerald-700 hover:bg-emerald-50"
              onClick={() => setShowFilePreview(!showFilePreview)}
            >
              <FileText size={18} className="mr-2" />
              VOIR LE CONTRAT
            </Button>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Progression du contrat</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-emerald-200" />
          </div>
        </div>
      </div>
      {/* Navigation tabs */}
      <div className="container mx-auto px-4 -mt-4 rounded-lg shadow-md">
        <Tabs defaultValue="details" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Informations du contrat
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-500 cursor-pointer"
                      onClick={() => navigate(`/administration/contrats/${contrat.id_contrat}/editer`)}
                    >
                      <Edit size={16} className="mr-2" />
                      Modifier
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Nom du contrat</p>
                        <p className="font-medium">
                          {contrat.nom_contrat}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
                        <FileSignature size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Référence</p>
                        <p className="font-medium">{contrat.reference || contrat.id_contrat}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date de début</p>
                        <p className="font-medium">{contrat.date_debut}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date de fin</p>
                        <p className="font-medium">{contrat.date_fin}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Durée</p>
                        <p className="font-medium">
                          {contrat.duree_contrat || calculateDuration(contrat.date_debut, contrat.date_fin)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
                        <Building size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type de contrat</p>
                        <p className="font-medium">
                          {contrat.type_de_contrat}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                      Partenaire associé
                    </h2>
                    {partenaire ? (
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-between text-left p-4 mb-4"
                        onClick={() => navigate(`/administration/partenaires/profil/${partenaire.id_partenaire}`)}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                            <Building size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {partenaire.nom_partenaire}
                            </p>
                            <p className="text-sm text-gray-500">
                              {partenaire.specialite}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                      </Button>
                    ) : (
                      <div className="text-gray-400 italic">Aucun partenaire associé</div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Actions rapides
                  </h2>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-gray-700 hover:text-emerald-600 hover:border-emerald-200 group"
                    >
                      <Download
                        size={18}
                        className="mr-2 text-gray-400 group-hover:text-emerald-500"
                      />
                      Télécharger le contrat
                    </Button>
                    <Button
                      disabled
                      variant="outline"
                      className="w-full justify-start text-gray-700 hover:text-emerald-600 hover:border-emerald-200 group"
                    >
                      <AlarmClock
                        size={18}
                        className="mr-2 text-gray-400 group-hover:text-emerald-500"
                      />
                      Ajouter une échéance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
                      </TabsContent>
            <TabsContent value="documents" className="p-6">
              <div className="space-y-6">
                {/* En-tête avec bouton d'ajout */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Documents du contrat</h2>
                  <DocumentSheet
                    contratId={parseInt(id!)}
                    onDocumentAdded={() => {
                      queryClient.invalidateQueries({ queryKey: ['contrat', id] });
                    }}
                    trigger={
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus size={16} className="mr-2" />
                        Ajouter un document
                      </Button>
                    }
                  />
                </div>



                {/* Liste des documents existants */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Documents existants</h3>
                    
                    {contrat?.documents && Array.isArray(contrat.documents) && contrat.documents.length > 0 ? (
                      <div className="space-y-3">
                        {contrat.documents.map((doc) => (
                          <div key={doc.id_documents} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-6 w-6 text-blue-500" />
                              <div>
                                <p className="font-medium text-gray-900">{doc.libelle_document}</p>
                                <p className="text-sm text-gray-500">{doc.classification_document}</p>
                                <p className="text-xs text-gray-400">
                                  Ajouté le {new Date(doc.date_document).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {doc.lien_document && (
                                <a
                                  href={`${STATIC_FILES_BASE_URL}/${doc.lien_document}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
                                  download
                                >
                                  <Download size={16} className="mr-2" />
                                  Télécharger
                                </a>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteDocument(doc.id_documents)}
                                disabled={deleteDocumentMutation.isLoading}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 size={16} className="mr-2" />
                                {deleteDocumentMutation.isLoading ? 'Suppression...' : 'Supprimer'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">Aucun document associé à ce contrat</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Cliquez sur "Ajouter un document" pour commencer
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      {/* Modal pour la prévisualisation du fichier (simulé) */}
      {showFilePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-3/4 flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium text-lg">
                Aperçu du contrat: {contrat.nom_contrat}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilePreview(false)}
              >
                ✕
              </Button>
            </div>
            <div className="flex-1 bg-gray-100 p-4 overflow-auto">
              <div className="bg-white h-full w-full flex items-center justify-center border shadow">
                <div className="text-center p-8">
                  <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    Aperçu du contrat
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Dans une application réelle, le PDF serait affiché ici
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowFilePreview(false)}
              >
                Fermer
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Download size={16} className="mr-2" />
                Télécharger
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoContract;
