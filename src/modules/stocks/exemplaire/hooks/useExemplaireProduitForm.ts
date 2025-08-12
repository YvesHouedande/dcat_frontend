// src/hooks/useExemplaireProduitForm.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toDatetimeLocal } from "@/modules/stocks/utils/helpers";
import {  useExemplaireCréation, useExemplaireUpdate } from "..";
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
  const [margeError, setMargeError] = useState<string | null>(null);

  const { createExemplaireProduit } = useExemplaireCréation();
  const { updateExemplaireProduit } = useExemplaireUpdate();
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
      id_produit: initialData?.id_produit || "",
      prix_achat: initialData?.prix_achat || 0,
      prix_de_revient: initialData?.prix_de_revient || 0,
      coef_divers: initialData?.coef_divers || 0,
      prix_de_vente: initialData?.prix_de_vente || 0,
      frais_divers: initialData?.frais_divers || 0,
      marge_basse: initialData?.marge_basse || 0,
      marge_haute: initialData?.marge_haute || 0,
    },
  });

  const handleSubmit = async (data: ExemplaireProduitFormValues) => {
    setLoading(true);
    setError(null);
    const marge_basse = Number(data.marge_basse) || 0;
    const marge_haute = Number(data.marge_haute) || 0;
    if (marge_basse > marge_haute) {
      setMargeError(
        "La marge basse ne peut pas être supérieure à la marge haute."
      );
      setLoading(false);
      return;
    }
    try {
      // Calcul automatique des champs prix_de_revient et prix_de_vente
      const prix_achat = Number(data.prix_achat) || 0;
      const coef_divers = Number(data.coef_divers) || 0;
      const marge_basse = Number(data.marge_basse) || 0;
      const marge_haute = Number(data.marge_haute) || 0;
      const frais_divers = Number(data.frais_divers) || 0;
      const prix_de_revient = prix_achat + (frais_divers * coef_divers) ;
      const marge = marge_basse + marge_haute / 2;
      const prix_de_vente = prix_de_revient + marge;
      const dataWithCalcul = {
        ...data,
        prix_de_revient,
        prix_de_vente,
      };
      if (isEditMode && initialData?.id_exemplaire) {
        await updateExemplaireProduit({
          id: initialData.id_exemplaire,
          data: {
            ...dataWithCalcul,
            id_exemplaire: initialData.id_exemplaire,
          },
        });
      } else {
        await createExemplaireProduit({
          ...dataWithCalcul,
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
    margeError
  };
}
