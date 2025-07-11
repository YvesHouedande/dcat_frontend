// src/components/EditPartnerForm.tsx
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
import { useNavigate, useParams } from "react-router-dom";
import { Interlocuteur, Partenaires } from "../../types/interfaces";
import {
  fetchPartnerById,
  updatePartner,
  fetchEntites,
  addEntite,
  deleteEntite,
} from '@/modules/administration-Finnance/services/partenaireService';
import { useApiCall } from '@/hooks/useAPiCall';

interface Entite {
  id: number;
  nom: string;
}

const EditPartnerForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // États pour la gestion des entités
  const { 
    data: entites, 
    loading: loadingEntites, 
    error: entitesError, 
    call: fetchEntitesData 
  } = useApiCall<Entite[]>(fetchEntites);

  // État pour la mise à jour du partenaire
  const { 
    call: submitPartnerData, 
    loading: isSubmitting 
  } = useApiCall<Partenaires, [string, Partenaires]>(updatePartner);

  // État pour le chargement du partenaire existant
  const { 
    call: fetchPartnerData 
  } = useApiCall<Partenaires, [string]>(fetchPartnerById);

  const [formData, setFormData] = useState<Partenaires>({
    id_partenaire: 0,
    nom_partenaire: "",
    telephone_partenaire: "",
    email_partenaire: "",
    specialite: "",
    localisation: "",
    type_partenaire: "",
    statut: "Actif", // Ajout du statut avec valeur par défaut
    id_entite: 0,
    interlocuteurs: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [interlocuteurErrors, setInterlocuteurErrors] = useState<Record<number, Record<string, string>>>({});
  const [newInterlocuteur, setNewInterlocuteur] = useState<Interlocuteur>({
    id_interlocuteur: 0,
    nom_interlocuteur: "",
    prenom_interlocuteur: "",
    fonction_interlocuteur: "",
    contact_interlocuteur: "",
    mail_interlocuteur: "",
  });

  const [newEntiteNom, setNewEntiteNom] = useState("");
  const [showAddEntite, setShowAddEntite] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [localEntites, setLocalEntites] = useState<Entite[]>([]);
  

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

  // Ajout des statuts possibles
  const statuts = [
    "Actif",
    "Inactif",
    "En pause",
    "Suspendu",
    "Résilié",
    "En négociation"
  ];

  // Chargement initial des données
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchEntitesData();
        if (id) {
          const partner = await fetchPartnerData(id);
          if (partner) {
            // Si le partenaire n'a pas de statut (données existantes), on initialise avec "Actif"
            if (!partner.statut) {
              partner.statut = "Actif";
            }
            setFormData(partner);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [id]);

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Gestion des changements de formulaire (identique à AddPartnerForm)
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

  // Gestion des entités (identique à AddPartnerForm)
  const handleAddEntite = async () => {
      if (!newEntiteNom.trim()) return;
  
      try {
        const newEntite = await addEntite({ nom: newEntiteNom });
        setLocalEntites([...(localEntites || []), newEntite]);
        setFormData(prev => ({ ...prev, id_entite: newEntite.id }));
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
        setDeleteMode(false);
      } catch (error) {
        console.error("Failed to delete entite", error);
        alert("Erreur lors de la suppression de l'entité");
      }
    }
  };

  // Gestion des interlocuteurs (identique à AddPartnerForm)
  const handleInterlocuteurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewInterlocuteur(prev => ({ ...prev, [name]: value }));
  };

  const addInterlocuteur = () => {
    const newErrors: Record<string, string> = {};

    if (!newInterlocuteur.nom_interlocuteur.trim()) {
      newErrors.nom_interlocuteur = "Le nom est obligatoire";
    }

    if (!newInterlocuteur.prenom_interlocuteur.trim()) {
      newErrors.prenom_interlocuteur = "Le prénom est obligatoire";
    }

    if (!newInterlocuteur.mail_interlocuteur.trim()) {
      newErrors.mail_interlocuteur = "L'email est obligatoire";
    } else if (!/^\S+@\S+\.\S+$/.test(newInterlocuteur.mail_interlocuteur)) {
      newErrors.mail_interlocuteur = "Format d'email invalide";
    }

    if (!newInterlocuteur.contact_interlocuteur.trim()) {
      newErrors.contact_interlocuteur = "Le contact est obligatoire";
    }

    if (Object.keys(newErrors).length > 0) {
      setInterlocuteurErrors(prev => ({
        ...prev,
        [formData.interlocuteurs.length]: newErrors
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      interlocuteurs: [...prev.interlocuteurs, newInterlocuteur]
    }));

    setNewInterlocuteur({
      id_interlocuteur: 0,
      nom_interlocuteur: "",
      prenom_interlocuteur: "",
      fonction_interlocuteur: "",
      contact_interlocuteur: "",
      mail_interlocuteur: "",
    });

    setInterlocuteurErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[formData.interlocuteurs.length];
      return newErrors;
    });
  };

  const removeInterlocuteur = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interlocuteurs: prev.interlocuteurs.filter((_, i) => i !== index)
    }));

    setInterlocuteurErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  // Validation (identique à AddPartnerForm)
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

    if (!formData.statut) {
      newErrors.statut = "Le statut est obligatoire";
    }

    if (!formData.id_entite) {
      newErrors.id_entite = "L'entité est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission adaptée pour l'édition
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (!id) {
        throw new Error("ID du partenaire manquant");
      }
      
      await submitPartnerData(id, formData);
      alert("Partenaire mis à jour avec succès !");
      navigate("/administration/partenaires");
    } catch (error) {
      console.error("Error details:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la mise à jour du partenaire.");
    }
  };

  // JSX (identique à AddPartnerForm sauf pour les parties spécifiques)
  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Modifier un partenaire
          </h1>
          <p className="text-gray-500">
            Remplissez le formulaire pour modifier le partenaire
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
                <div className="relative mb-4">
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
                  <p className="text-red-500 text-sm">{errors.nom_partenaire}</p>
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
                  <p className="text-red-500 text-sm">{errors.type_partenaire}</p>
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

              {/* Ajout du champ statut */}
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
                      } else {
                        if (deleteMode) {
                          handleDeleteEntite(parseInt(value, 10));
                        } else {
                          handleSelectChange("id_entite", parseInt(value, 10));
                        }
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
                            ? "Choisir une entité à supprimer"
                            : "Sélectionner une entité"
                        }
                      />
                    </SelectTrigger>
  
                    <SelectContent>
                      {loadingEntites ? (
                        <div className="py-2 text-center text-sm text-gray-500">
                          Chargement des entités...
                        </div>
                      ) : entitesError ? (
                        <div className="py-2 text-center text-sm text-red-500">
                          Erreur: Impossible de charger les entités
                        </div>
                      ) : (
                        <>
                          {entites?.map((entite) => (
                            <SelectItem
                              key={entite.id}
                              value={entite.id.toString()}
                              className={deleteMode ? "text-red-500 hover:bg-red-50" : ""}
                            >
                              {entite.nom}
                            </SelectItem>
                          ))}
  
                          <SelectItem value="__add__" className="text-blue-600 font-medium">
                            + Ajouter une entité
                          </SelectItem>
  
                          {entites && entites.length > 0 && (
                            <SelectItem
                              value="__delete__"
                              className={
                                deleteMode
                                  ? "bg-gray-100 font-medium"
                                  : "text-red-600 font-medium"
                              }
                            >
                              {deleteMode
                                ? "✕ Annuler la suppression"
                                : "− Supprimer une entité"}
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
                    <Button
                      variant="outline"
                      onClick={() => setShowAddEntite(false)}
                    >
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
                  className={
                    errors.telephone_partenaire ? "border-red-500" : ""
                  }
                />
                {errors.telephone_partenaire && (
                  <p className="text-red-500 text-sm">
                    {errors.telephone_partenaire}
                  </p>
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
              {formData.interlocuteurs.map((interlocuteur, index) => (
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
                      <p className="font-medium">
                        {interlocuteur.prenom_interlocuteur}{" "}
                        {interlocuteur.nom_interlocuteur}
                      </p>
                      <p className="text-sm text-gray-500">
                        {interlocuteur.fonction_interlocuteur}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm">
                        {interlocuteur.mail_interlocuteur}
                      </p>
                      <p className="text-sm">
                        {interlocuteur.contact_interlocuteur}
                      </p>
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
                      className={
                        interlocuteurErrors[formData.interlocuteurs.length]
                          ?.prenom_interlocuteur
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {interlocuteurErrors[formData.interlocuteurs.length]
                      ?.prenom_interlocuteur && (
                      <p className="text-red-500 text-sm">
                        {
                          interlocuteurErrors[formData.interlocuteurs.length]
                            .prenom_interlocuteur
                        }
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
                      className={
                        interlocuteurErrors[formData.interlocuteurs.length]
                          ?.nom_interlocuteur
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {interlocuteurErrors[formData.interlocuteurs.length]
                      ?.nom_interlocuteur && (
                      <p className="text-red-500 text-sm">
                        {
                          interlocuteurErrors[formData.interlocuteurs.length]
                            .nom_interlocuteur
                        }
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
                    <Label htmlFor="mail_interlocuteur">Email</Label>
                    <Input
                      id="mail_interlocuteur"
                      name="mail_interlocuteur"
                      type="email"
                      value={newInterlocuteur.mail_interlocuteur}
                      onChange={handleInterlocuteurChange}
                      className={
                        interlocuteurErrors[formData.interlocuteurs.length]
                          ?.mail_interlocuteur
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {interlocuteurErrors[formData.interlocuteurs.length]
                      ?.mail_interlocuteur && (
                      <p className="text-red-500 text-sm">
                        {
                          interlocuteurErrors[formData.interlocuteurs.length]
                            .mail_interlocuteur
                        }
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
                      className={
                        interlocuteurErrors[formData.interlocuteurs.length]
                          ?.contact_interlocuteur
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {interlocuteurErrors[formData.interlocuteurs.length]
                      ?.contact_interlocuteur && (
                      <p className="text-red-500 text-sm">
                        {
                          interlocuteurErrors[formData.interlocuteurs.length]
                            .contact_interlocuteur
                        }
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
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
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

export default EditPartnerForm;