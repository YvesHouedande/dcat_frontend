import React, { useEffect, useState } from "react";
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
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { Employe } from "../../types/interfaces"; // Import the Employe interface
import { profilesList } from "./employe"; // Import the profilesList

export const jobFunctions: Record<number, string> = {
  1: "Développeur",
  2: "Technicien Réseau",
  3: "Directeur Général",
  4: "Comptable",
  5: "Agent Commercial",
  6: "Directeur Technique",
  7: "Administrateur Réseau",
};

export const getJobFunction = (id_fonction: number | undefined): string => {
  if (id_fonction !== undefined && id_fonction in jobFunctions) {
    return jobFunctions[id_fonction];
  }
  return "Non spécifié";
};

const ModernUserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [userInfo, setUserInfo] = useState<Employe | null>(null);

  // Define job functions with type safety


  // Example data for documents
  const documents = [
    {
      id: "1",
      name: "Demande de congés annuels",
      type: "Formulaire RH",
      date: "12/03/2025",
      status: "En cours",
    },
    {
      id: "2",
      name: "Note de frais - Mars 2025",
      type: "Finance",
      date: "28/03/2025",
      status: "Approuvé",
    },
    {
      id: "3",
      name: "CV et lettre de motivation",
      type: "Personnel",
      date: "15/02/2025",
      status: "Complété",
    },
  ];

  useEffect(() => {
    // Fetch profile data based on the ID
    const fetchProfileData = () => {
      const profile = profilesList.find((p) => p.id_employe === Number(id));
      setUserInfo(profile || null);
    };

    fetchProfileData();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours":
        return "bg-amber-100 text-amber-800";
      case "Approuvé":
        return "bg-green-100 text-green-800";
      case "Complété":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleClick = (id: string | number | undefined) => {
    navigate(`/administration/employers/${id}/editer`);
  };

  // Helper function to safely get job function name


  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with photo and name */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-white">
              <AvatarFallback className="bg-gray-800 text-xl">
                {userInfo.nom_employes.charAt(0) + userInfo.prenom_employes.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">
                {userInfo.prenom_employes} {userInfo.nom_employes}
              </h1>
              <p className="text-blue-100">{getJobFunction(userInfo.id_fonction)}</p>
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className="bg-blue-500/20 text-white border-blue-200"
                >
                  {userInfo.status}
                </Badge>
              </div>
            </div>

            <Button
              disabled
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              MON ESPACE PERSONNEL
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="container mx-auto px-4 -mt-4 rounded-lg shadow-md">
        <Tabs defaultValue="profil" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profil">Profil</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>
          <TabsContent value="profil" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Informations personnelles
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
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Nom complet</p>
                        <p className="font-medium">
                          {userInfo.prenom_employes} {userInfo.nom_employes}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <Briefcase size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Poste</p>
                        <p className="font-medium">{getJobFunction(userInfo.id_fonction)}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date d'embauche</p>
                        <p className="font-medium">{userInfo.date_embauche_employes}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Adresse</p>
                        <p className="font-medium">{userInfo.adresse_employes}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <Mail size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{userInfo.email_employes}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium">{userInfo.contact_employes}</p>
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
                      className="w-full justify-start text-gray-700 hover:text-blue-600 hover:border-blue-200 group"
                    >
                      <FileText
                        size={18}
                        className="mr-2 text-gray-400 group-hover:text-blue-500"
                      />
                      Formulaires de demande
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-gray-700 hover:text-blue-600 hover:border-blue-200 group"
                    >
                      <Calendar
                        size={18}
                        className="mr-2 text-gray-400 group-hover:text-blue-500"
                      />
                      Demande de congés
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-gray-700 hover:text-blue-600 hover:border-blue-200 group"
                    >
                      <Upload
                        size={18}
                        className="mr-2 text-gray-400 group-hover:text-blue-500"
                      />
                      Mettre à jour mon CV
                    </Button>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      Partager mon profil
                    </h3>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="p-2 h-auto w-auto rounded-full"
                      >
                        <Facebook size={16} className="text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="p-2 h-auto w-auto rounded-full"
                      >
                        <Twitter size={16} className="text-blue-400" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="p-2 h-auto w-auto rounded-full"
                      >
                        <Linkedin size={16} className="text-blue-700" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="p-2 h-auto w-auto rounded-full"
                      >
                        <Instagram size={16} className="text-pink-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="documents" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Mes documents</h2>
              <Button
                onClick={() => {
                  navigate(`/administration/documents/nouveau`);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
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
                        className="text-blue-600 text-xs"
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
              Paramètres du compte
            </h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h3 className="font-medium">
                      Modification des infos personnelles
                    </h3>
                    <p className="text-sm text-gray-500">
                      Modifier vos informations de profil
                    </p>
                  </div>
                  <Button variant="outline">
                    <ExternalLink size={16} className="mr-2" />
                    Accéder
                  </Button>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h3 className="font-medium">Préférences de notification</h3>
                    <p className="text-sm text-gray-500">
                      Gérer vos préférences d'email et notifications
                    </p>
                  </div>
                  <Button disabled variant="outline">
                    <ExternalLink size={16} className="mr-2" />
                    Accéder
                  </Button>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h3 className="font-medium">Sécurité du compte</h3>
                    <p className="text-sm text-gray-500">
                      Modifier votre mot de passe et sécurité
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
                      Suspension d'accès
                    </h3>
                    <p className="text-sm text-gray-500">
                      Suspendre temporairement l'accès
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    Suspendre
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

export default ModernUserProfile;