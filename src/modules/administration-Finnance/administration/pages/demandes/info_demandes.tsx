import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useParams, useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  FileText,
  User,
  Pencil,
  XCircle,
  CheckCircle,
  ClockIcon,
  Paperclip,
  Loader2,
  Trash2,
  ArrowLeft,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

// Importez les fonctions d'appel API de votre service
import {
  fetchDemandeById,
  fetchEmployeById,
  getAllNatureDocuments,
  updateDemande,
  deleteDemande,
  fetchDocumentsByDemande,
} from "../../../services/demandeService"; // Ajustez le chemin si nécessaire

// Assurez-vous que ces chemins sont corrects pour vos interfaces
import { Employe, Demande, NatureDocument, DemandeDocument } from "../../types/interfaces";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

// Configuration pour les fichiers statiques
const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
const STATIC_FILES_BASE_URL = API_BASE_URL.endsWith('/api') 
  ? API_BASE_URL.slice(0, -4)
  : API_BASE_URL;

// Fonction utilitaire pour formater les dates (celle que vous avez déjà corrigée)
const formatShortDate = (date: Date | string | null | undefined): string => {
  if (!date) return "N/A";

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return "N/A";

  return format(dateObj, "dd MMMM yyyy", { locale: fr });
};

const DemandeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State pour les données
  const [demande, setDemande] = useState<Demande | null>(null);
  const [employe, setEmploye] = useState<Employe | null>(null);
  const [naturesDocuments, setNaturesDocuments] = useState<NatureDocument[]>(
    []
  );
  const [documents, setDocuments] = useState<DemandeDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les dialogues d'approbation/refus
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Fonctions utilitaires pour les fichiers (inspirées de financeCompta)
  const getFileType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    return extension.toUpperCase();
  };

  const getFileTypeColor = (filename: string) => {
    const type = getFileType(filename).toLowerCase();
    switch (type) {
      case "pdf":
        return "bg-red-100 text-red-800";
      case "docx":
        return "bg-blue-100 text-blue-800";
      case "xlsx":
        return "bg-green-100 text-green-800";
      case "pptx":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDownloadDocument = async (doc: DemandeDocument) => {
    if (!doc.lien_document || doc.lien_document.trim() === "") {
      toast.error('Aucun fichier disponible pour le téléchargement');
      return;
    }

    // Vérifier si c'est un blob URL (qui ne sera plus valide après rechargement)
    if (doc.lien_document.startsWith('blob:')) {
      toast.error('Ce fichier n\'est plus disponible pour le téléchargement. Il a été temporairement stocké lors de la création de la demande.');
      return;
    }

    try {
      const absoluteUrl = `${STATIC_FILES_BASE_URL}/${doc.lien_document}`;
      console.log('Tentative de téléchargement depuis:', absoluteUrl);
      
      const response = await fetch(absoluteUrl, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = doc.lien_document.split('/').pop() || doc.libelle_document || 'document';
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Document téléchargé avec succès');
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
      toast.error('Erreur lors du téléchargement du fichier. Vérifiez que le fichier existe sur le serveur.');
    }
  };

  useEffect(() => {
    const fetchAllDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupération de la demande par son ID
        const fetchedDemande = await fetchDemandeById(Number(id));
        setDemande(fetchedDemande);

        if (!fetchedDemande.id_employes) {
          throw new Error("La demande n'a pas d'employé associé.");
        }

        // Récupération de l'employé associé via son ID, au lieu de toute la liste
        const fetchedEmploye = await fetchEmployeById(
          fetchedDemande.id_employes
        );
        setEmploye(fetchedEmploye);

        // Récupération des natures de documents
        const fetchedNaturesDocuments = await getAllNatureDocuments();
        setNaturesDocuments(fetchedNaturesDocuments);

        // Récupération des documents associés à la demande via un appel API séparé
        console.log("Récupération des documents pour la demande:", id);
        const fetchedDocuments = await fetchDocumentsByDemande(Number(id));
        console.log("Documents récupérés:", fetchedDocuments);
        setDocuments(fetchedDocuments);
      } catch (err: unknown) {
        console.error("Erreur lors du chargement des détails :", err);
        setError((typeof err === 'object' && err !== null && 'message' in err) ? (err as { message?: string }).message || "Impossible de charger les détails de la demande." : "Impossible de charger les détails de la demande.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAllDetails();
    }
  }, [id]); // Déclenche l'effet lorsque l'ID change

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Chargement des détails...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  // Vérifications finales après le chargement et la gestion des erreurs
  if (!demande || !employe) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        <p>Demande ou employé non trouvé. L'ID pourrait être invalide.</p>
      </div>
    );
  }

  // Fonction pour obtenir la couleur et l'icône du badge selon le statut
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Approuvé":
      case "Approuvée":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
        };
      case "Refusé":
      case "Refusée":
        return {
          color: "bg-red-100 text-red-800",
          icon: <XCircle className="h-4 w-4 mr-1" />,
        };
      case "En attente":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <ClockIcon className="h-4 w-4 mr-1" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <FileText className="h-4 w-4 mr-1" />,
        };
    }
  };

  const statusInfo = getStatusInfo(demande.status);

  // Fonction pour naviguer vers la page de modification
  const handleEdit = () => {
    navigate(`/administration/demandes/${id}/editer`);
  };

  // Fonction pour approuver une demande
  const handleApprove = async () => {
    if (!id || !demande) return;

    try {
      setActionLoading(true);
      // Utiliser updateDemande pour approuver, en s'assurant de ne pas envoyer de champ vide
      const updatedData: {
        status: string;
        commentaire_approbation?: string;
      } = {
        status: "Approuvé",
      };

      if (approvalComment) {
        updatedData.commentaire_approbation = approvalComment;
      }

      await updateDemande(Number(id), updatedData);

      // Recharger les données de la demande pour avoir le nouveau statut
      const updatedDemande = await fetchDemandeById(Number(id));
      setDemande(updatedDemande);

      setShowApproveDialog(false);
      setApprovalComment("");

      console.log("Demande approuvée avec succès");
    } catch (err: unknown) {
      console.error("Erreur lors de l'approbation:", err);
      setError((typeof err === 'object' && err !== null && 'message' in err) ? (err as { message?: string }).message || "Erreur lors de l'approbation de la demande" : "Erreur lors de l'approbation de la demande");
    } finally {
      setActionLoading(false);
    }
  };

  // Fonction pour refuser une demande
  const handleReject = async () => {
    if (!id || !demande) return;

    try {
      setActionLoading(true);
      // Utiliser updateDemande pour refuser, en s'assurant de ne pas envoyer de champ vide
      const updatedData: {
        status: string;
        motif_refus?: string;
      } = {
        status: "Refusé",
      };

      if (rejectionReason) {
        updatedData.motif_refus = rejectionReason;
      }

      await updateDemande(Number(id), updatedData);

      // Recharger les données de la demande pour avoir le nouveau statut
      const updatedDemande = await fetchDemandeById(Number(id));
      setDemande(updatedDemande);

      setShowRejectDialog(false);
      setRejectionReason("");

      console.log("Demande refusée avec succès");
    } catch (err: unknown) {
      console.error("Erreur lors du refus:", err);
      setError((typeof err === 'object' && err !== null && 'message' in err) ? (err as { message?: string }).message || "Erreur lors du refus de la demande" : "Erreur lors du refus de la demande");
    } finally {
      setActionLoading(false);
    }
  };

  // Fonction pour supprimer une demande
  const handleDelete = async () => {
    if (!id) return;

    try {
      setActionLoading(true);
      await deleteDemande(Number(id));
      console.log("Demande supprimée avec succès");
      navigate("/administration/demandes"); // Rediriger vers la liste après suppression
    } catch (err: unknown) {
      console.error("Erreur lors de la suppression:", err);
      setError((typeof err === 'object' && err !== null && 'message' in err) ? (err as { message?: string }).message || "Erreur lors de la suppression de la demande" : "Erreur lors de la suppression de la demande");
    } finally {
      setActionLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/administration/demandes")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte principale avec les détails de la demande */}
        <div className="md:col-span-2">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Demande #{id}
                </CardTitle>
                <CardDescription className="mt-1">
                  {demande.type_demande}
                </CardDescription>
              </div>
              <Badge className={`flex items-center ${statusInfo.color}`}>
                {statusInfo.icon}
                {demande.status}
              </Badge>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">
                      Type de demande
                    </div>
                    <div className="text-base">{demande.type_demande}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">
                      Durée
                    </div>
                    <div className="text-base">{demande.duree} jours</div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">
                      Date d'absence
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span>{formatShortDate(demande.date_absence)}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">
                      Date de retour
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span>{formatShortDate(demande.date_retour)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Motif</div>
                  <div className="text-base p-3 bg-gray-50 rounded-md">
                    {demande.motif}
                  </div>
                </div>

                {/* Section pour les documents joints */}
                {documents && documents.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">
                        Documents joints ({documents.length})
                      </div>
                      <div className="space-y-2">
                        {documents.map((doc) => (
                          <div
                            key={doc.id_documents}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <Paperclip className="h-4 w-4 text-gray-500" />
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {doc.libelle_document}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  {doc.lien_document && !doc.lien_document.startsWith('blob:') && (
                                    <Badge className={getFileTypeColor(doc.lien_document)}>
                                      {getFileType(doc.lien_document)}
                                    </Badge>
                                  )}
                                  {doc.classification_document && (
                                    <Badge variant="outline" className="text-xs">
                                      {doc.classification_document}
                                    </Badge>
                                  )}
                                  {doc.id_nature_document && (
                                    <Badge variant="secondary" className="text-xs">
                                      {naturesDocuments.find(
                                        (n) => n.id_nature_document === doc.id_nature_document
                                      )?.libelle || "Type inconnu"}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatShortDate(doc.date_document)}
                                </p>
                                {doc.lien_document && doc.lien_document.startsWith('blob:') && (
                                  <p className="text-xs text-orange-600 mt-1">
                                    ⚠️ Fichier temporaire (non téléchargeable)
                                  </p>
                                )}
                              </div>
                            </div>
                            {doc.lien_document && !doc.lien_document.startsWith('blob:') ? (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleDownloadDocument(doc)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Télécharger
                              </Button>
                            ) : (
                              <div className="text-xs text-gray-400 px-2 py-1">
                                Non téléchargeable
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Message si aucun document */}
                {documents && documents.length === 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">
                        Documents joints
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md text-center text-gray-500">
                        <Paperclip className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">Aucun document joint à cette demande</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Carte de décision - affiche le commentaire d'approbation ou le motif de refus */}
                {(demande.commentaire_approbation || demande.motif_refus) && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">
                        Commentaire
                      </div>
                      <div className={`p-4 rounded-md border-l-4 ${
                        demande.status === "Approuvée" || demande.status === "Approuvé"
                          ? "bg-green-50 border-green-400 text-green-800" 
                          : "bg-red-50 border-red-400 text-red-800"
                      }`}>
                        <div className="flex items-start space-x-3">
                          {demande.status === "Approuvée" || demande.status === "Approuvé" ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">
                              {demande.status === "Approuvée" || demande.status === "Approuvé" ? "Demande approuvée" : "Demande refusée"}
                            </p>
                            <p className="text-sm">
                              {demande.commentaire_approbation || demande.motif_refus}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      {employe.prenom_employes} {employe.nom_employes}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Employé #{employe.id_employes}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2 border-t pt-4">
              {demande.status === "En attente" && (
                <>
                  <Button 
                    variant="outline" 
                    className="bg-red-50 text-red-600 hover:bg-red-100"
                    onClick={() => setShowRejectDialog(true)}
                    disabled={actionLoading}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Refuser
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-green-50 text-green-600 hover:bg-green-100"
                    onClick={() => setShowApproveDialog(true)}
                    disabled={actionLoading}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approuver
                  </Button>
                </>
              )}
              <Button onClick={handleEdit} disabled={actionLoading} variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                disabled={actionLoading}
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Carte latérale avec résumé et historique */}
        <div className="md:col-span-1 space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Récapitulatif
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Statut
                </span>
                <Badge className={statusInfo.color}>
                  {statusInfo.icon}
                  {demande.status}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Type</span>
                <span>{demande.type_demande}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Employé
                </span>
                <span>
                  {employe.prenom_employes} {employe.nom_employes}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Durée</span>
                <span>{demande.duree} jours</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Période
                </span>
                <span className="text-sm">
                  {formatShortDate(demande.date_absence)} -{" "}
                  {formatShortDate(demande.date_retour)}
                </span>
              </div>

              {/* Affichage du commentaire d'approbation ou motif de refus dans le récapitulatif */}
              {(demande.commentaire_approbation || demande.motif_refus) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-500">
                      Commentaire
                    </span>
                    <div className={`p-2 rounded text-xs ${
                      demande.status === "Approuvée" || demande.status === "Approuvé"
                        ? "bg-green-50 text-green-700" 
                        : "bg-red-50 text-red-700"
                    }`}>
                      {demande.commentaire_approbation || demande.motif_refus}
                    </div>
                  </div>
                </>
              )}

              {/* Informations sur les documents */}
              <Separator />
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-500">
                  Documents joints
                </span>
                <div className="text-sm text-gray-800">
                  {documents.length} document{documents.length > 1 ? 's' : ''}
                </div>
              </div>
            </CardContent>

            {documents && documents.length > 0 && (
              <CardFooter className="flex flex-col space-y-2 border-t pt-4">
                {documents.some(doc => doc.lien_document && !doc.lien_document.startsWith('blob:')) ? (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const downloadableDoc = documents.find(doc => doc.lien_document && !doc.lien_document.startsWith('blob:'));
                      if (downloadableDoc) {
                        handleDownloadDocument(downloadableDoc);
                      }
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger un document
                  </Button>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">
                      {documents.length} document{documents.length > 1 ? 's' : ''} joint{documents.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-400">
                      Documents temporaires (non téléchargeables)
                    </p>
                  </div>
                )}
              </CardFooter>
            )}
          </Card>
        </div>
      </div>

      {/* Dialogue d'approbation */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approuver la demande</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir approuver cette demande ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="approval-comment">Commentaire (optionnel)</Label>
              <Textarea
                id="approval-comment"
                placeholder="Ajoutez un commentaire d'approbation..."
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleApprove}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approbation...
                </>
              ) : (
                "Approuver"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialogue de refus */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Refuser la demande</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir refuser cette demande ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Motif du refus (recommandé)</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Expliquez pourquoi cette demande est refusée..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReject}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refus...
                </>
              ) : (
                "Refuser"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialogue de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la demande</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette demande ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DemandeDetailPage;