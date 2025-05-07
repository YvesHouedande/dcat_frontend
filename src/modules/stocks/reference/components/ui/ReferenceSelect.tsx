import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import {
  marqueTypes,
  familleTypes,
  modeleTypes,
  categorieTypes,
} from "@/modules/stocks/types/reference";

// Schéma de validation
export const formSchema = z.object({
  id_produit: z.number().optional(),
  code_produit: z.string().optional(),
  desi_produit: z.string().min(1, "La désignation est obligatoire"),
  desc_produit: z.string().optional(),
  image_produit: z.string().optional(),
  emplacement: z.string().min(1, "L'emplacement est obligatoire"),
  caracteristiques: z.string().optional(),
  id_categorie: z.number().min(1, "La catégorie est obligatoire"),
  id_type_produit: z.number().min(1, "Le type est obligatoire"),
  id_modele: z.number().min(1, "Le modèle est obligatoire"),
  id_famille: z.number().min(1, "La famille est obligatoire"),
  id_marque: z.number().min(1, "La marque est obligatoire"),
});

export type FormValues = z.infer<typeof formSchema>;

// Composant de sélection pour les références
export const ReferenceSelectMarque = ({
  items,
  label,
  name,
  control,
  isRequired = false,
  onChange = undefined,
}: {
  items: marqueTypes[];
  label: string;
  name: keyof FormValues;
  control: any;
  isRequired?: boolean;
  onChange?: (value: string) => void;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(Number(value)); // conversion string -> number
              if (onChange) onChange(value);
            }}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={`Sélectionner ${label.toLowerCase()}`}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.libelle_marque}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export const ReferenceSelectModele = ({
  items,
  label,
  name,
  control,
  isRequired = false,
  onChange = undefined,
}: {
  items: modeleTypes[];
  label: string;
  name: keyof FormValues;
  control: any;
  isRequired?: boolean;
  onChange?: (value: string) => void;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(Number(value)); // conversion string -> number
              if (onChange) onChange(value);
            }}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={`Sélectionner ${label.toLowerCase()}`}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.libelle_modele}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export const ReferenceSelectFamille = ({
  items,
  label,
  name,
  control,
  isRequired = false,
  onChange = undefined,
}: {
  items: familleTypes[];
  label: string;
  name: keyof FormValues;
  control: any;
  isRequired?: boolean;
  onChange?: (value: string) => void;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(Number(value)); // conversion string -> number
              if (onChange) onChange(value);
            }}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={`Sélectionner ${label.toLowerCase()}`}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.libelle_famille}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export const ReferenceSelectCategorie = ({
  items,
  label,
  name,
  control,
  isRequired = false,
  onChange = undefined,
}: {
  items: categorieTypes[];
  label: string;
  name: keyof FormValues;
  control: any;
  isRequired?: boolean;
  onChange?: (value: string) => void;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(Number(value)); // conversion string -> number
              if (onChange) onChange(value);
            }}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={`Sélectionner ${label.toLowerCase()}`}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.libelle_categorie}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
