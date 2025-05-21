import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, File, X, AlertCircle } from "lucide-react";
import { Document } from "../../types/interfaces";

// Fonction utilitaire pour fusionner les classes conditionnellement
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};
interface Errors {
  [key: string]: string | undefined;
}

const AddDocumentPage: React.FC = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Errors>({});
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentInfo, setDocumentInfo] = useState<Partial<Document>>({
    libele_document: "",
    classification_document: "",
    etat_document: "private",
    id_nature_document: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gestion du drag & drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      addFile(droppedFiles[0]); // Prendre seulement le premier fichier
    }
  };

  // Gestion de la sélection de fichier via le bouton
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]; // Prendre seulement le premier fichier
      addFile(selectedFile);
      e.target.value = ""; // Réinitialiser l'input pour permettre la sélection du même fichier
    }
  };

  // Ajout d'un seul fichier
  const addFile = (newFile: File) => {
    setFile(newFile);

    // Si aucun libellé n'est défini, utiliser le nom du fichier
    if (!documentInfo.libele_document) {
      const fileName = newFile.name.split(".")[0]; // Enlever l'extension
      syncDocumentNames(fileName);
    }
  };

  // Supprimer le fichier
  const removeFile = () => {
    setFile(null);
  };

  // Gérer les changements d'informations du document
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDocumentInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Simuler l'envoi du document au backend
  const handleUpload = () => {
    const newErrors: Errors = {};

    if (!documentInfo.classification_document) {
      newErrors.classification_document = "La classification est obligatoire";
    }

    if (!documentInfo.libele_document) {
      newErrors.libele_document = "Le libellé est obligatoire";
    }

    if (!documentInfo.id_nature_document) {
      newErrors.id_nature_document = "La nature du document est obligatoire";
    }

    // Vérifier si nous avons un fichier
    if (!file) {
      newErrors.file = "Veuillez sélectionner un fichier";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Préparation des données à envoyer au backend
    const formData = new FormData();

    // Ajouter les informations du document
    formData.append('libele_document', documentInfo.libele_document || '');
    formData.append('classification_document', documentInfo.classification_document || '');
    formData.append('etat_document', documentInfo.etat_document || 'private');
    formData.append('id_nature_document', documentInfo.id_nature_document?.toString() || '0');

    // Ajouter le fichier
    if (file) {
      formData.append('file', file);
    }

    // Simulation de l'envoi au backend
    // En production, remplacer par un vrai appel API
    const simulateUpload = () => {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setUploading(false);
              // Redirection après succès
              navigate("/administration/documents");
            }, 500);
            return 100;
          }
          return prev + 5;
        });
      }, 150);
    };

    simulateUpload();

    // Code pour API réelle (à décommenter en production)
    /*
    fetch('/api/documents', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) throw new Error('Erreur lors de l\'envoi du document');
        return response.json();
      })
      .then(data => {
        setUploading(false);
        navigate("/administration/documents");
      })
      .catch(error => {
        setUploading(false);
        setErrors({ api: "Une erreur est survenue lors de l'envoi du document" });
        console.error('Erreur:', error);
      });
    */
  };

  // Synchroniser les noms de document
  const syncDocumentNames = (name: string) => {
    setDocumentInfo((prev) => ({
      ...prev,
      libele_document: name,
    }));
  };

  // Fonction pour déterminer l'icône du type de fichier
  const getFileIcon = (file: File) => {
    if (file.type?.startsWith("image/")) {
      return (
        <div className="w-12 h-12 rounded overflow-hidden">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    return <File className="h-12 w-12 text-blue-500" />;
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl"><h1 className="text-2xl font-bold mb-6">Ajouter un document</h1>
      <Card>
        <CardHeader>
          <CardTitle>Nouveau document</CardTitle>
          <CardDescription>
            Téléchargez un document et ajoutez les informations nécessaires
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="upload" className="mb-6">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="upload">Document</TabsTrigger>
              <TabsTrigger value="info">Informations</TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              {/* Zone de drag & drop pour un fichier */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  dragOver
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Glissez et déposez votre fichier ici
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  ou cliquez pour parcourir vos fichiers
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Sélectionner un fichier
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Fichier sélectionné */}
              {file && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Fichier sélectionné</h3>
                  <div className="flex items-center p-3 border rounded-lg bg-gray-50">
                    {getFileIcon(file)}
                    <div className="ml-3 flex-1">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {errors.file && (
                <p className="text-sm text-red-500 mt-2">{errors.file}</p>
              )}
            </TabsContent>

            <TabsContent value="info">
              <div className="space-y-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="libele_document">Libellé du document*</Label>
                  <Input
                    id="libele_document"
                    name="libele_document"
                    placeholder="Entrez un libellé"
                    value={documentInfo.libele_document || ""}
                    onChange={handleInfoChange}
                    className={errors.libele_document ? "border-red-500" : ""}
                  />
                  {errors.libele_document && (
                    <p className="text-sm text-red-500">{errors.libele_document}</p>
                  )}
                </div>

                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="classification_document">Classification*</Label>
                  <Select
                    value={documentInfo.classification_document || ""}
                    onValueChange={(value) => {
                      setDocumentInfo((prev) => ({ ...prev, classification_document: value }));
                      setErrors((prev) => ({ ...prev, classification_document: undefined }));
                    }}
                  >
                    <SelectTrigger
                      className={errors.classification_document ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Sélectionnez une classification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confidentiel">Confidentiel</SelectItem>
                      <SelectItem value="interne">Interne</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="personnel">Personnel</SelectItem>
                      <SelectItem value="restreint">Restreint</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.classification_document && (
                    <p className="text-sm text-red-500">{errors.classification_document}</p>
                  )}
                </div>

                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="id_nature_document">Nature du document*</Label>
                  <Select
                  value={documentInfo.id_nature_document? documentInfo.id_nature_document.toString() : ""}
                    onValueChange={(value) => {
                      setDocumentInfo((prev) => ({ ...prev, id_nature_document: parseInt(value) }));
                      setErrors((prev) => ({ ...prev, id_nature_document: undefined }));
                    }}
                  >
                    <SelectTrigger
                      className={errors.id_nature_document ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Sélectionnez une nature" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Contrat</SelectItem>
                      <SelectItem value="2">Facture</SelectItem>
                      <SelectItem value="3">Rapport</SelectItem>
                      <SelectItem value="4">CV</SelectItem>
                      <SelectItem value="5">Procédure</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.id_nature_document && (
                    <p className="text-sm text-red-500">{errors.id_nature_document}</p>
                  )}
                </div>

                <div className="grid w-full items-center gap-2">
                  <Label>État du document</Label>
                  <RadioGroup
                    value={documentInfo.etat_document || "private"}
                    onValueChange={(value) =>
                      setDocumentInfo((prev) => ({ ...prev, etat_document: value }))
                    }
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">Public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private">Privé</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="draft" id="draft" />
                      <Label htmlFor="draft">Brouillon</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Barre de progression */}
          {uploading && (
            <div className="my-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Téléchargement en cours...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Annuler
          </Button>
          <Button
            onClick={handleUpload}
            disabled={
              uploading ||  !documentInfo.classification_document ||
              !documentInfo.libele_document ||
              !documentInfo.id_nature_document ||
              !file
            }
            className="ml-2"
          >
            {uploading ? "Téléchargement..." : "Télécharger"}
          </Button>
        </CardFooter>
      </Card>

      {/* Bannière d'information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 flex">
        <AlertCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-800 mb-1">
            Types de fichiers acceptés
          </h4>
          <p className="text-sm text-blue-600">
            Documents (.pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx), Images
            (.jpg, .png), et Archives (.zip, .rar) jusqu'à 25 MB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddDocumentPage;
