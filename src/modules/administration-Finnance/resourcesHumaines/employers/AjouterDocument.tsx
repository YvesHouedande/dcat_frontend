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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, File, X } from "lucide-react";
import { EmployeDocument } from "../../administration/types/interfaces";
import { useContratsApi } from "../../services/documentService";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

// Fonction utilitaire pour fusionner les classes conditionnellement
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};
interface Errors {
  [key: string]: string | undefined;
}

const AjouterDocument: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState<Errors>({});
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { uploadDocument } = useContratsApi();
  const [documentInfo, setDocumentInfo] = useState<Partial<EmployeDocument>>({
    libelle_document: "",
    etat_document: "private",
    id_employes: id ? Number(id) : undefined,
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
    setDocumentInfo((prev) => ({
      ...prev,
      libelle_document: newFile.name,
    }));

    // Si aucun libellé n'est défini, utiliser le nom du fichier
    if (!documentInfo.libelle_document) {
      const fileName = newFile.name.split(".")[0]; // Enlever l'extension
      syncDocumentNames(fileName);
    }
  };

  // Supprimer le fichier
  const removeFile = () => {
    setFile(null);
    setDocumentInfo((prev) => ({
      ...prev,
      libelle_document: "",
    }));
  };

  // Gérer les changements d'informations du document

  // Simuler l'envoi du document au backend
  const handleUpload = async () => {
    const newErrors: Errors = {};



    if (!documentInfo.libelle_document) {
      newErrors.libele_document = "Le libellé est obligatoire";
    }

    // Vérifier si nous avons un fichier
    if (!file) {
      newErrors.file = "Veuillez sélectionner un fichier";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setUploadProgress(0);
    // Préparation des données à envoyer au backend

    try {
      if (!file || !documentInfo.id_employes) {
        throw new Error("Fichier ou ID employé manquant");
      }

      await uploadDocument(
        Number(documentInfo.id_employes),
        file,
        documentInfo.libelle_document || "Document employé"
      );
      
      console.log(JSON.stringify(documentInfo));
      toast.success("Document ajouté avec succès");
      navigate(-1);
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      toast.error("Erreur lors de l'ajout du document: " + (error instanceof Error ? error.message : "Erreur inconnue"));
    }
    setUploading(false);
    setUploadProgress(100);
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

          <div className="grid w-full items-center gap-2 my-4">
            <Label>État du document</Label>
            <RadioGroup
              value={documentInfo.etat_document || "private"}
              onValueChange={(value) =>
                setDocumentInfo((prev) => ({ ...prev, etat_document: value }))
              }
              className="flex flex-row space-x-4 "
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

          <div className="space-y-4">
            <div className="grid w-full items-center gap-2 my-4">
              <Label htmlFor="libele_document">Libellé du document*</Label>
              <Input
                id="libele_document"
                name="libele_document"
                placeholder="Entrez un libellé"
                value={documentInfo.libelle_document || ""}
                onChange={(e) =>
                  setDocumentInfo((prev) => ({
                    ...prev,
                    libelle_document: e.target.value,
                  }))
                }
                className={errors.libele_document ? "border-red-500" : ""}
              />
              {errors.libele_document && (
                <p className="text-sm text-red-500">{errors.libele_document}</p>
              )}
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
          </div>

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
              uploading ||
              !documentInfo.libelle_document ||
              !file
            }
            className="ml-2"
          >
            {uploading ? "Téléchargement..." : "Télécharger"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AjouterDocument;
