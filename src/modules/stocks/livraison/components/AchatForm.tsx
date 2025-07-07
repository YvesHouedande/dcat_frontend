// components/LivraisonForm.tsx - Formulaire pour créer/éditer une livraison
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  achatSchema,
  AchatFormValues,
} from "../schema/schema";
import { Partenaire } from "../types/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AchatFormProps {
  defaultValues?: Partial<AchatFormValues>;
  partenaires: Partenaire[];
  onSubmit: (values: AchatFormValues) => void;
  isSubmitting: boolean;
  isEditing?: boolean;
}

const AchatForm: React.FC<AchatFormProps> = ({
  defaultValues,
  partenaires,
  onSubmit,
  isSubmitting,
}) => {
  const form = useForm<AchatFormValues>({
    resolver: zodResolver(achatSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Affiche le champ id_livraison seulement en édition */}

        <FormField
          control={form.control}
          name="id_livraison"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference Livraison</FormLabel>
              <FormControl>
                <Input {...field}  type="text" readOnly />
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
              <FormLabel>Frais Divers</FormLabel>
              <FormControl>
                <Input
                  placeholder="Frais divers"
                  {...field}
                  type="number"
                  min={0}
                />
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
              <FormLabel>Prix d'achat</FormLabel>
              <FormControl>
                <Input
                  placeholder="frais"
                  {...field}
                  type="number"
                  min={0}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />




        <FormField
          control={form.control}
          name="id_partenaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Partenaire</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value ? String(field.value) : undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un partenaire" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {partenaires.map((partenaire) => (
                    <SelectItem
                      key={partenaire.id_partenaire}
                      value={partenaire.id_partenaire.toString()}
                    >
                      {partenaire.nom_partenaire}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="justify-end flex ">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Traitement en cours..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AchatForm;
