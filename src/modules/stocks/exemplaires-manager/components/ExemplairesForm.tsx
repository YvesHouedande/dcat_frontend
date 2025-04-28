import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { exemplaireSchema, ExemplaireFormValues } from '../schemas/exemplaires';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { Produit, Commande, Livraison } from '../types/exemplaires';
import { useEffect } from 'react';

interface ExemplairesFormProps {
  initialData?: ExemplaireFormValues;
  produits: Produit[];
  commandes: Commande[];
  livraisons: Livraison[];
  onSubmit: (data: ExemplaireFormValues) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export const ExemplairesForm = ({
  initialData,
  produits,
  commandes,
  livraisons,
  onSubmit,
  onCancel,
  isEdit = false
}: ExemplairesFormProps) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ExemplaireFormValues>({
    resolver: zodResolver(exemplaireSchema),
    defaultValues: initialData || {
      id_exemplaire: '',
      num_serie: '',
      prix_exemplaire: '',
      etat_disponible_indisponible_: 'disponible',
      Id_Commande: null,
      id_livraison: null,
      id_produit: '',
      Code_produit: ''
    }
  });

  const selectedProductId = watch('id_produit');

  useEffect(() => {
    if (selectedProductId) {
      const selectedProduct = produits.find(p => p.id_produit === selectedProductId);
      if (selectedProduct) {
        setValue('Code_produit', selectedProduct.Code_produit);
      }
    }
  }, [selectedProductId, produits, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ... autres champs ... */}

        <div className="space-y-2">
          <Label htmlFor="Id_Commande">Commande</Label>
          <Select 
            onValueChange={(value) => setValue('Id_Commande', value || null)}
            value={watch('Id_Commande') || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Aucune commande" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune commande</SelectItem>
              {commandes.map(commande => (
                <SelectItem 
                  key={commande.Id_Commande} 
                  value={commande.Id_Commande}
                >
                  {commande.Id_Commande} - {commande.client}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="id_livraison">Livraison</Label>
          <Select 
            onValueChange={(value) => setValue('id_livraison', value || null)}
            value={watch('id_livraison') || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Aucune livraison" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune livraison</SelectItem>
              {livraisons.map(livraison => (
                <SelectItem 
                  key={livraison.id_livraison} 
                  value={livraison.id_livraison}
                >
                  {livraison.id_livraison} ({livraison.date_livraison})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-1" />
          {isEdit ? 'Mettre à jour' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
};