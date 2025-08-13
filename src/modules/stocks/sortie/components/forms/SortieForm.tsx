// src/components/forms/ExemplaireProduitForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ExemplaireProduitFormValues } from "@/modules/stocks/exemplaire";
import { useForm } from "react-hook-form";
import { SortieFormValues, SortieSchema } from "../../schemas/SortieSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import DebugZod from "@/modules/stocks/utils/debug";
import { useSortieExemplaireCreate } from "@/modules/stocks/exemplaire/hooks/useSortieExemplaire";
import { toast } from "sonner";
import { getAxiosErrorMessage } from "@/api/api";
import { AxiosError } from "axios";

interface SortieFormProps {
  initialData?: ExemplaireProduitFormValues;
  onCancel?: () => void;
}

export const SortieForm = ({ initialData, onCancel }: SortieFormProps) => {
  const form = useForm<SortieFormValues>({
    resolver: zodResolver(SortieSchema),
    defaultValues: {
      type_sortie: undefined,
      id_commande: undefined,
      id_exemplaire: initialData?.id_exemplaire || "",
    },
  });
  const { mutate, isLoading, error } = useSortieExemplaireCreate();
  const onSubmit = (data: SortieFormValues) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Sortie réussie");
        form.reset();
        onCancel?.();
      },
      onError: (error) => {
        toast.error(getAxiosErrorMessage(error));
      },
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="id_exemplaire"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="hidden">
                  Identifiant d'exemplaire
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="ID exemplaire"
                    {...field}
                    readOnly
                    type={"hidden"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id_commande"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Numero de commande"}</FormLabel>
                <FormDescription>
                  {
                    "Le numero de commande est fourni dans la partie vente d'équipement du module marketing commercial"
                  }
                </FormDescription>
                <FormControl>
                  <div className="flex flex-col gap-2 ">
                    <Input
                      placeholder="Numero de commande"
                      {...field}
                      type={"text"}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type_sortie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Type de sortie"}</FormLabel>
                <FormDescription>
                  {
                    "Le type de sortie est de type vente directe si elle ne concerne pas une commande de vente en ligne"
                  }
                </FormDescription>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le type de sortie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vente directe">
                        Vente directe
                      </SelectItem>
                      <SelectItem value="vente en ligne">
                        Vente en ligne
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <DebugZod form={form} /> */}
          {/* Composant pour le champ "Achat" */}

          {(error as AxiosError) && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              Erreur: {getAxiosErrorMessage(error)}
            </div>
          )}
          <div className="flex justify-end space-x-2">
            {onCancel && (
              <div
                onClick={!isLoading ? onCancel : undefined}
                className={`cursor-default px-4 flex items-center justify-center  border rounded-md  ${
                  isLoading
                    ? "opacity-50 pointer-events-none"
                    : "hover:bg-gray-100"
                }`}
                aria-disabled={isLoading}
              >
                Annuler
              </div>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Chargement..." : "Faire la sortie"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
