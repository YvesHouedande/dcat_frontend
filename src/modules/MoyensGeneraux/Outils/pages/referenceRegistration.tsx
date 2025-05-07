import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  ReferenceSelectMarque,
  ReferenceSelectCategorie,
  ReferenceSelectFamille,
  ReferenceSelectModele,
} from "../components/ui/ReferenceSelect";
import { referenceSchema } from "@/modules/stocks/reference/schemas/referenceSchema";
import { ImageDropzone } from "../utils/ImageDropzone";
import { generateProductCode } from "@/modules/stocks/utils/generateProductCode";
import { useReferenceOptions } from "@/modules/stocks/hooks/useReferenceOptions";
import { ReferenceProduit } from "@/modules/stocks/types/reference";

export default function ReferenceForm() {
  const { categories, modeles, familles, marques } = useReferenceOptions();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState({
    success: false,
    message: "",
  });
  const [selectedReferences, setSelectedReferences] = useState({
    id_marque: 0,
    id_modele: 0,
    id_categorie: 0,
    id_famille: 0,
    id_type_produit: 2, // Valeur par défaut définie à 2 comme demandé
  });

  // Valeurs par défaut initiales
  const defaultValues = {
    id_produit: 0,
    code_produit: "",
    desi_produit: "",
    desc_produit: "",
    image_produit: "",
    emplacement: "",
    caracteristiques: "",
    id_categorie: 2,
    id_type_produit: 2, // Valeur par défaut définie à 2 comme demandé
    id_modele: 2,
    id_famille: 3,
    id_marque: 5,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(referenceSchema),
    defaultValues,
  });

  // Récupère les données du produit si on est en mode édition
  useEffect(() => {
    const fetchProduct = async () => {
      if (isEditMode) {
        try {
          // En production, remplacer par un vrai appel API
          // const response = await fetch(`/api/produits/${id}`);
          // const product = await response.json();
          
          // Simulation de données récupérées pour la démonstration
          const product: ReferenceProduit = {
            id_produit: Number(id),
            code_produit: "SAM-MDA-ELC-FAX",
            desi_produit: "Moniteur Samsung",
            desc_produit: "Un super écran",
            image_produit: "",
            emplacement: "A1",
            qte_produit: 0,
            caracteristiques: "27 pouces, 4K",
            id_categorie: 3,
            id_type_produit: 2, // Toujours initialiser à 2
            id_modele: 4,
            id_famille: 5,
            id_marque: 6,
          };
          
          form.reset(product);
          setSelectedReferences({
            id_marque: product.id_marque,
            id_modele: product.id_modele,
            id_categorie: product.id_categorie,
            id_famille: product.id_famille,
            id_type_produit: product.id_type_produit || 2, // Assurer que c'est 2 si non défini
          });
        } catch (error) {
          console.error("Erreur lors de la récupération du produit:", error);
          setSubmitResult({
            success: false,
            message: "Erreur lors de la récupération du produit.",
          });
        }
      }
    };
    
    fetchProduct();
  }, [id, isEditMode, form]);

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
      form.setValue("code_produit", code);
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
      // Assurer que id_type_produit est bien défini à 2
      data.id_type_produit = 2;
      
      // Simulation d'un appel API - À remplacer par un vrai appel en production
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (isEditMode) {
        // Pour la modification d'un produit existant
        // await fetch(`/api/produits/${id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // });
        console.log("Produit modifié:", data);
        setSubmitResult({
          success: true,
          message: "Produit modifié avec succès!",
        });
      } else {
        // Pour l'ajout d'un nouveau produit
        // await fetch('/api/produits', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // });
        console.log("Nouveau produit ajouté:", data);
        setSubmitResult({
          success: true,
          message: "Produit ajouté avec succès!",
        });
        // Réinitialiser le formulaire après ajout
        if (!isEditMode) {
          form.reset(defaultValues);
          setSelectedReferences({
            id_marque: defaultValues.id_marque,
            id_modele: defaultValues.id_modele,
            id_categorie: defaultValues.id_categorie,
            id_famille: defaultValues.id_famille,
            id_type_produit: 2,
          });
        }
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: isEditMode 
          ? "Erreur lors de la modification du produit." 
          : "Erreur lors de l'ajout du produit.",
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
            {isEditMode ? "Modification" : "Ajout"} d'un produit
          </CardTitle>
          <CardDescription>
            {isEditMode 
              ? "Modifiez les informations du produit sélectionné" 
              : "Ajoutez un nouveau produit à votre catalogue"}
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
              <div className="p-4 rounded-md mb-4">
                <h3 className="font-medium mb-2">Classification du produit</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ReferenceSelectMarque
                    items={marques}
                    label="Marque"
                    name="id_marque"
                    control={form.control}
                    isRequired={true}
                    onChange={(value) =>
                      handleReferenceChange("id_marque", Number.parseInt(value))
                    }
                  />
                  <ReferenceSelectModele
                    items={modeles}
                    label="Modèle"
                    name="id_modele"
                    control={form.control}
                    isRequired={true}
                    onChange={(value) =>
                      handleReferenceChange("id_modele", Number.parseInt(value))
                    }
                  />
                  <ReferenceSelectCategorie
                    items={categories}
                    label="Catégorie"
                    name="id_categorie"
                    control={form.control}
                    isRequired={true}
                    onChange={(value) =>
                      handleReferenceChange(
                        "id_categorie",
                        Number.parseInt(value)
                      )
                    }
                  />
                  <ReferenceSelectFamille
                    items={familles}
                    label="Famille"
                    name="id_famille"
                    control={form.control}
                    isRequired={true}
                    onChange={(value) =>
                      handleReferenceChange(
                        "id_famille",
                        Number.parseInt(value)
                      )
                    }
                  />
                  <FormField
                    control={form.control}
                    name="code_produit"
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
                          <Input {...field} type="hidden" value="2" />
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
                            initialImage={form.getValues("image_produit")}
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
                    onClick={() => {
                      if (isEditMode) {
                        // Réinitialiser avec les données originales du produit
                        // fetchProduct();
                      } else {
                        // Réinitialiser avec les valeurs par défaut
                        form.reset(defaultValues);
                        setSelectedReferences({
                          id_marque: defaultValues.id_marque,
                          id_modele: defaultValues.id_modele,
                          id_categorie: defaultValues.id_categorie,
                          id_famille: defaultValues.id_famille,
                          id_type_produit: 2,
                        });
                      }
                    }}
                  >
                    Réinitialiser
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Enregistrement en cours..."
                      : isEditMode
                        ? "Enregistrer les modifications"
                        : "Ajouter le produit"}
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