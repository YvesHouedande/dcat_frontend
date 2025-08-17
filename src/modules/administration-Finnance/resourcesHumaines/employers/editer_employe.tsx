import React, { useRef, useState, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Camera,
  Save,
  UserPlus,
  Plus,
  Upload,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Briefcase,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Employe, Fonction } from "../../administration/types/interfaces";
import { fetchFonctions, createFonction, deleteFonction } from "../../services/fonctionService";
import { useEmployesApi } from "../../services/employeService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const EditEmployeForm: React.FC = () => {
  const router = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [fonctions, setFonctions] = useState<Fonction[]>([]);
  const [newFonction, setNewFonction] = useState("");
  const [isAddingFonction, setIsAddingFonction] = useState(false);
  const [isDeletingFonction, setIsDeletingFonction] = useState(false);
  const [fonctionToDelete, setFonctionToDelete] = useState<Fonction | null>(null);
  const { fetchEmployeById, updateEmploye, uploadEmployePhoto } = useEmployesApi();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Employe>({
    id_employes: 0,
    nom_employes: "",
    prenom_employes: "",
    email_employes: "",
    contact_employes: "",
    adresse_employes: "",
    status_employes: "actif",
    date_embauche_employes: "",
    date_de_naissance: "",
    contrat: "",
    id_fonction: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fonction pour construire l'URL de la photo
  const getPhotoUrl = (photoPath: string | null | undefined): string | undefined => {
    if (!photoPath) {
      return undefined;
    }
    
    // Si c'est déjà une URL complète, on la retourne
    if (photoPath.startsWith('http')) {
      return photoPath;
    }
    
    // Construire l'URL correcte pour les images
    // Enlever /api/ de l'URL de base car les images sont servies directement
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const baseUrl = API_URL.replace('/api', ''); // Enlever /api/ de l'URL
    const fullUrl = `${baseUrl}/${photoPath}`;
    
    return fullUrl;
  };

  useEffect(() => {
    loadFonctions();
    if (id) {
      fetchEmployeById(Number(id))
        .then((employe) => {
          setFormData(employe);
          console.log("Employé chargé pour édition :", employe);
        })
        .catch((error) => {
          console.error("Erreur lors du chargement de l'employé :", error);
        });
    }
  }, [id, fetchEmployeById]);

  const loadFonctions = async () => {
    try {
      const data = await fetchFonctions();
      setFonctions(data);
    } catch (error) {
      console.error("Erreur lors du chargement des fonctions:", error);
    }
  };

  const handleAddFonction = async () => {
    if (!newFonction.trim()) return;

    try {
      await createFonction({ nom_fonction: newFonction });
      await loadFonctions();
      setNewFonction("");
      setIsAddingFonction(false);
      toast.success("Fonction créée avec succès");
    } catch (error) {
      console.error("Erreur lors de la création de la fonction:", error);
      toast.error("Erreur lors de la création de la fonction");
    }
  };

  // Fonctions de gestion de la suppression de fonction
  const handleDeleteFonction = async (fonction: Fonction) => {
    // Vérifier si la fonction est utilisée par l'employé actuel
    if (formData.id_fonction === fonction.id_fonction) {
      toast.error("Impossible de supprimer la fonction actuellement attribuée à cet employé");
      return;
    }

    setFonctionToDelete(fonction);
  };

  const handleDeleteFonctionConfirm = async () => {
    if (!fonctionToDelete) return;

    setIsDeletingFonction(true);
    try {
      await deleteFonction(fonctionToDelete.id_fonction);
      await loadFonctions();
      toast.success("Fonction supprimée avec succès");
      setFonctionToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression de la fonction:", error);
      toast.error("Erreur lors de la suppression de la fonction");
    } finally {
      setIsDeletingFonction(false);
    }
  };

  const handleDeleteFonctionCancel = () => {
    setFonctionToDelete(null);
  };

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
      // Validation du fichier
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error("Format de fichier non supporté. Utilisez JPEG, PNG ou GIF.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB max
        toast.error("Fichier trop volumineux. Taille maximale : 5MB");
        return;
      }

      // Stocker le fichier pour l'upload
      setSelectedFile(file);
      
      // Créer l'aperçu
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
      status_employes: value as "actif" | "absent" | "depart",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Préparer uniquement les champs attendus par l'API
      const employeToSend = {
        nom_employes: formData.nom_employes,
        prenom_employes: formData.prenom_employes,
        email_employes: formData.email_employes,
        contact_employes: formData.contact_employes || "",
        adresse_employes: formData.adresse_employes || "",
        status_employes: formData.status_employes,
        date_embauche_employes: formData.date_embauche_employes,
        date_de_naissance: formData.date_de_naissance || "",
        contrat: formData.contrat || "",
        id_fonction: formData.id_fonction,
      };
      console.log("Données envoyées (nettoyées) :", employeToSend);
      
      // Mettre à jour les données de l'employé
      await updateEmploye(formData.id_employes, employeToSend);
      
             // Upload de la photo si un fichier a été sélectionné
       if (selectedFile) {
         console.log("Upload de la photo...");
         try {
           await uploadEmployePhoto(formData.id_employes, selectedFile);
           console.log("Photo uploadée avec succès");
           toast.success("Photo de profil mise à jour avec succès");
         } catch (photoError) {
           console.error("Erreur lors de l'upload de la photo:", photoError);
           toast.warning("L'employé a été modifié mais l'upload de la photo a échoué.");
         }
       }
       
       toast.success("Employé modifié avec succès !");
       router("/resources-humaines/employes");
     } catch (error) {
       console.error("Erreur lors de la mise à jour :", error);
       toast.error("Erreur lors de la modification de l'employé. Veuillez réessayer.");
     } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      actif: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Actif",
      },
      absent: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Absent",
      },
      depart: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Départ",
      },
    } as const;

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.actif;
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header avec breadcrumb */}
        <div className="mb-8">
         

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Modifier l'employé
              </h1>
              <p className="text-gray-600">
                Mettez à jour les informations de {formData.prenom_employes}{" "}
                {formData.nom_employes}
              </p>
            </div>
            {getStatusBadge(formData.status_employes)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Photo de profil - Section mise en avant */}
          <Card className="overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage 
                      src={profileImage || getPhotoUrl(formData.photo_employes)} 
                      alt={`${formData.prenom_employes} ${formData.nom_employes}`}
                      className="h-full w-full object-cover"
                    />
                    <AvatarFallback className="bg-white text-blue-600 text-xl font-bold">
                      {formData.nom_employes && formData.prenom_employes ? (
                        getInitials(
                          `${formData.prenom_employes} ${formData.nom_employes}`
                        )
                      ) : (
                        <UserPlus size={32} />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    className="absolute -bottom-2 -right-2 bg-white hover:bg-gray-50 rounded-full p-2 text-blue-600 shadow-lg border-2 border-blue-100 transition-all duration-200 hover:scale-105"
                    onClick={triggerFileInput}
                  >
                    <Camera size={16} />
                  </button>
                </div>

                <div className="text-white">
                  <h2 className="text-xl font-semibold mb-2">
                    {formData.prenom_employes} {formData.nom_employes}
                  </h2>
                  <p className="text-blue-100 mb-3">
                    {fonctions.find(
                      (f) => f.id_fonction === formData.id_fonction
                    )?.nom_fonction || "Fonction non définie"}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                    onClick={triggerFileInput}
                  >
                    <Upload size={14} className="mr-2" />
                    Changer la photo
                  </Button>
                </div>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Card>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Informations personnelles */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                  <User className="h-5 w-5 text-blue-600" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="nom_employes"
                      className="text-sm font-medium text-gray-700"
                    >
                      Nom  <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nom_employes"
                      name="nom_employes"
                      placeholder="ex: KOUAME"
                      value={formData.nom_employes}
                      onChange={handleChange}
                      className={`transition-all duration-200 ${
                        errors.nom_employes
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                      }`}
                    />
                    {errors.nom_employes && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.nom_employes}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="prenom_employes"
                      className="text-sm font-medium text-gray-700"
                    >
                      Prénom <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="prenom_employes"
                      name="prenom_employes"
                      placeholder="ex: Jean-Baptiste"
                      value={formData.prenom_employes}
                      onChange={handleChange}
                      className={`transition-all duration-200 ${
                        errors.prenom_employes
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                      }`}
                    />
                    {errors.prenom_employes && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.prenom_employes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="date_de_naissance"
                      className="text-sm font-medium text-gray-700"
                    >
                      Date de naissance
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="date_de_naissance"
                        name="date_de_naissance"
                        type="date"
                        value={formData.date_de_naissance}
                        onChange={handleChange}
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="status"
                      className="text-sm font-medium text-gray-700"
                    >
                      Statut
                    </Label>
                    <Select
                      value={formData.status_employes}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger
                        id="status"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                      >
                        <SelectValue placeholder="Sélectionner le statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actif">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Actif
                          </div>
                        </SelectItem>
                        <SelectItem value="absent">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Absent
                          </div>
                        </SelectItem>
                        <SelectItem value="depart">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            Départ
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations de contact */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email_employes"
                    className="text-sm font-medium text-gray-700"
                  >
                    Adresse email <span className="text-red-500">*</span>   
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email_employes"
                      name="email_employes"
                      type="email"
                      placeholder="ex: jean.kouame@dcat.ci"
                      value={formData.email_employes}
                      onChange={handleChange}
                      className={`pl-10 transition-all duration-200 ${
                        errors.email_employes
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                      }`}
                    />
                  </div>
                  {errors.email_employes && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.email_employes}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="contact_employes"
                    className="text-sm font-medium text-gray-700"
                  >
                    Numéro de téléphone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="contact_employes"
                      name="contact_employes"
                      placeholder="ex: 07 12 34 56 78"
                      value={formData.contact_employes}
                      onChange={handleChange}
                      className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="adresse_employes"
                    className="text-sm font-medium text-gray-700"
                  >
                    Adresse
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="adresse_employes"
                      name="adresse_employes"
                      placeholder="ex: Cocody, Abidjan"
                      value={formData.adresse_employes}
                      onChange={handleChange}
                      className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Informations professionnelles */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Informations professionnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="id_fonction"
                    className="text-sm font-medium text-gray-700"
                  >
                    Fonction <span className="text-red-500">*</span>  
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      value={
                        formData.id_fonction
                          ? formData.id_fonction.toString()
                          : ""
                      }
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          id_fonction: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger
                        id="id_fonction"
                        className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                      >
                        <SelectValue placeholder="Sélectionner une fonction" />
                      </SelectTrigger>
                      <SelectContent>
                        {fonctions.map((fonction) => (
                          <SelectItem
                            key={fonction.id_fonction}
                            value={fonction.id_fonction.toString()}
                          >
                            {fonction.nom_fonction}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Dialog
                      open={isAddingFonction}
                      onOpenChange={setIsAddingFonction}
                    >
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="whitespace-nowrap border-gray-200 hover:border-blue-300 hover:text-blue-600"
                        >
                          <Plus size={16} className="mr-1" />
                          Nouvelle
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5 text-blue-600" />
                            Ajouter une fonction
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="new-fonction"
                              className="text-sm font-medium text-gray-700"
                            >
                              Nom de la fonction
                            </Label>
                            <Input
                              id="new-fonction"
                              value={newFonction}
                              onChange={(e) => setNewFonction(e.target.value)}
                              placeholder="ex: Développeur Full-Stack"
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                            />
                          </div>
                          <div className="flex justify-end gap-3 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsAddingFonction(false)}
                              className="border-gray-200 hover:border-gray-300"
                            >
                              Annuler
                            </Button>
                            <Button
                              type="button"
                              onClick={handleAddFonction}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Ajouter
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Section de gestion des fonctions */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Gestion des fonctions
                  </Label>
                  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {fonctions.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-2">
                          Aucune fonction disponible
                        </p>
                      ) : (
                        fonctions.map((fonction) => (
                          <div
                            key={fonction.id_fonction}
                            className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50"
                          >
                            <span className="text-sm font-medium text-gray-700">
                              {fonction.nom_fonction}
                            </span>
                            <div className="flex items-center gap-2">
                              {formData.id_fonction === fonction.id_fonction && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  Actuelle
                                </span>
                              )}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteFonction(fonction)}
                                disabled={formData.id_fonction === fonction.id_fonction}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title={
                                  formData.id_fonction === fonction.id_fonction
                                    ? "Impossible de supprimer la fonction actuellement attribuée"
                                    : "Supprimer cette fonction"
                                }
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="contrat"
                    className="text-sm font-medium text-gray-700"
                  >
                    Type de contrat
                  </Label>
                  <Select
                    value={formData.contrat}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, contrat: value }))
                    }
                  >
                    <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-200">
                      <SelectValue placeholder="Sélectionner le type de contrat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CDI">
                        CDI - Contrat à Durée Indéterminée
                      </SelectItem>
                      <SelectItem value="CDD">
                        CDD - Contrat à Durée Déterminée
                      </SelectItem>
                      <SelectItem value="Stage">Stage</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="date_embauche_employes"
                  className="text-sm font-medium text-gray-700"
                >
                  Date d'embauche
                </Label>
                <div className="relative max-w-md">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="date_embauche_employes"
                    name="date_embauche_employes"
                    type="date"
                    value={formData.date_embauche_employes}
                    onChange={handleChange}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Les champs marqués d'un <span className="text-red-500">*</span> sont obligatoires
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="px-6 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                onClick={() => window.history.back()}
              >
                <ArrowLeft size={16} className="mr-2" />
                Retour
              </Button>
              <Button
                type="submit"
                className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Dialog de confirmation de suppression de fonction */}
        <AlertDialog open={!!fonctionToDelete} onOpenChange={(open) => !open && setFonctionToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer la fonction{" "}
                <strong>{fonctionToDelete?.nom_fonction}</strong> ? 
                Cette action est irréversible et supprimera définitivement cette fonction.
                {formData.id_fonction === fonctionToDelete?.id_fonction && (
                  <span className="block mt-2 text-red-600 font-medium">
                    ⚠️ Cette fonction est actuellement attribuée à cet employé et ne peut pas être supprimée.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleDeleteFonctionCancel} disabled={isDeletingFonction}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteFonctionConfirm}
                disabled={isDeletingFonction || formData.id_fonction === fonctionToDelete?.id_fonction}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeletingFonction ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Suppression...
                  </>
                ) : (
                  "Supprimer définitivement"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default EditEmployeForm;
