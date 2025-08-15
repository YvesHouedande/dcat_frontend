// src/components/EditPartnerForm.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Save, Building, X, Plus } from "lucide-react";
import { Interlocuteur, Partenaires } from "../../types/interfaces";
import { usePartenaireApi } from "@/modules/administration-Finnance/services/partenaireService";

import { toast } from "sonner";

const EditPartnerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    fetchPartnerById,
    updatePartner,
    fetchInterlocuteursByPartenaire,
    addInterlocuteur,
    updateInterlocuteur,
    deleteInterlocuteur,
  } = usePartenaireApi();

  // Charger le partenaire
  const {
    data: partnerData,
    isLoading: loadingPartner,
    error: partnerError,
  } = useQuery({
    queryKey: ["partner", id],
    queryFn: () => fetchPartnerById(parseInt(id!)),
    enabled: !!id,
  });

  // Charger les interlocuteurs
  const { data: initialInterlocuteurs, isLoading: loadingInterlocuteurs } =
    useQuery({
      queryKey: ["interlocuteurs", id],
      queryFn: () => fetchInterlocuteursByPartenaire(parseInt(id!)),
      enabled: !!id,
    });

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

  // Variables pour gérer les champs personnalisés
  const [showCustomType, setShowCustomType] = useState(false);
  const [showCustomSpecialite, setShowCustomSpecialite] = useState(false);

  const [interlocuteurs, setInterlocuteurs] = useState<Interlocuteur[]>([]);
  const [newInterlocuteur, setNewInterlocuteur] = useState<
    Omit<Interlocuteur, "id_interlocuteur" | "id_partenaire">
  >({
    nom_interlocuteur: "",
    prenom_interlocuteur: "",
    fonction_interlocuteur: "",
    contact_interlocuteur: "",
    email_interlocuteur: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [interlocuteurErrors, setInterlocuteurErrors] = useState<
    Record<number, Record<string, string>>
  >({});
  const [editingInterlocuteur, setEditingInterlocuteur] = useState<
    number | null
  >(null);

  // Mettre à jour le formData et interlocuteurs quand les données sont chargées
  useEffect(() => {
    if (partnerData) setFormData(partnerData);
  }, [partnerData]);

  useEffect(() => {
    if (initialInterlocuteurs) setInterlocuteurs(initialInterlocuteurs);
  }, [initialInterlocuteurs]);

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
    "Autres",
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

  // Initialiser les champs personnalisés quand les données sont chargées
  useEffect(() => {
    if (partnerData) {
      // Vérifier si le type ou la spécialité ne sont pas dans les listes prédéfinies
      if (partnerData.type_partenaire && !types_partenaire.includes(partnerData.type_partenaire)) {
        setShowCustomType(true);
      }
      if (partnerData.specialite && !specialites.includes(partnerData.specialite)) {
        setShowCustomSpecialite(true);
      }
    }
  }, [partnerData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (field: string, value: string | number | undefined) => {
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
      setErrors((prev) => ({ ...prev, [field]: "" }));
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

  const addInterlocuteurHandler = async () => {
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
        [-1]: {
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
        [-1]: {
          email_interlocuteur: "Format d'email invalide",
        },
      }));
      return;
    }

    try {
      const createdInterlocuteur = await addInterlocuteur({
        ...newInterlocuteur,
        id_partenaire: parseInt(id!),
      });

      setInterlocuteurs((prev) => [...prev, createdInterlocuteur]);
      setNewInterlocuteur({
        nom_interlocuteur: "",
        prenom_interlocuteur: "",
        fonction_interlocuteur: "",
        contact_interlocuteur: "",
        email_interlocuteur: "",
      });
      setInterlocuteurErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[-1];
        return newErrors;
      });
      toast.success("Interlocuteur ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'interlocuteur:", error);
      toast.error("Erreur lors de l'ajout de l'interlocuteur");
    }
  };

  const updateInterlocuteurData = async (index: number) => {
    const interlocuteur = interlocuteurs[index];
    if (!interlocuteur) return;

    // Validation des champs requis
    const requiredFields = {
      nom_interlocuteur: "Nom",
      prenom_interlocuteur: "Prénom",
      contact_interlocuteur: "Contact",
      email_interlocuteur: "Email",
      fonction_interlocuteur: "Fonction",
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !interlocuteur[key as keyof typeof interlocuteur])
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      setInterlocuteurErrors((prev) => ({
        ...prev,
        [index]: {
          general: `Les champs suivants sont obligatoires : ${missingFields.join(
            ", "
          )}`,
        },
      }));
      return;
    }

    // Validation de l'email
    if (!/^\S+@\S+\.\S+$/.test(interlocuteur.email_interlocuteur)) {
      setInterlocuteurErrors((prev) => ({
        ...prev,
        [index]: {
          email_interlocuteur: "Format d'email invalide",
        },
      }));
      return;
    }

    try {
      const updatedInterlocuteur = await updateInterlocuteur(
        interlocuteur.id_interlocuteur,
        {
          nom_interlocuteur: interlocuteur.nom_interlocuteur,
          prenom_interlocuteur: interlocuteur.prenom_interlocuteur,
          fonction_interlocuteur: interlocuteur.fonction_interlocuteur,
          contact_interlocuteur: interlocuteur.contact_interlocuteur,
          email_interlocuteur: interlocuteur.email_interlocuteur,
          id_partenaire: interlocuteur.id_partenaire,
        }
      );

      setInterlocuteurs((prev) =>
        prev.map((item, i) => (i === index ? updatedInterlocuteur : item))
      );
      setEditingInterlocuteur(null);
      setInterlocuteurErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
      toast.success("Interlocuteur mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'interlocuteur:", error);
      toast.error("Erreur lors de la mise à jour de l'interlocuteur");
    }
  };

  const removeInterlocuteur = async (id: number, index: number) => {
    try {
      await deleteInterlocuteur(id);
      setInterlocuteurs((prev) => prev.filter((_, i) => i !== index));
      toast.success("Interlocuteur supprimé avec succès !");
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'interlocuteur:",
        error
      );
      toast.error("Erreur lors de la suppression de l'interlocuteur");
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

    if (!formData.statut) {
      newErrors.statut = "Le statut est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Mutation pour la mise à jour du partenaire
  const { mutate: updatePartenaire } = useMutation({
    mutationFn: (data: Partial<Partenaires>) =>
      updatePartner(parseInt(id!), data),
    onSuccess: () => {
      toast.success("Partenaire mis à jour avec succès !");
      queryClient.invalidateQueries(["partenaires"]);
      navigate("/gestion-administrative/partenaires");
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erreur lors de la mise à jour du partenaire";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Utiliser la mutation updatePartenaire de TanStack Query
    updatePartenaire({
      nom_partenaire: formData.nom_partenaire,
      telephone_partenaire: formData.telephone_partenaire,
      email_partenaire: formData.email_partenaire,
      specialite: formData.specialite,
      localisation: formData.localisation,
      type_partenaire: formData.type_partenaire,
      statut: formData.statut,
    });
  };

  if (loadingPartner || loadingInterlocuteurs) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement en cours...</div>
      </div>
    );
  }

  if (partnerError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          Erreur lors du chargement du partenaire
        </div>
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
                      formData.nom_partenaire
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)
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
              {/* Liste des interlocuteurs existants */}
              {interlocuteurs.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">
                    Interlocuteurs existants ({interlocuteurs.length})
                  </h4>
                  {interlocuteurs.map((interlocuteur, index) => (
                    <div
                      key={interlocuteur.id_interlocuteur}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      {editingInterlocuteur === index ? (
                        // Mode édition
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`nom_${index}`}>Nom</Label>
                              <Input
                                id={`nom_${index}`}
                                value={interlocuteur.nom_interlocuteur}
                                onChange={(e) => {
                                  const updatedInterlocuteurs = [
                                    ...interlocuteurs,
                                  ];
                                  updatedInterlocuteurs[index] = {
                                    ...updatedInterlocuteurs[index],
                                    nom_interlocuteur: e.target.value,
                                  };
                                  setInterlocuteurs(updatedInterlocuteurs);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`prenom_${index}`}>Prénom</Label>
                              <Input
                                id={`prenom_${index}`}
                                value={interlocuteur.prenom_interlocuteur}
                                onChange={(e) => {
                                  const updatedInterlocuteurs = [
                                    ...interlocuteurs,
                                  ];
                                  updatedInterlocuteurs[index] = {
                                    ...updatedInterlocuteurs[index],
                                    prenom_interlocuteur: e.target.value,
                                  };
                                  setInterlocuteurs(updatedInterlocuteurs);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`fonction_${index}`}>
                                Fonction
                              </Label>
                              <Input
                                id={`fonction_${index}`}
                                value={interlocuteur.fonction_interlocuteur}
                                onChange={(e) => {
                                  const updatedInterlocuteurs = [
                                    ...interlocuteurs,
                                  ];
                                  updatedInterlocuteurs[index] = {
                                    ...updatedInterlocuteurs[index],
                                    fonction_interlocuteur: e.target.value,
                                  };
                                  setInterlocuteurs(updatedInterlocuteurs);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`contact_${index}`}>
                                Contact
                              </Label>
                              <Input
                                id={`contact_${index}`}
                                value={interlocuteur.contact_interlocuteur}
                                onChange={(e) => {
                                  const updatedInterlocuteurs = [
                                    ...interlocuteurs,
                                  ];
                                  updatedInterlocuteurs[index] = {
                                    ...updatedInterlocuteurs[index],
                                    contact_interlocuteur: e.target.value,
                                  };
                                  setInterlocuteurs(updatedInterlocuteurs);
                                }}
                              />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                              <Label htmlFor={`email_${index}`}>Email</Label>
                              <Input
                                id={`email_${index}`}
                                type="email"
                                value={interlocuteur.email_interlocuteur}
                                onChange={(e) => {
                                  const updatedInterlocuteurs = [
                                    ...interlocuteurs,
                                  ];
                                  updatedInterlocuteurs[index] = {
                                    ...updatedInterlocuteurs[index],
                                    email_interlocuteur: e.target.value,
                                  };
                                  setInterlocuteurs(updatedInterlocuteurs);
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              onClick={() => updateInterlocuteurData(index)}
                              size="sm"
                            >
                              Sauvegarder
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setEditingInterlocuteur(null)}
                              size="sm"
                            >
                              Annuler
                            </Button>
                          </div>
                          {interlocuteurErrors[index]?.general && (
                            <p className="text-red-500 text-sm">
                              {interlocuteurErrors[index].general}
                            </p>
                          )}
                          {interlocuteurErrors[index]?.email_interlocuteur && (
                            <p className="text-red-500 text-sm">
                              {interlocuteurErrors[index].email_interlocuteur}
                            </p>
                          )}
                        </div>
                      ) : (
                        // Mode affichage
                        <div className="flex items-center justify-between">
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
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingInterlocuteur(index)}
                            >
                              Modifier
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                >
                                  <X size={16} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirmer la suppression
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer cet interlocuteur ? 
                                    Cette action ne peut pas être annulée.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      removeInterlocuteur(
                                        interlocuteur.id_interlocuteur,
                                        index
                                      )
                                    }
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      )}
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
                  onClick={addInterlocuteurHandler}
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter l'interlocuteur
                </Button>

                {interlocuteurErrors[-1]?.general && (
                  <p className="text-red-500 text-sm mt-2">
                    {interlocuteurErrors[-1].general}
                  </p>
                )}
                {interlocuteurErrors[-1]?.email_interlocuteur && (
                  <p className="text-red-500 text-sm mt-2">
                    {interlocuteurErrors[-1].email_interlocuteur}
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
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder les modifications
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPartnerForm;
