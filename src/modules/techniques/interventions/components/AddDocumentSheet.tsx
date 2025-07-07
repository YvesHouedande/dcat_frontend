import { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { addDocumentToIntervention, getAllNatureDocuments } from '../api/intervention';
import { Nature } from '../interface/interface';

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
  const [classification, setClassification] = useState('');
  const [natureDocuments, setNatureDocuments] = useState<Nature[]>([]);
  const [selectedNature, setSelectedNature] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadNatureDocuments = async () => {
      if (!isOpen) return;
      
      setIsLoading(true);
      try {
        const natures = await getAllNatureDocuments();
        if (isMounted) {
          setNatureDocuments(natures);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Erreur lors du chargement des natures de documents:', error);
          toast.error('Erreur lors du chargement des natures de documents');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (isOpen) {
      loadNatureDocuments();
    }
    
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

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
    setClassification('');
    setSelectedNature('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validation améliorée
  const validateForm = (): boolean => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier');
      return false;
    }

    if (!libelle.trim()) {
      toast.error('Veuillez saisir un libellé');
      return false;
    }

    if (!selectedNature) {
      toast.error('Veuillez sélectionner une nature de document');
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
          classification_document: classification.trim() || 'standard',
          date_document: new Date().toISOString(),
          id_nature_document: parseInt(selectedNature),
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
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-sm text-gray-500">Chargement des natures de documents...</div>
          </div>
        ) : (
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
              <Label htmlFor="classification">Classification</Label>
              <Input
                id="classification"
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
                disabled={isSubmitting}
                placeholder="Classification du document (optionnel)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nature">Nature du document*</Label>
              <Select 
                value={selectedNature} 
                onValueChange={setSelectedNature} 
                required
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une nature" />
                </SelectTrigger>
                <SelectContent>
                  {natureDocuments.map((nature) => (
                    <SelectItem 
                      key={nature.id_nature_document} 
                      value={nature.id_nature_document.toString()}
                    >
                      {nature.libelle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
};