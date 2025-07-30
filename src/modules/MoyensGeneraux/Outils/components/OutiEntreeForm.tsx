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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";

import { UseFormReturn } from "react-hook-form";
import { ExemplaireProduitFormValues } from "@/modules/stocks/exemplaire";
import DebugZod from "@/modules/stocks/utils/debug";
import { OutilEntreeType } from "../types/OutilsType";
import { useExemplaireOutilsForm } from "../exemplaire/hooks/useExemplaireOutilsForm";

interface ExemplaireProduitFormProps {
  initialData?: ExemplaireProduitFormValues;
  onSuccess?: () => void;
  onCancel?: () => void;
  isEditMode?: boolean;
}

export const OutilEntreeForm = React.forwardRef<
  UseFormReturn<OutilEntreeType> | null,
  ExemplaireProduitFormProps
>(({ initialData, onSuccess, onCancel, isEditMode = false }) => {
  const { form, onSubmit, loading, error } = useExemplaireOutilsForm({
    onSuccess,
    initialData,
    isEditMode,
  });

  // Expose form via ref si besoin
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
                <FormLabel>{"Outil"}</FormLabel>
                <FormControl>
                  <ProductCombobox
                    isTools={true}
                    value={String(field.value)}
                    onChange={field.onChange}
                  />
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
                    autoFocus={true}
                    placeholder="Numéro de série"
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
            name="etat_exemplaire"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"État de l'outil"}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez l'état" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Disponible">Bon</SelectItem>
                    <SelectItem value="Endommagé">Endommagé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="commentaire"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commentaire</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Commentaire" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DebugZod form={form} />
          {/* Composant pour le champ "Achat" */}

          {error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              Erreur: {error.message}
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
