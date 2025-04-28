// components/LivraisonForm.tsx - Formulaire pour créer/éditer une livraison
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LivraisonFormValues,
  livraisonSchema,
  livraisonUpdateSchema,
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

interface LivraisonFormProps {
  defaultValues?: Partial<LivraisonFormValues>;
  partenaires: Partenaire[];
  onSubmit: (values: LivraisonFormValues) => void;
  isSubmitting: boolean;
  isEditing?: boolean;
}

const LivraisonForm: React.FC<LivraisonFormProps> = ({
  defaultValues,
  partenaires,
  onSubmit,
  isSubmitting,
  isEditing = false,
}) => {
  const schema = isEditing ? livraisonUpdateSchema : livraisonSchema;
  const form = useForm<LivraisonFormValues>({
    resolver: zodResolver(schema as any),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="id_livraison"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="ID achat"
                  {...field}
                  type={`${isEditing ? "" : "hidden"}`}
                  readOnly
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
          name="prix_achat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix d'achat</FormLabel>
              <FormControl>
                <Input
                  placeholder="Prix d'achat"
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
          name="prix_de_revient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix de revient</FormLabel>
              <FormControl>
                <Input
                  placeholder="Prix de revient"
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
          name="prix_de_vente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix de vente</FormLabel>
              <FormControl>
                <Input
                  placeholder="Prix de vente"
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
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference</FormLabel>
              <FormControl>
                <Input placeholder="Reference" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Periode_achat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Période d'achat</FormLabel>
              <FormControl>
                <Input
                  placeholder="Période d'achat"
                  {...field}
                  type="date"
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
            {isSubmitting
              ? "Traitement en cours..."
              : isEditing
              ? "Mettre à jour"
              : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LivraisonForm;
