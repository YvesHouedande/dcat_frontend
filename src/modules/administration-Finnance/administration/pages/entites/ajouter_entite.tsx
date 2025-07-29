// src/components/AddEntiteForm.tsx
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Save, Building, MapPin, Phone, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Entite } from "../../types/interfaces";
import { useEntiteApi } from '@/modules/administration-Finnance/services/entiteService';
import { usePartenaireApi } from '@/modules/administration-Finnance/services/partenaireService';
import { useApiCall } from '@/hooks/useAPiCall';
import { toast } from "sonner";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddEntiteForm: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addEntite } = useEntiteApi();
  const { fetchPartners } = usePartenaireApi();

  // Invalider le cache des partenaires quand on revient sur la page
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["partenaires"] });
  }, [queryClient]);

  // Charger les partenaires pour la sélection
  const { data: partenairesData, isLoading: loadingPartenaires } = useQuery({
    queryKey: ["partenaires"],
    queryFn: () => fetchPartners(1, 1000), // Récupérer tous les partenaires
    refetchOnMount: true, // Recharger à chaque montage
    refetchOnWindowFocus: true, // Recharger quand la fenêtre reprend le focus
  });

  const partenaires = partenairesData?.data || [];

  const {
    call: submitEntiteData,
    loading: isSubmitting
  } = useApiCall<Entite, [{
    denomination: string;
    abreviation_nom?: string;
    contact?: string;
    adresse_postal?: string;
    localisation?: string;
    id_partenaire?: number;
  }]>(addEntite);

  // État pour les données de l'entité
  const [formData, setFormData] = useState({
    denomination: "",
    abreviation_nom: "",
    contact: "",
    adresse_postal: "",
    localisation: "",
    id_partenaire: undefined as number | undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handlePartenaireChange = (value: string) => {
    const idPartenaire = value === "none" ? undefined : parseInt(value);
    setFormData((prev) => ({ ...prev, id_partenaire: idPartenaire }));
    
    if (errors["id_partenaire"]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors["id_partenaire"];
        return newErrors;
      });
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
      newErrors.localisation = "La localisation doit contenir au moins 2 caractères";
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
      const entiteData = {
        denomination: formData.denomination.trim(),
        abreviation_nom: formData.abreviation_nom.trim() || undefined,
        contact: formData.contact.trim() || undefined,
        adresse_postal: formData.adresse_postal.trim() || undefined,
        localisation: formData.localisation.trim() || undefined,
        id_partenaire: formData.id_partenaire,
      };
      
      console.log("Données de l'entité à envoyer:", entiteData);
      
      const createdEntite = await submitEntiteData(entiteData);
      console.log("Entité créée:", createdEntite);

      toast.success("Entité ajoutée avec succès !");
      console.log("Invalidation des requêtes entités...");
      queryClient.invalidateQueries(['entites']);
      navigate("/gestion-administrative/entites");
    } catch (error) {
      console.error("Error details:", error);
      toast.error("Erreur lors de l'ajout de l'entité");
    }
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Ajouter une entité
          </h1>
          <p className="text-gray-500">
            Remplissez le formulaire pour ajouter une nouvelle entité
          </p>
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
                  value={formData.id_partenaire?.toString() || "none"}
                  onValueChange={handlePartenaireChange}
                  disabled={loadingPartenaires}
                >
                  <SelectTrigger className={errors["id_partenaire"] ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner un partenaire (optionnel)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      Aucun partenaire
                    </SelectItem>
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
                  <p className="text-red-500 text-sm">{errors["id_partenaire"]}</p>
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
                      className={`pl-10 ${errors.contact ? "border-red-500" : ""}`}
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
                      className={`pl-10 ${errors.localisation ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.localisation && (
                    <p className="text-red-500 text-sm">{errors.localisation}</p>
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
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Ajout en cours..." : "Ajouter l'entité"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntiteForm; 