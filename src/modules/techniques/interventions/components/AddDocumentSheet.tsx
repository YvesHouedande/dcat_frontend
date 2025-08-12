import { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { addDocumentToIntervention } from '../api/intervention';

interface AddDocumentSheetProps {
  interventionId: number;
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: () => void;
}

export const AddDocumentSheet: React.FC<AddDocumentSheetProps> = ({
  interventionId,
  isOpen,
  onClose,
  onDocumentAdded,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [libelle, setLibelle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Réinitialiser l'état isSubmitting si la sheet se ferme
  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setFile(null);
    setLibelle('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validation simplifiée
  const validateForm = (): boolean => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier');
      return false;
    }

    if (!libelle.trim()) {
      toast.error('Veuillez saisir un libellé');
      return false;
    }

    // Validation optionnelle de la taille du fichier (ex: 10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('Le fichier est trop volumineux (max 10MB)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await addDocumentToIntervention(
        interventionId,
        file!,
        {
          libelle_document: libelle.trim(),
          classification_document: '',
          // Ne pas envoyer date_document, laisser le backend utiliser la date de création
          id_nature_document: 1, // Valeur par défaut
        }
      );

      // Utiliser la date de création retournée par l'API pour mettre à jour le document
      if (response.data && typeof response.data === 'object' && 'details' in response.data) {
        const details = (response.data as { details?: { dateCreation?: string } }).details;
        if (details?.dateCreation) {
          console.log('Date de création utilisée:', details.dateCreation);
        }
      }

      toast.success('Document ajouté avec succès');
      onDocumentAdded();
      resetForm();
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du document:', error);
      toast.error('Erreur lors de l\'ajout du document. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Ajouter un document</SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="file">Fichier*</Label>
            <Input
              ref={fileInputRef}
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              disabled={isSubmitting}
            />
            {file && (
              <div className="text-sm text-gray-500">
                Fichier sélectionné: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="libelle">Libellé*</Label>
            <Input
              id="libelle"
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Saisir le libellé du document"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date du document</Label>
            <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded border">
              La date sera automatiquement définie à la date de création du document
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button 
              variant="outline" 
              type="button" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};