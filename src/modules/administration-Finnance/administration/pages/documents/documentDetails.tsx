import React from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, FileText, Download, Eye, Pencil, Trash2, ArrowLeft, File } from "lucide-react";
import {documents} from "./documents"

const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

 

  const document = documents.find(doc => doc.id_documents === Number(id)) || documents[0];

  const getNatureLabel = (natureId?: number): string => {
    if (!natureId) return "Inconnu";
    const natures = {
      1: "Contrat",
      2: "Facture",
      3: "Rapport",
      4: "CV",
      5: "Procédure",
    };
    return natures[natureId as keyof typeof natures] || "Inconnu";
  };

  const getClassificationBadge = (classification?: string) => {
    if (!classification) return "bg-gray-100 text-gray-800";
    const classColors = {
      confidentiel: "bg-red-100 text-red-800 hover:bg-red-200",
      interne: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      public: "bg-green-100 text-green-800 hover:bg-green-200",
      personnel: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      restreint: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    };
    return classColors[classification as keyof typeof classColors] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return { color: "bg-gray-100 text-gray-800", label: "Inconnu" };
    const statusColors = {
      public: "bg-green-100 text-green-800",
      private: "bg-blue-100 text-blue-800",
      draft: "bg-gray-100 text-gray-800",
    };

    const statusLabels = {
      public: "Public",
      private: "Privé",
      draft: "Brouillon",
    };

    return {
      color: statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800",
      label: statusLabels[status as keyof typeof statusLabels] || "Inconnu"
    };
  };

  const handleDownload = () => {
    if (!document.lien_document) {
      alert("Aucun document à télécharger");
      return;
    }
    
    // Création d'un alias pour l'objet document du DOM
    const domDocument = window.document;
    
    const link = domDocument.createElement('a');
    link.href = document.lien_document;
    link.download = document.lien_document.split('/').pop() || 'document';
    link.target = '_blank'; // Optionnel : ouvre dans un nouvel onglet
    link.rel = 'noopener noreferrer'; // Bonne pratique de sécurité
    
    // Ajout au DOM
    domDocument.body.appendChild(link);
    
    // Déclenchement du téléchargement
    link.click();
    
    // Nettoyage
    setTimeout(() => {
      domDocument.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }, 100);
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      alert("Document supprimé avec succès.");
      navigate("/administration/documents");
    }
  };

  const statusInfo = getStatusBadge(document.etat_document);

  const getFileName = () => {
    if (!document.lien_document) return "Document";
    return document.lien_document.split('/').pop() || "Document";
  };

  const getFileType = () => {
    if (!document.lien_document) return "Inconnu";
    const extension = document.lien_document.split('.').pop()?.toUpperCase();
    return extension || "Fichier";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date non disponible";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error("Format de date invalide");

      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error("Erreur de formatage de date:", err);
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-4 flex items-center text-gray-600"
        onClick={() => navigate("/administration/documents")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
      </Button>

      <div className="flex flex-col md:flex-row items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{document.libelle_document}</h1>
          <div className="flex items-center mt-2 space-x-2">
            {document.classification_document && (
              <Badge className={getClassificationBadge(document.classification_document)}>
                {document.classification_document.charAt(0).toUpperCase() + document.classification_document.slice(1)}
              </Badge>
            )}
            {document.etat_document && (
              <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
            )}
          </div>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => navigate(`/administration/documents/${document.id_documents}/editer`)}
          >
            <Pencil className="mr-2 h-4 w-4" /> Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" /> Détails du document
          </CardTitle>
          <CardDescription>
            Informations complètes sur le document
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Détails</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Informations générales</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">ID Document</dt>
                        <dd className="mt-1 text-sm text-gray-900">{document.id_documents}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Libellé</dt>
                        <dd className="mt-1 text-sm text-gray-900">{document.libelle_document}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Type de fichier</dt>
                        <dd className="mt-1 text-sm text-gray-900">{getFileType()}</dd>
                      </div>
                      {document.id_nature_document && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Nature</dt>
                          <dd className="mt-1 text-sm text-gray-900 flex items-center">
                            <File className="h-4 w-4 mr-1 text-gray-400" />
                            {getNatureLabel(document.id_nature_document)}
                          </dd>
                        </div>
                      )}
                      {document.classification_document && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Classification</dt>
                          <dd className="mt-1">
                            <Badge className={getClassificationBadge(document.classification_document)}>
                              {document.classification_document.charAt(0).toUpperCase() + document.classification_document.slice(1)}
                            </Badge>
                          </dd>
                        </div>
                      )}
                      {document.etat_document && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">État</dt>
                          <dd className="mt-1">
                            <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                          </dd>
                        </div>
                      )}
                      {document.date_document && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Date</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formatDate(document.date_document)}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Fichier</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    {document.lien_document ? (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{getFileName()}</p>
                            <p className="text-xs text-gray-500">
                              {getFileType()} - {document.lien_document}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                            onClick={() => window.open(document.lien_document, "_blank")}
                          >
                            <Eye className="mr-2 h-4 w-4" /> Aperçu
                          </Button>
                          <Button
                            size="sm"
                            className="flex items-center"
                            onClick={handleDownload}
                          >
                            <Download className="mr-2 h-4 w-4" /> Télécharger
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Aucun fichier associé à ce document
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter>
          <div className="flex items-center text-sm text-gray-500">
            <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
            {document.id_documents && (
              <span>Document ID: {document.id_documents} - </span>
            )}
            Dernière mise à jour: {formatDate(document.date_document)}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DocumentDetailPage;
