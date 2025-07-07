// src/hooks/useExemplaireProduitForm.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toDatetimeLocal } from "@/modules/stocks/utils/helpers";
import { useExemplaireProduits } from "..";
import {
  ExemplaireProduitEditSchema,
  ExemplaireProduitFormValues,
  ExemplaireProduitSchema,
} from "../schemas/ExemplaireProduitSchema";

interface UseExemplaireProduitFormProps {
  onSuccess?: () => void;
  initialData?: Partial<ExemplaireProduitFormValues>;
  isEditMode?: boolean;
}

export function useExemplaireProduitForm({
  onSuccess,
  initialData,
  isEditMode = false,
}: UseExemplaireProduitFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { createExemplaireProduit, updateExemplaireProduit } =
    useExemplaireProduits();

  const schema = isEditMode
    ? ExemplaireProduitEditSchema
    : ExemplaireProduitSchema;

  const form = useForm<ExemplaireProduitFormValues>({
    resolver: zodResolver(schema as typeof ExemplaireProduitSchema),
    defaultValues: {
      id_exemplaire: initialData?.id_exemplaire || "",
      num_serie: initialData?.num_serie || "",
      date_entree: initialData?.date_entree || toDatetimeLocal(new Date()),
      etat_exemplaire: initialData?.etat_exemplaire || "Disponible",
      id_livraison: initialData?.id_livraison || "",
      id_produit: initialData?.id_produit || "",
    },
  });

  const handleSubmit = async (data: ExemplaireProduitFormValues) => {
    setLoading(true);
    setError(null);
    try {
      if (isEditMode && initialData?.id_exemplaire) {
        await updateExemplaireProduit({
          id: initialData.id_exemplaire,
          data: {
            ...data,
            id_exemplaire: initialData.id_exemplaire,
          },
        });
      } else {
        await createExemplaireProduit({
          date_entree: data.date_entree,
          etat_exemplaire: data.etat_exemplaire,
          id_livraison: data.id_livraison,
          id_produit: data.id_produit,
          num_serie: data.num_serie,
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

  const reset = (data?: Partial<ExemplaireProduitFormValues>) => {
    form.reset({
      id_exemplaire: data?.id_exemplaire || "",
      num_serie: data?.num_serie || "",
      date_entree: data?.date_entree || toDatetimeLocal(new Date()),
      etat_exemplaire: data?.etat_exemplaire || "invendu",
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
