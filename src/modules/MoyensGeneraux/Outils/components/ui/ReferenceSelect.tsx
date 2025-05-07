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
import { referenceSchema } from "@/modules/stocks/reference/schemas/referenceSchema";

export type FormValues = z.infer<typeof referenceSchema>;

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
