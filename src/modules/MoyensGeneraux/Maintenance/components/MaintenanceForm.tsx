import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Maintenance, MaintenanceFormData } from "../types/maitenance.types";
import {
  maintenanceSchema,
  MaintenanceSchema,
} from "../schemas/Maintenance.schema";
import { ProductCombobox } from "@/components/combobox/ProductCombobox";
import { Textarea } from "@/components/ui/textarea";
import { PartenaireCombobox } from "@/components/combobox/PartenaireCombobox";

interface MaintenanceFormProps {
  maintenance?: Maintenance;
  sections: string[];
  onSubmit: (data: MaintenanceFormData) => void;
  isSubmitting: boolean;
}

export function MoyensDesTravailForm({
  maintenance,
  sections,
  onSubmit,
  isSubmitting,
}: MaintenanceFormProps) {
  const form = useForm<MaintenanceSchema>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      recurrence: maintenance?.recurrence ?? "",
      date: maintenance?.date
        ? maintenance.date
        : new Date().toISOString().split("T")[0],
      operations: maintenance?.operations ?? "",
      recommandations: maintenance?.recommandations ?? "",
      type_maintenance: maintenance?.type_maintenance ?? "",
      autre_intervenant: maintenance?.autre_intervenant ?? "",
      id_section: maintenance?.id_section ?? "",
      id_partenaire: maintenance?.id_partenaire ?? "",
      id_exemplaire_produit: maintenance?.id_exemplaire_produit ?? "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type_maintenance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de maintenance</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type de maintenance" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="preventive">Préventive</SelectItem>
                    <SelectItem value="corrective">Corrective</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id_section"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
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
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="id_exemplaire_produit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dénomination</FormLabel>
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
            name="recurrence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recurrence</FormLabel>
                <FormControl>
                  <Input type="texte" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="recommandations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recommandations</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="id_partenaire"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partenaire</FormLabel>
                <PartenaireCombobox {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="autre_intervenant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Autre intervenant</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="operations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operations</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-end justify-end w-full">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Enregistrement..."
              : maintenance
              ? "Mettre à jour"
              : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
