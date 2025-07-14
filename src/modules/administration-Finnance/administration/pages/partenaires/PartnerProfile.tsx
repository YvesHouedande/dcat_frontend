import React, { useState } from "react";
import { Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  FileText,
  Mail,
  Phone,
  MapPin,
  Building,
  Tag,
  UserPlus,
  X
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  fetchPartnerById, 
  fetchInterlocuteursByPartenaire,
  addInterlocuteur,
  deleteInterlocuteur,
  fetchInterventionsByPartenaire
} from '@/modules/administration-Finnance/services/partenaireService';
import { TypeInterventionPartenaire } from '@/modules/administration-Finnance/services/partenaireService';
import { Interlocuteur} from "../../types/interfaces";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchContratsByPartenaire } from '@/modules/administration-Finnance/services/contratService';
import { Contrat } from '../../types/interfaces';

const ModernPartnerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // Charger les infos du partenaire
  const { data: partnerInfo, isLoading: loading, error } = useQuery({
    queryKey: ['partenaire', id],
    queryFn: () => fetchPartnerById(id!),
    enabled: !!id,
  });

  // Charger les interlocuteurs
  const { data: interlocuteurs = [], isLoading: loadingInterlocuteurs } = useQuery({
    queryKey: ['interlocuteurs', id],
    queryFn: () => fetchInterlocuteursByPartenaire(parseInt(id!)),
    enabled: !!id,
  });

  // Charger les interventions
  const { data: interventions = [], isLoading: loadingInterventions } = useQuery({
    queryKey: ['interventions', id],
    queryFn: () => fetchInterventionsByPartenaire(parseInt(id!)),
    enabled: !!id,
  });

  // Charger les contrats du partenaire
  const { data: contrats = [], isLoading: loadingContrats } = useQuery({
    queryKey: ['contrats-partenaire', id],
    queryFn: () => fetchContratsByPartenaire(id!),
    enabled: !!id,
  });

  // Mutation pour ajouter un interlocuteur
  const { mutate: addInterlocuteurMutation } = useMutation({
    mutationFn: (data: Omit<Interlocuteur, 'id_interlocuteur'>) => addInterlocuteur(data),
    onSuccess: () => {
      toast.success("Interlocuteur ajouté avec succès !");
      queryClient.invalidateQueries(['interlocuteurs', id]);
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de l'interlocuteur");
    },
  });

  // Mutation pour supprimer un interlocuteur
  const { mutate: deleteInterlocuteurMutation} = useMutation({
    mutationFn: (id_interlocuteur: number) => deleteInterlocuteur(id_interlocuteur),
    onSuccess: () => {
      toast.success("Interlocuteur supprimé avec succès !");
      queryClient.invalidateQueries(['interlocuteurs', id]);
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'interlocuteur");
    },
  });

  const [newInterlocuteur, setNewInterlocuteur] = useState<Omit<Interlocuteur, 'id_interlocuteur' | 'id_partenaire'>>({
    nom_interlocuteur: "",
    prenom_interlocuteur: "",
    fonction_interlocuteur: "",
    contact_interlocuteur: "",
    email_interlocuteur: "",
  });
  const [isAddingInterlocuteur, setIsAddingInterlocuteur] = useState(false);

  const handleInterlocuteurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewInterlocuteur(prev => ({ ...prev, [name]: value }));
  };

  const addNewInterlocuteur = async () => {
    if (!id) return;

    // Validation des champs requis
    const requiredFields = {
      nom_interlocuteur: "Nom",
      prenom_interlocuteur: "Prénom",
      contact_interlocuteur: "Contact",
      email_interlocuteur: "Email",
      fonction_interlocuteur: "Fonction"
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !newInterlocuteur[key as keyof typeof newInterlocuteur])
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      toast.error(`Les champs suivants sont obligatoires : ${missingFields.join(", ")}`);
      return;
    }

    try {
      addInterlocuteurMutation({
        ...newInterlocuteur,
        id_partenaire: parseInt(id)
      });
      
      // Réinitialiser le formulaire
      setNewInterlocuteur({
        nom_interlocuteur: "",
        prenom_interlocuteur: "",
        fonction_interlocuteur: "",
        contact_interlocuteur: "",
        email_interlocuteur: "",
      });
      
      setIsAddingInterlocuteur(false);
      
    } catch (error) {
      console.error('Error adding interlocuteur:', error);
      toast.error("Erreur lors de l'ajout de l'interlocuteur");
    }
  };

  const removeInterlocuteur = async (id_interlocuteur: number) => {
    toast.custom(
      (t) => (
        <div>
          <div className="mb-2">Voulez-vous vraiment supprimer cet interlocuteur ?</div>
          <div className="flex gap-2 justify-end">
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
              onClick={() => toast.dismiss(t)}
            >
              Annuler
            </button>
            <button
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                deleteInterlocuteurMutation(id_interlocuteur);
                toast.dismiss(t);
              }}
            >
              Supprimer
            </button>
          </div>
        </div>
      ),
      { duration: 8000 }
    );
  };

  // Affichage des états de chargement et d'erreur
  if (loading || loadingInterlocuteurs) {
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
            Erreur: {error instanceof Error ? error.message : "Erreur lors du chargement des données"}
          </div>
          <Button onClick={() => queryClient.invalidateQueries(['partenaire', id])} className="bg-indigo-600 hover:bg-indigo-700">
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
          <TabsList className="w-full flex-nowrap overflow-x-auto whitespace-nowrap gap-1 px-1" style={{ scrollbarWidth: 'thin' }}>
            <TabsTrigger value="profil" className="min-w-[120px] px-2 py-1 text-sm">Profil</TabsTrigger>
            <TabsTrigger value="interlocuteurs" className="min-w-[120px] px-2 py-1 text-sm">Interlocuteurs ({interlocuteurs.length})</TabsTrigger>
            <TabsTrigger value="contrats" className="min-w-[120px] px-2 py-1 text-sm">Contrats</TabsTrigger>
            <TabsTrigger value="interventions" className="min-w-[120px] px-2 py-1 text-sm">Interventions</TabsTrigger>
          </TabsList>

          <TabsContent value="profil" className="p-6">
            <div className="w-full max-w-4xl mx-auto p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Informations du partenaire</h2>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-indigo-100 p-2 rounded-full"><Building size={20} className="text-indigo-500" /></span>
                    <div>
                      <div className="text-sm text-gray-500">Nom</div>
                      <div className="font-medium text-lg">{partnerInfo.nom_partenaire}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-indigo-100 p-2 rounded-full"><Tag size={20} className="text-indigo-500" /></span>
                    <div>
                      <div className="text-sm text-gray-500">Type</div>
                      <div className="font-medium">{partnerInfo.type_partenaire}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-indigo-100 p-2 rounded-full"><Mail size={20} className="text-indigo-500" /></span>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{partnerInfo.email_partenaire}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-indigo-100 p-2 rounded-full"><Tag size={20} className="text-indigo-500" /></span>
                    <div>
                      <div className="text-sm text-gray-500">Statut</div>
                      <Badge className="bg-green-100 text-green-800">{partnerInfo.statut}</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-indigo-100 p-2 rounded-full"><Tag size={20} className="text-indigo-500" /></span>
                    <div>
                      <div className="text-sm text-gray-500">Spécialité</div>
                      <div className="font-medium">{partnerInfo.specialite}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-indigo-100 p-2 rounded-full"><MapPin size={20} className="text-indigo-500" /></span>
                    <div>
                      <div className="text-sm text-gray-500">Localisation</div>
                      <div className="font-medium">{partnerInfo.localisation}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-indigo-100 p-2 rounded-full"><Phone size={20} className="text-indigo-500" /></span>
                    <div>
                      <div className="text-sm text-gray-500">Téléphone</div>
                      <div className="font-medium">{partnerInfo.telephone_partenaire}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interlocuteurs" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Interlocuteurs ({interlocuteurs.length})
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
                      <Label htmlFor="email_interlocuteur">Email</Label>
                      <Input
                        id="email_interlocuteur"
                        name="email_interlocuteur"
                        type="email"
                        value={newInterlocuteur.email_interlocuteur}
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
                      onClick={addNewInterlocuteur}
                    >
                      Ajouter l'interlocuteur
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interlocuteurs.map((interlocuteur) => (
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
                        <p>{interlocuteur.email_interlocuteur}</p>
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
              ))}
            </div>

            {interlocuteurs.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p>Aucun interlocuteur trouvé pour ce partenaire</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="contrats" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Contrats du partenaire</h2>
              <Button
                onClick={() => navigate("/administration/contrats/nouveau", { state: { partenaireId: partnerInfo.id_partenaire } })}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <FileText size={16} className="mr-2" />
                Nouveau contrat
              </Button>
            </div>
            {loadingContrats ? (
              <div className="text-center text-gray-500 py-8">
                <p>Chargement des contrats...</p>
              </div>
            ) : contrats.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>Aucun contrat trouvé pour ce partenaire</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contrats.map((contrat: Contrat) => (
                  <Card key={contrat.id_contrat} className="hover:shadow-lg transition cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="font-medium text-indigo-700">
                            {contrat.nom_contrat}
                          </h3>
                          <p className="text-xs text-gray-500">Réf: {contrat.reference}</p>
                        </div>
                        <Badge className="bg-indigo-100 text-indigo-700">
                          {contrat.statut}
                        </Badge>
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        <span className="block">Type: {contrat.type_de_contrat}</span>
                        <span className="block">Début: {contrat.date_debut}</span>
                        <span className="block">Fin: {contrat.date_fin}</span>
                        <span className="block">Durée: {contrat.duree_contrat}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => navigate(`/administration/contrats/${contrat.id_contrat}/details`)}
                      >
                        Voir
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="interventions" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Interventions</h2>
            </div>
            {loadingInterventions ? (
              <div className="text-center text-gray-500 py-8">
                <p>Chargement des interventions...</p>
              </div>
            ) : interventions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>Aucune intervention trouvée pour ce partenaire</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {interventions.map((item: TypeInterventionPartenaire) => (
                  <Card
                    key={item.intervention.id_intervention}
                    className="cursor-pointer hover:shadow-lg transition"
                    onClick={() => navigate(`/technique/interventions/${item.intervention.id_intervention}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="font-medium text-indigo-700">
                            Intervention #{item.intervention.id_intervention}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.intervention.date_intervention}
                          </p>
                        </div>
                        <Badge className="bg-indigo-100 text-indigo-700">
                          {item.intervention.type_intervention}
                        </Badge>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm text-gray-500">Contrat : </span>
                        {item.contrat && item.contrat.nom_contrat ? (
                          <span
                            className="text-indigo-600 underline cursor-pointer"
                            onClick={e => {
                              e.stopPropagation();
                              navigate(`/administration/contrats/${item.contrat.id_contrat}`);
                            }}
                          >
                            {item.contrat.nom_contrat}
                          </span>
                        ) : (
                          <span className="text-gray-400">Contrat inconnu</span>
                        )}
                        {item.contrat && item.contrat.reference && (
                          <span className="ml-2 text-xs text-gray-400">({item.contrat.reference})</span>
                        )}
                      </div>
                      <div className="mb-2">
                        <span className="text-sm text-gray-500">Employés : </span>
                        {item.employes && item.employes.length > 0 ? (
                          item.employes.map(emp => (
                            <span key={emp.id_employes} className="inline-block mr-2 text-xs text-gray-700 bg-gray-100 rounded px-2 py-0.5">
                              {emp.prenom_employes} {emp.nom_employes}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">Aucun</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModernPartnerProfile;
