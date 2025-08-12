import React, { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Intervention,
  InterventionDocument,
  Employe,
  Partenaire,
} from "../interface/interface";
import {
  getInterventionDocuments,
  getInterventionEmployees,
  removeDocumentFromIntervention,
  assignEmployeeToIntervention,
  removeEmployeeFromIntervention,
  assignSuperviseurToIntervention,
  updateIntervention,
} from "../api/intervention";
import { usePartenairesApi } from "../../projects/projet/api/partenaires";
import { AddDocumentSheet } from "./AddDocumentSheet";
import {
  Download,
  FileText,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  User,
  Building,
  AlertTriangle,
  Wrench,
  Home,
  BarChart3,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useContratsApi } from '@/modules/administration-Finnance/services/contratService';
import { Contrat } from '@/modules/administration-Finnance/administration/types/interfaces';
import { useEmployesApi } from '../../projects/projet/api/employes';


interface InterventionDetailsProps {
  intervention: Intervention;
  onDocumentAdded: () => void;
  onDocumentDeleted: () => void;
}
const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
const STATIC_FILES_BASE_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL.slice(0, -4) // Remove '/api' from the end
  : API_BASE_URL; // Otherwise, use it as is

export const InterventionDetails: React.FC<InterventionDetailsProps> = ({
  intervention,
  onDocumentAdded,
  onDocumentDeleted,
}) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<InterventionDocument[]>([]);
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [partenaire, setPartenaire] = useState<Partenaire | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddSuperviseurOpen, setIsAddSuperviseurOpen] = useState(false);
  const [contrat, setContrat] = useState<Contrat | null>(null);
  const [superviseur, setSuperviseur] = useState<Employe | null>(null);
  const [allEmployes, setAllEmployes] = useState<Employe[]>([]);
  const { fetchContratById } = useContratsApi();
  const { getPartenaires } = usePartenairesApi();
  const { getEmployes } = useEmployesApi();
  const loadData = useCallback(async () => {
    try {
      const [documentsResponse, employesResponse, partenairesResponse, allEmployesResponse] =
        await Promise.all([
          getInterventionDocuments(intervention.id_intervention),
          getInterventionEmployees(intervention.id_intervention),
          getPartenaires({ limit: 100, page: 1 }),
          getEmployes({ limit: 100, page: 1 }),
        ]);

      let docsToSet: InterventionDocument[] = [];
      if (
        documentsResponse.documents &&
        Array.isArray(documentsResponse.documents)
      ) {
        docsToSet = documentsResponse.documents;
      } else if (
        documentsResponse.data &&
        Array.isArray(documentsResponse.data)
      ) {
        docsToSet = documentsResponse.data;
      }
      console.log("Documents chargés:", docsToSet);
      setDocuments(docsToSet);

      setEmployes(employesResponse.data || []);
      setAllEmployes(allEmployesResponse || []);
      const partenaireFound = partenairesResponse.find(
        (p) => p.id_partenaire === intervention.id_partenaire
      );
      setPartenaire(partenaireFound || null);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  }, [intervention.id_intervention, intervention.id_partenaire, getPartenaires]);

  useEffect(() => {
    loadData();
    // Charger le contrat si id_contrat existe
    const loadContrat = async () => {
      if (intervention.id_contrat) {
        try {
          const contratData = await fetchContratById(intervention.id_contrat);
          setContrat(contratData || null);
        } catch {
          setContrat(null);
        }
      } else {
        setContrat(null);
      }
    };
    
    // Charger le superviseur via l'API dédiée
    // Charger le superviseur si superviseur existe
    const loadSuperviseur = async () => {
      if (intervention.id_superviseur) {
        try {
          const employesResponse = await getEmployes({ limit: 100, page: 1 });
          const superviseurFound = employesResponse.find(
            (e) => e.id_employes === intervention.id_superviseur
          );
          setSuperviseur(superviseurFound || null);
        } catch {
          setSuperviseur(null);
        }
      } else {
        setSuperviseur(null);
      }
    };
    
    loadContrat();
    loadSuperviseur();
  }, [loadData, intervention.id_contrat, intervention.id_superviseur, fetchContratById, getEmployes]);

  const handleDeleteDocument = async (documentId: number) => {
    try {
      await removeDocumentFromIntervention(
        intervention.id_intervention,
        documentId
      );
      toast.success("Document supprimé avec succès");
      loadData(); // Recharger la liste des documents
      onDocumentDeleted();
    } catch (error) {
      console.error("Erreur lors de la suppression du document:", error);
      toast.error("Erreur lors de la suppression du document");
    }
  };

  const handleDownloadDocument = async (doc: InterventionDocument) => {
    try {
      // Construire l'URL complète du document
      const documentUrl = `${STATIC_FILES_BASE_URL}/${doc.lien_document}`;

      // Ouvrir le document dans un nouvel onglet pour le téléchargement
      window.open(documentUrl, "_blank");
    } catch (error) {
      console.error("Erreur lors du téléchargement du document:", error);
      toast.error("Erreur lors du téléchargement du document");
    }
  };

  const handleAssignEmployee = async (employeeId: number) => {
    try {
      await assignEmployeeToIntervention(intervention.id_intervention, employeeId);
      toast.success('Employé assigné avec succès');
      // Recharger les employés
      const employesResponse = await getInterventionEmployees(intervention.id_intervention);
      setEmployes(employesResponse.data || []);
      setIsAddEmployeeOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
      toast.error('Erreur lors de l\'assignation de l\'employé');
    }
  };

  const handleRemoveEmployee = async (employeeId: number) => {
    try {
      await removeEmployeeFromIntervention(intervention.id_intervention, employeeId);
      toast.success('Employé retiré avec succès');
      // Recharger les employés
      const employesResponse = await getInterventionEmployees(intervention.id_intervention);
      setEmployes(employesResponse.data || []);
    } catch (error) {
      console.error('Erreur lors du retrait:', error);
      toast.error('Erreur lors du retrait de l\'employé');
    }
  };

  const handleAssignSuperviseur = async (superviseurId: number) => {
    try {
      await assignSuperviseurToIntervention(intervention.id_intervention, superviseurId);
      toast.success('Superviseur assigné avec succès');
      // Recharger le superviseur
      const employesResponse = await getEmployes({ limit: 100, page: 1 });
      const superviseurFound = employesResponse.find(
        (e) => e.id_employes === superviseurId
      );
      setSuperviseur(superviseurFound || null);
      setIsAddSuperviseurOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'assignation du superviseur:', error);
      toast.error('Erreur lors de l\'assignation du superviseur');
    }
  };

  const handleRemoveSuperviseur = async () => {
    if (!superviseur) return;
    try {
      // Mettre à jour l'intervention pour retirer le superviseur
      await updateIntervention(intervention.id_intervention, { id_superviseur: null });
      toast.success('Superviseur retiré avec succès');
      setSuperviseur(null);
    } catch (error) {
      console.error('Erreur lors du retrait du superviseur:', error);
      toast.error('Erreur lors du retrait du superviseur');
    }
  };



  // Filtrer les employés disponibles (non assignés)
  const availableEmployes = allEmployes.filter(
    emp => !employes.some(assignedEmp => assignedEmp.id_employes === emp.id_employes)
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "terminé":
      case "completed":
        return "default"; // Vert
      case "en cours":
      case "in progress":
        return "secondary"; // Bleu
      case "planifié":
      case "planned":
        return "outline"; // Gris
      default:
        return "destructive"; // Rouge
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* En-tête avec titre et action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Détails de l'intervention
          </h1>
          <p className="text-muted-foreground">
            Intervention #{intervention.id_intervention} •{" "}
            {formatDate(intervention.date_intervention)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/gestion-des-interventions/interventions")}
          >
            <Home className="mr-2 h-4 w-4" />
            Tableau de bord
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/gestion-des-interventions/interventions/liste")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Voir toutes les interventions
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/gestion-des-interventions/interventions/rapports")}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Rapports
          </Button>
          <Button
            onClick={() => setIsAddDocumentOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter un document
          </Button>
          <Button
            onClick={() => navigate(`/gestion-des-interventions/interventions/${intervention.id_intervention}/edit`)}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations générales */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informations générales
            </CardTitle>
            <CardDescription>
              Détails principaux de l'intervention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date d'intervention</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(intervention.date_intervention)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Type d'intervention</p>
                  <Badge variant="outline">
                    {intervention.type_intervention}
                  </Badge>
                </div>
              </div>

              {/* Affichage du contrat associé */}
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Contrat associé</p>
                  {contrat ? (
                    <span
                      className="text-indigo-600 underline cursor-pointer"
                      onClick={() => navigate(`/gestion-administrative/contrats/${contrat.id_contrat}`)}
                    >
                      {contrat.nom_contrat}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Aucun</span>
                  )}
                  {contrat && contrat.duree_contrat && (
                    <span className="ml-2 text-xs text-gray-400">({contrat.duree_contrat})</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <p className="text-sm font-medium">Statut</p>
                  <Badge
                    variant={getStatusBadgeVariant(
                      intervention.statut_intervention
                    )}
                  >
                    {intervention.statut_intervention}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Lieu</p>
                  <p className="text-sm text-muted-foreground">
                    {intervention.lieu}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Durée</p>
                  <p className="text-sm text-muted-foreground">
                    {intervention.duree}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Mode d'intervention</p>
                  <p className="text-sm text-muted-foreground">
                    {intervention.mode_intervention}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partenaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Partenaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            {partenaire ? (
              <div className="space-y-2">
                <p className="font-medium">{partenaire.nom_partenaire}</p>
                <Separator />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Contact</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun partenaire associé
              </p>
            )}
          </CardContent>
        </Card>

        {/* Superviseur */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Superviseur
            </CardTitle>
          </CardHeader>
          <CardContent>
            {superviseur ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{superviseur.prenom_employes} {superviseur.nom_employes}</p>
                      <p className="text-sm text-muted-foreground">{superviseur.email_employes}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSuperviseur()}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Aucun superviseur assigné
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddSuperviseurOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un superviseur
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analyse technique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Analyse technique
          </CardTitle>
          <CardDescription>
            Détails sur la défaillance et les actions correctives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Type de défaillance</h4>
              <Badge variant="destructive" className="text-xs">
                {intervention.type_defaillance}
              </Badge>
            </div>
            <div>
              <h4 className="font-medium mb-2">Cause identifiée</h4>
              <p className="text-sm text-muted-foreground">
                {intervention.cause_defaillance}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Détail de la cause</h4>
              <p className="text-sm text-muted-foreground">
                {intervention.detail_cause || "Aucun détail fourni"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problème signalé */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Problème signalé
          </CardTitle>
          <CardDescription>
            Description du problème initialement signalé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm whitespace-pre-wrap">
              {intervention.probleme_signale || "Aucun problème signalé"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Rapport d'intervention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Rapport d'intervention
          </CardTitle>
          <CardDescription>
            Détails des actions réalisées lors de l'intervention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm whitespace-pre-wrap">
              {intervention.rapport_intervention || "Aucun rapport fourni"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Recommandations
          </CardTitle>
          <CardDescription>
            Suggestions et recommandations suite à l'intervention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm whitespace-pre-wrap">
              {intervention.recommandation || "Aucune recommandation fournie"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Équipe d'intervention */}
      {employes && employes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Équipe d'intervention
            </CardTitle>
            <CardDescription>
              Personnel affecté à cette intervention ({employes.length} personne{employes.length > 1 ? 's' : ''})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">
                {employes.length} employé{employes.length > 1 ? 's' : ''} assigné{employes.length > 1 ? 's' : ''}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddEmployeeOpen(true)}
                disabled={availableEmployes.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un employé
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employes.map((employe) => (
                <div key={employe.id_employes} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {employe.prenom_employes} {employe.nom_employes}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {employe.email_employes}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveEmployee(employe.id_employes)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message si aucun employé */}
      {(!employes || employes.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Équipe d'intervention
            </CardTitle>
            <CardDescription>
              Personnel affecté à cette intervention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucun employé assigné à cette intervention
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Les employés peuvent être assignés directement depuis cette page
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsAddEmployeeOpen(true)}
                disabled={availableEmployes.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un employé
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents associés
          </CardTitle>
          <CardDescription>
            Fichiers et rapports liés à cette intervention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Array.isArray(documents) && documents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date d'ajout</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id_documents}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {doc.libelle_document}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {doc.classification_document || "Document"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {doc.date_document ? formatDate(doc.date_document) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadDocument(doc)}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc.id_documents)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucun document associé à cette intervention
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Cliquez sur "Ajouter un document" pour joindre des fichiers
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AddDocumentSheet
        interventionId={intervention.id_intervention}
        isOpen={isAddDocumentOpen}
        onClose={() => setIsAddDocumentOpen(false)}
        onDocumentAdded={() => {
          loadData();
          onDocumentAdded();
        }}
      />

      {/* Dialog pour ajouter des employés */}
      <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un employé</DialogTitle>
            <DialogDescription>
              Sélectionnez un employé à assigner à cette intervention
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {availableEmployes.length > 0 ? (
              <div className="grid gap-2">
                {availableEmployes.map((employe) => (
                  <div
                    key={employe.id_employes}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {employe.prenom_employes} {employe.nom_employes}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {employe.email_employes}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssignEmployee(employe.id_employes)}
                    >
                      Assigner
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Tous les employés sont déjà assignés à cette intervention
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour ajouter un superviseur */}
      <Dialog open={isAddSuperviseurOpen} onOpenChange={setIsAddSuperviseurOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un superviseur</DialogTitle>
            <DialogDescription>
              Sélectionnez un employé à assigner comme superviseur de cette intervention
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {allEmployes.length > 0 ? (
              <div className="grid gap-2">
                {allEmployes.map((employe) => (
                  <div
                    key={employe.id_employes}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {employe.prenom_employes} {employe.nom_employes}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {employe.email_employes}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleAssignSuperviseur(employe.id_employes);
                        setIsAddSuperviseurOpen(false);
                      }}
                    >
                      Assigner
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucun employé disponible
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};
