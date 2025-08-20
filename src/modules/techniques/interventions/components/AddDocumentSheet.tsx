import { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { Edit, Plus, X } from 'lucide-react';
import { addDocumentToIntervention, getAllNatureDocuments, createNatureDocument, updateNatureDocument, deleteNatureDocument } from '../api/intervention';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Nature } from '../interface/interface';

// Clés de requête pour TanStack Query
const natureKeys = {
  all: ["natures"] as const,
  lists: () => [...natureKeys.all, "list"] as const,
  list: () => [...natureKeys.lists()] as const,
  details: () => [...natureKeys.all, "detail"] as const,
  detail: (id: number) => [...natureKeys.details(), id] as const,
};

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
  const [id_nature_document, setIdNatureDocument] = useState<number>(0);
  const [etat_document, setEtatDocument] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // États pour la création de nature
  const [newNatureLibelle, setNewNatureLibelle] = useState("");
  
  // États pour la modification de nature
  const [editingNature, setEditingNature] = useState<{ id: number; libelle: string } | null>(null);
  const [editNatureLibelle, setEditNatureLibelle] = useState("");

  const queryClient = useQueryClient();

  // Hook pour récupérer les natures
  const { data: natures, isLoading: naturesLoading, error: naturesError } = useQuery({
    queryKey: natureKeys.list(),
    queryFn: async () => {
      console.log("🔍 Récupération des natures...");
      const result = await getAllNatureDocuments();
      console.log("📋 Natures récupérées:", result);
      return result;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
    retryDelay: 1000,
  });

  // Hook pour créer une nature
  const createNature = useMutation({
    mutationFn: (libelle: string) => createNatureDocument(libelle),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: natureKeys.list(),
      });
      toast.success("Nature créée avec succès");
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la création de la nature:", error);
      toast.error(`Erreur lors de la création de la nature: ${error.message}`);
    },
  });

  // Hook pour mettre à jour une nature
  const updateNature = useMutation({
    mutationFn: ({ id, libelle }: { id: number; libelle: string }) => updateNatureDocument(id, libelle),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: natureKeys.list(),
      });
      toast.success("Nature mise à jour avec succès");
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la mise à jour de la nature:", error);
      toast.error(`Erreur lors de la mise à jour de la nature: ${error.message}`);
    },
  });

  // Hook pour supprimer une nature
  const deleteNature = useMutation({
    mutationFn: (id: number) => deleteNatureDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: natureKeys.list(),
      });
      toast.success("Nature supprimée avec succès");
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la suppression de la nature:", error);
      const errorMessage = error.message;
      
      if (errorMessage.includes("utilisée") || errorMessage.includes("utilisé")) {
        toast.info(errorMessage, {
          style: {
            background: '#dbeafe',
            color: '#1e40af',
            border: '1px solid #3b82f6',
          },
          icon: 'ℹ️',
        });
      } else {
        toast.error(errorMessage);
      }
    },
  });

  // Handler pour créer une nouvelle nature
  const handleCreateNature = async () => {
    if (!newNatureLibelle.trim()) return;
    
    try {
      const newNature = await createNature.mutateAsync(newNatureLibelle);
      // Gérer le cas où l'API retourne id_nature_document
      const natureId = (newNature as Nature).id_nature_document;
      if (natureId) {
        setIdNatureDocument(natureId);
      }
      setNewNatureLibelle("");
    } catch (error) {
      console.error("Erreur lors de la création de la nature:", error);
    }
  };

  // Handler pour modifier une nature
  const handleUpdateNature = async () => {
    if (!editingNature || !editNatureLibelle.trim()) return;
    
    try {
      await updateNature.mutateAsync({
        id: editingNature.id,
        libelle: editNatureLibelle.trim()
      });
      setEditingNature(null);
      setEditNatureLibelle("");
    } catch (error) {
      console.error("Erreur lors de la modification de la nature:", error);
    }
  };

  // Handler pour supprimer une nature
  const handleDeleteNature = async (natureId: number) => {
    try {
      await deleteNature.mutateAsync(natureId);
    } catch (error) {
      console.error("Erreur lors de la suppression de la nature:", error);
    }
  };

  // Handler pour commencer l'édition d'une nature
  const handleStartEdit = (nature: Nature) => {
    const id = nature.id_nature_document;
    if (id) {
      setEditingNature({ id, libelle: nature.libelle });
      setEditNatureLibelle(nature.libelle);
    }
  };

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
    setIdNatureDocument(0);
    setEtatDocument('');
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

    if (!id_nature_document) {
      toast.error('Veuillez sélectionner un type de document');
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
          id_nature_document: id_nature_document,
          etat_document: etat_document.trim() || 'Actif'
          // La date sera automatiquement gérée par l'API
        }
      );

      console.log('Document ajouté avec succès:', response);

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

          {/* Type de document */}
          <div className="space-y-2">
            <Label htmlFor="nature">Type de document *</Label>
            <div className="flex gap-2">
              <Select
                value={id_nature_document.toString()}
                onValueChange={(value) => setIdNatureDocument(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sélectionnez un type</SelectItem>
                  {naturesLoading ? (
                    <SelectItem value="loading" disabled>Chargement...</SelectItem>
                  ) : naturesError ? (
                    <SelectItem value="error" disabled>Erreur: {String(naturesError)}</SelectItem>
                  ) : natures && natures.length > 0 ? (
                    natures
                      .filter(nature => nature && nature.id_nature_document && nature.libelle)
                      .map((nature) => {
                        const natureId = nature.id_nature_document!;
                        const isEditing = editingNature?.id === natureId;
                        
                        return (
                          <div key={natureId} className="relative">
                            {isEditing ? (
                              <div className="flex items-center gap-2 p-2">
                                <Input
                                  value={editNatureLibelle}
                                  onChange={(e) => setEditNatureLibelle(e.target.value)}
                                  className="flex-1 h-8 text-sm"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleUpdateNature();
                                    } else if (e.key === 'Escape') {
                                      setEditingNature(null);
                                      setEditNatureLibelle("");
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={handleUpdateNature}
                                  disabled={updateNature.isLoading}
                                  className="h-8 px-2"
                                >
                                  {updateNature.isLoading ? "..." : "✓"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingNature(null);
                                    setEditNatureLibelle("");
                                  }}
                                  className="h-8 px-2"
                                >
                                  ✕
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between p-2 hover:bg-gray-50">
                                <SelectItem 
                                  value={natureId.toString()}
                                  className="flex-1 cursor-pointer"
                                >
                                  {nature.libelle}
                                </SelectItem>
                                <div className="flex items-center gap-1 ml-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleStartEdit(nature);
                                    }}
                                    className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <Edit size={12} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleDeleteNature(natureId);
                                    }}
                                    disabled={deleteNature.isLoading}
                                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    title="Supprimer cette nature"
                                  >
                                    <X size={12} />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                  ) : (
                    <>
                      <SelectItem value="1">Rapport</SelectItem>
                      <SelectItem value="2">Photo</SelectItem>
                      <SelectItem value="3">Plan</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    <Plus size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium leading-none">Créer une nouvelle nature</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Créez un nouveau type de document pour l'utiliser immédiatement.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nature-libelle">Libellé de la nature</Label>
                      <Input
                        id="nature-libelle"
                        value={newNatureLibelle}
                        onChange={(e) => setNewNatureLibelle(e.target.value)}
                        placeholder="Ex: Rapport technique"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleCreateNature();
                          }
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewNatureLibelle("")}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleCreateNature}
                        disabled={!newNatureLibelle.trim() || createNature.isLoading}
                        className="flex-1"
                      >
                        {createNature.isLoading ? "Création..." : "Créer"}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* État du document */}
          <div className="space-y-2">
            <Label htmlFor="etat_document">État du document</Label>
            <Select
              value={etat_document}
              onValueChange={setEtatDocument}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un état" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Actif">Actif</SelectItem>
                <SelectItem value="Archivé">Archivé</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
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