import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Définition du schéma de validation avec Zod
const missionSchema = z.object({
  title: z.string().min(3, {
    message: "Le titre doit contenir au moins 3 caractères",
  }),
  reference: z.string().min(1, {
    message: "La référence est requise",
  }),
  client: z.string().min(1, {
    message: "Le client est requis",
  }),
  startDate: z.date({
    required_error: "La date de début est requise",
  }),
  endDate: z.date().optional(),
  responsible: z.string().min(1, {
    message: "Le responsable est requis",
  }),
  teamMembers: z.string().optional(),
  budget: z.string().min(1, {
    message: "Le budget est requis",
  }),
  status: z.string({
    required_error: "Le statut est requis",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères",
  }),
  objectives: z.string().optional(),
  deliverables: z.string().optional(),
  notes: z.string().optional(),
});

type MissionFormValues = z.infer<typeof missionSchema>;

export default function MissionForm() {
  const [date, setDate] = useState<Date>();
  
  // Valeurs par défaut
  const defaultValues: Partial<MissionFormValues> = {
    title: "",
    reference: "",
    client: "",
    responsible: "",
    teamMembers: "",
    budget: "",
    description: "",
    objectives: "",
    deliverables: "",
    notes: "",
  };

  const form = useForm<MissionFormValues>({
    resolver: zodResolver(missionSchema),
    defaultValues,
  });

  function onSubmit(data: MissionFormValues) {
    console.log("Données du formulaire soumises:", data);
    // Ici vous ajouteriez la logique pour envoyer les données à votre API
    // Par exemple: api.createMission(data).then(response => { ... })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Formulaire de Mission</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre de la mission *</FormLabel>
                    <FormControl>
                      <Input placeholder="Titre" {...field} />
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
                    <FormLabel>Référence *</FormLabel>
                    <FormControl>
                      <Input placeholder="REF-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du client" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de début *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
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
                          disabled={(date) =>
                            date < new Date("1900-01-01")
                          }
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
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de fin prévue</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
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
                          disabled={(date) =>
                            date < new Date("1900-01-01")
                          }
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
                name="responsible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsable de mission *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du responsable" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget (€) *</FormLabel>
                    <FormControl>
                      <Input placeholder="10000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planned">Planifiée</SelectItem>
                        <SelectItem value="in-progress">En cours</SelectItem>
                        <SelectItem value="on-hold">En pause</SelectItem>
                        <SelectItem value="completed">Terminée</SelectItem>
                        <SelectItem value="canceled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="teamMembers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membres de l'équipe</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Un nom par ligne"
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description de la mission *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description détaillée de la mission"
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objectifs principaux</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Objectifs à atteindre"
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="deliverables"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Livrables attendus</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Liste des livrables"
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes additionnelles</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informations supplémentaires"
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CardFooter className="flex justify-center gap-4 pt-6 pb-0">
              <Button type="submit" className="w-32">Enregistrer</Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-32"
                onClick={() => form.reset(defaultValues)}
              >
                Réinitialiser
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}