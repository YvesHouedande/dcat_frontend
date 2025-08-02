import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Intervention, Partenaire, Employe } from '../interface/interface';
import { usePartenairesApi } from '../../projects/projet/api/partenaires';
import { useEmployesApi } from '../../projects/projet/api/employes';
import { useContratsApi } from '@/modules/administration-Finnance/services/contratService';
import { Contrat } from '@/modules/administration-Finnance/administration/types/interfaces';

// Schéma de validation du formulaire
const formSchema = z.object({
  date_intervention: z.string().min(1, 'La date d\'intervention est requise'),
  id_partenaire: z.number().min(1, 'Le client est requis'),
  id_contrat: z.number().optional(),
  probleme_signale: z.string().optional(),
  type_intervention: z.enum(['Corrective', 'Préventive']).optional(),
  type_defaillance: z.enum(['Électrique', 'Matérielle', 'Logiciel']).optional(),
  cause_defaillance: z.enum(['Usure normale', 'Défaut utilisateur', 'Défaut produit', 'Autre']).optional(),
  detail_cause: z.string().optional(),
  rapport_intervention: z.string().optional(),
  recommandation: z.string().optional(),
  duree: z.string().optional(),
  lieu: z.string().optional(),
  mode_intervention: z.string().optional(),
  statut_intervention: z.enum(['à faire', 'en cours', 'en attente', 'terminé']).optional(),
  employes: z.array(z.number()).optional(),
  superviseur: z.number().optional(),
});

export type FormData = z.infer<typeof formSchema>;

interface InterventionFormProps {
  intervention?: Intervention;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export const InterventionForm: React.FC<InterventionFormProps> = ({
  intervention,
  onSubmit,
  isLoading = false,
}) => {
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [contrats, setContrats] = useState<Contrat[]>([]);
  const { fetchContrats } = useContratsApi();
  const { getPartenaires } = usePartenairesApi();
  const { getEmployes } = useEmployesApi();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date_intervention: intervention?.date_intervention || format(new Date(), 'yyyy-MM-dd'),
      id_partenaire: intervention?.id_partenaire || 0,
      id_contrat: intervention?.id_contrat || undefined,
      probleme_signale: intervention?.probleme_signale || '',
      type_intervention: (intervention?.type_intervention as 'Corrective' | 'Préventive') || undefined,
      type_defaillance: (intervention?.type_defaillance as 'Électrique' | 'Matérielle' | 'Logiciel') || undefined,
      cause_defaillance: (intervention?.cause_defaillance as 'Usure normale' | 'Défaut utilisateur' | 'Défaut produit' | 'Autre') || undefined,
      detail_cause: intervention?.detail_cause || '',
      rapport_intervention: intervention?.rapport_intervention || '',
      recommandation: intervention?.recommandation || '',
      duree: intervention?.duree || '',
      lieu: intervention?.lieu || '',
      mode_intervention: intervention?.mode_intervention || '',
      statut_intervention: (intervention?.statut_intervention as 'à faire' | 'en cours' | 'en attente' | 'terminé') || undefined,
      employes: intervention?.employes?.map(e => e.id_employes) || [],
      superviseur: intervention?.superviseur || undefined,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('[Form] Chargement des données...');
        const [partenairesList, employesList, contratsList] = await Promise.all([
          getPartenaires({limit: 100, page: 1}),
          getEmployes({limit: 100, page: 1}),
          fetchContrats({limit: 100, page: 1}),
        ]);
        console.log('[Form] Données chargées:', {
          partenaires: partenairesList?.length || 0,
          employes: employesList?.length || 0,
          contrats: contratsList?.length || 0
        });
        setPartenaires(partenairesList);
        setEmployes(employesList);
        setContrats(contratsList);
      } catch (error) {
        console.error('[Form] Erreur lors du chargement des données:', error);
      }
    };
    loadData();
  }, [fetchContrats, getPartenaires, getEmployes]);

  // Handler pour la soumission du formulaire principal
  const handleFormSubmit = (data: FormData) => {
    console.log('[Form] Données du formulaire soumises:', data);
    console.log('[Form] Employés sélectionnés:', data.employes);
    console.log('[Form] Superviseur sélectionné:', data.superviseur);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {intervention ? "Modifier l'Intervention" : "Ajouter une nouvelle Intervention"}
            </h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations Générales</CardTitle>
            <CardDescription>Informations de base de l'intervention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="date_intervention"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date d'intervention</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="id_partenaire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {partenaires.map((partenaire) => (
                        <SelectItem
                          key={partenaire.id_partenaire}
                          value={partenaire.id_partenaire.toString()}
                        >
                          {partenaire.nom_partenaire}
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
              name="id_contrat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contrat</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value ? field.value.toString() : ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un contrat" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contrats.map((contrat) => (
                        <SelectItem
                          key={contrat.id_contrat}
                          value={contrat.id_contrat.toString()}
                        >
                          {contrat.nom_contrat} {contrat.duree_contrat ? `- ${contrat.duree_contrat}` : ''}
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
              name="employes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervenants</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const employeId = parseInt(value);
                      const currentEmployes = field.value || [];
                      if (!currentEmployes.includes(employeId)) {
                        field.onChange([...currentEmployes, employeId]);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez les intervenants" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employes.map((employe) => (
                        <SelectItem
                          key={employe.id_employes}
                          value={employe.id_employes.toString()}
                        >
                          {`${employe.prenom_employes} ${employe.nom_employes}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    {field.value?.map((employeId) => {
                      const employe = employes.find((e) => e.id_employes === employeId);
                      return employe ? (
                        <div key={employeId} className="flex items-center gap-2 my-1">
                          <span>{`${employe.prenom_employes} ${employe.nom_employes}`}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              field.onChange((field.value || []).filter((id) => id !== employeId));
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="probleme_signale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problème Signalé</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Détails Techniques</CardTitle>
            <CardDescription>Type de maintenance et défaillance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="type_intervention"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de Maintenance</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Corrective" id="corrective" />
                        <label htmlFor="corrective">Corrective</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Préventive" id="preventive" />
                        <label htmlFor="preventive">Préventive</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type_defaillance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de Défaillance</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Électrique" id="electrique" />
                        <label htmlFor="electrique">Électrique</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Matérielle" id="materielle" />
                        <label htmlFor="materielle">Matérielle</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Logiciel" id="logiciel" />
                        <label htmlFor="logiciel">Logiciel</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cause_defaillance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cause de la Défaillance</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Usure normale" id="usure" />
                        <label htmlFor="usure">Usure normale</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Défaut utilisateur" id="defaut-utilisateur" />
                        <label htmlFor="defaut-utilisateur">Défaut utilisateur</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Défaut produit" id="defaut-produit" />
                        <label htmlFor="defaut-produit">Défaut produit</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Autre" id="autre" />
                        <label htmlFor="autre">Autre</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('cause_defaillance') === 'Autre' && (
              <FormField
                control={form.control}
                name="detail_cause"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Détail de la cause</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rapport et Durée</CardTitle>
            <CardDescription>Détails de l'intervention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="rapport_intervention"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rapport d'Intervention</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[150px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recommandation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recommandation</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Ex: 2h30" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lieu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lieu</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mode_intervention"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode d'Intervention</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Ex: Sur site, À distance, Hybride" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Validation</CardTitle>
            <CardDescription>Superviseur et signatures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="statut_intervention"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut de l'Intervention</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="à faire" id="a-faire" />
                        <label htmlFor="a-faire">À faire</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="en cours" id="en-cours" />
                        <label htmlFor="en-cours">En cours</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="en attente" id="en-attente" />
                        <label htmlFor="en-attente">En attente</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="terminé" id="termine" />
                        <label htmlFor="termine">Terminé</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="superviseur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Superviseur</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value ? field.value.toString() : ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un superviseur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employes.map((employe) => (
                        <SelectItem
                          key={employe.id_employes}
                          value={employe.id_employes.toString()}
                        >
                          {`${employe.prenom_employes} ${employe.nom_employes}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : intervention ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 