import React, { useRef, useState } from "react";
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
import { Camera, Save, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
const EditEmployeForm: React.FC = () => {
  const router = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    missions: "",
    poste: "",
    email: "",
    phone: "",
    domicile: "",
    statut: "actif",
  });

  // États pour la validation et la soumission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Générer les initiales à partir du nom
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
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

  // Gérer le téléchargement d'image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Déclencher le clic sur l'input file
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Gérer la sélection de statut
  const handlestatutChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      statut: value as "active" | "away" | "offline",
    }));
  };

  // Valider le formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est obligatoire";
    }

    if (!formData.missions.trim()) {
      newErrors.role = "Le rôle est obligatoire";
    }

    if (!formData.poste) {
      newErrors.poste = "Le poste est obligatoire";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
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
      console.log("Données soumises:", formData);

      // Redirection vers la liste des employés après ajout
      alert("Employé ajouté avec succès !");
      router("/administration/employers"); // Redirection vers la liste des employés

      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Modifier les informations d'un employé
          </h1>
          <p className="text-gray-500">
            Remplissez le formulaire pour modifier les informations d'un membre
            de l'équipe
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Section téléchargement photo de profil */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <Avatar className="h-20 w-20 border-2 border-gray-200">
                    {profileImage ? (
                      <div className="h-full w-full overflow-hidden rounded-full">
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <AvatarFallback className="bg-blue-500 text-white text-lg">
                        {formData.name ? (
                          getInitials(formData.name)
                        ) : (
                          <UserPlus size={24} />
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
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={triggerFileInput}
                >
                  Télécharger une photo
                </Button>
              </div>

              {/* Nom complet */}
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="ex: YAO Biskoty"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              {/* Rôle */}
              <div className="space-y-2">
                <Label htmlFor="role">Rôle ou mission</Label>
                <Input
                  id="missions"
                  name="missionss"
                  placeholder="ex: Développeur Frontend"
                  value={formData.missions}
                  onChange={handleChange}
                  className={errors.missions ? "border-red-500" : ""}
                />
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.missions}</p>
                )}
              </div>

              {/* Poste */}
              <div className="space-y-2">
                <Label htmlFor="poste">Poste</Label>
                <Input
                  id="poste"
                  name="poste"
                  placeholder="ex: Développeur Frontend"
                  value={formData.poste}
                  onChange={handleChange}
                  className={errors.poste ? "border-red-500" : ""}
                />
                {errors.poste && (
                  <p className="text-red-500 text-sm">{errors.poste}</p>
                )}
              </div>

              {/* Statut */}
              <div className="space-y-2">
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={handlestatutChange}
                >
                  <SelectTrigger id="statut">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Informations de contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ex: nom.prenom@dcat.ci"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="ex: 06 12 34 56 78"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {/* Adresse */}
              <div className="space-y-2">
                <Label htmlFor="phone">Domicile</Label>
                <Input
                  id="adresse"
                  name="adresse"
                  placeholder="ex:Abidjan"
                  value={formData.domicile}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => router(-1)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
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

export default EditEmployeForm;
