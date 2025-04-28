import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Upload, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Schéma de validation avec Zod
const formSchema = z.object({
  id_produit: z.string(),
  Code_produit: z.string().regex(/^[A-Z]{3}-[A-Z]{3}-[A-Z]{3}$/, {
    message: "Le code produit doit être au format XXX-XXX-XXX",
  }),
  desi_produit: z.string().min(1, { message: "La désignation est requise" }),
  desc_produit: z.string().optional(),
  image_produit: z.string().optional(),
  Qte_produit: z.coerce
    .number()
    .min(0, { message: "La quantité doit être positive" }),
  emplacement: z.string().min(1, { message: "L'emplacement est requis" }),
  Id_type_produit: z
    .number()
    .min(1, { message: "Le type de produit est requis" }),
  Id_modele: z.string().min(1, { message: "Le modèle est requis" }),
  id_famille: z.string().min(1, { message: "La famille est requise" }),
  id_marque: z.string().min(1, { message: "La marque est requise" }),
});

// Fonction utilitaire pour générer le code produit
function generateProductCode(
  modele: string,
  famille: string,
  marque: string
): string {
  const getFirstThreeLetters = (str: string) =>
    str
      .replace(/[^a-zA-Z]/g, "") // Supprime les caractères non alphabétiques
      .toUpperCase()
      .substring(0, 3);

  const modelePart = getFirstThreeLetters(modele);
  const famillePart = getFirstThreeLetters(famille);
  const marquePart = getFirstThreeLetters(marque);

  return `${modelePart}-${famillePart}-${marquePart}`;
}

export default function ProduitAddPage() {
  // Options pour les select
  const typeOptions = [
    { id: "TYPE001", name: "Écrans" },
    { id: "TYPE002", name: "Périphériques" },
    { id: "TYPE003", name: "Stockage" },
    { id: "TYPE004", name: "Audio" },
    { id: "TYPE005", name: "Accessoires" },
  ];

  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gestion de la sélection d'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mettre à jour le nom du fichier dans le formulaire
      form.setValue("image_produit", file.name);

      // Créer un URL pour l'aperçu
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const modeleOptions = [
    { id: "MOD123", name: "Modèle Standard" },
    { id: "MOD456", name: "Modèle Premium" },
    { id: "MOD789", name: "Modèle Professionnel" },
  ];

  const familleOptions = [
    { id: "FAM22", name: "Informatique" },
    { id: "FAM33", name: "Réseau" },
    { id: "FAM44", name: "Audio/Vidéo" },
    { id: "FAM55", name: "Accessoires" },
  ];

  const marqueOptions = [
    { id: "BRAND03", name: "TechPro" },
    { id: "BRAND05", name: "ElectroMax" },
    { id: "BRAND07", name: "AudioTech" },
    { id: "BRAND08", name: "InfoSys" },
    { id: "BRAND09", name: "MediaHub" },
    { id: "BRAND12", name: "StoragePro" },
  ];

  // Initialisation de React Hook Form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_produit: "",
      Code_produit: "",
      desi_produit: "",
      desc_produit: "",
      image_produit: "",
      Qte_produit: 0,
      emplacement: "",
      Id_type_produit: 1,
      Id_modele: "",
      id_famille: "",
      id_marque: "",
    },
  });

  // Watch les valeurs des sélecteurs
  const selectedModeleId = form.watch("Id_modele");
  const selectedFamilleId = form.watch("id_famille");
  const selectedMarqueId = form.watch("id_marque");

  // Effet pour générer le code produit automatiquement
  React.useEffect(() => {
    if (selectedModeleId && selectedFamilleId && selectedMarqueId) {
      const selectedModele =
        modeleOptions.find((m) => m.id === selectedModeleId)?.name || "";
      const selectedFamille =
        familleOptions.find((f) => f.id === selectedFamilleId)?.name || "";
      const selectedMarque =
        marqueOptions.find((m) => m.id === selectedMarqueId)?.name || "";

      const generatedCode = generateProductCode(
        selectedModele,
        selectedFamille,
        selectedMarque
      );
      form.setValue("Code_produit", generatedCode);
    } else {
      form.setValue("Code_produit", "");
    }
  }, [selectedModeleId, selectedFamilleId, selectedMarqueId, form]);

  const isLoading = form.formState.isSubmitting;

  // Soumettre le formulaire
  const onSubmit = async (data) => {
    try {
      // Simulation d'un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Produit ajouté:", data);

      // Réinitialiser le formulaire après succès
      form.reset();

      // Afficher un toast de succès
      toast("Produit ajouté", {
        description: `Le produit ${data.desi_produit} a été ajouté avec succès.`,
      });
    } catch (error) {
      toast("Erreur", {
        description: "Une erreur s'est produite lors de l'ajout du produit.",
      });
    }
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex items-center mb-6">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="sm"
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Ajouter un produit</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Carte pour l'image */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Image du produit</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div
                  className="w-full aspect-square bg-gray-100 rounded-md flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Aperçu de l'image du produit"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-500 text-center mb-4">
                        Glissez-déposez une image ou cliquez pour parcourir
                      </p>
                    </>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    {previewImage ? "Changer l'image" : "Parcourir"}
                  </Button>
                </div>
                <div className="w-full mt-4">
                  <FormField
                    control={form.control}
                    name="image_produit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du fichier</FormLabel>
                        <FormControl>
                          <Input
                            readOnly
                            placeholder="Aucun fichier sélectionné"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            {/* Formulaire principal */}
            <div className="md:col-span-2 space-y-6">
              {/* Informations générales */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informations générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="Code_produit"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Code Produits *</FormLabel>
                          <FormControl>
                            <Input
                              readOnly
                              placeholder="Le code sera généré automatiquement"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="desi_produit"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Désignation *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nom de l'équipement"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="desc_produit"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description détaillée de l'équipement"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="Qte_produit"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Quantité *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emplacement"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Emplacement *</FormLabel>
                          <FormControl>
                            <Input placeholder="Entrepôt A" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Classifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Classifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="Id_modele"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Modèle *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un modèle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {modeleOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="id_famille"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Famille *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une famille" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {familleOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="id_marque"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Marque *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une marque" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {marqueOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="Id_type_produit"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <div className="hidden">
                            <FormLabel>Type de produit *</FormLabel>
                            <FormControl>
                              <Input readOnly  placeholder="Outil" {...field} />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Boutons d'action */}
              <Card>
                <CardFooter className="flex justify-between p-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    Réinitialiser
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>Enregistrement...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
