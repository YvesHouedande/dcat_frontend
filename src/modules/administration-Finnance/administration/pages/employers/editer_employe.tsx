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
import { Employe } from "../../types/interfaces"; // Import the Employe interface

const EditEmployeForm: React.FC = () => {
  const router = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Employe>({
    id_employe: 0, // Added id_employe field
    nom_employes: "",
    prenom_employes: "",
    email_employes: "",
    contact_employes: "",
    adresse_employes: "",
    status: "actif",
    date_embauche_employes: "",
    date_de_naissance: "",
    contrats: "",
    id_fonction: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const getInitials = (name: string) => {
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as "actif" | "absent" | "depart",
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom_employes.trim()) {
      newErrors.nom_employes = "Le nom est obligatoire";
    }

    if (!formData.prenom_employes.trim()) {
      newErrors.prenom_employes = "Le prénom est obligatoire";
    }

    if (!formData.email_employes?.trim()) {
      newErrors.email_employes = "L'email est obligatoire";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email_employes)) {
      newErrors.email_employes = "Format d'email invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Données soumises:", formData);
      alert("Employé modifié avec succès !");
      router("/administration/employers");

      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Modifier les informations d'un employé
          </h1>
          <p className="text-gray-500">
            Remplissez le formulaire pour modifier les informations d'un membre
            de l'équipe
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                        {formData.nom_employes ? (
                          getInitials(formData.nom_employes)
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

              <div className="space-y-2">
                <Label htmlFor="nom_employes">Nom</Label>
                <Input
                  id="nom_employes"
                  name="nom_employes"
                  placeholder="ex: YAO"
                  value={formData.nom_employes}
                  onChange={handleChange}
                  className={errors.nom_employes ? "border-red-500" : ""}
                />
                {errors.nom_employes && (
                  <p className="text-red-500 text-sm">{errors.nom_employes}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="prenom_employes">Prénom</Label>
                <Input
                  id="prenom_employes"
                  name="prenom_employes"
                  placeholder="ex: Biskoty"
                  value={formData.prenom_employes}
                  onChange={handleChange}
                  className={errors.prenom_employes ? "border-red-500" : ""}
                />
                {errors.prenom_employes && (
                  <p className="text-red-500 text-sm">{errors.prenom_employes}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="depart">Départ</SelectItem>
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
              <div className="space-y-2">
                <Label htmlFor="email_employes">Adresse email</Label>
                <Input
                  id="email_employes"
                  name="email_employes"
                  type="email"
                  placeholder="ex: nom.prenom@dcat.ci"
                  value={formData.email_employes}
                  onChange={handleChange}
                  className={errors.email_employes ? "border-red-500" : ""}
                />
                {errors.email_employes && (
                  <p className="text-red-500 text-sm">{errors.email_employes}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_employes">Numéro de téléphone</Label>
                <Input
                  id="contact_employes"
                  name="contact_employes"
                  placeholder="ex: 06 12 34 56 78"
                  value={formData.contact_employes}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse_employes">Adresse</Label>
                <Input
                  id="adresse_employes"
                  name="adresse_employes"
                  placeholder="ex: Abidjan"
                  value={formData.adresse_employes}
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
