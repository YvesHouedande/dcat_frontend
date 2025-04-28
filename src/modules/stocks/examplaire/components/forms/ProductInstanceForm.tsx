// src/components/forms/ProductInstanceForm.tsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productInstanceSchema,
  ProductInstanceFormValues,
} from "../../schemas/productInstanceSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DeliveryCombobox } from "../combobox/DeliveryCombobox";
import { ProductCombobox } from "../combobox/ProductCombobox";
import { ProductInstance } from "../../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductInstanceEditSchema } from "../../schemas/productInstanceSchema";

interface ProductInstanceFormProps {
  initialData?: Partial<ProductInstance>;
  onSubmit: (data: ProductInstanceFormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
  isEditMode: boolean;
}

export function ProductInstanceForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  isEditMode,
}: ProductInstanceFormProps) {
  const schema = isEditMode ? ProductInstanceEditSchema : productInstanceSchema;
  const form = useForm<ProductInstanceFormValues>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      id_exemplaire: initialData?.id_exemplaire || "",
      num_serie: initialData?.num_serie || "",
      date_entree:
        initialData?.date_entree || new Date().toISOString().split("T")[0],
      etat_vente: initialData?.etat_vente || "invendu",
      id_livraison: initialData?.id_livraison || "",
      id_produit: initialData?.id_produit || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="id_exemplaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`${isEditMode ? "" : "hidden"}`}>
                Identifiant d'exemplaire
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="ID exemplaire"
                  {...field}
                  readOnly
                  type={`${isEditMode ? "" : "hidden"}`}
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
              <FormLabel>Produit</FormLabel>
              <FormControl>
                <ProductCombobox
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
                <Input placeholder="Numéro de série" {...field} />
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
              <FormLabel>Date d'entrées</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditMode && (
          <FormField
            control={form.control}
            name="etat_vente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>État de vente</FormLabel>
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
                    <SelectItem value="vendu">Vendu</SelectItem>
                    <SelectItem value="invendu">Invendu</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="id_livraison"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Achat</FormLabel>
              <FormControl>
                <DeliveryCombobox
                  value={String(field.value)}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Chargement..."
              : isEditMode
              ? "Mettre à jour"
              : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
