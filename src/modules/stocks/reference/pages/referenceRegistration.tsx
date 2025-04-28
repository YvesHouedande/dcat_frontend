import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormValues,
  ReferenceSelect,
  formSchema,
} from "../components/ui/ReferenceSelect";
import { ImageDropzone } from "../utils/ImageDropzone";
import { generateProductCode } from "../../utils/generateProductCode";
import { useReferenceOptions } from "../../hooks/useReferenceOptions";



// Composant principal
export default function ProductRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState({
    success: false,
    message: "",
  });
  const { categories, modeles, familles, marques } = useReferenceOptions();
  const [selectedReferences, setSelectedReferences] = useState({
    id_marque: 0,
    id_modele: 0,
    id_categorie: 0,
    id_famille: 0,
    id_type_produit: 0,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Code_produit: "",
      desi_produit: "",
      desc_produit: "",
      image_produit: "",
      emplacement: "",
      caracteristiques: "",
      id_categorie: 0,
      id_type_produit: 1,
      id_modele: 0,
      id_famille: 0,
      id_marque: 0,
    },
  });

  // Générer le code produit automatiquement
  useEffect(() => {
    const { id_marque, id_modele, id_categorie, id_famille } =
      selectedReferences;
    const code = generateProductCode(
      id_marque,
      id_modele,
      id_categorie,
      id_famille,
      marques,
      modeles,
      categories,
      familles
    );
    if (code) {
      form.setValue("Code_produit", code);
    }
  }, [selectedReferences, form, marques, modeles, categories, familles]);

  const handleImageSelected = (imageDataUrl: string) => {
    form.setValue("image_produit", imageDataUrl);
  };

  const handleReferenceChange = (
    field: keyof typeof selectedReferences,
    value: number
  ) => {
    setSelectedReferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Simulation d'un appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(data);
      setSubmitResult({
        success: true,
        message: "Produit enregistré avec succès!",
      });
      form.reset(); // Réinitialise le formulaire
      setSelectedReferences({
        id_marque: 0,
        id_modele: 0,
        id_categorie: 0,
        id_famille: 0,
        id_type_produit: 1, // ou la valeur par défaut si besoin
      });
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "Erreur lors de l'enregistrement du produit.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            Enregistrement d'un nouveau produit
          </CardTitle>
          <CardDescription>
            Remplissez les informations pour ajouter un nouveau produit au
            catalogue
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {submitResult.message && (
            <Alert
              className={`mb-6 ${
                submitResult.success ? "bg-green-50" : "bg-red-50"
              }`}
            >
              {submitResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertTitle>
                {submitResult.success ? "Succès" : "Erreur"}
              </AlertTitle>
              <AlertDescription>{submitResult.message}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className=" p-4 rounded-md mb-4">
                <h3 className="font-medium mb-2">Classification du produit</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ReferenceSelect
                    items={marques}
                    label="Marque"
                    name="id_marque"
                    control={form.control}
                    isRequired={true}
                    onChange={(value) =>
                      handleReferenceChange("id_marque", Number.parseInt(value))
                    }
                  />
                  <ReferenceSelect
                    items={modeles}
                    label="Modèle"
                    name="id_modele"
                    control={form.control}
                    isRequired={true}
                    onChange={(value) =>
                      handleReferenceChange("id_modele", Number.parseInt(value))
                    }
                  />
                  <ReferenceSelect
                    items={categories}
                    label="Catégorie"
                    name="id_categorie"
                    control={form.control}
                    isRequired={true}
                    onChange={(value) =>
                      handleReferenceChange("id_categorie", Number.parseInt(value))
                    }
                  />
                  <ReferenceSelect
                    items={familles}
                    label="Famille"
                    name="id_famille"
                    control={form.control}
                    isRequired={true}
                    onChange={(value) =>
                      handleReferenceChange("id_famille", Number.parseInt(value))
                    }
                  />
                  <FormField
                    control={form.control}
                    name="Code_produit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code produit</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-gray-100" />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Généré automatiquement
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="id_type_produit"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} type="hidden" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <h3 className="font-medium mb-2">Informations du produit</h3>
                  <FormField
                    control={form.control}
                    name="desi_produit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Désignation<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Nom du produit" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="desc_produit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description détaillée du produit"
                            className="h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <h3 className="font-medium mb-2">Image du produit</h3>
                  <FormField
                    control={form.control}
                    name="image_produit"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <ImageDropzone
                            onImageSelected={handleImageSelected}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid items-start grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emplacement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Emplacement<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Localisation du produit"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="caracteristiques"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caractéristiques</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Caractéristiques techniques"
                          className="h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    Réinitialiser
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Enregistrement en cours..."
                      : "Enregistrer le produit"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
