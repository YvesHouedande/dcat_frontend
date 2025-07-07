import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
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

// Custom Components & Hooks
import { ReferenceSelect } from "../components/ui/ReferenceSelect";
import { ImageDropzone } from "../utils/ImageDropzone";
import { useProducts } from "../hooks/useProducts";
import {
  useProductCategories,
  useProductFamilies,
  useProductMarques,
  useProductModels,
} from "../hooks/useOthers";
import { generateProductCode } from "../../utils/generateProductCode";
import { referenceSchema } from "../schemas/referenceSchema";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { ImageProduit } from "../../types/reference";

import {
  marqueTypes,
  familleTypes,
  categorieTypes,
  modeleTypes,
} from "../../types/reference";

export type FormValues = z.infer<typeof referenceSchema>;

const DEFAULT_VALUES: Partial<FormValues> = {
  id_type_produit: 1,
  desi_produit: "",
  desc_produit: undefined,
  caracteristiques: "",
  emplacement_produit: "",
  code_produit: "",
};

type ReferenceFieldName =
  | "id_marque"
  | "id_modele"
  | "id_categorie"
  | "id_famille";

export default function ReferenceEditForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Data hooks
  const { productCategories: categories } = useProductCategories();
  const { productFamilies: familles } = useProductFamilies();
  const { productMarques: marques } = useProductMarques();
  const { productModels: modeles } = useProductModels();
  const { create, update, product } = useProducts({}, id);

  // State
  const [productImages, setProductImages] = useState<ImageProduit[]>([]);
  const [isFormDirty, setIsFormDirty] = useState(false);

  // Form
  const form = useForm<FormValues>({
    resolver: zodResolver(referenceSchema),
    defaultValues:
      isEditMode && product.data
        ? {
            ...DEFAULT_VALUES,
            ...product.data,
            id_marque: product.data.id_marque ?? undefined,
            id_modele: product.data.id_modele ?? undefined,
            id_categorie: product.data.id_categorie ?? undefined,
            id_famille: product.data.id_famille ?? undefined,
            id_type_produit: product.data.id_type_produit ?? 1,
          }
        : DEFAULT_VALUES,
  });

  const watchedValues = form.watch([
    "id_marque",
    "id_modele",
    "id_categorie",
    "id_famille",
  ]);

  // Utilities
  const cleanImageData = (images: ImageProduit[]) =>
    images.map((img, index) => ({
      ...img,
      numero_image:
        typeof img.numero_image === "string"
          ? parseInt(img.numero_image, 10)
          : img.numero_image || index + 1,
      url: img.url || img.lien_image,
    }));

  const resetForm = useCallback(
    (data = DEFAULT_VALUES, images: ImageProduit[] = []) => {
      form.reset(data, {
        keepDefaultValues: false,
        keepErrors: false,
        keepDirty: false,
        keepTouched: false,
      });
      setProductImages(images);
      setIsFormDirty(false);
      setTimeout(() => form.trigger(), 100);
    },
    [form]
  );

  // Auto-generate product code
  useMemo(() => {
    const [id_marque, id_modele, id_categorie, id_famille] = watchedValues;

    if (
      (isEditMode && !isFormDirty) ||
      !marques.data ||
      !modeles.data ||
      !categories.data ||
      !familles.data ||
      !id_marque ||
      !id_modele ||
      !id_categorie ||
      !id_famille
    )
      return;

    const code = generateProductCode(
      Number(id_marque),
      Number(id_modele),
      Number(id_categorie),
      Number(id_famille),
      marques.data,
      modeles.data,
      categories.data,
      familles.data
    );

    if (code && code !== form.getValues("code_produit")) {
      form.setValue("code_produit", code, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [
    watchedValues,
    marques.data,
    modeles.data,
    categories.data,
    familles.data,
    isEditMode,
    isFormDirty,
    form,
  ]);

  // Image handlers
  const handleImageSelected = useCallback(
    (imageDataUrl: string, file: File) => {
      const newImage: ImageProduit = {
        libelle_image: file.name.replace(/\.[^/.]+$/, ""),
        numero_image: productImages.length + 1,
        file,
        dataUrl: imageDataUrl,
      };
      setProductImages((prev) => [...prev, newImage]);
      setIsFormDirty(true);
    },
    [productImages.length]
  );

  const handleImageChange = useCallback(
    (action: string, index: number, value?: string | number) => {
      setProductImages((prev) => {
        let updated = [...prev];
        switch (action) {
          case "label":
            updated[index] = {
              ...updated[index],
              libelle_image: String(value),
            };
            break;
          case "remove":
            updated = updated.filter((_, i) => i !== index);
            break;
          case "reorder": {
            const [movedImage] = updated.splice(index, 1);
            updated.splice(Number(value), 0, movedImage);
            break;
          }
        }
        return updated.map((img, i) => ({ ...img, numero_image: i + 1 }));
      });
      setIsFormDirty(true);
    },
    []
  );

  // Form handlers
  const handleFieldChange = useCallback(() => setIsFormDirty(true), []);

  const handleReset = useCallback(() => {
    if (isEditMode && product.data) {
      const formData = {
        ...DEFAULT_VALUES,
        ...product.data,
        id_marque: product.data.id_marque || undefined,
        id_modele: product.data.id_modele || undefined,
        id_categorie: product.data.id_categorie || undefined,
        id_famille: product.data.id_famille || undefined,
        id_type_produit: product.data.id_type_produit || 1,
      };
      const images = product.data.images
        ? cleanImageData(product.data.images)
        : [];
      resetForm(formData, images);
    } else {
      resetForm();
    }
  }, [isEditMode, product.data, resetForm]);

  const handleCancel = useCallback(() => {
    if (
      isFormDirty &&
      !window.confirm(
        "Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?"
      )
    )
      return;
    navigate(-1);
  }, [isFormDirty, navigate]);

  const onSubmit = async (data: FormValues) => {
    try {
      const formDataWithImages = {
        ...data,
        images: productImages,
        imagesMeta: JSON.stringify(
          productImages.map((img) => ({
            libelle: img.libelle_image,
            numero: img.numero_image,
          }))
        ),
      };

      if (isEditMode) {
        await update.mutateAsync(formDataWithImages);
        toast.success("Produit mis à jour avec succès");
        setIsFormDirty(false);
      } else {
        await create.mutateAsync(formDataWithImages);
        toast.success("Produit ajouté avec succès");
        resetForm();
      }
    } catch (error) {
      toast.error(
        isEditMode
          ? "Erreur lors de la mise à jour du produit"
          : "Erreur lors de l'ajout du produit"
      );
      console.error("Form submission error:", error);
    }
  };

  // Loading states
  const isLoading = create.isLoading || update.isLoading;
  const isDataLoading = isEditMode && product.isLoading;

  if (isDataLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="w-full shadow-lg">
          <CardContent className="p-8 flex items-center justify-center">
            <div className="text-lg">Chargement...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Reference data with mapping
  const referenceData: {
    data: unknown[] | undefined;
    name: ReferenceFieldName;
    label: string;
    getLabel: (item: unknown) => string;
  }[] = [
    {
      data: marques.data?.map((item) => ({ ...item, id: item.id_marque })),
      name: "id_marque",
      label: "Marque",
      getLabel: (item: unknown) => (item as marqueTypes).libelle_marque,
    },
    {
      data: modeles.data?.map((item) => ({ ...item, id: item.id_modele })),
      name: "id_modele",
      label: "Modèle",
      getLabel: (item: unknown) => (item as modeleTypes).libelle_modele,
    },
    {
      data: categories.data?.map((item) => ({
        ...item,
        id: item.id_categorie,
      })),
      name: "id_categorie",
      label: "Catégorie",
      getLabel: (item: unknown) => (item as categorieTypes).libelle,
    },
    {
      data: familles.data?.map((item) => ({ ...item, id: item.id_famille })),
      name: "id_famille",
      label: "Famille",
      getLabel: (item: unknown) => (item as familleTypes).libelle_famille,
    },
  ];

  return (
    <div className="container mx-auto p-4">
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
          <Form
            key={isEditMode ? `edit-${product.data?.code_produit}` : "create"}
            {...form}
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Classification Section */}
              <div className="px-4 pb-4 rounded-md">
                <h3 className="font-medium mb-4 text-lg">
                  Classification du produit
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {referenceData.map(({ data, name, label, getLabel }) => (
                    <ReferenceSelect
                      key={name}
                      items={(data as { id: number }[]) ?? []}
                      label={label}
                      name={name}
                      control={form.control}
                      isRequired={true}
                      getLabel={getLabel}
                      onChange={handleFieldChange}
                    />
                  ))}

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
                      <FormItem className="hidden">
                        <FormControl>
                          <Input {...field} type="hidden" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Product Info & Images Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-6">
                  <h3 className="font-medium text-lg">
                    Informations du produit
                  </h3>

                  <FormField
                    control={form.control}
                    name="desi_produit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Désignation <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nom du produit"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleFieldChange();
                            }}
                          />
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
                            onChange={(e) => {
                              field.onChange(e);
                              handleFieldChange();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Images Section */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Images du produit</h3>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <ImageDropzone onImageSelected={handleImageSelected} />
                  </div>

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
                            <Badge variant="secondary" className="shrink-0">
                              #{image.numero_image}
                            </Badge>

                            <div className="w-12 h-12 shrink-0">
                              {image.dataUrl ||
                              image.url ||
                              image.lien_image ? (
                                <img
                                  src={
                                    image.dataUrl ||
                                    image.url ||
                                    image.lien_image
                                  }
                                  alt={image.libelle_image}
                                  className="w-full h-full object-cover rounded border"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 rounded border flex items-center justify-center">
                                  <span className="text-xs text-gray-500">
                                    IMG
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              <Input
                                value={image.libelle_image}
                                onChange={(e) =>
                                  handleImageChange(
                                    "label",
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder="Nom de l'image"
                                className="text-sm"
                              />
                            </div>

                            <div className="flex gap-1 shrink-0">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="px-2"
                                onClick={() =>
                                  handleImageChange(
                                    "reorder",
                                    index,
                                    Math.max(0, index - 1)
                                  )
                                }
                                disabled={index === 0}
                              >
                                ↑
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="px-2"
                                onClick={() =>
                                  handleImageChange(
                                    "reorder",
                                    index,
                                    Math.min(
                                      productImages.length - 1,
                                      index + 1
                                    )
                                  )
                                }
                                disabled={index === productImages.length - 1}
                              >
                                ↓
                              </Button>

                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="px-2"
                                onClick={() =>
                                  handleImageChange("remove", index)
                                }
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

              {/* Additional Info Section */}
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
                          onChange={(e) => {
                            field.onChange(e);
                            handleFieldChange();
                          }}
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
                        <Input
                          placeholder="Localisation du produit"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleFieldChange();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="min-w-32"
                >
                  Annuler
                </Button>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={isLoading}
                    className="min-w-32"
                  >
                    Réinitialiser
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-48"
                  >
                    {isLoading
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
