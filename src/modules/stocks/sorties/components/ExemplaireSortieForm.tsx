// src/components/dashboard/ExemplaireSortieForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exemplaireSortieSchema, ExemplaireSortieFormValues } from "../schemas/exemplaireSortieSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { ExemplaireCombobox } from "./ExemplaireCombobox";
import { ExemplaireSortie, ProductInstance, TYPE_SORTIE_OPTIONS } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ExemplaireSortieFormProps {
  onSubmit: (data: ExemplaireSortieFormValues) => void;
  onCancel: () => void;
  exemplaires: ProductInstance[];
  isEditMode: boolean;
  defaultValues?: ExemplaireSortie | undefined;
}

export function ExemplaireSortieForm({
  defaultValues,
  onSubmit,
  onCancel,
  exemplaires,
  isEditMode
}: ExemplaireSortieFormProps) {
  // Utiliser l'état du chargement du hook parent
  const isLoading = false; // Cette valeur devrait être passée par les props si nécessaire

  const form = useForm<ExemplaireSortieFormValues>({
    resolver: zodResolver(exemplaireSortieSchema),
    defaultValues: {
      type_sortie: defaultValues?.type_sortie || TYPE_SORTIE_OPTIONS[0],
      reference_id: defaultValues?.reference_id || "",
      date_sortie: defaultValues?.date_sortie ? new Date(defaultValues.date_sortie).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      id_exemplaire: defaultValues?.id_exemplaire || 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type_sortie"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de sortie</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type de sortie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TYPE_SORTIE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reference_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Référence</FormLabel>
              <FormControl>
                <Input placeholder="Référence" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date_sortie"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de sortie</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="id_exemplaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exemplaire</FormLabel>
              <FormControl>
                <ExemplaireCombobox
                  exemplaires={exemplaires}
                  value={field.value || null}
                  onChange={(value) => field.onChange(value)}
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
            {isLoading ? "Chargement..." : isEditMode ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
}