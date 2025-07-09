import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Upload, Save, X } from "lucide-react";
import { NatureDocument } from "../administration/types/interfaces";
import { getAllNatureDocuments, createDocument } from "../services/finance_comptaService";

const AddFinanceCompta: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    libelle_document: "",
    lien_document: "",
    date_document: "",
    id_nature_document: 0,
    classification_document: "",
    etat_document: ""
  });
  
  const [natures, setNatures] = useState<NatureDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const fetchNatures = async () => {
      try {
        const naturesData = await getAllNatureDocuments();
        setNatures(naturesData);
        
        // Pré-sélectionner la nature selon le type (finance ou comptabilite)
        if (type === "finance") {
          const financeNature = naturesData.find(n =>
            n.libelle && (
              n.libelle.toLowerCase().includes('finance') ||
              n.libelle.toLowerCase().includes('financier')
            )
          );
          if (financeNature) {
            setFormData(prev => ({ ...prev, id_nature_document: financeNature.id_nature_document }));
          }
        } else if (type === "comptabilite") {
          const comptabiliteNature = naturesData.find(n =>
            n.libelle && (
              n.libelle.toLowerCase().includes('comptabilite') ||
              n.libelle.toLowerCase().includes('comptable') ||
              n.libelle.toLowerCase().includes('compta')
            )
          );
          if (comptabiliteNature) {
            setFormData(prev => ({ ...prev, id_nature_document: comptabiliteNature.id_nature_document }));
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des types de documents:", error);
        toast.error("Impossible de charger les types de documents");
      }
    };

    fetchNatures();
  }, [type]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setFormData(prev => ({
        ...prev,
        lien_document: file.name
      }));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileName("");
    setFormData(prev => ({
      ...prev,
      lien_document: ""
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.libelle_document.trim()) {
      toast.error("Le titre du document est requis");
      return;
    }

    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    if (!formData.id_nature_document) {
      toast.error("Veuillez sélectionner un type de document");
      return;
    }

    setLoading(true);

    try {
      // Créer un FormData pour l'upload de fichier
      const formDataToSend = new FormData();
      formDataToSend.append('libelle_document', formData.libelle_document);
      formDataToSend.append('date_document', formData.date_document);
      formDataToSend.append('id_nature_document', formData.id_nature_document.toString());
      formDataToSend.append('classification_document', formData.classification_document || '');
      formDataToSend.append('etat_document', formData.etat_document || '');
      formDataToSend.append('document', selectedFile);

      await createDocument(formDataToSend);

      toast.success("Document ajouté avec succès");

      // Rediriger vers la liste
      navigate(`/administration/finance-compta/${type}`);
    } catch (error: unknown) {
      console.error("Erreur lors de l'ajout du document:", error);
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        console.error("Réponse backend:", err.response?.data);
        toast.error(err.response?.data?.message || "Impossible d'ajouter le document");
      } else {
        toast.error("Impossible d'ajouter le document");
      }
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    return type === "finance" ? "Ajouter un Document Finance" : "Ajouter un Document Comptabilité";
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/administration/finance-compta/${type}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">{getTitle()}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations du document</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Titre du document */}
              <div className="space-y-2">
                <Label htmlFor="libelle_document">Titre du document *</Label>
                <Input
                  id="libelle_document"
                  value={formData.libelle_document}
                  onChange={(e) => handleInputChange("libelle_document", e.target.value)}
                  placeholder="Entrez le titre du document"
                  required
                />
              </div>

              {/* Type de document */}
              <div className="space-y-2">
                <Label htmlFor="nature">Type de document *</Label>
                <Select
                  value={formData.id_nature_document.toString()}
                  onValueChange={(value) => handleInputChange("id_nature_document", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {natures.map((nature) => (
                      <SelectItem key={nature.id_nature_document} value={nature.id_nature_document.toString()}>
                        {nature.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date du document */}
              <div className="space-y-2">
                <Label htmlFor="date_document">Date du document</Label>
                <Input
                  id="date_document"
                  type="date"
                  value={formData.date_document}
                  onChange={(e) => handleInputChange("date_document", e.target.value)}
                />
              </div>

              {/* Classification du document */}
              <div className="space-y-2">
                <Label htmlFor="classification_document">Classification</Label>
                <Input
                  id="classification_document"
                  value={formData.classification_document}
                  onChange={(e) => handleInputChange("classification_document", e.target.value)}
                  placeholder="Ex: confidentiel, public, interne..."
                />
              </div>

              {/* État du document */}
              <div className="space-y-2">
                <Label htmlFor="etat_document">État du document</Label>
                <Input
                  id="etat_document"
                  value={formData.etat_document}
                  onChange={(e) => handleInputChange("etat_document", e.target.value)}
                  placeholder="Ex: actif, archivé..."
                />
              </div>

              {/* Upload de fichier */}
              <div className="space-y-2">
                <Label htmlFor="file">Fichier *</Label>
                {!selectedFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('file-input')?.click()}
                      >
                        Sélectionner un fichier
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      PDF, DOCX, XLSX, PPTX ou images acceptés
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Upload className="h-5 w-5 text-gray-500" />
                        <span className="text-sm font-medium">{fileName}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                )}
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png"
                />
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/administration/finance-compta/${type}`)}
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save size={16} />
                  )}
                  {loading ? "Ajout en cours..." : "Ajouter le document"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddFinanceCompta; 