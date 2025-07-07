// src/components/dashboard/ExemplaireSortieForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exemplaireSortieSchema } from "../schemas/exemplaireSortieSchema";
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
import { ExemplaireSortieFormValues, ExemplaireProduit } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  exemplaires?: ExemplaireProduit[];
  isEditMode: boolean;
  defaultValues?: ExemplaireSortieFormValues | undefined;
  // Ajoutez ces propriétés selon vos besoins
  clients?: ClientOption[];
  projets?: ProjetOption[];
  interventions?: InterventionOption[];
  commandes?: CommandeOption[];
}

import { Textarea } from "@/components/ui/textarea";
import { EmployesCombobox } from "@/components/combobox/EmployesCombobox";
import { OutilsCombobox } from "@/components/combobox/OutilsCombobox";
export function ExemplaireSortieForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEditMode,
}: ExemplaireSortieFormProps) {
  // Utiliser l'état du chargement du hook parent
  const isLoading = false; // Cette valeur devrait être passée par les props si nécessaire

  const form = useForm<ExemplaireSortieFormValues>({
    resolver: zodResolver(exemplaireSortieSchema),
    defaultValues: {
      ...defaultValues,
      date_de_sortie: defaultValues?.date_de_sortie
        ? defaultValues.date_de_sortie
        : new Date().toISOString().slice(0, 16), // Date actuelle par défaut
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Deuxième ligne: Date et Outils */}
        <FormField
          control={form.control}
          name="id_exemplaire"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" value={field.value} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="id_exemplaire"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outils</FormLabel>
                <FormControl>
                  <OutilsCombobox
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
            name="date_de_sortie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de sortie</FormLabel>
                <FormControl>
                  <Input type="datetime-local" value={field.value} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Troisième ligne: Personne affectée et État du matériel */}
        <div className="grid lg:grid-cols-2 gap-4">
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
          <FormField
            control={form.control}
            name="site_intervention"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site d'utilisation</FormLabel>
                <FormControl>
                  <Input value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Quatrième ligne: Site d'utilisation et Champ sans label */}
        <div className="grid lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="etat_avant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>État du matériel</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                    onChange={field.onChange}
                    className="resize-none h-20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Motif en pleine largeur */}
        <FormField
          control={form.control}
          name="but_usage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motif</FormLabel>
              <FormControl>
                <Textarea
                  value={field.value}
                  onChange={field.onChange}
                  className="resize-none h-20"
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
