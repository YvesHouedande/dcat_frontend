// src/components/AddPartnerForm.tsx
import React, { useState } from "react";
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
import { Interlocuteur, Partenaires } from "../../types/interfaces";
import { usePartenaireApi } from "@/modules/administration-Finnance/services/partenaireService";

import { useApiCall } from "@/hooks/useAPiCall";
import { omit } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// Interface pour les interlocuteurs temporaires (sans id_partenaire)
interface TempInterlocuteur
  extends Omit<Interlocuteur, "id_partenaire" | "id_interlocuteur"> {
  id_interlocuteur: number;
}

const AddPartnerForm: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addPartner, addMultipleInterlocuteurs } = usePartenaireApi();

  const { call: submitPartnerData, loading: isSubmitting } = useApiCall<
    Partenaires,
    [Omit<Partenaires, "id_partenaire">]
  >(addPartner);

  // État pour les données du partenaire
  const [formData, setFormData] = useState<Partenaires>({
    id_partenaire: 0,
    nom_partenaire: "",
    telephone_partenaire: "",
    email_partenaire: "",
    specialite: "",
    localisation: "",
    type_partenaire: "",
    statut: "Actif",
    id_entite: undefined,
  });

  // État séparé pour les interlocuteurs temporaires
  const [tempInterlocuteurs, setTempInterlocuteurs] = useState<
    TempInterlocuteur[]
  >([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [interlocuteurErrors, setInterlocuteurErrors] = useState<
    Record<number, Record<string, string>>
  >({});
  const [newInterlocuteur, setNewInterlocuteur] = useState<TempInterlocuteur>({
    id_interlocuteur: 0,
    nom_interlocuteur: "",
    prenom_interlocuteur: "",
    fonction_interlocuteur: "",
    contact_interlocuteur: "",
    email_interlocuteur: "",
  });

  // États pour les options "Autres"
  const [showCustomType, setShowCustomType] = useState(false);
  const [showCustomSpecialite, setShowCustomSpecialite] = useState(false);

  const types_partenaire = [
    "Fournisseur",
    "Client",
    "Autres",
  ];

  const specialites = [
    "Audiovisuelle",
    "Domotique",
    "Informatique & Réseau",
    "Solutions Solaires",
    "Autres",
  ];

  const statuts = ["Actif", "Inactif", "En attente", "Suspendu", "Archivé"];



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

  const handleSelectChange = (field: string, value: string | number | undefined) => {
    console.log(
      `handleSelectChange - field: ${field}, value: ${value}, type: ${typeof value}`
    );
    
    // Gestion des options "Autres"
    if (field === "type_partenaire" && value === "Autres") {
      setShowCustomType(true);
      setFormData((prev) => ({ ...prev, [field]: "" }));
    } else if (field === "specialite" && value === "Autres") {
      setShowCustomSpecialite(true);
      setFormData((prev) => ({ ...prev, [field]: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Masquer les champs personnalisés si une option normale est sélectionnée
      if (field === "type_partenaire") {
        setShowCustomType(false);
      } else if (field === "specialite") {
        setShowCustomSpecialite(false);
      }
    }
    
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleInterlocuteurChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewInterlocuteur((prev) => ({ ...prev, [name]: value }));
  };

  // Gestionnaires pour les champs personnalisés
  const handleCustomTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, type_partenaire: value }));
  };

  const handleCustomSpecialiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, specialite: value }));
  };

  const addInterlocuteur = () => {
    // Validation des champs requis
    const requiredFields = {
      nom_interlocuteur: "Nom",
      prenom_interlocuteur: "Prénom",
      contact_interlocuteur: "Contact",
      email_interlocuteur: "Email",
      fonction_interlocuteur: "Fonction",
    };

    const missingFields = Object.entries(requiredFields)
      .filter(
        ([key]) => !newInterlocuteur[key as keyof typeof newInterlocuteur]
      )
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      setInterlocuteurErrors((prev) => ({
        ...prev,
        [tempInterlocuteurs.length]: {
          general: `Les champs suivants sont obligatoires : ${missingFields.join(
            ", "
          )}`,
        },
      }));
      return;
    }

    // Validation de l'email
    if (!/^\S+@\S+\.\S+$/.test(newInterlocuteur.email_interlocuteur)) {
      setInterlocuteurErrors((prev) => ({
        ...prev,
        [tempInterlocuteurs.length]: {
          email_interlocuteur: "Format d'email invalide",
        },
      }));
      return;
    }

    // Ajouter l'interlocuteur à la liste temporaire
    setTempInterlocuteurs((prev) => [
      ...prev,
      { ...newInterlocuteur, id_interlocuteur: Date.now() },
    ]);

    // Réinitialiser le formulaire d'interlocuteur
    setNewInterlocuteur({
      id_interlocuteur: 0,
      nom_interlocuteur: "",
      prenom_interlocuteur: "",
      fonction_interlocuteur: "",
      contact_interlocuteur: "",
      email_interlocuteur: "",
    });

    // Effacer les erreurs
    setInterlocuteurErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[tempInterlocuteurs.length];
      return newErrors;
    });
  };

  const removeInterlocuteur = (index: number) => {
    setTempInterlocuteurs((prev) => prev.filter((_, i) => i !== index));
    setInterlocuteurErrors((prev) => {
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
      };

      console.log("Données du partenaire à envoyer:", partenaireData);

      const createdPartenaire = await submitPartnerData(partenaireData);
      console.log("Partenaire créé:", createdPartenaire);

      // 2. Si des interlocuteurs ont été ajoutés, les créer avec l'ID du partenaire
      if (tempInterlocuteurs.length > 0 && createdPartenaire?.id_partenaire) {
        const interlocuteursToCreate = tempInterlocuteurs.map((inter) => ({
          nom_interlocuteur: inter.nom_interlocuteur,
          prenom_interlocuteur: inter.prenom_interlocuteur,
          contact_interlocuteur: inter.contact_interlocuteur,
          email_interlocuteur: inter.email_interlocuteur,
          fonction_interlocuteur: inter.fonction_interlocuteur,
          id_partenaire: createdPartenaire.id_partenaire,
        }));

        try {
          await addMultipleInterlocuteurs(
            interlocuteursToCreate,
            createdPartenaire.id_partenaire
          );
        } catch (error) {
          console.error("Erreur lors de l'ajout des interlocuteurs:", error);
          if (axios.isAxiosError(error)) {
            toast.error(
              `Erreur lors de l'ajout des interlocuteurs: ${
                error.response?.data?.message || error.message
              }`
            );
          } else {
            toast.error("Erreur lors de l'ajout des interlocuteurs");
          }
          return;
        }
      }

      toast.success("Partenaire ajouté avec succès !");
      console.log("Invalidation des requêtes partenaires...");
      queryClient.invalidateQueries(["partenaires"]);
      navigate("/gestion-administrative/partenaires");
    } catch (error) {
      console.error("Error details:", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          `Erreur lors de l'ajout du partenaire: ${
            error.response?.data?.message || error.message
          }`
        );
      } else {
        toast.error("Erreur lors de l'ajout du partenaire");
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <p className="text-red-500 text-sm">
                      {errors.email_partenaire}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="specialite">Spécialité</Label>
                  {showCustomSpecialite ? (
                    <Input
                      placeholder="Entrez votre spécialité personnalisée"
                      value={formData.specialite}
                      onChange={handleCustomSpecialiteChange}
                      className={errors.specialite ? "border-red-500" : ""}
                    />
                  ) : (
                    <Select
                      value={formData.specialite}
                      onValueChange={(value) =>
                        handleSelectChange("specialite", value)
                      }
                    >
                      <SelectTrigger
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
                  )}
                  {errors.specialite && (
                    <p className="text-red-500 text-sm">{errors.specialite}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type_partenaire">Type de partenaire</Label>
                  {showCustomType ? (
                    <Input
                      placeholder="Entrez votre type de partenaire personnalisé"
                      value={formData.type_partenaire}
                      onChange={handleCustomTypeChange}
                      className={errors.type_partenaire ? "border-red-500" : ""}
                    />
                  ) : (
                    <Select
                      value={formData.type_partenaire}
                      onValueChange={(value) =>
                        handleSelectChange("type_partenaire", value)
                      }
                    >
                      <SelectTrigger
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
                  )}
                  {errors.type_partenaire && (
                    <p className="text-red-500 text-sm">
                      {errors.type_partenaire}
                    </p>
                  )}
                </div>
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
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value) => handleSelectChange("statut", value)}
                >
                  <SelectTrigger
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

              
            </CardContent>
          </Card>

          {/* Section Interlocuteurs */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Interlocuteurs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Liste des interlocuteurs temporaires */}
              {tempInterlocuteurs.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">
                    Interlocuteurs à ajouter ({tempInterlocuteurs.length})
                  </h4>
                  {tempInterlocuteurs.map((interlocuteur, index) => (
                    <div
                      key={interlocuteur.id_interlocuteur}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {interlocuteur.nom_interlocuteur}{" "}
                          {interlocuteur.prenom_interlocuteur}
                        </p>
                        <p className="text-sm text-gray-500">
                          {interlocuteur.fonction_interlocuteur} •{" "}
                          {interlocuteur.contact_interlocuteur}
                        </p>
                        <p className="text-sm text-gray-500">
                          {interlocuteur.email_interlocuteur}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeInterlocuteur(index)}
                        className="ml-2"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulaire pour ajouter un interlocuteur */}
              <div className="border-t pt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-4">
                  Ajouter un interlocuteur
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nom_interlocuteur">Nom</Label>
                    <Input
                      id="nom_interlocuteur"
                      name="nom_interlocuteur"
                      value={newInterlocuteur.nom_interlocuteur}
                      onChange={handleInterlocuteurChange}
                    />
                  </div>

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
                    <Label htmlFor="fonction_interlocuteur">Fonction</Label>
                    <Input
                      id="fonction_interlocuteur"
                      name="fonction_interlocuteur"
                      value={newInterlocuteur.fonction_interlocuteur}
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

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="email_interlocuteur">Email</Label>
                    <Input
                      id="email_interlocuteur"
                      name="email_interlocuteur"
                      type="email"
                      value={newInterlocuteur.email_interlocuteur}
                      onChange={handleInterlocuteurChange}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={addInterlocuteur}
                  className="mt-4"
                  variant="outline"
                >
                  Ajouter l'interlocuteur
                </Button>

                {interlocuteurErrors[tempInterlocuteurs.length]?.general && (
                  <p className="text-red-500 text-sm mt-2">
                    {interlocuteurErrors[tempInterlocuteurs.length].general}
                  </p>
                )}
                {interlocuteurErrors[tempInterlocuteurs.length]
                  ?.email_interlocuteur && (
                  <p className="text-red-500 text-sm mt-2">
                    {
                      interlocuteurErrors[tempInterlocuteurs.length]
                        .email_interlocuteur
                    }
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/gestion-administrative/partenaires")}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Ajout en cours..." : "Ajouter le partenaire"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPartnerForm;
