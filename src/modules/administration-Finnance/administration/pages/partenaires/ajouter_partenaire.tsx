// src/components/AddPartnerForm.tsx
import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { Entite, Interlocuteur, Partenaires } from "../../types/interfaces";
import {
  addPartner,
  fetchEntites,
  addEntite,
  deleteEntite, 
  addMultipleInterlocuteurs
} from '@/modules/administration-Finnance/services/partenaireService';
import { useApiCall } from '@/hooks/useAPiCall';
import { omit } from "@/lib/utils";
import axios from "axios";

// Interface pour les interlocuteurs temporaires (sans id_partenaire)
interface TempInterlocuteur extends Omit<Interlocuteur, 'id_partenaire' | 'id_interlocuteur'> {
  id_interlocuteur: number;
}

const AddPartnerForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: entites,
    loading: loadingEntites,
    error: entitesErrorData,
    call: fetchEntitesData
  } = useApiCall<Entite[]>(fetchEntites);

  const {
    call: submitPartnerData,
    loading: isSubmitting
  } = useApiCall<Partenaires, [Omit<Partenaires, 'id_partenaire'>]>(addPartner);

  // État pour les données du partenaire
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

  // État séparé pour les interlocuteurs temporaires
  const [tempInterlocuteurs, setTempInterlocuteurs] = useState<TempInterlocuteur[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [interlocuteurErrors, setInterlocuteurErrors] = useState<Record<number, Record<string, string>>>({});
  const [newInterlocuteur, setNewInterlocuteur] = useState<TempInterlocuteur>({
    id_interlocuteur: 0,
    nom_interlocuteur: "",
    prenom_interlocuteur: "",
    fonction_interlocuteur: "",
    contact_interlocuteur: "",
    email_interlocuteur: "",
  });

  const [newEntiteNom, setNewEntiteNom] = useState("");
  const [showAddEntite, setShowAddEntite] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [localEntites, setLocalEntites] = useState<Entite[]>([]);

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

  const statuts = [
    "Actif",
    "Inactif",
    "En attente",
    "Suspendu",
    "Archivé"
  ];

  useEffect(() => {
    fetchEntitesData();
  }, []);

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddEntite = async () => {
    if (!newEntiteNom.trim()) return;

    try {
      const newEntite = await addEntite({ denomination: newEntiteNom });
      setLocalEntites([...(localEntites || []), newEntite]);
      setFormData(prev => ({ ...prev, id_entite: newEntite.id_entite }));
      setNewEntiteNom("");
      setShowAddEntite(false);
    } catch (error) {
      console.error("Failed to add entite", error);
      alert("Erreur lors de l'ajout de l'entité");
    }
  };

  const handleDeleteEntite = async (id: number | string) => {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  
    if (isNaN(numericId)) {
      console.error("ID invalide:", id);
      alert("ID d'entité invalide");
      return;
    }
  
    if (formData.id_entite === numericId) {
      alert("Impossible de supprimer cette entité car elle est actuellement sélectionnée");
      return;
    }
  
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement cette entité ?`)) {
      try {
        await deleteEntite(numericId);
        setLocalEntites(prevEntites => prevEntites?.filter(entite => entite.id_entite !== numericId) || []);
        setDeleteMode(false);
        fetchEntitesData();
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

  const addInterlocuteur = () => {
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
      setInterlocuteurErrors(prev => ({
        ...prev,
        [tempInterlocuteurs.length]: {
          general: `Les champs suivants sont obligatoires : ${missingFields.join(", ")}`
        }
      }));
      return;
    }

    // Validation du format email
    if (!/^\S+@\S+\.\S+$/.test(newInterlocuteur.email_interlocuteur)) {
      setInterlocuteurErrors(prev => ({
        ...prev,
        [tempInterlocuteurs.length]: {
          email_interlocuteur: "Le format de l'email est invalide"
        }
      }));
      return;
    }

    // Préparation des données de l'interlocuteur
    const formattedInterlocuteur = {
      ...newInterlocuteur,
      nom_interlocuteur: newInterlocuteur.nom_interlocuteur.trim(),
      prenom_interlocuteur: newInterlocuteur.prenom_interlocuteur.trim(),
      contact_interlocuteur: newInterlocuteur.contact_interlocuteur.trim(),
      email_interlocuteur: newInterlocuteur.email_interlocuteur.trim(),
      fonction_interlocuteur: newInterlocuteur.fonction_interlocuteur.trim(),
      id_interlocuteur: tempInterlocuteurs.length + 1 // ID temporaire pour l'affichage
    };

    // Ajouter l'interlocuteur aux interlocuteurs temporaires
    setTempInterlocuteurs(prev => [...prev, formattedInterlocuteur]);

    // Réinitialiser le formulaire d'interlocuteur
    setNewInterlocuteur({
      id_interlocuteur: 0,
      nom_interlocuteur: "",
      prenom_interlocuteur: "",
      fonction_interlocuteur: "",
      contact_interlocuteur: "",
      email_interlocuteur: "",
    });

    // Nettoyer les erreurs
    setInterlocuteurErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[tempInterlocuteurs.length];
      return newErrors;
    });
  };

  const removeInterlocuteur = (index: number) => {
    setTempInterlocuteurs(prev => prev.filter((_, i) => i !== index));

    setInterlocuteurErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
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
      // 1. Créer le partenaire d'abord
      const partenaireData = {
        ...omit(formData, ["id_partenaire"]),
        id_entite: typeof formData.id_entite === 'string' ? parseInt(formData.id_entite) : formData.id_entite
      };
      
      const createdPartenaire = await submitPartnerData(partenaireData);
      
      // 2. Si des interlocuteurs ont été ajoutés, les créer avec l'ID du partenaire
      if (tempInterlocuteurs.length > 0 && createdPartenaire?.id_partenaire) {
        const interlocuteursToCreate = tempInterlocuteurs.map(inter => ({
          nom_interlocuteur: inter.nom_interlocuteur,
          prenom_interlocuteur: inter.prenom_interlocuteur,
          contact_interlocuteur: inter.contact_interlocuteur,
          email_interlocuteur: inter.email_interlocuteur,
          fonction_interlocuteur: inter.fonction_interlocuteur,
          id_partenaire: createdPartenaire.id_partenaire
        }));
        
        try {
          await addMultipleInterlocuteurs(interlocuteursToCreate, createdPartenaire.id_partenaire);
        } catch (error) {
          console.error("Erreur lors de l'ajout des interlocuteurs:", error);
          if (axios.isAxiosError(error)) {
            alert(`Erreur lors de l'ajout des interlocuteurs: ${error.response?.data?.message || error.message}`);
          } else {
            alert("Erreur lors de l'ajout des interlocuteurs");
          }
          return;
        }
      }

      alert("Partenaire ajouté avec succès !");
      navigate("/administration/partenaires");
    } catch (error) {
      console.error("Error details:", error);
      if (axios.isAxiosError(error)) {
        alert(`Erreur lors de l'ajout du partenaire: ${error.response?.data?.message || error.message}`);
      } else {
        alert("Erreur lors de l'ajout du partenaire");
      }
    }
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Ajouter un partenaire
          </h1>
          <p className="text-gray-500">
            Remplissez le formulaire pour ajouter un nouveau partenaire
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
                      getInitials(formData.nom_partenaire)
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
                  placeholder="ex: Entreprise ABC"
                  value={formData.nom_partenaire}
                  onChange={handleChange}
                  className={errors.nom_partenaire ? "border-red-500" : ""}
                />
                {errors.nom_partenaire && (
                  <p className="text-red-500 text-sm">
                    {errors.nom_partenaire}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type_partenaire">Type de partenaire</Label>
                <Select
                  value={formData.type_partenaire}
                  onValueChange={(value) =>
                    handleSelectChange("type_partenaire", value)
                  }
                >
                  <SelectTrigger
                    id="type_partenaire"
                    className={errors.type_partenaire ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types_partenaire.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type_partenaire && (
                  <p className="text-red-500 text-sm">
                    {errors.type_partenaire}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialite">Spécialité</Label>
                <Select
                  value={formData.specialite}
                  onValueChange={(value) =>
                    handleSelectChange("specialite", value)
                  }
                >
                  <SelectTrigger
                    id="specialite"
                    className={errors.specialite ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Sélectionner une spécialité" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialites.map((specialite) => (
                      <SelectItem key={specialite} value={specialite}>
                        {specialite}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.specialite && (
                  <p className="text-red-500 text-sm">{errors.specialite}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value) =>
                    handleSelectChange("statut", value)
                  }
                >
                  <SelectTrigger
                    id="statut"
                    className={errors.statut ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuts.map((statut) => (
                      <SelectItem key={statut} value={statut}>
                        {statut}
                      </SelectItem>
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
                    value={formData.id_entite ? formData.id_entite.toString() : ""}
                    onValueChange={(value) => {
                      if (value === "__add__") {
                        setShowAddEntite(true);
                        setDeleteMode(false);
                      } else if (value === "__delete__") {
                        setDeleteMode(!deleteMode);
                        setShowAddEntite(false);
                      } else if (deleteMode) {
                        handleDeleteEntite(value);
                      } else {
                        handleSelectChange("id_entite", parseInt(value, 10));
                      }
                    }}
                  >
                    <SelectTrigger
                      id="entite"
                      className={errors.id_entite ? "border-red-500" : ""}
                      disabled={loadingEntites}
                    >
                      <SelectValue
                        placeholder={
                          loadingEntites 
                            ? "Chargement..." 
                            : deleteMode 
                                ? "Sélectionner une entité à supprimer" 
                                : "Sélectionner une entité"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                        {loadingEntites ? (
                          <div className="py-2 text-center text-sm text-gray-500">
                            Chargement des entités...
                          </div>
                        ) : entitesErrorData ? (
                          <div className="py-2 text-center text-sm text-red-500">
                            Erreur: Impossible de charger les entités
                          </div>
                        ) : (
                          <>
                            {localEntites?.map((entite) => (
                              <SelectItem
                                key={entite.id_entite}
                                value={entite.id_entite?.toString()}
                                className={deleteMode ? "text-red-500 hover:bg-red-50" : ""}
                              >
                                {entite.denomination}
                              </SelectItem>
                            ))}
                            <SelectItem value="__add__" className="text-blue-600 font-medium">
                              + Ajouter une entité
                            </SelectItem>
                            {localEntites && localEntites.length > 0 && (
                              <SelectItem
                                value="__delete__"
                                className={deleteMode ? "bg-gray-100 font-medium" : "text-red-600 font-medium"}
                              >
                                {deleteMode ? "✕ Annuler la suppression" : "− Supprimer une entité"}
                              </SelectItem>
                            )}
                          </>
                        )}
                      </SelectContent>
                </Select>
                </div>

                {showAddEntite && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Nom de la nouvelle entité"
                      value={newEntiteNom}
                      onChange={(e) => setNewEntiteNom(e.target.value)}
                    />
                    <Button
                      onClick={handleAddEntite}
                      disabled={!newEntiteNom.trim()}
                    >
                      Ajouter
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddEntite(false)}>
                      Annuler
                    </Button>
                  </div>
                )}

                {errors.id_entite && (
                  <p className="text-red-500 text-sm">{errors.id_entite}</p>
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
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Interlocuteurs (facultatif)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {tempInterlocuteurs.map((interlocuteur, index) => (
                <div key={index} className="border rounded-lg p-4 relative">
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    onClick={() => removeInterlocuteur(index)}
                  >
                    <X size={16} />
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">{interlocuteur.prenom_interlocuteur} {interlocuteur.nom_interlocuteur}</p>
                      <p className="text-sm text-gray-500">{interlocuteur.fonction_interlocuteur}</p>
                    </div>
                    <div>
                      <p className="text-sm">{interlocuteur.email_interlocuteur}</p>
                      <p className="text-sm">{interlocuteur.contact_interlocuteur}</p>
                    </div>
                  </div>
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
                      className={interlocuteurErrors[tempInterlocuteurs.length]?.prenom_interlocuteur ? "border-red-500" : ""}
                    />
                    {interlocuteurErrors[tempInterlocuteurs.length]?.prenom_interlocuteur && (
                      <p className="text-red-500 text-sm">
                        {interlocuteurErrors[tempInterlocuteurs.length].prenom_interlocuteur}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nom_interlocuteur">Nom</Label>
                    <Input
                      id="nom_interlocuteur"
                      name="nom_interlocuteur"
                      value={newInterlocuteur.nom_interlocuteur}
                      onChange={handleInterlocuteurChange}
                      className={interlocuteurErrors[tempInterlocuteurs.length]?.nom_interlocuteur ? "border-red-500" : ""}
                    />
                    {interlocuteurErrors[tempInterlocuteurs.length]?.nom_interlocuteur && (
                      <p className="text-red-500 text-sm">
                        {interlocuteurErrors[tempInterlocuteurs.length].nom_interlocuteur}
                      </p>
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
                      className={interlocuteurErrors[tempInterlocuteurs.length]?.email_interlocuteur ? "border-red-500" : ""}
                    />
                    {interlocuteurErrors[tempInterlocuteurs.length]?.email_interlocuteur && (
                      <p className="text-red-500 text-sm">
                        {interlocuteurErrors[tempInterlocuteurs.length].email_interlocuteur}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_interlocuteur">Contact</Label>
                    <Input
                      id="contact_interlocuteur"
                      name="contact_interlocuteur"
                      value={newInterlocuteur.contact_interlocuteur}
                      onChange={handleInterlocuteurChange}
                      className={interlocuteurErrors[tempInterlocuteurs.length]?.contact_interlocuteur ? "border-red-500" : ""}
                    />
                    {interlocuteurErrors[tempInterlocuteurs.length]?.contact_interlocuteur && (
                      <p className="text-red-500 text-sm">
                        {interlocuteurErrors[tempInterlocuteurs.length].contact_interlocuteur}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={addInterlocuteur}
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
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              <Save size={16} className="mr-2" />
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPartnerForm;