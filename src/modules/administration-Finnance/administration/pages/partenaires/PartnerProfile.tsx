import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Edit,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Linkedin,
  Building,
  Tag,
  Users,
  UserPlus,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchPartnerById, updatePartner } from '@/modules/administration-Finnance/services/partenaireService';
import { Interlocuteur, Partenaires } from "../../types/interfaces";

const ModernPartnerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // États pour gérer les données et le loading
  const [partnerInfo, setPartnerInfo] = useState<Partenaires | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newInterlocuteur, setNewInterlocuteur] = useState<Omit<Interlocuteur, 'id_interlocuteur'>>({
    nom_interlocuteur: "",
    prenom_interlocuteur: "",
    fonction_interlocuteur: "",
    contact_interlocuteur: "",
    mail_interlocuteur: "",
  });
  const [isAddingInterlocuteur, setIsAddingInterlocuteur] = useState(false);

  // Fonction pour charger les données du partenaire
  const loadPartnerData = async () => {
    if (!id) {
      setError("ID du partenaire manquant");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Chargement du partenaire avec ID:", id);
      
      const data = await fetchPartnerById(id);
      console.log("Données reçues:", data);
      
      setPartnerInfo(data);
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadPartnerData();
  }, [id]);

  // Affichage des états de chargement et d'erreur
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des informations du partenaire...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Erreur: {error}
          </div>
          <Button onClick={loadPartnerData} className="bg-indigo-600 hover:bg-indigo-700">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!partnerInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Aucune donnée de partenaire disponible.</p>
          <Button onClick={() => navigate('/administration/partenaires')} variant="outline">
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

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

  const handleEditClick = () => {
    if (id === undefined) {
      console.error("ID is undefined");
      return;
    }
    navigate(`/administration/partenaires/${id}/editer`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const handleInterlocuteurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewInterlocuteur(prev => ({ ...prev, [name]: value }));
  };

  const addInterlocuteur = async () => {
    if (id === undefined || !partnerInfo) {
      console.error("ID is undefined or partner info not loaded");
      return;
    }

    if (
      !newInterlocuteur.nom_interlocuteur ||
      !newInterlocuteur.prenom_interlocuteur ||
      !newInterlocuteur.mail_interlocuteur ||
      !newInterlocuteur.contact_interlocuteur
    ) {
      return;
    }

    const maxId = partnerInfo.interlocuteurs && partnerInfo.interlocuteurs.length > 0
      ? Math.max(...partnerInfo.interlocuteurs.map(i => i.id_interlocuteur))
      : 0;

    const newInterlocuteurWithId = {
      ...newInterlocuteur,
      id_interlocuteur: maxId + 1,
    };

    try {
      setLoading(true);
      const updatedPartnerData = {
        ...partnerInfo,
        interlocuteurs: [...(partnerInfo.interlocuteurs || []), newInterlocuteurWithId],
      };

      await updatePartner(id, updatedPartnerData);
      setNewInterlocuteur({
        nom_interlocuteur: "",
        prenom_interlocuteur: "",
        fonction_interlocuteur: "",
        contact_interlocuteur: "",
        mail_interlocuteur: "",
      });
      setIsAddingInterlocuteur(false);
      await loadPartnerData(); // Recharger les données
    } catch (error) {
      console.error('Error updating partner:', error);
      setError("Erreur lors de l'ajout de l'interlocuteur");
    } finally {
      setLoading(false);
    }
  };

  const removeInterlocuteur = async (id_interlocuteur: number) => {
    if (id === undefined || !partnerInfo) {
      console.error("ID is undefined or partner info not loaded");
      return;
    }

    try {
      setLoading(true);
      const updatedInterlocuteurs = (partnerInfo.interlocuteurs || []).filter(
        i => i.id_interlocuteur !== id_interlocuteur
      );

      const updatedPartnerData = {
        ...partnerInfo,
        interlocuteurs: updatedInterlocuteurs,
      };

      await updatePartner(id, updatedPartnerData);
      await loadPartnerData(); // Recharger les données
    } catch (error) {
      console.error('Error updating partner:', error);
      setError("Erreur lors de la suppression de l'interlocuteur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                  {partnerInfo.type_partenaire}
                </Badge>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="bg-white text-indigo-700 hover:bg-indigo-50"
                onClick={handleEditClick}
              >
                <Edit size={16} className="mr-2" />
                Modifier
              </Button>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-indigo-700 hover:text-white"
              >
                ESPACE PARTENAIRE
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-4 rounded-lg shadow-md">
        <Tabs defaultValue="profil" className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profil">Profil</TabsTrigger>
            <TabsTrigger value="interlocuteurs">
              Interlocuteurs ({partnerInfo.interlocuteurs?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
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
                      onClick={handleEditClick}
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
                          {partnerInfo.email_partenaire}
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

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                        <Tag size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Statut</p>
                        <Badge className={getStatusColor(partnerInfo.statut)}>
                          {partnerInfo.statut}
                        </Badge>
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

          <TabsContent value="interlocuteurs" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Interlocuteurs ({partnerInfo.interlocuteurs?.length || 0})
              </h2>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setIsAddingInterlocuteur(true)}
              >
                <UserPlus size={16} className="mr-2" />
                Ajouter un interlocuteur
              </Button>
            </div>

            {isAddingInterlocuteur && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Nouvel interlocuteur</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingInterlocuteur(false)}
                    >
                      <X size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="prenom_interlocuteur">Prénom</Label>
                      <Input
                        id="prenom_interlocuteur"
                        name="prenom_interlocuteur"
                        value={newInterlocuteur.prenom_interlocuteur}
                        onChange={handleInterlocuteurChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nom_interlocuteur">Nom</Label>
                      <Input
                        id="nom_interlocuteur"
                        name="nom_interlocuteur"
                        value={newInterlocuteur.nom_interlocuteur}
                        onChange={handleInterlocuteurChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label htmlFor="fonction_interlocuteur">Fonction</Label>
                    <Input
                      id="fonction_interlocuteur"
                      name="fonction_interlocuteur"
                      value={newInterlocuteur.fonction_interlocuteur}
                      onChange={handleInterlocuteurChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="mail_interlocuteur">Email</Label>
                      <Input
                        id="mail_interlocuteur"
                        name="mail_interlocuteur"
                        type="email"
                        value={newInterlocuteur.mail_interlocuteur}
                        onChange={handleInterlocuteurChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_interlocuteur">Contact</Label>
                      <Input
                        id="contact_interlocuteur"
                        name="contact_interlocuteur"
                        value={newInterlocuteur.contact_interlocuteur}
                        onChange={handleInterlocuteurChange}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingInterlocuteur(false)}
                    >
                      Annuler
                    </Button>
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700"
                      onClick={addInterlocuteur}
                    >
                      Ajouter l'interlocuteur
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partnerInfo.interlocuteurs?.map((interlocuteur) => (
                <Card key={interlocuteur.id_interlocuteur}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium">
                          {interlocuteur.prenom_interlocuteur} {interlocuteur.nom_interlocuteur}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {interlocuteur.fonction_interlocuteur}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeInterlocuteur(interlocuteur.id_interlocuteur)}
                      >
                        <X size={16} />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Mail size={14} className="mr-2 text-gray-500" />
                        <p>{interlocuteur.mail_interlocuteur}</p>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone size={14} className="mr-2 text-gray-500" />
                        <p>{interlocuteur.contact_interlocuteur}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        <Mail size={14} className="mr-1" />
                        Email
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone size={14} className="mr-1" />
                        Appeler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) || []}
            </div>

            {(!partnerInfo.interlocuteurs || partnerInfo.interlocuteurs.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                <p>Aucun interlocuteur trouvé pour ce partenaire</p>
              </div>
            )}
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

            <div className="text-center text-gray-500">
              <p>Aucun projet trouvé pour ce partenaire</p>
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

            <div className="text-center text-gray-500">
              <p>Aucun document trouvé pour ce partenaire</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModernPartnerProfile;