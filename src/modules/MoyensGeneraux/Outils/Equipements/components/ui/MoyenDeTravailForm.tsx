import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { moyenDeTravailSchema, MoyenDeTravailFormValues } from '../../schemas/moyenDeTravailSchema';
import { MoyenDeTravail } from '../../types/moyenDeTravail';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toISODateString } from '../../utils/dateUtils';


interface MoyenDeTravailFormProps {
  initialValues?: MoyenDeTravail;
  onSubmit: (data: MoyenDeTravailFormValues) => void;
  isLoading: boolean;
}

export const MoyenDeTravailForm = ({ 
  initialValues, 
  onSubmit, 
  isLoading 
}: MoyenDeTravailFormProps) => {
  const form = useForm<MoyenDeTravailFormValues>({
    resolver: zodResolver(moyenDeTravailSchema),
    defaultValues: initialValues ? {
      denomination: initialValues.denomination,
      date_acquisition: toISODateString(initialValues.date_acquisition),
      section: initialValues.section,
    } : {
      denomination: '',
      date_acquisition: '',
      section: '',
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="denomination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dénomination</FormLabel>
              <FormControl>
                <Input placeholder="Dénomination" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date_acquisition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'acquisition</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="section"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section</FormLabel>
              <FormControl>
                <Input placeholder="Section" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Chargement...' : initialValues ? 'Mettre à jour' : 'Créer'}
        </Button>
      </form>
    </Form>
  );
};
