import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// UI Components
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
import { Badge } from "@/components/ui/badge";
import { useProducts } from "../hooks/useProducts";

// Custom Components
import { ReferenceSelect } from "../components/ui/ReferenceSelect";
import { ImageDropzone } from "../utils/ImageDropzone";

// Hooks and Utils
import {
  useProductCategories,
  useProductFamilies,
  useProductMarques,
  useProductModels,
} from "../hooks/useOthers";
import { generateProductCode } from "../../utils/generateProductCode";
import { referenceSchema } from "../schemas/referenceSchema";

// Types
export type FormValues = z.infer<typeof referenceSchema>;

interface SelectedReferences {
  id_marque: number;
  id_modele: number;
  id_categorie: number;
  id_famille: number;
  id_type_produit: number;
}

interface ProductImage {
  id_image?: number;
  libelle_image: string;
  lien_image?: string;
  numero_image: number;
  file?: File;
  dataUrl?: string;
  created_at?: string;
  url?: string;
}

export default function ReferenceEditForm() {
  // Hooks
  const { state } = useLocation();
  const { productCategories: categories } = useProductCategories();
  const { productFamilies: familles } = useProductFamilies();
  const { productMarques: marques } = useProductMarques();
  const { productModels: modeles } = useProductModels();
  const { create, update } = useProducts();

  const [selectedReferences, setSelectedReferences] =
    useState<SelectedReferences>({
      id_marque: 0,
      id_modele: 0,
      id_categorie: 0,
      id_famille: 0,
      id_type_produit: 1,
    });

  const [productImages, setProductImages] = useState<ProductImage[]>([]);

  // Derived values
  const reference: FormValues = state?.product;
  const isEditMode = Boolean(reference?.id_produit);

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(referenceSchema),
    defaultValues: {
      ...reference,
      id_type_produit: 1,
    },
  });

  // Initialize form with existing data
  useEffect(() => {
    if (reference) {
      form.reset(reference);
      setSelectedReferences({
        id_marque: reference.id_marque ?? 1,
        id_modele: reference.id_modele ?? 0,
        id_categorie: reference.id_categorie ?? 0,
        id_famille: reference.id_famille ?? 0,
        id_type_produit: reference.id_type_produit ?? 1,
      });

      // Initialize existing images if any
      if (reference.image_produit && Array.isArray(reference.image_produit)) {
        setProductImages(reference.image_produit);
      }
    }
  }, [reference, form]);

  // Generate product code when references change
  useEffect(() => {
    const { id_marque, id_modele, id_categorie, id_famille } =
      selectedReferences;

    // Only generate code if we have all required data
    if (marques.data && modeles.data && categories.data && familles.data) {
      const code = generateProductCode(
        id_marque,
        id_modele,
        id_categorie,
        id_famille,
        marques.data,
        modeles.data,
        categories.data,
        familles.data
      );

      if (code) {
        form.setValue("code_produit", code);
      }
    }
  }, [selectedReferences]);

  // Image handlers
  const handleImageSelected = useCallback(
    (imageDataUrl: string, file: File) => {
      const newImage: ProductImage = {
        libelle_image: file.name.replace(/\.[^/.]+$/, ""), // Enlever l'extension du nom
        numero_image: productImages.length + 1,
        file: file,
        dataUrl: imageDataUrl,
      };

      setProductImages((prev) => [...prev, newImage]);
    },
    [productImages.length]
  );

  const handleImageLabelChange = useCallback(
    (index: number, newLabel: string) => {
      setProductImages((prev) =>
        prev.map((img, i) =>
          i === index ? { ...img, libelle_image: newLabel } : img
        )
      );
    },
    []
  );

  const handleImageRemove = useCallback((index: number) => {
    setProductImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Réorganiser les numéros d'images
      return updated.map((img, i) => ({ ...img, numero_image: i + 1 }));
    });
  }, []);

  const handleImageReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      setProductImages((prev) => {
        const updated = [...prev];
        const [movedImage] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, movedImage);
        // Réorganiser les numéros d'images
        return updated.map((img, i) => ({ ...img, numero_image: i + 1 }));
      });
    },
    []
  );

  const handleReferenceChange = useCallback(
    (field: keyof SelectedReferences, value: number) => {
      setSelectedReferences((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleReset = useCallback(() => {
    form.reset();
    setProductImages([]);
  }, [form]);

  const onSubmit = async (data: FormValues) => {
    // Ajouter les images aux données du formulaire
    const formDataWithImages = {
      ...data,
      images: productImages,
    };

    if (!isEditMode) {
      await create.mutateAsync(formDataWithImages);
    } else {
      await update.mutateAsync(formDataWithImages);
    }

    // Reset form only for new products
    if (!isEditMode) {
      form.reset();
      setProductImages([]);
      setSelectedReferences({
        id_marque: 0,
        id_modele: 0,
        id_categorie: 0,
        id_famille: 0,
        id_type_produit: 1,
      });
    }
  };

  // Render helpers
  const renderClassificationSection = () => (
    <div className="px-4 pb-4 rounded-md">
      <h3 className="font-medium mb-4 text-lg">Classification du produit</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReferenceSelect
          items={
            marques.data?.map((item) => ({
              ...item,
              id: item.id_marque,
            })) || []
          }
          label="Marque"
          name="id_marque"
          control={form.control}
          isRequired={true}
          getLabel={(item) => item.libelle_marque}
          onChange={(value) =>
            handleReferenceChange("id_marque", parseInt(value))
          }
        />

        <ReferenceSelect
          items={
            modeles.data?.map((item) => ({
              ...item,
              id: item.id_modele,
            })) || []
          }
          label="Modèle"
          name="id_modele"
          control={form.control}
          getLabel={(item) => item.libelle_modele}
          isRequired={true}
          onChange={(value) =>
            handleReferenceChange("id_modele", parseInt(value))
          }
        />

        <ReferenceSelect
          items={
            categories.data?.map((item) => ({
              ...item,
              id: item.id_categorie,
            })) || []
          }
          label="Catégorie"
          name="id_categorie"
          control={form.control}
          isRequired={true}
          getLabel={(item) => item.libelle}
          onChange={(value) =>
            handleReferenceChange("id_categorie", parseInt(value))
          }
        />

        <ReferenceSelect
          items={
            familles.data?.map((item) => ({
              ...item,
              id: item.id_famille,
            })) || []
          }
          label="Famille"
          name="id_famille"
          control={form.control}
          isRequired={true}
          getLabel={(item) => item.libelle_famille}
          onChange={(value) =>
            handleReferenceChange("id_famille", parseInt(value))
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

        {/* Hidden field for product type */}
        <FormField
          control={form.control}
          name="id_type_produit"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input {...field} type="hidden" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const renderProductInfoSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="space-y-6">
        <h3 className="font-medium text-lg">Informations du produit</h3>

        <FormField
          control={form.control}
          name="desi_produit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Désignation <span className="text-red-500">*</span>
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
                  className="min-h-24 resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Images du produit</h3>

        {/* Zone de dépôt d'image */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <ImageDropzone onImageSelected={handleImageSelected} />
        </div>

        {/* Liste des images ajoutées */}
        {productImages.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">
              Images ajoutées ({productImages.length})
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {productImages.map((image, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50"
                >
                  {/* Numéro d'ordre */}
                  <Badge variant="secondary" className="shrink-0">
                    #{image.numero_image}
                  </Badge>

                  {/* Preview de l'image */}
                  <div className="w-12 h-12 shrink-0">
                    {image.dataUrl ? (
                      <img
                        src={image.dataUrl}
                        alt={image.libelle_image}
                        className="w-full h-full object-cover rounded border"
                      />
                    ) : image.url ? (
                      <img
                        src={image.url}
                        alt={image.libelle_image}
                        className="w-full h-full object-cover rounded border"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded border flex items-center justify-center">
                        <span className="text-xs text-gray-500">IMG</span>
                      </div>
                    )}
                  </div>

                  {/* Libellé modifiable */}
                  <div className="flex-1">
                    <Input
                      value={image.libelle_image}
                      onChange={(e) =>
                        handleImageLabelChange(index, e.target.value)
                      }
                      placeholder="Nom de l'image"
                      className="text-sm"
                    />
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex gap-1 shrink-0">
                    {/* Monter */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleImageReorder(index, Math.max(0, index - 1))
                      }
                      disabled={index === 0}
                      className="px-2"
                    >
                      ↑
                    </Button>

                    {/* Descendre */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleImageReorder(
                          index,
                          Math.min(productImages.length - 1, index + 1)
                        )
                      }
                      disabled={index === productImages.length - 1}
                      className="px-2"
                    >
                      ↓
                    </Button>

                    {/* Supprimer */}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleImageRemove(index)}
                      className="px-2"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAdditionalInfoSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <FormField
        control={form.control}
        name="caracteristiques"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Caractéristiques</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Caractéristiques techniques"
                className="min-h-24 resize-y"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="emplacement_produit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Emplacement <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Localisation du produit" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <div className="container mx-auto p-4 ">
      <Card className="w-full shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold">
            {isEditMode ? "Modification" : "Ajout"} d'un produit
          </CardTitle>
          <CardDescription className="text-base">
            {isEditMode
              ? "Modifiez les informations du produit sélectionné"
              : "Ajoutez un nouveau produit à votre catalogue"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {renderClassificationSection()}
              {renderProductInfoSection()}
              {renderAdditionalInfoSection()}

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={update.isLoading || create.isLoading}
                  className="min-w-32"
                >
                  Réinitialiser
                </Button>
                <Button
                  type="submit"
                  disabled={update.isLoading || create.isLoading}
                  className="min-w-48"
                >
                  {update.isLoading || create.isLoading
                    ? "Enregistrement en cours..."
                    : isEditMode
                    ? "Enregistrer les modifications"
                    : "Ajouter le produit"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
