// src/hooks/useProductInstanceForm.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productInstanceSchema,
  ProductInstanceFormValues,
  ProductInstanceEditSchema,
} from "../schemas/productInstanceSchema";
import { ProductInstance } from "../types";
import { toDatetimeLocal } from "@/modules/stocks/utils/helpers";
import { useProductInstances } from "./useProductInstances";

interface UseProductInstanceFormProps {
  onSuccess?: () => void;
  initialData?: Partial<ProductInstance>;
  isEditMode?: boolean;
}

export function useProductInstanceForm({
  onSuccess,
  initialData,
  isEditMode = false,
}: UseProductInstanceFormProps = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    createProductInstance,
    updateProductInstance,
  } = useProductInstances();

  const schema = isEditMode ? ProductInstanceEditSchema : productInstanceSchema;
  
  const form = useForm<ProductInstanceFormValues>({
    resolver: zodResolver(schema as typeof productInstanceSchema),
    defaultValues: {
      id_exemplaire: initialData?.id_exemplaire || "",
      num_serie: initialData?.num_serie || "",
      date_entree: initialData?.date_entree || toDatetimeLocal(new Date()),
      etat_vente: initialData?.etat_vente || "invendu",
      id_livraison: initialData?.id_livraison || "",
      id_produit: initialData?.id_produit || "",
    },
  });

  const handleSubmit = async (data: ProductInstanceFormValues) => {
    setLoading(true);
    setError(null);
    try {
      if (isEditMode && initialData?.id_exemplaire) {
        await updateProductInstance({
          id: initialData.id_exemplaire,
          data: {
            ...data,
            id_exemplaire: initialData.id_exemplaire,
            commentaire: data.commentaire ?? "",
          },
        });
      } else {
        await createProductInstance({
          ...data,
          commentaire: data.commentaire ?? "",
        });
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Une erreur est survenue"));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = form.handleSubmit(handleSubmit);

  const reset = (data?: Partial<ProductInstance>) => {
    form.reset({
      id_exemplaire: data?.id_exemplaire || "",
      num_serie: data?.num_serie || "",
      date_entree: data?.date_entree || toDatetimeLocal(new Date()),
      etat_vente: data?.etat_vente || "invendu",
      id_livraison: data?.id_livraison || "",
      id_produit: data?.id_produit || "",
    });
  };

  return {
    form,
    onSubmit,
    loading,
    error,
    reset,
    isEditMode,
  };
}