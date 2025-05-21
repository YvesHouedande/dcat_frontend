import React, { useState, useEffect } from "react";
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
import { AlertCircle, FileText, Download, Eye, Pencil, Trash2, ArrowLeft, File } from "lucide-react";
import { Document } from "../administration/types/interfaces";
import { documents } from "./finances";

const FinanceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = () => {
      setLoading(true);
      try {
        setTimeout(() => {
          const docId = Number(id);
          const foundDoc = documents.find(doc => doc.id_document === docId);
          
          if (foundDoc) {
            setDocument(foundDoc);
          } else {
            setError("Document non trouvé");
          }
          setLoading(false);
        }, 800);
      } catch (error) {
        // Fixed: Use the error parameter instead of unused 'err'
        console.error("Error fetching document:", error);
        setError("Erreur lors du chargement du document");
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const getNatureLabel = (natureId: number | null | undefined): string => {
    if (natureId === null || natureId === undefined) return "Non spécifié";
    
    const natures = {
      1: "Contrat",
      2: "Facture",
      3: "Rapport",
      4: "CV",
      5: "Procédure",
    };
    return natures[natureId as keyof typeof natures] || "Inconnu";
  };

  const getStatusBadge = (status: string | undefined) => {
    const statusColors = {
      actif: "bg-green-100 text-green-800",
      inactif: "bg-red-100 text-red-800",
      archive: "bg-gray-100 text-gray-800",
      public: "bg-blue-100 text-blue-800",
      private: "bg-purple-100 text-purple-800",
      draft: "bg-yellow-100 text-yellow-800",
    };
    
    const statusLabels = {
      actif: "Actif",
      inactif: "Inactif",
      archive: "Archivé",
      public: "Public",
      private: "Privé",
      draft: "Brouillon",
    };
    
    const defaultStatus = "actif";
    const effectiveStatus = status || defaultStatus;
    
    return {
      color: statusColors[effectiveStatus as keyof typeof statusColors] || "bg-gray-100 text-gray-800",
      label: statusLabels[effectiveStatus as keyof typeof statusLabels] || "Inconnu"
    };
  };

  const formatDate = (dateString?: string): string => {
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
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return dateString; // Retourne la string originale si le formatage échoue
    }
  };

  const handleDownload = () => {
    alert(`Téléchargement du document ${document?.libele_document} en cours...`);
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document financier ?")) {
      alert("Document supprimé avec succès.");
      navigate("/administration/finance");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du document...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="container mx-auto py-8 max-w-3xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-500 mr-4" />
              <div>
                <h2 className="text-xl font-semibold text-red-700">Erreur</h2>
                <p className="text-red-600">{error || "Document non trouvé"}</p>
                <Button className="mt-4" onClick={() => navigate("/administration/finance")}>
                  Retour à la liste
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusBadge(document.etat_document);
  const fileExtension = document.lien_document?.split('.').pop()?.toUpperCase() || 'FILE';

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center text-gray-600"
        onClick={() => navigate("/administration/finance")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
      </Button>
      
      <div className="flex flex-col md:flex-row items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{document.libele_document}</h1>
          <div className="flex items-center mt-2 space-x-2">
            <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
            <Badge variant="outline">{fileExtension}</Badge>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={() => navigate(`/administration/finance/${document.id_document}/editer`)}
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
            <FileText className="mr-2 h-5 w-5" /> Détails du document financier
          </CardTitle>
          <CardDescription>
            Informations complètes sur le document financier
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID Document</dt>
                    <dd className="mt-1 text-sm text-gray-900">{document.id_document}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Libellé</dt>
                    <dd className="mt-1 text-sm text-gray-900">{document.libele_document}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nature</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {getNatureLabel(document.id_nature_document)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(document.date_document)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">État</dt>
                    <dd className="mt-1">
                      <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Fichier</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded">
                      <File className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{document.libele_document}</p>
                      <p className="text-xs text-gray-500">
                        {fileExtension} - {Math.round(Math.random() * 2000 + 500) / 1000} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center" 
                      onClick={() => document.lien_document && window.open(document.lien_document, "_blank")}
                    >
                      <Eye className="mr-2 h-4 w-4" /> Aperçu
                    </Button>
                    <Button size="sm" className="flex items-center" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" /> Télécharger
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center text-sm text-gray-500">
            <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
            Dernière modification le {formatDate(document.date_document)}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FinanceDetailPage;