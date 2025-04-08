// AddDocumentPage.tsx
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

// Fonction utilitaire pour fusionner les classes conditionnellement
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

interface FileWithPreview {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

interface FormErrors {
  category?: string;
  title?: string;
}
const AddDocumentPage: React.FC = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormErrors>({});
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentInfo, setDocumentInfo] = useState({
    title: "",
    category: "",
    status: "private",
    description: "",
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
    addFiles(droppedFiles);
  };

  // Gestion de la sélection de fichiers via le bouton
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
      e.target.value = ""; // Réinitialiser l'input pour permettre la sélection du même fichier
    }
  };

  // Modifiez la fonction addFiles pour gérer le titre par défaut
  const addFiles = (newFiles: File[]) => {
    const updatedFiles = newFiles.map((file) => ({
      id: `${file.name}-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));

    setFiles((prev) => {
      const newFileList = [...prev, ...updatedFiles];

      // Si c'est le premier fichier et qu'aucun titre n'est défini
      if (prev.length === 0 && !documentInfo.title) {
        const firstName = updatedFiles[0].name.split(".")[0]; // Enlève l'extension
        syncTitles(firstName);
      }

      return newFileList;
    });
  };
  // Supprimer un fichier
  const removeFile = (id: string) => {
    setFiles((prev) => {
      const updatedFiles = prev.filter((file) => file.id !== id);

      // Libérer les URLs des aperçus
      prev.forEach((file) => {
        if (file.id === id && file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });

      return updatedFiles;
    });
  };

  // Gérer les changements d'informations du document
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDocumentInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Simuler le téléchargement
  const handleUpload = () => {
    if (files.length === 0) return;
    const newErrors: FormErrors = {};

    if (!documentInfo.category) {
      newErrors.category = "La catégorie est obligatoire";
    }

    if (!documentInfo.title) {
      newErrors.title = "Le titre est obligatoire";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Validation de la catégorie
    if (!documentInfo.category) {
      setErrors({ category: "La catégorie est obligatoire" });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulation de progression d'upload
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          // Simuler une latence pour l'achèvement
          setTimeout(() => {
            setUploading(false);
            // Rediriger vers la page d'annuaire
            navigate("/administration/documents");
          }, 500);

          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  // Ajoutez cette fonction pour synchroniser les titres
  const syncTitles = (title: string) => {
    setDocumentInfo((prev) => ({
      ...prev,
      title,
      // Si la description est vide, on peut aussi la remplir
      description: prev.description || `Document ${title}`,
    }));
  };

  // Fonction pour déterminer l'icône du type de fichier
  const getFileIcon = (file: FileWithPreview) => {
    if (file.type?.startsWith("image/") && file.preview) {
      return (
        <div className="w-12 h-12 rounded overflow-hidden">
          <img
            src={file.preview}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    return <File className="h-12 w-12 text-blue-500" />;
  };
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Ajouter un document</h1>

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
              <TabsTrigger value="upload">Téléchargement</TabsTrigger>
              <TabsTrigger value="info">Informations</TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              {/* Zone de drag & drop */}
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
                  Glissez et déposez vos fichiers ici
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
                  Sélectionner des fichiers
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple
                />
              </div>

              {/* Liste des fichiers sélectionnés */}
              {files.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Fichiers sélectionnés</h3>
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center p-3 border rounded-lg bg-gray-50"
                      >
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
                            removeFile(file.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="info">
              <div className="space-y-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="title">Titre du document*</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Entrez un titre"
                    value={documentInfo.title}
                    onChange={handleInfoChange}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="category">Catégorie*</Label>
                  <Select
                    value={documentInfo.category}
                    onValueChange={(value) => {
                      setDocumentInfo((prev) => ({ ...prev, category: value }));
                      setErrors((prev) => ({ ...prev, category: undefined }));
                    }}
                  >
                    <SelectTrigger
                      className={errors.category ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rapports">Rapports</SelectItem>
                      <SelectItem value="documentation">
                        Documentation
                      </SelectItem>
                      <SelectItem value="legal">Légal</SelectItem>
                      <SelectItem value="strategie">Stratégie</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500">{errors.category}</p>
                  )}
                </div>

                <div className="grid w-full items-center gap-2">
                  <Label>Statut de visibilité</Label>
                  <RadioGroup
                    value={documentInfo.status}
                    onValueChange={(value) =>
                      setDocumentInfo((prev) => ({ ...prev, status: value }))
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

                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Décrivez brièvement ce document"
                    value={documentInfo.description}
                    onChange={handleInfoChange}
                  />
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
            disabled={files.length === 0 || uploading || !documentInfo.category}
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
