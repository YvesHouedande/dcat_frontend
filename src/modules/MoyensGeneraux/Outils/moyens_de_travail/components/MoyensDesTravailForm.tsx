import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { moyenDeTravailSchema, MoyenDeTravailSchema } from "../libs/validation";
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
import {
  MoyenDeTravail,
  MoyenDeTravailFormData,
} from "../types/moyens-de-travail.types";
import { useEffect } from "react";
import { formatDateForInput } from "../utils/format";

interface MoyensDesTravailFormProps {
  moyen?: MoyenDeTravail;
  sections: string[];
  onSubmit: (data: MoyenDeTravailFormData) => void;
  isSubmitting: boolean;
}

export function MoyensDesTravailForm({
  moyen,
  sections,
  onSubmit,
  isSubmitting,
}: MoyensDesTravailFormProps) {
  const form = useForm<MoyenDeTravailSchema>({
    resolver: zodResolver(moyenDeTravailSchema),
    defaultValues: {
      denomination: "",
      date_acquisition: new Date().toISOString().split("T")[0],
      section: "",
    },
  });

  // Préremplir le formulaire lors de l'édition
  useEffect(() => {
    if (moyen) {
      form.reset({
        denomination: moyen.denomination,
        date_acquisition: formatDateForInput(moyen.date_acquisition),
        section: moyen.section,
      });
    }
  }, [moyen, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="denomination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dénomination</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une dénomination" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="equipement">Equipement</SelectItem>
                  <SelectItem value="outils">
                    Outils et Moyens de Travail
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_acquisition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'acquisition</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="section"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une section" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sections?.map((section) => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Enregistrement..."
            : moyen
            ? "Mettre à jour"
            : "Créer"}
        </Button>
      </form>
    </Form>
  );
}
