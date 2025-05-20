import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  Download,
  Upload,
  Edit,
  FileText,
  Calendar,
  Clock,
  Building,
  FileSignature,
  File,
  Users,
  ChevronRight,
  AlarmClock,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { Contrat, Document } from "../../types/interfaces";

const InfoContract: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showFilePreview, setShowFilePreview] = useState(false);

  const contractInfo: Contrat = {
    id_contrat: 20250042, // Changé de string à number
    nom_contrat: "Accord de maintenance IT",
    duree_Contrat: "24 mois",
    date_debut: "01/03/2025",
    date_fin: "28/02/2027",
    id_partenaire: 1,
    type_de_contrat: "Service",
    status: "Actif",
  };

  const partnerInfo = {
    id_partenaire: 1,
    nom_partenaire: "EcoTech Solutions",
    telephone_partenaire: "07 45 23 89 67",
    Email_partenaire: "contact@ecotech-solutions.ci",
    specialite: "Solutions Numériques Durables",
  };

  const documents: Document[] = [
    {
      id_document: 1,
      libele_document: "Contrat Principal",
      date_document: "01/03/2025",
      lien_document: "contrat_maintenance_it.pdf",
      id_contrat: 20250042, // Changé de string à number
      id_nature_document: 1,
    },
    {
      id_document: 2,
      libele_document: "Annexe 1 - Tarifs",
      date_document: "01/03/2025",
      lien_document: "annexe_1_tarifs.pdf",
      id_contrat: 20250042, // Changé de string à number
      id_nature_document: 2,
    },
    {
      id_document: 3,
      libele_document: "Conditions Générales",
      date_document: "01/03/2025",
      lien_document: "conditions_generales.pdf",
      id_contrat: 20250042, // Changé de string à number
      id_nature_document: 3,
    },
  ];

  const amendments = [
    {
      id: "1",
      title: "Modification budgétaire",
      date: "15/04/2025",
      status: "Approuvé",
      description: "Augmentation du budget de maintenance de 10%",
    },
    {
      id: "2",
      title: "Extension de service",
      date: "Planifié - 01/06/2025",
      status: "En attente",
      description: "Ajout de services de formation pour les utilisateurs",
    },
  ];

  const events = [
    {
      id: "1",
      title: "Signature du contrat",
      date: "01/03/2025",
      type: "Administratif",
    },
    {
      id: "2",
      title: "Premier rapport trimestriel",
      date: "01/06/2025",
      type: "Livrable",
    },
    {
      id: "3",
      title: "Réunion de suivi",
      date: "15/06/2025",
      type: "Réunion",
    },
    {
      id: "4",
      title: "Renouvellement automatique",
      date: "01/12/2026",
      type: "Échéance",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-800";
      case "En attente":
        return "bg-amber-100 text-amber-800";
      case "Approuvé":
        return "bg-blue-100 text-blue-800";
      case "Expiré":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "Administratif":
        return "bg-blue-100 text-blue-800";
      case "Livrable":
        return "bg-purple-100 text-purple-800";
      case "Réunion":
        return "bg-teal-100 text-teal-800";
      case "Échéance":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEdit = (id: string | number | undefined) => {
    navigate(`/administration/contrats/${id}/editer`);
  };

  const handlePartnerClick = (id: number) => {
    navigate(`/administration/partenaires/profil/${id}`);
  };

  // Calcul du pourcentage de progression du contrat
  const calculateProgress = () => {
    const startDate = new Date(
      contractInfo.date_debut.split("/").reverse().join("-")
    );
    const endDate = new Date(
      contractInfo.date_fin.split("/").reverse().join("-")
    );
    const today = new Date();

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedDuration = today.getTime() - startDate.getTime();

    if (elapsedDuration < 0) return 0;
    if (elapsedDuration > totalDuration) return 100;

    return Math.round((elapsedDuration / totalDuration) * 100);
  };

  const progress = calculateProgress();

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
                    {contractInfo.nom_contrat}
                  </h1>
                  <p className="text-emerald-100">
                    Référence: {contractInfo.id_contrat}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="mt-2 md:mt-0 bg-emerald-500/20 text-white border-emerald-200 self-center"
                >
                  {contractInfo.status}
                </Badge>
              </div>

              <div className="mt-4 flex flex-col md:flex-row gap-2 md:gap-6">
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2 text-emerald-200" />
                  <span>Début: {contractInfo.date_debut}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2 text-emerald-200" />
                  <span>Fin: {contractInfo.date_fin}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="mr-2 text-emerald-200" />
                  <span>Durée: {contractInfo.duree_Contrat}</span>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger disabled value="calendar">Échéances</TabsTrigger>
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
                      onClick={() => handleEdit(id)}
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
                          {contractInfo.nom_contrat}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
                        <FileSignature size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Référence</p>
                        <p className="font-medium">{contractInfo.id_contrat}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date de début</p>
                        <p className="font-medium">{contractInfo.date_debut}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date de fin</p>
                        <p className="font-medium">{contractInfo.date_fin}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Durée</p>
                        <p className="font-medium">
                          {contractInfo.duree_Contrat}
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
                          {contractInfo.type_de_contrat}
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
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-between text-left p-4 mb-4"
                      onClick={() =>
                        handlePartnerClick(partnerInfo.id_partenaire)
                      }
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                          <Building size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {partnerInfo.nom_partenaire}
                          </p>
                          <p className="text-sm text-gray-500">
                            {partnerInfo.specialite}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </Button>
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

          <TabsContent value="amendments" className="p-6">
            <div className="space-y-4">
              {amendments.map((amendment) => (
                <Card
                  key={amendment.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start md:items-center mb-4 md:mb-0">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3 shrink-0">
                          <FileText size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-800">
                              {amendment.title}
                            </h3>
                            <Badge className={getStatusColor(amendment.status)}>
                              {amendment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {amendment.date}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            {amendment.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-gray-600"
                        >
                          <FileText size={14} className="mr-1" />
                          Voir
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-emerald-600"
                        >
                          <Download size={14} className="mr-1" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Échéances et événements
              </h2>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Calendar size={16} className="mr-2" />
                Ajouter une échéance
              </Button>
            </div>

            <div className="space-y-4">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
                        {event.type === "Administratif" && (
                          <FileSignature size={20} />
                        )}
                        {event.type === "Livrable" && <File size={20} />}
                        {event.type === "Réunion" && <Users size={20} />}
                        {event.type === "Échéance" && <AlarmClock size={20} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-800">
                            {event.title}
                          </h3>
                          <Badge className={getEventColor(event.type)}>
                            {event.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {event.date}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-gray-600"
                        >
                          <Edit size={14} className="mr-1" />
                          Modifier
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Documents associés
              </h2>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Upload size={16} className="mr-2" />
                Ajouter un document
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((document) => (
                <Card
                  key={document.id_document}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-gray-50 p-4 border-b">
                    <div className="flex justify-between">
                      <Badge className="bg-emerald-100 text-emerald-800">
                        {document.id_nature_document === 1
                          ? "Principal"
                          : document.id_nature_document === 2
                          ? "Annexe"
                          : "Juridique"}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {document.date_document}
                      </span>
                    </div>
                    <div className="mt-6 mb-4 flex justify-center">
                      <div className="w-16 h-20 bg-white border shadow-sm flex items-center justify-center">
                        <FileText size={24} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-800 mb-1">
                      {document.libele_document}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {document.id_nature_document === 1
                        ? "Contrat principal"
                        : document.id_nature_document === 2
                        ? "Grille tarifaire"
                        : "Conditions générales"}
                    </p>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-600 text-xs"
                      >
                        <FileText size={14} className="mr-1" />
                        Voir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-emerald-600 text-xs"
                      >
                        <Download size={14} className="mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                Aperçu du contrat: {contractInfo.nom_contrat}
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
                    Aperçu du document {documents[0].libele_document}
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
