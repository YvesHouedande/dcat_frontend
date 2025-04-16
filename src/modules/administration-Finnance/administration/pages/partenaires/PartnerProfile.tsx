import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  Download,
  Upload,
  ExternalLink,
  Edit,
  FileText,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Linkedin,
  Building,
  Tag,
  Users,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

const ModernPartnerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const partnerInfo = {
    id_partenaire: 1,
    nom_partenaire: "EcoTech Solutions",
    telephone_partenaire: "07 45 23 89 67",
    Email_partenaire: "contact@ecotech-solutions.ci",
    specialite: "Solutions Numériques Durables",
    localisation: "Plateau, Abidjan, Côte d'Ivoire",
    type_partenaire: "Technique",
    entite: "Entreprise Privée",
    status: "Actif",
  };

  const projects = [
    {
      id: "1",
      name: "Déploiement ERP",
      type: "Projet IT",
      date: "15/03/2025",
      status: "En cours",
    },
    {
      id: "2",
      name: "Formation Développeurs",
      type: "Formation",
      date: "02/04/2025",
      status: "Planifié",
    },
    {
      id: "3",
      name: "Maintenance Infrastructures",
      type: "Support",
      date: "Récurrent",
      status: "Actif",
    },
  ];

  const documents = [
    {
      id: "1",
      name: "Contrat de partenariat",
      type: "Juridique",
      date: "12/01/2025",
      status: "Signé",
    },
    {
      id: "2",
      name: "Accord de confidentialité",
      type: "Juridique",
      date: "12/01/2025",
      status: "Signé",
    },
    {
      id: "3",
      name: "Présentation de l'entreprise",
      type: "Commercial",
      date: "05/02/2025",
      status: "Validé",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours":
        return "bg-amber-100 text-amber-800";
      case "Planifié":
        return "bg-purple-100 text-purple-800";
      case "Actif":
        return "bg-green-100 text-green-800";
      case "Signé":
        return "bg-blue-100 text-blue-800";
      case "Validé":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleClick = (id: string | number | undefined) => {
    navigate(`/administration/partenaires/${id}/editer`);
  };

  // Fonction pour obtenir les initiales à partir du nom du partenaire
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec logo et nom */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-white">
              <AvatarFallback className="bg-gray-800 text-xl">
                {getInitials(partnerInfo.nom_partenaire)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">
                {partnerInfo.nom_partenaire}
              </h1>
              <p className="text-indigo-100">{partnerInfo.specialite}</p>
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className="bg-indigo-500/20 text-white border-indigo-200"
                >
                  {partnerInfo.status}
                </Badge>
              </div>
            </div>

            <Button className="bg-white text-indigo-700 hover:bg-indigo-50">
              ESPACE PARTENAIRE
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="container mx-auto px-4 -mt-4 rounded-lg shadow-md">
        <Tabs defaultValue="profil" className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profil">Profil</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>
          <TabsContent value="profil" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Informations du partenaire
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
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                        <Building size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Nom</p>
                        <p className="font-medium">
                          {partnerInfo.nom_partenaire}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                        <Tag size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Spécialité</p>
                        <p className="font-medium">{partnerInfo.specialite}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                        <Users size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium">
                          {partnerInfo.type_partenaire}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                        <Briefcase size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Entité</p>
                        <p className="font-medium">{partnerInfo.entite}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Localisation</p>
                        <p className="font-medium">
                          {partnerInfo.localisation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                        <Mail size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">
                          {partnerInfo.Email_partenaire}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium">
                          {partnerInfo.telephone_partenaire}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Actions rapides
                  </h2>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-gray-700 hover:text-indigo-600 hover:border-indigo-200 group"
                    >
                      <Calendar
                        size={18}
                        className="mr-2 text-gray-400 group-hover:text-indigo-500"
                      />
                      Planifier une réunion
                    </Button>
                    <Button
                      onClick={()=> navigate("/administration/contrats/nouveau_contrat")}
                      variant="outline"
                      className="w-full justify-start text-gray-700 hover:text-indigo-600 hover:border-indigo-200 group"
                    >
                      <FileText
                        size={18}
                        className="mr-2 text-gray-400 group-hover:text-indigo-500"
                      />
                      Nouveau contrat
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-gray-700 hover:text-indigo-600 hover:border-indigo-200 group"
                    >
                      <Upload
                        size={18}
                        className="mr-2 text-gray-400 group-hover:text-indigo-500"
                      />
                      Partager un document
                    </Button>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      Contacter par
                    </h3>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="p-2 h-auto w-auto rounded-full"
                      >
                        <Mail size={16} className="text-indigo-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="p-2 h-auto w-auto rounded-full"
                      >
                        <Phone size={16} className="text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="p-2 h-auto w-auto rounded-full"
                      >
                        <Linkedin size={16} className="text-blue-700" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Projets en cours
              </h2>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Calendar size={16} className="mr-2" />
                Nouveau projet
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-gray-50 p-4 border-b">
                    <div className="flex justify-between">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {project.date}
                      </span>
                    </div>
                    <div className="mt-6 mb-4 flex justify-center">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full border shadow-sm flex items-center justify-center">
                        <Briefcase size={24} className="text-indigo-600" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-800 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">{project.type}</p>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-600 text-xs"
                      >
                        <Edit size={14} className="mr-1" />
                        Détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-indigo-600 text-xs"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Voir le projet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Documents</h2>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Upload size={16} className="mr-2" />
                Ajouter un document
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-gray-50 p-4 border-b">
                    <div className="flex justify-between">
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                      <span className="text-xs text-gray-500">{doc.date}</span>
                    </div>
                    <div className="mt-6 mb-4 flex justify-center">
                      <div className="w-16 h-20 bg-white border shadow-sm flex items-center justify-center">
                        <FileText size={24} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-800 mb-1">
                      {doc.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">{doc.type}</p>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-600 text-xs"
                      >
                        <Edit size={14} className="mr-1" />
                        Mettre à jour
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-indigo-600 text-xs"
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

          <TabsContent value="settings" className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Paramètres du partenaire
            </h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h3 className="font-medium">
                      Modification des informations
                    </h3>
                    <p className="text-sm text-gray-500">
                      Modifier les informations du partenaire
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => handleClick(id)}>
                    <ExternalLink size={16} className="mr-2" />
                    Accéder
                  </Button>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h3 className="font-medium">Gestion des contrats</h3>
                    <p className="text-sm text-gray-500">
                      Gérer les contrats et accords
                    </p>
                  </div>
                  <Button variant="outline">
                    <ExternalLink size={16} className="mr-2" />
                    Accéder
                  </Button>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h3 className="font-medium">Historique de collaboration</h3>
                    <p className="text-sm text-gray-500">
                      Consulter l'historique des projets
                    </p>
                  </div>
                  <Button variant="outline">
                    <ExternalLink size={16} className="mr-2" />
                    Accéder
                  </Button>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h3 className="font-medium text-red-600">
                      Suspendre la collaboration
                    </h3>
                    <p className="text-sm text-gray-500">
                      Suspendre temporairement ce partenaire
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Accéder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModernPartnerProfile;
