import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, UploadCloud, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Document } from "../../types/interfaces";

const EditDocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // États du formulaire
  const [formData, setFormData] = useState<Document>({
    id_document: 0,
    libele_document: "",
    classification_document: "",
    lien_document: "",
    etat_document: "private",
    id_nature_document: 0,
    date_document: new Date().toISOString(),
  });

  // Liste des natures de document
  const naturesDocument = [
    { id: 1, nom: "Contrat" },
    { id: 2, nom: "Facture" },
    { id: 3, nom: "Rapport" },
    { id: 4, nom: "CV" },
    { id: 5, nom: "Procédure" },
  ];

  // Chargement des données existantes
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        // Simulation de données existantes
        const mockDocument = {
          id_document: parseInt(id || "0"),
          libele_document: "Rapport annuel 2024",
          classification_document: "confidentiel",
          lien_document: "https://example.com/documents/rapport-annuel-2024.pdf",
          etat_document: "private",
          id_nature_document: 3,
          date_document: "2024-05-10T14:20:00",
        };

        setFormData({
          ...formData,
          ...mockDocument
        });
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement du document", error);
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  // Gérer les changements des champs de texte
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Gérer le changement de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Mettre à jour le libellé avec le nom du fichier (sans extension)
      const fileName = selectedFile.name.split(".")[0];
      setFormData({
        ...formData,
        libele_document: fileName,
        lien_document: selectedFile.name
      });

      // Créer un aperçu pour les images/PDF
      if (selectedFile.type.startsWith("image/")) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else if (selectedFile.type === "application/pdf") {
        setFilePreview("/pdf-icon.png"); // Remplacez par votre icône PDF
      } else {
        setFilePreview("/file-icon.png"); // Icône générique pour autres fichiers
      }
    }
  };

  // Supprimer le fichier sélectionné
  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    setFormData({
      ...formData,
      lien_document: ""
    });
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.libele_document || !formData.id_nature_document) {
      setIsSubmitting(false);
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      // Créer FormData si un fichier est uploadé
      const formDataToSend = new FormData();
      
      // Ajouter les champs du formulaire
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      // Ajouter le fichier s'il existe
      if (file) {
        formDataToSend.append("file", file);
      }

      // Ici vous feriez normalement un appel API
      // const response = await fetch(`/api/documents/${id}`, {
      //   method: "PUT",
      //   body: formDataToSend
      // });

      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirection après succès
      navigate("/administration/documents");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Modifier un document
            </h1>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Informations de base */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Informations générales
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="libele_document">
                        Libellé du document <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="libele_document"
                        name="libele_document"
                        placeholder="Entrez le libellé du document"
                        value={formData.libele_document}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="id_nature_document">
                        Nature du document <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.id_nature_document?.toString()}
                        onValueChange={(value) =>
                          setFormData({ ...formData, id_nature_document: parseInt(value) })
                        }
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner une nature" />
                        </SelectTrigger>
                        <SelectContent>
                          {naturesDocument.map((nature) => (
                            <SelectItem
                              key={nature.id}
                              value={nature.id.toString()}
                            >
                              {nature.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="etat_document">
                        État du document <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.etat_document}
                        onValueChange={(value) =>
                          setFormData({ ...formData, etat_document: value })
                        }
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un état" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Privé</SelectItem>
                          <SelectItem value="draft">Brouillon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date_document">Date du document</Label>
                      <Input
                        id="date_document"
                        name="date_document"
                        type="date"
                        value={new Date(formData.date_document || "").toISOString().split('T')[0]}
                        onChange={handleInputChange}
                        disabled
                      />
                      <p className="text-xs text-gray-500 italic">
                        La date sera mise à jour automatiquement lors de l'enregistrement
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section Upload de fichier */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Fichier du document
                  </h2>

                  <div className="space-y-4">
                    {/* Afficher le fichier existant ou uploadé */}
                    {formData.lien_document && !file && (
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-md bg-blue-100 text-blue-600">
                            <UploadCloud size={20} />
                          </div>
                          <span className="text-sm font-medium">
                            {formData.lien_document}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Afficher le nouveau fichier sélectionné */}
                    {file && (
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                          {filePreview && (
                            <img 
                              src={filePreview} 
                              alt="Preview" 
                              className="h-10 w-10 object-cover rounded-md"
                            />
                          )}
                          <span className="text-sm font-medium">
                            {file.name}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveFile}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    )}

                    {/* Zone d'upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <UploadCloud className="h-8 w-8 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <Label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                          >
                            <span>Téléverser un fichier</span>
                            <Input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              onChange={handleFileChange}
                              className="sr-only"
                            />
                          </Label>
                          <p className="pl-1">ou glisser-déposer</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, XLSX, JPG, PNG jusqu'à 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Informations complémentaires
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes ou commentaires</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Ajoutez des notes ou commentaires sur ce document..."
                        rows={4}
                        value={formData.notes || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="mt-6 flex space-x-2 justify-end">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => navigate(-1)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              disabled={isSubmitting}
            >
              <Save size={16} className="mr-2" />
              {isSubmitting ? "Enregistrement en cours..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDocumentPage;