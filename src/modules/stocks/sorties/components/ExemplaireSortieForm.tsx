// src/components/dashboard/ExemplaireSortieForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  exemplaireSortieSchema,
  ExemplaireSortieFormValues,
} from "../schemas/exemplaireSortieSchema";
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
import { ProductCombobox } from "../../exemplaire";
import {
  ExemplaireSortie,
  ProductInstance,
  TYPE_SORTIE_OPTIONS,
} from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

// Ces interfaces peuvent être déplacées dans votre fichier types.ts
interface ClientOption {
  id: string;
  name: string;
}

interface ProjetOption {
  id: string;
  nom: string;
}

interface InterventionOption {
  id: string;
  reference: string;
}

interface CommandeOption {
  id: string;
  numero_commande: string;
}
export interface ExemplaireSortieFormProps {
  onSubmit: (data: ExemplaireSortieFormValues) => void;
  onCancel: () => void;
  exemplaires?: ProductInstance[];
  isEditMode: boolean;
  defaultValues?: ExemplaireSortie | undefined;
  // Ajoutez ces propriétés selon vos besoins
  clients?: ClientOption[];
  projets?: ProjetOption[];
  interventions?: InterventionOption[];
  commandes?: CommandeOption[];
}
import ReferenceField from "./ReferenceField";
export function ExemplaireSortieForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEditMode,
  clients = [],
  projets = [],
  interventions = [],
  commandes = [],
}: ExemplaireSortieFormProps) {
  // Utiliser l'état du chargement du hook parent
  const isLoading = false; // Cette valeur devrait être passée par les props si nécessaire
  const [typeSortie, setTypeSortie] = useState<string>(
    defaultValues?.type_sortie || TYPE_SORTIE_OPTIONS[0]
  );

  const form = useForm<ExemplaireSortieFormValues>({
    resolver: zodResolver(exemplaireSortieSchema),
    defaultValues: {
      type_sortie: defaultValues?.type_sortie || TYPE_SORTIE_OPTIONS[0],
      reference_id: defaultValues?.reference_id || "",
      date_sortie: new Date().toISOString().split("T")[0], // Date actuelle par défaut
      id_produit: defaultValues?.id_produit || undefined,
      quantite: defaultValues?.quantite || 1, // Nouveau champ quantité avec 1 par défaut
    },
  });

  // Met à jour le titre du champ de référence en fonction du type de sortie
  const getReferenceLabel = () => {
    switch (typeSortie) {
      case "Vente en ligne":
        return "Numéro de commande";
      case "Vente directe":
        return "Client";
      case "Projet":
        return "Projet";
      case "Intervention":
        return "Intervention";
      default:
        return "Référence";
    }
  };

  // Réinitialise la valeur de référence_id quand le type de sortie change
  useEffect(() => {
    form.setValue("reference_id", "");
  }, [typeSortie, form]);

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
                onValueChange={(value) => {
                  field.onChange(value);
                  setTypeSortie(value);
                }}
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
          render={() => (
            <FormItem>
              <FormLabel>{getReferenceLabel()}</FormLabel>
              <FormControl>
                {/*  Rend le composant de référence approprié selon le type de sortie*/}

                <ReferenceField
                  typeSortie={typeSortie}
                  form={form}
                  clients={clients}
                  interventions={interventions}
                  projets={projets}
                  commandes={commandes}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date_sortie"
          render={() => (
            <FormItem>
              <FormLabel>Date de sortie</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={new Date().toISOString().slice(0, 16)}
                  disabled
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
          name="quantite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantité</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  placeholder="Quantité"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 1)
                  }
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
