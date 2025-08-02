import { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
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
  const [dateDocument, setDateDocument] = useState<Date | undefined>(new Date());
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
    setDateDocument(new Date());
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
      await addDocumentToIntervention(
        interventionId,
        file!,
        {
          libelle_document: libelle.trim(),
          classification_document: '',
          date_document: dateDocument ? dateDocument.toISOString() : new Date().toISOString(),
          id_nature_document: 1, // Valeur par défaut
        }
      );

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
            <Label htmlFor="date_document">Date du document</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateDocument ? (
                    format(dateDocument, "dd MMMM yyyy", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateDocument}
                  onSelect={setDateDocument}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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