// src/components/forms/ProductInstanceForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DeliveryCombobox } from "../combobox/DeliveryCombobox";
import { ProductCombobox } from "../combobox/ProductCombobox";
import { ProductInstance } from "../../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductInstanceForm } from "../../hooks/useProductInstanceForm";
// import { ProductInstanceFormValues } from "../../schemas/productInstanceSchema";

interface ProductInstanceFormProps {
  initialData?: Partial<ProductInstance>;
  onSuccess?: () => void;
  onCancel?: () => void;
  isEditMode?: boolean;
}

export function ProductInstanceForm({
  initialData,
  onSuccess,
  onCancel,
  isEditMode = false,
}: ProductInstanceFormProps) {
  const { form, onSubmit, loading, error } = useProductInstanceForm({
    onSuccess,
    initialData,
    isEditMode,
  });

  return (
    <>
      {error && (
        <div className="bg-red-50 p-4 mb-4 rounded-md border border-red-200 text-red-800">
          Erreur: {error.message}
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="id_exemplaire"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`${isEditMode ? "" : "hidden"}`}>
                  Identifiant d'exemplaire
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="ID exemplaire"
                    {...field}
                    readOnly
                    type={`${isEditMode ? "" : "hidden"}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id_produit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Produit</FormLabel>
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
            name="num_serie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de série</FormLabel>
                <FormControl>
                  <Input placeholder="Numéro de série" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_entree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date d'entrée</FormLabel>
                <FormControl>
                  <Input readOnly type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditMode && (
            <FormField
              control={form.control}
              name="etat_vente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>État de vente</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez l'état" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="vendu">Vendu</SelectItem>
                      <SelectItem value="invendu">Invendu</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="id_livraison"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Achat</FormLabel>
                <FormControl>
                  <DeliveryCombobox
                    value={String(field.value)}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button variant="outline" onClick={onCancel} disabled={loading}>
                Annuler
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading
                ? "Chargement..."
                : isEditMode
                ? "Mettre à jour"
                : "Ajouter"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}