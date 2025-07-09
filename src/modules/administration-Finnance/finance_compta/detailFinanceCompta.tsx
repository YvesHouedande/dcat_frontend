import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Edit,
  Trash2,
  FileText,
  Calendar,
  User
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { DemandeDocument, NatureDocument } from "../administration/types/interfaces";
import { getAllNatureDocuments, getDocumentsByNature, deleteDocument } from "../services/finance_comptaService";

// Type local pour la structure possible de docsResponse
type DocsResponseWithData = { success: boolean; data: DemandeDocument[] };

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
const STATIC_FILES_BASE_URL = API_BASE_URL.endsWith('/api') 
  ? API_BASE_URL.slice(0, -4)
  : API_BASE_URL;

const DetailFinanceCompta: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  
  const [documentData, setDocumentData] = useState<DemandeDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [natures, setNatures] = useState<NatureDocument[]>([]);

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      setError(null);
      setDocumentData(null);
      try {
        // 1. Charger les natures pour trouver l'id de la nature courante
        const naturesData = await getAllNatureDocuments();
        setNatures(naturesData as NatureDocument[]);
        let nature: NatureDocument | undefined;
        if (type === "finance") {
          nature = (naturesData as NatureDocument[]).find((n: NatureDocument) => n.libelle && /finance|financier/i.test(n.libelle));
        } else if (type === "comptabilite") {
          nature = (naturesData as NatureDocument[]).find((n: NatureDocument) => n.libelle && /comptabilite|comptable|compta/i.test(n.libelle));
        }
        if (!nature) {
          setError("Type de document inconnu ou non configuré.");
          setLoading(false);
          return;
        }
        // 2. Charger les documents de cette nature
        const docsResponse = await getDocumentsByNature(nature.id_nature_document);
        let docs: DemandeDocument[] = [];
        if (Array.isArray(docsResponse)) {
          docs = docsResponse as DemandeDocument[];
        } else if (
          docsResponse &&
          typeof docsResponse === 'object' &&
          'success' in docsResponse &&
          Array.isArray((docsResponse as DocsResponseWithData).data)
        ) {
          docs = (docsResponse as DocsResponseWithData).data;
        } else {
          console.error("Réponse inattendue de getDocumentsByNature:", docsResponse);
          setError("Erreur inattendue lors de la récupération des documents.");
          setLoading(false);
          return;
        }
        // 3. Chercher le document par id
        const found = docs.find((doc: DemandeDocument) => doc.id_documents === Number(id));
        if (!found) {
          if (docs.length === 0) {
            setError("Aucun document n'existe encore pour cette nature.");
          } else {
            setError("Document non trouvé ou supprimé.");
          }
        } else {
          setDocumentData(found);
        }
      } catch (err: unknown) {
        console.error("Erreur lors du chargement des détails du document:", err);
        setError("Erreur lors du chargement des détails du document.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id, type]);

  const handleDelete = async () => {
    if (!documentData) return;
    
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      try {
        await deleteDocument(documentData.id_documents);
        toast.success("Document supprimé avec succès");
        setDocumentData(null);
        setError("Le document a été supprimé avec succès.");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Impossible de supprimer le document");
      }
    }
  };

  const handleEdit = () => {
    if (!documentData) return;
    navigate(`/administration/finance-compta/${type}/${documentData.id_documents}/modifier`);
  };

  const handleDownload = async () => {
    if (!documentData) return;
    try {
      const absoluteUrl = `${STATIC_FILES_BASE_URL}/${documentData.lien_document}`;
      const response = await fetch(absoluteUrl, { method: 'GET' });
      if (!response.ok) throw new Error('Erreur lors du téléchargement du fichier');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = documentData.lien_document.split('/').pop() || 'document';
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Erreur lors du téléchargement du fichier');
      console.error('Erreur téléchargement:', err);
    }
  };

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

  const getFileIcon = (filename: string) => {
    const type = getFileType(filename).toLowerCase();
    
    switch (type) {
      case "pdf":
        return <FileText size={48} className="text-red-500" />;
      case "docx":
        return <FileText size={48} className="text-blue-500" />;
      case "xlsx":
        return <FileText size={48} className="text-green-500" />;
      case "pptx":
        return <FileText size={48} className="text-orange-500" />;
      default:
        return <FileText size={48} className="text-gray-500" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non spécifiée";
    try {
      const date = new Date(dateString);
      return format(date, "dd MMMM yyyy 'à' HH:mm", { locale: fr });
    } catch (err) {
      console.error("Erreur de formatage de date:", err);
      return dateString;
    }
  };

  const getNatureLabel = (natureId: number) => {
    const nature = natures.find((n: NatureDocument) => n.id_nature_document === natureId);
    return nature ? nature.libelle : "Type inconnu";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !documentData) {
    return (
      <div className="bg-gray-50 min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/administration/finance-compta/${type}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Retour
            </Button>
          </div>
          <div className="flex justify-center items-center h-64 text-red-600">
            {error || "Document non trouvé"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/administration/finance-compta/${type}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Retour
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              Détails du Document {type === "finance" ? "Finance" : "Comptabilité"}
            </h1>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Télécharger
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <Edit size={16} />
              Modifier
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              Supprimer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Titre et type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {documentData.libelle_document}
                  </h2>
                  <Badge className={getFileTypeColor(documentData.lien_document)}>
                    {getFileType(documentData.lien_document)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type de document</label>
                    <p className="text-sm text-gray-800">{getNatureLabel(documentData.id_nature_document)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date du document</label>
                    <p className="text-sm text-gray-800">{formatDate(documentData.date_document)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aperçu du fichier */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Aperçu du fichier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 text-center bg-white">
                  {getFileIcon(documentData.lien_document)}
                  <p className="mt-2 text-sm text-gray-600 break-all">{documentData.lien_document}</p>
                  <a
                    href={`${STATIC_FILES_BASE_URL}/${documentData.lien_document}`}
                    download
                    className="inline-block mt-3"
                  >
                    <Button variant="outline" size="sm">
                      <Download size={16} className="mr-2" />
                      Télécharger le fichier
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métadonnées */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Métadonnées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date de création</p>
                    <p className="text-sm text-gray-800">{formatDate(documentData.date_document)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Créé par</p>
                    <p className="text-sm text-gray-800">Utilisateur système</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nom du fichier</p>
                    <p className="text-sm text-gray-800 break-all">{documentData.lien_document}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailFinanceCompta; 