// src/components/forms/ExemplaireProduitForm.tsx
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
import { DeliveryCombobox } from "@/components/combobox/DeliveryCombobox";
import { ProductCombobox } from "@/components/combobox/ProductCombobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExemplaireProduitForm } from "../../hooks/useExemplaireProduitForm"
import React from "react";
import { FournisseurCombobox } from "@/components/combobox/FournisseurCombobox";
import { UseFormReturn } from "react-hook-form";
import { ExemplaireProduitFormValues } from "../../schemas/ExemplaireProduitSchema";

interface ExemplaireProduitFormProps {
  initialData?: Partial<ExemplaireProduitFormValues>;
  onSuccess?: () => void;
  onCancel?: () => void;
  isEditMode?: boolean;
  isTools?: boolean;
}

export const ExemplaireProduitForm = React.forwardRef<
  UseFormReturn<ExemplaireProduitFormValues> | null,
  ExemplaireProduitFormProps
>(
  (
    { initialData, onSuccess, onCancel, isEditMode = false, isTools = false },
    ref
  ) => {
    const { form, onSubmit, loading, error } = useExemplaireProduitForm({
      onSuccess,
      initialData,
      isEditMode,
    });

    // Expose form via ref si besoin
    React.useImperativeHandle(ref, () => form, [form]);

    // Composant pour le champ "État de vente ou etat du materiel"
    const EtatVenteField = (
      <FormField
        control={form.control}
        name="etat_exemplaire"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {isTools ? "Etat du matériel" : "État de vente"}
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez l'état" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {isTools ? (
                  <>
                    <SelectItem value="bon">Bon</SelectItem>
                    <SelectItem value="endommage">Endommagé</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="Vendu">Vendu</SelectItem>
                    <SelectItem value="Disponible">Disponible</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );

    const shouldShowEtatVente = isEditMode || isTools;

    return (
      <>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
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
              name="id_produit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isTools ? "Outils" : "Produit"}</FormLabel>
                  <FormControl>
                    <div className="pointer-events-none opacity-70">
                      <ProductCombobox
                        isTools={isTools}
                        value={String(field.value)}
                        onChange={field.onChange}
                      />
                    </div>
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
                    <Input
                      autoFocus={true}
                      placeholder="Numéro de série"
                      {...field}
                    />
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
                    <Input
                      readOnly
                      type={isEditMode ? "text" : "datetime-local"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {shouldShowEtatVente && EtatVenteField}
            {/* Composant pour le champ "Achat" */}
            {!isTools ? (
              <>
                <FormField
                  control={form.control}
                  name="id_livraison"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Livraison</FormLabel>
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
                <FormField
                  control={form.control}
                  name="prix_achat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix d'achat</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Prix d'achat"
                          value={field.value}
                          onChange={field.onChange}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="variante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variante (cota des frais)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Variante"
                          value={field.value}
                          onChange={field.onChange}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marge_haute"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marge haute</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Marge haute"
                          value={field.value}
                          onChange={field.onChange}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marge_basse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Marge basse </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Marge basse"
                          value={field.value}
                          onChange={field.onChange}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="id_livraison"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fournisseur</FormLabel>
                      <FormControl>
                        <FournisseurCombobox
                          value={String(field.value)}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                Erreur: {error.message}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              {onCancel && (
                <div
                  onClick={!loading ? onCancel : undefined}
                  className={`cursor-default px-4 flex items-center justify-center  border rounded-md  ${
                    loading
                      ? "opacity-50 pointer-events-none"
                      : "hover:bg-gray-100"
                  }`}
                  aria-disabled={loading}
                >
                  Annuler
                </div>
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
);
