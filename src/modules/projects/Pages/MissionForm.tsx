import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import {
  Form,
  FormControl,
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
import { Badge, CalendarIcon, Cog, Plus, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  responsable: z.string().min(1, {
    message: "Le responsable est requis",
  }),
  status: z.string({
    required_error: "Le statut est requis",
  }),
  budget: z.string().min(1, {
    message: "Le budget est requis",
  }),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "La priorité est requise",
  }),
  teamMembers: z.array(z.string()).optional(),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères",
  }),
  objectives: z.string().optional(),
});

type MissionFormValues = z.infer<typeof missionSchema>;

// Liste des statuts disponibles
const statusOptions = [
  { value: "not-started", label: "Non démarré" },
  { value: "in-progress", label: "En cours" },
  { value: "on-hold", label: "En attente" },
  { value: "completed", label: "Terminé" },
  { value: "cancelled", label: "Annulé" },
];

// Liste fictive des membres de l'équipe
const availableTeamMembers = [
  "Sophie Martin",
  "Thomas Dubois",
  "Julie Leroy",
  "Alexandre Bernard",
  "Marie Petit",
  "Nicolas Richard",
];

export default function MissionForm() {
  // État pour gérer les membres d'équipe sélectionnés
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState("");

  // Valeurs par défaut
  const defaultValues: Partial<MissionFormValues> = {
    title: "",
    reference: "",
    client: "",
    status: "",
    budget: "",
    priority: "medium",
    teamMembers: [],
    description: "",
    objectives: "",
  };

  const form = useForm<MissionFormValues>({
    resolver: zodResolver(missionSchema),
    defaultValues,
  });

  function onSubmit(data: MissionFormValues) {
    console.log("Données du formulaire soumises:", data);
    // Logique pour envoyer les données à votre API
  }

  // Ajouter un membre à l'équipe
  const addTeamMember = () => {
    if (newMember && !selectedMembers.includes(newMember)) {
      const updatedMembers = [...selectedMembers, newMember];
      setSelectedMembers(updatedMembers);
      form.setValue("teamMembers", updatedMembers);
      setNewMember("");
    }
  };

  // Supprimer un membre de l'équipe
  const removeTeamMember = (member: string) => {
    const updatedMembers = selectedMembers.filter((m: string) => m !== member);
    setSelectedMembers(updatedMembers);
    form.setValue("teamMembers", updatedMembers);
  };

  return (
    <Layout>
      <div className="w-full py-6">
        <div className="flex w-full flex-col justify-center items-center uppercase font-semibold text-xl">
          <div className="flex items-center gap-2">
            <Cog className="w-6 h-6" />
            Créer une nouvelle mission
          </div>
          <div className="w-32 h-1.5 bg-blue-600 mt-1 rounded-full"></div>
        </div>
      </div>
      <div className="w-full rounded-lg">
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
                            variant="outline"
                            className={cn(
                              "w-full flex justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="h-4 w-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
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
                            variant="outline"
                            className={cn(
                              "w-full flex justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="h-4 w-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
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
                name="responsable"
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
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
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
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget (€) *</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="10000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Priorité *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="low" />
                          </FormControl>
                          <FormLabel className="font-normal text-green-600">
                            Basse
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="medium" />
                          </FormControl>
                          <FormLabel className="font-normal text-orange-500">
                            Moyenne
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="high" />
                          </FormControl>
                          <FormLabel className="font-normal text-red-600">
                            Haute
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Membres de l'équipe */}
            <FormField
              control={form.control}
              name="teamMembers"
              render={({ }) => (
                <FormItem>
                  <FormLabel>Membres de l'équipe</FormLabel>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Select onValueChange={setNewMember}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un membre" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTeamMembers.map((member) => (
                            <SelectItem key={member} value={member}>
                              {member}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={addTeamMember}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedMembers.map((member) => (
                        <Badge key={member} className="text-sm py-1 pl-2">
                          {member}
                          <button 
                            type="button" 
                            className="ml-1 text-slate-500 hover:text-slate-700"
                            onClick={() => removeTeamMember(member)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
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
                      className="min-h-32"
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
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-center gap-4 pt-4">
              <Button type="submit" className="px-8">Enregistrer</Button>
              <Button 
                type="button" 
                variant="outline" 
                className="px-8"
                onClick={() => form.reset(defaultValues)}
              >
                Annuler
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
}