// src/techniques/projects/components/forms/DocumentForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useState } from "react";
import FileUpload  from "@/components/ui/file-upload";
import { fr } from "date-fns/locale";

export const documentFormSchema = z.object({
  libele_document: z.string().min(1, "Le nom du document est requis"),
  classification_document: z.enum(['contrat', 'facture', 'rapport', 'plan', 'autre']),
  lien_document: z.string().min(1, "Le fichier est requis"),
  etat_document: z.enum(['brouillon', 'validé', 'archivé', 'obsolète']),
  id_projet: z.string(),
  date_creation: z.date(),
  createur: z.string().min(2, "Le créateur doit contenir au moins 2 caractères"),
  version: z.string().min(1, "La version est requise"),
  description: z.string().min(1, "La description est requise")
});



export type DocumentFormValues = z.infer<typeof documentFormSchema>;

 // Map Document to DocumentFormDefaultValues
 export const mapDocumentToFormValues = (document: Partial<Record<keyof DocumentFormValues, unknown>>): DocumentFormValues => ({
  id_projet: String(document.id_projet ?? ""),
  libele_document: String(document.libele_document ?? ""),
  description: String(document.description ?? ""),
  version: String(document.version ?? ""),
  lien_document: String(document.lien_document ?? ""),
  classification_document: document.classification_document as DocumentFormValues["classification_document"] ?? "autre",
  etat_document: document.etat_document as DocumentFormValues["etat_document"] ?? "brouillon",
  date_creation: document.date_creation ? new Date(document.date_creation as string) : new Date(),
  createur: String(document.createur ?? ""),
});

// Créer un type pour les valeurs par défaut qui correspond exactement au schéma
type DocumentFormDefaultValues = Partial<DocumentFormValues> & {
  date_creation: Date;
};

type DocumentFormProps = {
  document?: DocumentFormDefaultValues;
  projects: { id_projet: string; nom_projet: string }[];
  onSubmit: (values: DocumentFormValues & { file?: File }) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
};

export const DocumentForm = ({ 
  document, 
  projects, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: DocumentFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      libele_document: "",
      classification_document: "autre",
      lien_document: "",
      etat_document: "brouillon",
      id_projet: "",
      date_creation: new Date(),
      createur: "",
      version: "",
      description: "",
      ...document
    } as DocumentFormValues
  });

  const handleSubmit = async (values: DocumentFormValues) => {
    await onSubmit({
      ...values,
      file: file || undefined
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="libele_document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du document</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="classification_document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de document</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="contrat">Contrat</SelectItem>
                    <SelectItem value="facture">Facture</SelectItem>
                    <SelectItem value="rapport">Rapport</SelectItem>
                    <SelectItem value="plan">Plan</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="etat_document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="brouillon">Brouillon</SelectItem>
                    <SelectItem value="validé">Validé</SelectItem>
                    <SelectItem value="archivé">Archivé</SelectItem>
                    <SelectItem value="obsolète">Obsolète</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id_projet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Projet (optionnel)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un projet" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Aucun projet</SelectItem>
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
            name="createur"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Créateur</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date_creation"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de création</FormLabel>
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
        </div>

        <FormField
          control={form.control}
          name="lien_document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fichier</FormLabel>
              <FormControl>
                <FileUpload 
                  onChange={(file: File | null) => {
                    setFile(file);
                    field.onChange(file?.name || "");
                  }} 
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-[100px]" />
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
          <Button type="submit" disabled={isLoading || !form.watch('lien_document')}>
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};