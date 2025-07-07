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
} from "../api/intervention";
import { getPartenaires } from "../../projects/projet/api/partenaires";
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
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";



interface InterventionDetailsProps {
  intervention: Intervention;
  onDocumentAdded: () => void;
  onDocumentDeleted: () => void;
}

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

  const loadData = useCallback(async () => {
    try {
      const [documentsResponse, employesResponse, partenairesResponse] =
        await Promise.all([
          getInterventionDocuments(intervention.id_intervention),
          getInterventionEmployees(intervention.id_intervention),
          getPartenaires(),
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
  }, [intervention.id_intervention, intervention.id_partenaire]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      const documentUrl = `${import.meta.env.VITE_APP_API_URL}/${doc.lien_document}`;

      // Ouvrir le document dans un nouvel onglet pour le téléchargement
      window.open(documentUrl, "_blank");
    } catch (error) {
      console.error("Erreur lors du téléchargement du document:", error);
      toast.error("Erreur lors du téléchargement du document");
    }
  };

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
            onClick={() => navigate("/technique/interventions")}
          >
            <Home className="mr-2 h-4 w-4" />
            Tableau de bord
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/technique/interventions/liste")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Voir toutes les interventions
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/technique/interventions/rapports")}
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
                {intervention.detail_cause}
              </p>
            </div>
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
              Personnel affecté à cette intervention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Spécialité</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employes.map((employe) => (
                  <TableRow key={employe.id_employes}>
                    <TableCell className="font-medium">
                      {employe.nom_employes}
                    </TableCell>
                    <TableCell>{employe.prenom_employes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
    </div>
  );
};
