// src/techniques/projects/components/forms/ProjectForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Project } from "../../types/types";
import {
  PartenaireProfile,
  partenairesList,
} from "@/modules/administration-Finnance/administration/pages/partenaires/partenaire";
// Importez la liste des partenaires depuis le nouveau fichier
import { MultiSelectPartenaires } from "../gestions/MultiSelectPartenaires";
import {
  EmployeProfile,
  profilesList,
} from "@/modules/administration-Finnance/administration/pages/employers/employe";

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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelectProfile } from "../gestions/MultiSelectProfile";
// import { profiles } from "@/modules/administration-Finance/administration/pages/employers/employe";

// Mise à jour du schéma pour inclure les partenaires
const projectFormSchema = z.object({
  nom_projet: z.string().min(1, "Le nom du projet est requis"),
  type_projet: z.string().min(1, "Le type de projet est requis"),
  devis_estimatif: z.string().min(1, "Le devis estimatif est requis"),
  date_debut: z.string().min(1, "La date de début est requise"),
  date_fin: z.string().min(1, "La date de fin est requise"),
  duree_prevu_projet: z.string().min(1, "La durée prévue est requise"),
  description_projet: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  etat: z.enum(["planifié", "en cours", "terminé", "annulé"]),
  lieu: z.string().min(1, "Le lieu est requis"),
  responsable: z.string().min(1, "les responsable est requis"),
  profiles: z.array(z.number()).default([]),
  site: z.string().min(1, "Le site est requis"),
  id_famille: z.string().min(1, "La famille est requise"),
  partenairesIds: z.array(z.number()).default([]), // IDs des partenaires sélectionnés
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

type ProjectFormProps = {
  project?: Project;
  onSubmit: (values: Omit<Project, "id_projet">) => void;
  onCancel?: () => void;
  isLoading?: boolean;
};

export const ProjectForm = ({
  project,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProjectFormProps) => {
  // Extraction des IDs des partenaires si un projet existe
  const defaultPartenaireIds = project?.partenaires
    ? project.partenaires.map((p) => p.id_partenaire)
    : [];
  const defaultProfile = project?.profiles
    ? project.profiles.map((m) => Number(m.id))
    : [];

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      nom_projet: project?.nom_projet || "",
      type_projet: project?.type_projet || "",
      devis_estimatif: project?.devis_estimatif || "",
      date_debut: project?.date_debut || "",
      date_fin: project?.date_fin || "",
      duree_prevu_projet: project?.duree_prevu_projet || "",
      description_projet: project?.description_projet || "",
      etat: project?.etat || "planifié",
      lieu: project?.lieu || "",
      profiles: defaultProfile,
      site: project?.site || "",
      id_famille: project?.id_famille || "",
      partenairesIds: defaultPartenaireIds,
    },
  });

  const handleSubmit = (values: ProjectFormValues) => {
    // Conversion des IDs en objets partenaires complets
    const selectedPartenaires = values.partenairesIds
      .map((id) => partenairesList.find((p) => p.id_partenaire === id))
      .filter((p): p is PartenaireProfile => p !== undefined);

    const selectedProfiles = values.profiles
      .map((id) => profilesList.find((m) => Number(m.id) === id))
      .filter((m): m is EmployeProfile => m !== undefined);

    // Suppression du champ partenairesIds et ajout du champ partenaires avec les objets complets
    const { partenairesIds, ...restValues } = values;

    onSubmit({
      ...restValues,
      partenaires: selectedPartenaires,
      profiles: selectedProfiles,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nom_projet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du projet</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Champ pour les partenaires */}
          <FormField
            control={form.control}
            name="partenairesIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partenaires</FormLabel>
                <FormControl>
                  <MultiSelectPartenaires
                    partenaires={partenairesList}
                    selectedPartenaires={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type_projet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de projet</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="infrastructure">
                      Infrastructure
                    </SelectItem>
                    <SelectItem value="formation">Formation</SelectItem>
                    <SelectItem value="innovation">Innovation</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="devis_estimatif"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Devis estimatif</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="etat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>État</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un état" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="planifié">Planifié</SelectItem>
                    <SelectItem value="en cours">En cours</SelectItem>
                    <SelectItem value="terminé">Terminé</SelectItem>
                    <SelectItem value="annulé">Annulé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date_debut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de début</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date_fin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de fin</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lieu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lieu</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profiles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsable</FormLabel>
                <FormControl>
                  <MultiSelectProfile
                    profiles={profilesList}
                    selectedProfiles={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="site"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id_famille"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Famille</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une famille" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="technique">Technique</SelectItem>
                    <SelectItem value="administrative">
                      Administrative
                    </SelectItem>
                    <SelectItem value="financiere">Financière</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description_projet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
