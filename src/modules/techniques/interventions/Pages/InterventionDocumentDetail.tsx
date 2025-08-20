import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  FileText,
  Tag,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { fetchNatureDocumentById } from "../api/intervention";
import { InterventionDocument as InterventionDocumentType, Nature } from "../interface/interface";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
const STATIC_FILES_BASE_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL.slice(0, -4)
  : API_BASE_URL;

const InterventionDocumentDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  

  const [natures, setNatures] = useState<Nature | null>(null);
  const [loadingNatures, setLoadingNatures] = useState(false);

  // Récupération des données du document depuis les paramètres
  let documentData: InterventionDocumentType | null = null;

  if (
    location.state &&
    typeof location.state === "object" &&
    "data" in location.state
  ) {
    try {
      const rawData = location.state.data as string;
      documentData = JSON.parse(rawData);
    } catch (error) {
      console.error("Erreur lors du parsing des données:", error);
    }
  }

  useEffect(() => {
    const fetchNatures = async () => {
      if (!documentData?.id_nature_document) return;

      setLoadingNatures(true);
      try {
        const natures = await fetchNatureDocumentById(documentData.id_nature_document.toString());
        setNatures(natures);
      } catch (error) {
        console.error("Erreur lors de la récupération du dossier:", error);
        toast.error("Impossible de récupérer les informations du dossier");
      } finally {
        setLoadingNatures(false);
      }
    };

    fetchNatures();
  }, [documentData?.id_nature_document]);

  const handleDownload = async () => {
    if (!documentData?.lien_document) {
      toast.error("Aucun fichier disponible pour le téléchargement");
      return;
    }

    try {
      const fileUrl = documentData.lien_document.startsWith("http")
        ? documentData.lien_document
        : `${STATIC_FILES_BASE_URL}/${documentData.lien_document}`;

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = documentData.libelle_document || "document";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Téléchargement initié");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement du fichier");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getStatusColor = (etat?: string) => {
    switch (etat?.toLowerCase()) {
      case "validé":
      case "approuvé":
        return "bg-green-100 text-green-800 border-green-200";
      case "en attente":
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejeté":
      case "refusé":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!documentData) {
    return (
      <div className="bg-gray-50 min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Document introuvable
              </h2>
              <p className="text-gray-600 mb-4">
                Les données du document ne sont pas disponibles.
              </p>
              <Button onClick={handleGoBack}>Retour à la liste</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <Button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {documentData.libelle_document}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    Document d'Intervention Technique
                  </p>
                </div>
              </div>

              {documentData.etat_document ? (
                <Badge className={getStatusColor(documentData.etat_document)}>
                  {documentData.etat_document}
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                  actif
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Informations du document
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-600">
                      Nom du document
                    </span>
                    <span className="text-sm text-gray-900">
                      {documentData.libelle_document}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-600">
                      Nature du document
                    </span>
                    <span className="text-sm text-gray-900">
                    {loadingNatures ? (
                        <div className="flex items-center gap-2">
                        </div>
                      ) : natures?.libelle ? (
                        natures.libelle
                      ) : (
                        `nature ID: ${documentData.id_nature_document}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-600">
                      Fichier
                    </span>
                    <span className="text-sm text-gray-900">
                      {documentData.lien_document}
                    </span>
                  </div>
               
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-600">
                      Date du document
                    </span>
                    <span className="text-sm text-gray-900">
                      {documentData.date_document && documentData.date_document !== "1970-01-01T00:00:00.000Z"
                        ? format(
                            new Date(documentData.date_document),
                            "dd MMMM yyyy",
                            {
                              locale: fr,
                            }
                          )
                        : "Non renseignée"}
                    </span>
                  </div>
                </div>
              </div>



            
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={handleGoBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la liste
              </Button>

              <div className="flex gap-2">
                <Button
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le fichier
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterventionDocumentDetail;
