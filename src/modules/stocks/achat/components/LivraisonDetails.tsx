// components/LivraisonDetails.tsx

import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Livraison, Partenaire } from '../types/livraison.types';

interface LivraisonDetailsProps {
  livraison: Livraison | null;
  partenaires: Partenaire[];
  isOpen: boolean;
  onClose: () => void;
}

const LivraisonDetails: React.FC<LivraisonDetailsProps> = ({
  livraison,
  partenaires,
  isOpen,
  onClose
}) => {
  if (!livraison) return null;

  // Trouver le partenaire correspondant
  const partenaire = partenaires.find(p => p.id === livraison.Id_partenaire);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de la livraison {livraison.id_livraison}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">ID Livraison</p>
              <p>{livraison.id_livraison}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Partenaire</p>
              <p>{partenaire?.nom_partenaire || 'Inconnu'}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Période d'achat</p>
              <p>{livraison.Periode_achat}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Prix d'achat</p>
              <p>{livraison.prix_achat}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Frais divers</p>
              <p>{livraison.frais_divers}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Prix de revient</p>
              <p>{livraison.Prix_de_revient}</p>
            </div>
            
            <div className="space-y-1 col-span-2">
              <p className="text-sm font-medium text-gray-500">Prix de vente</p>
              <p>{livraison.Prix_de_vente}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LivraisonDetails;