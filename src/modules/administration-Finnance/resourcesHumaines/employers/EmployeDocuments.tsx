import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Trash2,
  Plus,
  Eye,
  Calendar,
  Edit,
  X,
} from "lucide-react";
import { format, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { DossierCombobox } from "@/components/combobox/DossierCombobox";
import { useEmployeDocuments, useDeleteDocumentFromEmploye, useAddDocumentToEmploye, useNatures, useCreateNature, useUpdateNature, useDeleteNature } from "../../hooks/useEmployeDocuments";
import { EmployeDocument } from "../../administration/types/interfaces";
import { toast } from "sonner";

interface NatureDocument {
  id?: number;
  id_nature_document?: number;
  libelle: string;
  created_at?: string;
  updated_at?: string;
}

interface EmployeDocumentsProps {
  employeId: number;
}

const EmployeDocuments: React.FC<EmployeDocumentsProps> = ({ employeId }) => {
  const { data: documents, isLoading, error } = useEmployeDocuments(employeId);
  const deleteDocument = useDeleteDocumentFromEmploye();
  const addDocument = useAddDocumentToEmploye();
  
  // Hooks pour les natures
  const { data: natures, isLoading: naturesLoading, error: naturesError } = useNatures();
  const createNature = useCreateNature();
  const updateNature = useUpdateNature();
  const deleteNature = useDeleteNature();
  
  // Debug des natures
  console.log("🔍 État des natures:", {
    natures,
    naturesLoading,
    naturesError,
    naturesLength: natures?.length,
    naturesType: typeof natures,
    isArray: Array.isArray(natures)
  });
  
  // États pour la suppression
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<EmployeDocument | null>(null);
  
  // États pour l'ajout de document
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [libelle, setLibelle] = useState("");
  // const [classification, setClassification] = useState("");
  const [natureId, setNatureId] = useState<string | undefined>(undefined);
  const [id_dossier, setIdDossier] = useState<number | undefined>(undefined);
  const [etat_document, setEtatDocument] = useState<"Actif" | "Archivé">("Actif");
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // États pour la création de nature
  const [newNatureLibelle, setNewNatureLibelle] = useState("");
  
  // États pour la modification de nature
  const [editingNature, setEditingNature] = useState<{ id: number; libelle: string } | null>(null);
  const [editNatureLibelle, setEditNatureLibelle] = useState("");
  
  // État pour les messages d'erreur de suppression
  // const [deleteError, setDeleteError] = useState<string | null>(null);

  // Handlers pour l'ajout de document
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handler pour créer une nouvelle nature
  const handleCreateNature = async () => {
    if (!newNatureLibelle.trim()) return;
    
    try {
      const newNature = await createNature.mutateAsync(newNatureLibelle);
      // Gérer le cas où l'API retourne id ou id_nature_document
      const natureId = (newNature as NatureDocument).id || (newNature as NatureDocument).id_nature_document;
      if (natureId) {
        setNatureId(natureId.toString());
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
      // setDeleteError(null);
    } catch (error) {
      console.error("Erreur lors de la suppression de la nature:", error);
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la suppression";
      
      // Vérifier si c'est une erreur de contrainte (nature utilisée)
      if (errorMessage.includes("utilisée") || errorMessage.includes("utilisé")) {
        // setDeleteError(errorMessage);
        // Afficher un toast informatif en bleu
        toast.info(errorMessage, {
          style: {
            background: '#dbeafe',
            color: '#1e40af',
            border: '1px solid #3b82f6',
          },
          icon: 'ℹ️',
        });
      } else {
        // Pour les autres erreurs, utiliser le toast d'erreur normal
        toast.error(errorMessage);
      }
    }
  };

  // Handler pour commencer l'édition d'une nature
  const handleStartEdit = (nature: NatureDocument) => {
    const id = nature.id_nature_document || nature.id;
    if (id) {
      setEditingNature({ id, libelle: nature.libelle });
      setEditNatureLibelle(nature.libelle);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    
    if (!file || !libelle || !id_dossier) {
      setUploadError("Le fichier, le libellé et le dossier sont obligatoires.");
      return;
    }

    try {
      await addDocument.mutateAsync({
        employeId: employeId,
        documentData: {
          file: file,
          libelle_document: libelle,
          id_nature_document: Number(natureId) || 1,
          etat_document: etat_document,
          // classification: classification || undefined,
          id_dossier: id_dossier,
        },
      });
      
      // Réinitialiser le formulaire
      setFile(null);
      setLibelle("");
      // setClassification("");
      setNatureId(undefined);
      setIdDossier(undefined);
      setEtatDocument("Actif");
      setUploadError(null);
      
      // Fermer le sheet
      setIsSheetOpen(false);
      
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      setUploadError("Erreur lors de l'ajout du document");
    }
  };

  // Déterminer la base URL pour les fichiers statiques
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL as string;
  const STATIC_FILES_BASE_URL = API_BASE_URL.endsWith("/api")
    ? API_BASE_URL.slice(0, -4)
    : API_BASE_URL;

  const handleDeleteDocument = (document: EmployeDocument) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!documentToDelete) return;

    deleteDocument.mutate({
      employeId: employeId,
      documentId: documentToDelete.id_documents,
    });

    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  const getFileType = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    return extension.toUpperCase();
  };

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "bg-red-100 text-red-800";
      case "docx":
        return "bg-blue-100 text-blue-800";
      case "xlsx":
        return "bg-green-100 text-green-800";
      case "pptx":
        return "bg-orange-100 text-orange-800";
      case "jpg":
      case "jpeg":
      case "png":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (etat: string | undefined) => {
    switch (etat) {
      case "Actif":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Actif
          </Badge>
        );
      case "Archivé":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Archivé
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {etat || "Non défini"}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Date non définie";
    
    try {
      const date = new Date(dateString);
      if (isValid(date)) {
        return format(date, "dd MMM yyyy", { locale: fr });
      }
    } catch (error) {
      console.warn("Date invalide:", dateString, error);
    }
    
    return "Date non définie";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Chargement des documents...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 text-center py-4">
            Erreur lors du chargement des documents: {String(error)}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Documents</CardTitle>
                                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                          <Button className="flex items-center gap-2">
                            <Plus size={16} /> Ajouter un document
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                          <SheetHeader>
                            <SheetTitle>Ajouter un document</SheetTitle>
                            <SheetDescription>
                              Remplissez les informations du document à associer à cet employé.
                            </SheetDescription>
                          </SheetHeader>
                          <form
                            onSubmit={handleAddDocument}
                            className="space-y-3 mt-4 px-2"
                          >
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Fichier <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="file"
                                  onChange={handleFileChange}
                                  accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {file && (
                                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                                    <div className="flex items-center gap-2 text-sm text-green-700">
                                      <FileText size={16} />
                                      <span className="font-medium">{file.name}</span>
                                      <span className="text-xs">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Libellé <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={libelle}
                                onChange={(e) => setLibelle(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nom du document"
                              />
                            </div>
                            {/* <div>
                              <label className="block text-sm font-medium mb-1">
                                Classification
                              </label>
                              <input
                                type="text"
                                value={classification}
                                onChange={(e) => setClassification(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Classification du document (optionnel)"
                              />
                            </div> */}
                                                         <div>
                               <label className="block text-sm font-medium mb-1">
                                 Nature du document
                               </label>
                               <div className="flex gap-2">
                                 <Select
                                   value={natureId ?? undefined}
                                   onValueChange={(value) => setNatureId(value)}
                                 >
                                   <SelectTrigger className="flex-1">
                                     <SelectValue placeholder="Sélectionnez une nature" />
                                   </SelectTrigger>
                                                                                                           <SelectContent>
                                      {naturesLoading ? (
                                        <SelectItem value="" disabled>
                                          Chargement...
                                        </SelectItem>
                                      ) : naturesError ? (
                                        <SelectItem value="" disabled>
                                          Erreur: {String(naturesError)}
                                        </SelectItem>
                                      ) : natures && Array.isArray(natures) && natures.length > 0 ? (
                                        (natures as NatureDocument[])
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
                                        <SelectItem value="" disabled>
                                          Aucune nature disponible
                                        </SelectItem>
                                      )
                                      }
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
                                        +
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
                                            placeholder="Ex: Contrat de travail"
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
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                État du document
                              </label>
                              <Select
                                value={etat_document}
                                onValueChange={(value: "Actif" | "Archivé") => setEtatDocument(value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Actif">Actif</SelectItem>
                                  <SelectItem value="Archivé">Archivé</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Dossier <span className="text-red-500">*</span>
                              </label>
                              <DossierCombobox
                                value={id_dossier}
                                onChange={(value) => setIdDossier(Number(value))}
                                type={"demandes RH"}
                              />
                            </div>
                            {uploadError && (
                              <div className="text-red-600 text-sm">
                                {uploadError}
                              </div>
                            )}
                            <SheetFooter>
                              <Button
                                type="submit"
                                disabled={addDocument.isLoading}
                                className="w-full"
                              >
                                {addDocument.isLoading
                                  ? "Ajout en cours..."
                                  : "Ajouter le document"}
                              </Button>
                            </SheetFooter>
                          </form>
                        </SheetContent>
                      </Sheet>
        </CardHeader>
        <CardContent>
          {documents && documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((document) => (
                <div
                  key={document.id_documents}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {document.libelle_document}
                        </h4>
                        {getStatusBadge(document.etat_document)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(document.date_document)}
                        </span>
                        <Badge
                          variant="outline"
                          className={getFileTypeColor(getFileType(document.lien_document))}
                        >
                          {getFileType(document.lien_document)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const url = `${STATIC_FILES_BASE_URL}/${document.lien_document}`;
                        window.open(url, '_blank');
                      }}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const url = `${STATIC_FILES_BASE_URL}/${document.lien_document}`;
                        const link = window.document.createElement('a');
                        link.href = url;
                        link.download = document.libelle_document;
                        window.document.body.appendChild(link);
                        link.click();
                        window.document.body.removeChild(link);
                      }}
                    >
                      <Download size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDocument(document)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun document
              </h3>
              <p className="text-gray-500 mb-4">
                Cet employé n'a pas encore de documents associés.
              </p>
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus size={16} /> Ajouter le premier document
                  </Button>
                </SheetTrigger>
              </Sheet>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le document "{documentToDelete?.libelle_document}" ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteDocument.isLoading}
            >
              {deleteDocument.isLoading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
                    </AlertDialog>
        
      </>
   );
 };

export default EmployeDocuments;
