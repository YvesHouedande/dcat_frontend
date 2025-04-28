// components/LivraisonForm.tsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Livraison, Partenaire } from '../types/livraison.types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

// Schéma de validation
const livraisonSchema = z.object({
  id_livraison: z.string().optional(),
  frais_divers: z.string().min(1, "Ce champ est obligatoire"),
  Periode_achat: z.string().min(1, "Ce champ est obligatoire"),
  prix_achat: z.string().min(1, "Ce champ est obligatoire"),
  Prix_de_revient: z.string().min(1, "Ce champ est obligatoire"),
  Prix_de_vente: z.string().min(1, "Ce champ est obligatoire"),
  Id_partenaire: z.string().min(1, "Veuillez sélectionner un partenaire"),
});

type LivraisonFormValues = z.infer<typeof livraisonSchema>;

interface LivraisonFormProps {
  initialData?: Livraison;
  partenaires: Partenaire[];
  onSubmit: (data: LivraisonFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const LivraisonForm: React.FC<LivraisonFormProps> = ({
  initialData,
  partenaires,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const form = useForm<LivraisonFormValues>({
    resolver: zodResolver(livraisonSchema),
    defaultValues: initialData || {
      id_livraison: '',
      frais_divers: '',
      Periode_achat: '',
      prix_achat: '',
      Prix_de_revient: '',
      Prix_de_vente: '',
      Id_partenaire: '',
    },
  });

  // Calculer automatiquement le prix de revient lorsque prix d'achat ou frais divers changent
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'prix_achat' || name === 'frais_divers') {
        const prixAchat = parseFloat(value.prix_achat || '0');
        const fraisDivers = parseFloat(value.frais_divers || '0');
        
        if (!isNaN(prixAchat) && !isNaN(fraisDivers)) {
          const prixRevient = (prixAchat + fraisDivers).toString();
          form.setValue('Prix_de_revient', prixRevient);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {initialData && (
              <FormField
                control={form.control}
                name="id_livraison"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Livraison</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="Periode_achat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Période d'achat</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="Id_partenaire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partenaire</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un partenaire" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {partenaires.map((partenaire) => (
                          <SelectItem key={partenaire.id} value={partenaire.id}>
                            {partenaire.nom_partenaire}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="prix_achat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix d'achat</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="frais_divers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frais divers</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="Prix_de_revient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix de revient</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} readOnly className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="Prix_de_vente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix de vente</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Traitement..." : initialData ? "Mettre à jour" : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LivraisonForm;