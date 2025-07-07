// src/components/dashboard/ExemplaireSortieForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

export interface ExemplaireSortieFormProps {
  onSubmit: (data: RetourSchemaFormsValue) => void;
  onCancel: () => void;
  exemplaires?: ExemplaireProduit[];
  isEditMode: boolean;
  defaultValues?: RetourSchemaFormsValue | undefined;
  isLoading?: boolean;
}

import { Textarea } from "@/components/ui/textarea";
import { ExemplaireProduit } from "../../sorties/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RetourSchemaFormsValue } from "../types";
import { RetourSchemaForms } from "../schema/retourSchema";
import { EmployesCombobox } from "@/components/combobox/EmployesCombobox";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
export function RetourForms({
  defaultValues,
  onSubmit,
  onCancel,
  isEditMode,
  isLoading,
}: ExemplaireSortieFormProps) {
  // Utiliser l'état du chargement du hook parent

  const form = useForm<RetourSchemaFormsValue>({
    resolver: zodResolver(RetourSchemaForms),
    defaultValues: {
      ...defaultValues,
      date_de_retour: defaultValues?.date_de_retour
        ? defaultValues.date_de_retour
        : new Date().toISOString().slice(0, 16), // Date actuelle par défaut
      id_employes: defaultValues?.id_employes,
      id_exemplaire: defaultValues?.id_exemplaire,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label>Outil</Label>
          <Input type="text" value={defaultValues?.id_exemplaire} readOnly />
        </div>
        <FormField
          control={form.control}
          name="date_de_retour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de retour</FormLabel>
              <FormControl className="disabled">
                <Input
                  value={field.value}
                  type="datetime-local"
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="etat_apres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>État du matériel</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'état" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bon">Bon</SelectItem>
                  <SelectItem value="endommage">Endommagé</SelectItem>
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
                <Textarea
                  value={field.value}
                  className="resize-none h-20"
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="id_employes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personne affectée</FormLabel>
              <FormControl>
                <EmployesCombobox
                  value={String(field.value)}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoaderCircle className="animate-spin" />
                Chargement...
              </>
            ) : isEditMode ? (
              "Mettre à jour"
            ) : (
              <>
                <LoaderCircle className="animate-spin" /> Retourner
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
