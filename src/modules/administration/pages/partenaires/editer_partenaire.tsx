import React, { useState, useRef } from "react";
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
import { Save, Building, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditPartnerForm: React.FC = () => {
  const router = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nom_partenaire: "",
    telephone_partenaire: "",
    Email_partenaire: "",
    specialite: "",
    localisation: "",
    type_partenaire: "",
    Entite: "",
  });

  const [logo, setLogo] = useState<string | null>(null);

  // États pour la validation et la soumission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Options pour les listes déroulantes
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

  const entites = ["Societé", "Prestataire", "Freelance"];

  // Générer les initiales à partir du nom
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Gérer le téléchargement du logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Déclencher le clic sur l'input file
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Mettre à jour les données du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Effacer l'erreur si l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Gérer les changements de sélection
  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom_partenaire.trim()) {
      newErrors.nom_partenaire = "Le nom du partenaire est obligatoire";
    }

    if (!formData.telephone_partenaire.trim()) {
      newErrors.telephone_partenaire = "Le numéro de téléphone est obligatoire";
    }

    if (!formData.Email_partenaire.trim()) {
      newErrors.Email_partenaire = "L'email est obligatoire";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.Email_partenaire)) {
      newErrors.Email_partenaire = "Format d'email invalide";
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

    if (!formData.Entite) {
      newErrors.Entite = "L'entité est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulation d'une soumission à une API
    setTimeout(() => {
      // Ici, vous pourriez envoyer les données à votre backend
      console.log("Données soumises:", { ...formData, logo });

      // Redirection vers la liste des partenaires après ajout
      alert("Partenaire ajouté avec succès !");
      router("/administration/partenaires"); // Redirection vers la liste des partenaires

      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Modifier les informations d'un partenaire
          </h1>
          <p className="text-gray-500">
            Remplissez le formulaire pour modifier les informations d'un
            partenaire
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Informations du partenaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Section téléchargement logo */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <Avatar className="h-20 w-20 border-2 border-gray-200">
                    {logo ? (
                      <div className="h-full w-full overflow-hidden rounded-full">
                        <img
                          src={logo}
                          alt="Logo du partenaire"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <AvatarFallback className="bg-blue-500 text-white text-lg">
                        {formData.nom_partenaire ? (
                          getInitials(formData.nom_partenaire)
                        ) : (
                          <Building size={24} />
                        )}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-1 text-white"
                    onClick={triggerFileInput}
                  >
                    <Camera size={14} />
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={triggerFileInput}
                >
                  Télécharger un logo
                </Button>
              </div>

              {/* Nom partenaire */}
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

              {/* Type partenaire */}
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

              {/* Spécialité */}
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

              {/* Entité */}
              <div className="space-y-2">
                <Label htmlFor="Entite">Entité</Label>
                <Select
                  value={formData.Entite}
                  onValueChange={(value) => handleSelectChange("Entite", value)}
                >
                  <SelectTrigger
                    id="Entite"
                    className={errors.Entite ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Sélectionner une entité" />
                  </SelectTrigger>
                  <SelectContent>
                    {entites.map((entite) => (
                      <SelectItem key={entite} value={entite}>
                        {entite}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.Entite && (
                  <p className="text-red-500 text-sm">{errors.Entite}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Localisation et contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Localisation */}
              <div className="space-y-2">
                <Label htmlFor="localisation">Localisation</Label>
                <Input
                  id="localisation"
                  name="localisation"
                  placeholder="ex: Abidjan, Côte d'Ivoire"
                  value={formData.localisation}
                  onChange={handleChange}
                  className={errors.localisation ? "border-red-500" : ""}
                />
                {errors.localisation && (
                  <p className="text-red-500 text-sm">{errors.localisation}</p>
                )}
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label htmlFor="telephone_partenaire">
                  Numéro de téléphone
                </Label>
                <Input
                  id="telephone_partenaire"
                  name="telephone_partenaire"
                  placeholder="ex: +225 01 23 45 67 34"
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

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="Email_partenaire">Adresse email</Label>
                <Input
                  id="Email_partenaire"
                  name="Email_partenaire"
                  type="email"
                  placeholder="ex: contact@entreprise-abc.com"
                  value={formData.Email_partenaire}
                  onChange={handleChange}
                  className={errors.Email_partenaire ? "border-red-500" : ""}
                />
                {errors.Email_partenaire && (
                  <p className="text-red-500 text-sm">
                    {errors.Email_partenaire}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router(-1)}>
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
