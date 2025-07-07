// src/hooks/useExemplaireProduitForm.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExemplaireOutilsSchema,
  ExemplaireOutilsFormValues,
  ExemplaireOutilsEditSchema,
} from "..";
import { ExemplaireProduit } from "../types";
import { toDatetimeLocal } from "@/modules/stocks/utils/helpers";
import { useExemplaireOutils } from "..";

interface UseExemplaireProduitFormProps {
  onSuccess?: () => void;
  initialData?: Partial<ExemplaireProduit>;
  isEditMode?: boolean;
}

export function useExemplaireProduitForm({
  onSuccess,
  initialData,
  isEditMode = false,
}: UseExemplaireProduitFormProps = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { createExemplaireProduit, updateExemplaireProduit } =
    useExemplaireOutils();

  const schema = isEditMode
    ? ExemplaireOutilsEditSchema
    : ExemplaireOutilsSchema;

  const form = useForm<ExemplaireOutilsFormValues>({
    resolver: zodResolver(schema as typeof ExemplaireOutilsSchema),
    defaultValues: {
      id_exemplaire: initialData?.id_exemplaire || "",
      num_serie: initialData?.num_serie || "",
      date_entree: initialData?.date_entree || toDatetimeLocal(new Date()),
      etat_vente: initialData?.etat_vente || "invendu",
      id_livraison: initialData?.id_livraison || "",
      id_produit: initialData?.id_produit || "",
    },
  });

  const handleSubmit = async (data: ExemplaireOutilsFormValues) => {
    setLoading(true);
    setError(null);
    try {
      if (isEditMode && initialData?.id_exemplaire) {
        await updateExemplaireProduit({
          id: initialData.id_exemplaire,
          data: {
            ...data,
            id_exemplaire: initialData.id_exemplaire,
            commentaire: data.commentaire ?? "",
          },
        });
      } else {
        await createExemplaireProduit({
          ...data,
          commentaire: data.commentaire ?? "",
        });
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Une erreur est survenue")
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = form.handleSubmit(handleSubmit);

  const reset = (data?: Partial<ExemplaireProduit>) => {
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
