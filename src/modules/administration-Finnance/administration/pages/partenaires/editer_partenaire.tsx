// src/components/EditPartnerForm.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Save, Building, X } from "lucide-react";
import { Entite, Interlocuteur, Partenaires } from "../../types/interfaces";
import {
  fetchPartnerById,
  updatePartner,
  fetchEntites,
  addEntite,
  deleteEntite,
  fetchInterlocuteursByPartenaire,
  updateInterlocuteur,
  deleteInterlocuteur,
  addInterlocuteur,
} from '@/modules/administration-Finnance/services/partenaireService';
import { useApiCall } from '@/hooks/useAPiCall';
import axios from "axios";

const EditPartnerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: partnerData,
    loading: loadingPartner,
    error: partnerError,
    call: fetchPartner
  } = useApiCall<Partenaires>(() => fetchPartnerById(id!));

  const {
    data: entites,
    loading: loadingEntites,
    call: fetchEntitesData
  } = useApiCall<Entite[]>(fetchEntites);

  const {
    data: initialInterlocuteurs,
    loading: loadingInterlocuteurs,
    call: fetchInterlocuteurs
  } = useApiCall<Interlocuteur[]>(() => fetchInterlocuteursByPartenaire(parseInt(id!)));

  const [formData, setFormData] = useState<Partenaires>({
    id_partenaire: 0,
    nom_partenaire: "",
    telephone_partenaire: "",
    email_partenaire: "",
    specialite: "",
    localisation: "",
    type_partenaire: "",
    id_entite: 0,
    statut: "Actif",
  });

  const [interlocuteurs, setInterlocuteurs] = useState<Interlocuteur[]>([]);
  const [newInterlocuteur, setNewInterlocuteur] = useState<Omit<Interlocuteur, 'id_interlocuteur' | 'id_partenaire'>>({
    nom_interlocuteur: "",
    prenom_interlocuteur: "",
    fonction_interlocuteur: "",
    contact_interlocuteur: "",
    email_interlocuteur: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [interlocuteurErrors, setInterlocuteurErrors] = useState<Record<number, Record<string, string>>>({});
  const [newEntiteNom, setNewEntiteNom] = useState("");
  const [showAddEntite, setShowAddEntite] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [localEntites, setLocalEntites] = useState<Entite[]>([]);

  // Initialisation des données
  useEffect(() => {
    if (id) {
      fetchPartner();
      fetchInterlocuteurs();
      fetchEntitesData();
    }
  }, [id]);

  useEffect(() => {
    if (partnerData) {
      setFormData(partnerData);
    }
  }, [partnerData]);

  useEffect(() => {
    if (initialInterlocuteurs) {
      setInterlocuteurs(initialInterlocuteurs);
    }
  }, [initialInterlocuteurs]);

  useEffect(() => {
    if (entites) {
      setLocalEntites(entites);
    }
  }, [entites]);

  const types_partenaire = [
    "Fournisseur",
    "Client",
    "Distributeur",
    "Consultant",
    "Prestataire de service",
    "Revendeur",
    "Fabricant",
    "Institution",
    "Association",
  ];

  const specialites = [
    "Audiovisuelle",
    "Domotique",
    "Informatique & Réseau",
    "Solutions Solaires",
    "Conseil",
    "Autres",
  ];

  const statuts = ["Actif", "Inactif", "En attente", "Suspendu", "Archivé"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddEntite = async () => {
    if (!newEntiteNom.trim()) return;

    try {
      const newEntite = await addEntite({ denomination: newEntiteNom });
      setLocalEntites([...localEntites, newEntite]);
      setFormData(prev => ({ ...prev, id_entite: newEntite.id_entite }));
      setNewEntiteNom("");
      setShowAddEntite(false);
    } catch (error) {
      console.error("Failed to add entite", error);
      alert("Erreur lors de l'ajout de l'entité");
    }
  };

  const handleDeleteEntite = async (id: number) => {
    if (formData.id_entite === id) {
      alert("Impossible de supprimer cette entité car elle est actuellement sélectionnée");
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement cette entité ?`)) {
      try {
        await deleteEntite(id);
        setLocalEntites(localEntites.filter(entite => entite.id_entite !== id));
        setDeleteMode(false);
      } catch (error) {
        console.error("Échec de la suppression:", error);
        alert(error instanceof Error ? error.message : "Erreur lors de la suppression de l'entité");
      }
    }
  };

  const handleInterlocuteurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewInterlocuteur(prev => ({ ...prev, [name]: value }));
  };

  const addInterlocuteurHandler = async () => {
    const newErrors: Record<string, string> = {};

    if (!newInterlocuteur.nom_interlocuteur.trim()) {
      newErrors.nom_interlocuteur = "Le nom est obligatoire";
    }

    if (!newInterlocuteur.prenom_interlocuteur.trim()) {
      newErrors.prenom_interlocuteur = "Le prénom est obligatoire";
    }

    if (!newInterlocuteur.email_interlocuteur.trim()) {
      newErrors.email_interlocuteur = "L'email est obligatoire";
    } else if (!/^\S+@\S+\.\S+$/.test(newInterlocuteur.email_interlocuteur)) {
      newErrors.email_interlocuteur = "Format d'email invalide";
    }

    if (!newInterlocuteur.contact_interlocuteur.trim()) {
      newErrors.contact_interlocuteur = "Le contact est obligatoire";
    }

    if (Object.keys(newErrors).length > 0) {
      setInterlocuteurErrors(prev => ({
        ...prev,
        [-1]: newErrors // Utiliser -1 pour le nouvel interlocuteur
      }));
      return;
    }

    try {
      const createdInterlocuteur = await addInterlocuteur({
        ...newInterlocuteur,
        id_partenaire: parseInt(id!)
      });
      setInterlocuteurs([...interlocuteurs, createdInterlocuteur]);
      setNewInterlocuteur({
        nom_interlocuteur: "",
        prenom_interlocuteur: "",
        fonction_interlocuteur: "",
        contact_interlocuteur: "",
        email_interlocuteur: "",
      });
      // Nettoyer les erreurs
      setInterlocuteurErrors(prev => {
        const newState = { ...prev };
        delete newState[-1];
        return newState;
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'interlocuteur", error);
      alert("Erreur lors de l'ajout de l'interlocuteur");
    }
  };

  const updateInterlocuteurData = async (index: number) => {
    const interlocuteur = interlocuteurs[index];
    try {
      // Validation des champs requis
      const requiredFields = {
        nom_interlocuteur: "Nom",
        prenom_interlocuteur: "Prénom",
        contact_interlocuteur: "Contact",
        email_interlocuteur: "Email",
        fonction_interlocuteur: "Fonction"
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !interlocuteur[key as keyof typeof interlocuteur])
        .map(([, label]) => label);

      if (missingFields.length > 0) {
        alert(`Les champs suivants sont obligatoires : ${missingFields.join(", ")}`);
        return;
      }

      // Validation du format email
      if (!/^\S+@\S+\.\S+$/.test(interlocuteur.email_interlocuteur)) {
        alert("Le format de l'email est invalide");
        return;
      }

      // Préparation des données pour l'API
      const interlocuteurData = {
        nom_interlocuteur: interlocuteur.nom_interlocuteur.trim(),
        prenom_interlocuteur: interlocuteur.prenom_interlocuteur.trim(),
        contact_interlocuteur: interlocuteur.contact_interlocuteur.trim(),
        email_interlocuteur: interlocuteur.email_interlocuteur.trim(),
        fonction_interlocuteur: interlocuteur.fonction_interlocuteur.trim(),
        id_partenaire: parseInt(id!)
      };

      console.log('Tentative de mise à jour de l\'interlocuteur:', interlocuteurData);
      
      const updated = await updateInterlocuteur(
        interlocuteur.id_interlocuteur,
        interlocuteurData
      );

      // Mise à jour de l'état local uniquement si la requête API réussit
      const updatedList = [...interlocuteurs];
      updatedList[index] = updated;
      setInterlocuteurs(updatedList);
      alert("Interlocuteur mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'interlocuteur", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue';
        alert(`Erreur lors de la mise à jour de l'interlocuteur: ${errorMessage}`);
      } else {
        alert("Erreur lors de la mise à jour de l'interlocuteur");
      }
    }
  };

  const removeInterlocuteur = async (id: number, index: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet interlocuteur ?")) {
      return;
    }
    try {
      await deleteInterlocuteur(id);
      setInterlocuteurs(interlocuteurs.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'interlocuteur", error);
      alert("Erreur lors de la suppression de l'interlocuteur");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom_partenaire.trim()) {
      newErrors.nom_partenaire = "Le nom du partenaire est obligatoire";
    }

    if (!formData.telephone_partenaire.trim()) {
      newErrors.telephone_partenaire = "Le numéro de téléphone est obligatoire";
    }

    if (!formData.email_partenaire.trim()) {
      newErrors.email_partenaire = "L'email est obligatoire";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email_partenaire)) {
      newErrors.email_partenaire = "Format d'email invalide";
    }

    if (!formData.specialite) {
      newErrors.specialite = "La spécialité est obligatoire";
    }

    if (!formData.localisation.trim()) {
      newErrors.localisation = "La localisation est obligatoire";
    }

    if (!formData.type_partenaire) {
      newErrors.type_partenaire = "Le type de partenaire est obligatoire";
    }

    if (!formData.id_entite) {
      newErrors.id_entite = "L'entité est obligatoire";
    }

    if (!formData.statut) {
      newErrors.statut = "Le statut est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // S'assurer que les données sont du bon type
      const partnerDataToUpdate = {
        nom_partenaire: formData.nom_partenaire,
        telephone_partenaire: formData.telephone_partenaire,
        email_partenaire: formData.email_partenaire,
        specialite: formData.specialite,
        localisation: formData.localisation,
        type_partenaire: formData.type_partenaire,
        statut: formData.statut,
        id_entite: typeof formData.id_entite === 'string' ? parseInt(formData.id_entite) : formData.id_entite
      };

      console.log('Tentative de mise à jour du partenaire:', partnerDataToUpdate);

      await updatePartner(parseInt(id!), partnerDataToUpdate);
      alert("Partenaire mis à jour avec succès !");
      navigate("/administration/partenaires");
    } catch (error) {
      console.error("Error updating partner:", error);
      if (axios.isAxiosError(error) && error.response?.data) {
        alert(`Erreur lors de la mise à jour du partenaire: ${error.response.data.message || 'Une erreur est survenue'}`);
      } else {
        alert("Erreur lors de la mise à jour du partenaire");
      }
    }
  };

  if (loadingPartner || loadingEntites || loadingInterlocuteurs) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement en cours...</div>
      </div>
    );
  }

  if (partnerError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Erreur lors du chargement du partenaire</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Modifier le partenaire
          </h1>
          <p className="text-gray-500">
            Modifiez les informations du partenaire
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Informations du partenaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-20 w-20 border-2 border-gray-200">
                  <AvatarFallback className="bg-blue-500 text-white text-lg">
                    {formData.nom_partenaire ? (
                      formData.nom_partenaire.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
                    ) : (
                      <Building size={24} />
                    )}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom_partenaire">Nom du partenaire</Label>
                <Input
                  id="nom_partenaire"
                  name="nom_partenaire"
                  value={formData.nom_partenaire}
                  onChange={handleChange}
                  className={errors.nom_partenaire ? "border-red-500" : ""}
                />
                {errors.nom_partenaire && (
                  <p className="text-red-500 text-sm">{errors.nom_partenaire}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone_partenaire">Téléphone</Label>
                <Input
                  id="telephone_partenaire"
                  name="telephone_partenaire"
                  value={formData.telephone_partenaire}
                  onChange={handleChange}
                  className={errors.telephone_partenaire ? "border-red-500" : ""}
                />
                {errors.telephone_partenaire && (
                  <p className="text-red-500 text-sm">{errors.telephone_partenaire}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email_partenaire">Email</Label>
                <Input
                  id="email_partenaire"
                  name="email_partenaire"
                  type="email"
                  value={formData.email_partenaire}
                  onChange={handleChange}
                  className={errors.email_partenaire ? "border-red-500" : ""}
                />
                {errors.email_partenaire && (
                  <p className="text-red-500 text-sm">{errors.email_partenaire}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialite">Spécialité</Label>
                <Select
                  value={formData.specialite}
                  onValueChange={value => handleSelectChange("specialite", value)}
                >
                  <SelectTrigger className={errors.specialite ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner une spécialité" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialites.map(specialite => (
                      <SelectItem key={specialite} value={specialite}>{specialite}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.specialite && (
                  <p className="text-red-500 text-sm">{errors.specialite}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="localisation">Localisation</Label>
                <Input
                  id="localisation"
                  name="localisation"
                  value={formData.localisation}
                  onChange={handleChange}
                  className={errors.localisation ? "border-red-500" : ""}
                />
                {errors.localisation && (
                  <p className="text-red-500 text-sm">{errors.localisation}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type_partenaire">Type de partenaire</Label>
                <Select
                  value={formData.type_partenaire}
                  onValueChange={value => handleSelectChange("type_partenaire", value)}
                >
                  <SelectTrigger className={errors.type_partenaire ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types_partenaire.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type_partenaire && (
                  <p className="text-red-500 text-sm">{errors.type_partenaire}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={value => handleSelectChange("statut", value)}
                >
                  <SelectTrigger className={errors.statut ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuts.map(statut => (
                      <SelectItem key={statut} value={statut}>{statut}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.statut && (
                  <p className="text-red-500 text-sm">{errors.statut}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="entite">Entité</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.id_entite?.toString()}
                    onValueChange={value => {
                      if (value === "__add__") {
                        setShowAddEntite(true);
                        setDeleteMode(false);
                      } else if (value === "__delete__") {
                        setDeleteMode(!deleteMode);
                        setShowAddEntite(false);
                      } else if (deleteMode) {
                        handleDeleteEntite(parseInt(value));
                      } else {
                        handleSelectChange("id_entite", parseInt(value));
                      }
                    }}
                  >
                    <SelectTrigger className={errors.id_entite ? "border-red-500" : ""}>
                      <SelectValue placeholder={deleteMode ? "Sélectionner une entité à supprimer" : "Sélectionner une entité"} />
                    </SelectTrigger>
                    <SelectContent>
                      {localEntites?.map(entite => (
                        <SelectItem
                          key={entite.id_entite}
                          value={entite.id_entite.toString()}
                          className={deleteMode ? "text-red-500 hover:bg-red-50" : ""}
                        >
                          {entite.denomination}
                        </SelectItem>
                      ))}
                      <SelectItem value="__add__" className="text-blue-600 font-medium">
                        + Ajouter une entité
                      </SelectItem>
                      {localEntites?.length > 0 && (
                        <SelectItem
                          value="__delete__"
                          className={deleteMode ? "bg-gray-100 font-medium" : "text-red-600 font-medium"}
                        >
                          {deleteMode ? "✕ Annuler la suppression" : "− Supprimer une entité"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {showAddEntite && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Nom de la nouvelle entité"
                      value={newEntiteNom}
                      onChange={e => setNewEntiteNom(e.target.value)}
                    />
                    <Button
                      type="button"
                      onClick={handleAddEntite}
                      disabled={!newEntiteNom.trim()}
                    >
                      Ajouter
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddEntite(false)}>
                      Annuler
                    </Button>
                  </div>
                )}

                {errors.id_entite && (
                  <p className="text-red-500 text-sm">{errors.id_entite}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Interlocuteurs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {interlocuteurs.map((interlocuteur, index) => (
                <div key={interlocuteur.id_interlocuteur} className="border rounded-lg p-4 relative">
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    onClick={() => removeInterlocuteur(interlocuteur.id_interlocuteur, index)}
                  >
                    <X size={16} />
                  </button>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>Prénom</Label>
                      <Input
                        value={interlocuteur.prenom_interlocuteur}
                        onChange={(e) => {
                          const updated = [...interlocuteurs];
                          updated[index].prenom_interlocuteur = e.target.value;
                          setInterlocuteurs(updated);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Nom</Label>
                      <Input
                        value={interlocuteur.nom_interlocuteur}
                        onChange={(e) => {
                          const updated = [...interlocuteurs];
                          updated[index].nom_interlocuteur = e.target.value;
                          setInterlocuteurs(updated);
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>Fonction</Label>
                      <Input
                        value={interlocuteur.fonction_interlocuteur}
                        onChange={(e) => {
                          const updated = [...interlocuteurs];
                          updated[index].fonction_interlocuteur = e.target.value;
                          setInterlocuteurs(updated);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Contact</Label>
                      <Input
                        value={interlocuteur.contact_interlocuteur}
                        onChange={(e) => {
                          const updated = [...interlocuteurs];
                          updated[index].contact_interlocuteur = e.target.value;
                          setInterlocuteurs(updated);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={interlocuteur.email_interlocuteur}
                      onChange={(e) => {
                        const updated = [...interlocuteurs];
                        updated[index].email_interlocuteur = e.target.value;
                        setInterlocuteurs(updated);
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={() => updateInterlocuteurData(index)}
                  >
                    Enregistrer modifications
                  </Button>
                </div>
              ))}

              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium">Ajouter un interlocuteur</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prenom_interlocuteur">Prénom</Label>
                    <Input
                      id="prenom_interlocuteur"
                      name="prenom_interlocuteur"
                      value={newInterlocuteur.prenom_interlocuteur}
                      onChange={handleInterlocuteurChange}
                      className={interlocuteurErrors[-1]?.prenom_interlocuteur ? "border-red-500" : ""}
                    />
                    {interlocuteurErrors[-1]?.prenom_interlocuteur && (
                      <p className="text-red-500 text-sm">{interlocuteurErrors[-1].prenom_interlocuteur}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nom_interlocuteur">Nom</Label>
                    <Input
                      id="nom_interlocuteur"
                      name="nom_interlocuteur"
                      value={newInterlocuteur.nom_interlocuteur}
                      onChange={handleInterlocuteurChange}
                      className={interlocuteurErrors[-1]?.nom_interlocuteur ? "border-red-500" : ""}
                    />
                    {interlocuteurErrors[-1]?.nom_interlocuteur && (
                      <p className="text-red-500 text-sm">{interlocuteurErrors[-1].nom_interlocuteur}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fonction_interlocuteur">Fonction</Label>
                  <Input
                    id="fonction_interlocuteur"
                    name="fonction_interlocuteur"
                    value={newInterlocuteur.fonction_interlocuteur}
                    onChange={handleInterlocuteurChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email_interlocuteur">Email</Label>
                    <Input
                      id="email_interlocuteur"
                      name="email_interlocuteur"
                      type="email"
                      value={newInterlocuteur.email_interlocuteur}
                      onChange={handleInterlocuteurChange}
                      className={interlocuteurErrors[-1]?.email_interlocuteur ? "border-red-500" : ""}
                    />
                    {interlocuteurErrors[-1]?.email_interlocuteur && (
                      <p className="text-red-500 text-sm">{interlocuteurErrors[-1].email_interlocuteur}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_interlocuteur">Contact</Label>
                    <Input
                      id="contact_interlocuteur"
                      name="contact_interlocuteur"
                      value={newInterlocuteur.contact_interlocuteur}
                      onChange={handleInterlocuteurChange}
                      className={interlocuteurErrors[-1]?.contact_interlocuteur ? "border-red-500" : ""}
                    />
                    {interlocuteurErrors[-1]?.contact_interlocuteur && (
                      <p className="text-red-500 text-sm">{interlocuteurErrors[-1].contact_interlocuteur}</p>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addInterlocuteurHandler}
                  className="mt-2"
                >
                  Ajouter l'interlocuteur
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save size={16} className="mr-2" />
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPartnerForm;