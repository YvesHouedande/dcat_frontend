// src/techniques/projects/components/forms/LivrableForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Livrable } from "../../types/types";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { fr } from "date-fns/locale";

const livrableFormSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  Date_: z.date(),
  Réalisations: z.string().min(1, "Les réalisations sont requises"),
  Réserves: z.string().min(1, "Le projet est requis"),//il faut revoir ce cas 
  Approbation: z.enum(['en attente', 'approuvé', 'rejeté', 'révisions requises']),
  _Recommandation: z.string().min(1, "Le projet est requis"), //il faut revoir ce cas 
  id_projet: z.string().min(1, "Le projet est requis"),
  version: z.string().min(1, "Le projet est requis"),//il faut revoir ce cas 
});

type LivrableFormValues = z.infer<typeof livrableFormSchema>;

type LivrableFormProps = {
  livrable?: Livrable;
  projects: { id_projet: string; nom_projet: string }[];
  onSubmit: (values: Omit<Livrable, 'Id_Livrable'>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
};

export const LivrableForm = ({ 
  livrable, 
  projects, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: LivrableFormProps) => {
  const form = useForm<LivrableFormValues>({
    resolver: zodResolver(livrableFormSchema),
    defaultValues: livrable ? {
      ...livrable,
      Date_: new Date(livrable.Date_),
    } : {
      titre: "",
      Date_: new Date(),
      Réalisations: "",
      Réserves: "",
      Approbation: "en attente",
      _Recommandation: "",
      id_projet: "",
      version: "",
    },
  });

  const handleSubmit = (values: LivrableFormValues) => {
    onSubmit({
      ...values,
      Date_: values.Date_.toISOString(),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="titre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre du livrable</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="1.0.0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Date_"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id_projet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Projet</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un projet" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id_projet} value={project.id_projet}>
                        {project.nom_projet}
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
            name="Approbation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut d'approbation</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="en attente">En attente</SelectItem>
                    <SelectItem value="approuvé">Approuvé</SelectItem>
                    <SelectItem value="rejeté">Rejeté</SelectItem>
                    <SelectItem value="révisions requises">Révisions requises</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="Réalisations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Réalisations</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-[120px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Réserves"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Réserves</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-[80px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="_Recommandation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recommandations</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-[80px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
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