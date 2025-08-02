// src/components/EditEntiteForm.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Save, Building, MapPin, Phone, Home, ArrowLeft } from "lucide-react";
import { Entite } from "../../types/interfaces";
import { useEntiteApi } from "@/modules/administration-Finnance/services/entiteService";
import { usePartenaireApi } from "@/modules/administration-Finnance/services/partenaireService";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { omit } from "@/lib/utils";
const EditEntiteForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { fetchEntiteById, updateEntite } = useEntiteApi();
  const { fetchPartners } = usePartenaireApi();

  // Charger les partenaires pour la sélection
  const { data: partenairesData, isLoading: loadingPartenaires } = useQuery({
    queryKey: ["partenaires-editer-entite"],
    queryFn: () => fetchPartners(1, 1000), // Récupérer tous les partenaires
  });

  const partenaires = partenairesData?.data || [];

  // Charger l'entité
  const {
    data: entiteData,
    isLoading: loadingEntite,
    error: entiteError,
  } = useQuery({
    queryKey: ["entite", id],
    queryFn: () => fetchEntiteById(parseInt(id!)),
    enabled: !!id,
  });

  const [formData, setFormData] = useState<Entite>({
    id_entite: 0,
    denomination: "",
    abreviation_nom: "",
    contact: "",
    adresse_postal: "",
    localisation: "",
    id_partenaire: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mettre à jour le formData quand les données sont chargées
  useEffect(() => {
    if (entiteData) setFormData(entiteData);
  }, [entiteData]);

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePartenaireChange = (value: string) => {
    const idPartenaire = value === "none" ? 0 : parseInt(value);
    setFormData((prev) => ({ ...prev, id_partenaire: idPartenaire }));

    if (errors["id_partenaire"]) {
      setErrors((prev) => ({ ...prev, ["id_partenaire"]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.denomination.trim()) {
      newErrors.denomination = "La dénomination est obligatoire";
    }

    if (formData.contact && !/^[+]?[0-9\s\-()]+$/.test(formData.contact)) {
      newErrors.contact = "Format de contact invalide";
    }

    if (formData.localisation && formData.localisation.length < 2) {
      newErrors.localisation =
        "La localisation doit contenir au moins 2 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Mutation pour la mise à jour de l'entité
  const { mutate: updateEntiteMutation, status } = useMutation({
    mutationFn: (data: Partial<Entite>) => updateEntite(parseInt(id!), data),
    onSuccess: () => {
      toast.success("Entité mise à jour avec succès !");
      queryClient.invalidateQueries({ queryKey: ["entites"] });
      queryClient.invalidateQueries({ queryKey: ["entite", id] });
      navigate("/gestion-administrative/entites");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erreur lors de la mise à jour de l'entité");
      }
    },
  });

  const isPending = status === "loading";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Utiliser la mutation updateEntiteMutation de TanStack Query
    updateEntiteMutation({
      ...omit(formData, ["id_partenaire"]),
    });
  };

  if (loadingEntite) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement en cours...</div>
      </div>
    );
  }

  if (entiteError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          Erreur lors du chargement de l'entité
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/gestion-administrative/entites")}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              Modifier l'entité
            </h1>
          </div>
          <p className="text-gray-500">Modifiez les informations de l'entité</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Informations de l'entité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-20 w-20 border-2 border-gray-200">
                  <AvatarFallback className="bg-blue-500 text-white text-lg">
                    {formData.denomination ? (
                      getInitials(formData.denomination)
                    ) : (
                      <Building size={24} />
                    )}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-gray-500 mt-2">
                  ID: {formData.id_entite}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="denomination">
                  Dénomination <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="denomination"
                  name="denomination"
                  placeholder="ex: Société Générale de Commerce"
                  value={formData.denomination}
                  onChange={handleChange}
                  className={errors.denomination ? "border-red-500" : ""}
                />
                {errors.denomination && (
                  <p className="text-red-500 text-sm">{errors.denomination}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="abreviation_nom">Abréviation</Label>
                <Input
                  id="abreviation_nom"
                  name="abreviation_nom"
                  placeholder="ex: SGC"
                  value={formData.abreviation_nom}
                  onChange={handleChange}
                />
                <p className="text-sm text-gray-500">
                  Abréviation courte pour identifier rapidement l'entité
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_partenaire">Partenaire associé</Label>
                <Select
                  value={
                    formData.id_partenaire === 0 ||
                    formData.id_partenaire === undefined ||
                    formData.id_partenaire === null
                      ? "none"
                      : formData.id_partenaire.toString()
                  }
                  onValueChange={handlePartenaireChange}
                  disabled={loadingPartenaires}
                >
                  <SelectTrigger
                    className={errors["id_partenaire"] ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Sélectionner un partenaire (optionnel)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun partenaire</SelectItem>
                    {partenaires.map((partenaire) => (
                      <SelectItem
                        key={partenaire.id_partenaire}
                        value={partenaire.id_partenaire.toString()}
                      >
                        {partenaire.nom_partenaire} - {partenaire.specialite}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors["id_partenaire"] && (
                  <p className="text-red-500 text-sm">
                    {errors["id_partenaire"]}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Associer cette entité à un partenaire existant (optionnel)
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="contact"
                      name="contact"
                      placeholder="ex: +225 0123456789"
                      value={formData.contact}
                      onChange={handleChange}
                      className={`pl-10 ${
                        errors.contact ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.contact && (
                    <p className="text-red-500 text-sm">{errors.contact}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="localisation">Localisation</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="localisation"
                      name="localisation"
                      placeholder="ex: Abidjan, Côte d'Ivoire"
                      value={formData.localisation}
                      onChange={handleChange}
                      className={`pl-10 ${
                        errors.localisation ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.localisation && (
                    <p className="text-red-500 text-sm">
                      {errors.localisation}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse_postal">Adresse postale</Label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  <Textarea
                    id="adresse_postal"
                    name="adresse_postal"
                    placeholder="ex: 123 Avenue des Affaires, Plateau, Abidjan"
                    value={formData.adresse_postal}
                    onChange={handleChange}
                    className="pl-10 min-h-[80px]"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Adresse complète de l'entité
                </p>
              </div>

              {formData.id_partenaire && (
                <div className="space-y-2">
                  <Label>Partenaire associé</Label>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-gray-600">
                      Cette entité est associée au partenaire{" "}
                      {
                        partenaires.find(
                          (paternaire) =>
                            paternaire.id_partenaire === formData.id_partenaire
                        )?.nom_partenaire
                      }{" "}
                      -
                      {
                        partenaires.find(
                          (paternaire) =>
                            paternaire.id_partenaire === formData.id_partenaire
                        )?.specialite
                      }
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      La modification du partenaire associé se fait depuis la
                      gestion des partenaires
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/gestion-administrative/entites")}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              <Save className="mr-2 h-4 w-4" />
              {isPending
                ? "Sauvegarde en cours..."
                : "Sauvegarder les modifications"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEntiteForm;
