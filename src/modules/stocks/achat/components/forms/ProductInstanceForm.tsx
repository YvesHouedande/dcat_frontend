// src/components/forms/ExemplaireProduitForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ProductCombobox } from "@/components/combobox/ProductCombobox";

import { useExemplaireProduitForm } from "@/modules/stocks/exemplaire/hooks/useExemplaireProduitForm";
import React from "react";

import { UseFormReturn } from "react-hook-form";
import { ExemplaireProduitFormValues } from "@/modules/stocks/exemplaire";
// import DebugZod from "@/modules/stocks/utils/debug";

interface ExemplaireProduitFormProps {
  initialData?: ExemplaireProduitFormValues;
  onSuccess?: () => void;
  onCancel?: () => void;
  isEditMode?: boolean;
}

export const ProductInstanceForm = React.forwardRef<
  UseFormReturn<ExemplaireProduitFormValues> | null,
  ExemplaireProduitFormProps
>(({ initialData, onSuccess, onCancel, isEditMode = false }, ref) => {
  const { form, onSubmit, loading, error, margeError } =
    useExemplaireProduitForm({
      onSuccess,
      initialData,
      isEditMode,
    });

  // Expose form via ref si besoin
  React.useImperativeHandle(ref, () => form, [form]);

  // Composant pour le champ "État de vente ou etat du materiel"

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="id_exemplaire"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="hidden">
                  Identifiant d'exemplaire
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="ID exemplaire"
                    {...field}
                    readOnly
                    type={"hidden"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id_produit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Produit"}</FormLabel>
                <FormControl>
                  <div className="pointer-events-none">
                    <ProductCombobox
                      isTools={false}
                      value={String(field.value)}
                      onChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="num_serie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de série</FormLabel>
                <FormControl>
                  <Input
                    className="pointer-events-none"
                    autoFocus={true}
                    placeholder="Numéro de série "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date_entree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date d'entrée</FormLabel>
                <FormControl>
                  <Input
                    readOnly
                    type={isEditMode ? "text" : "datetime-local"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prix_achat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix d'achat</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="frais_divers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frais divers</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marge_basse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marge basse</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marge_haute"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marge haute</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coef_divers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coeficient divers</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Composant pour le champ "Achat" */}

          {error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              Erreur: {error.message}
            </div>
          )}
          {/* DEBUG TEMPORAIRE : Affichage des données et erreurs Zod */}
          {/* <DebugZod form={form} /> */}
          {margeError && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              {margeError}
            </div>
          )}
          <div className="flex justify-end space-x-2">
            {onCancel && (
              <div
                onClick={!loading ? onCancel : undefined}
                className={`cursor-default px-4 flex items-center justify-center  border rounded-md  ${
                  loading
                    ? "opacity-50 pointer-events-none"
                    : "hover:bg-gray-100"
                }`}
                aria-disabled={loading}
              >
                Annuler
              </div>
            )}
            <Button type="submit" disabled={loading}>
              {loading
                ? "Chargement..."
                : isEditMode
                ? "Mettre à jour"
                : "Ajouter"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
});
