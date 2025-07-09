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
import { ArrowLeft, Upload, Save, X, FileText } from "lucide-react";
import { DemandeDocument, NatureDocument } from "../administration/types/interfaces";
import {
  getAllNatureDocuments,
  getDocumentsByNature,
  updateDocument,
} from "../services/finance_comptaService";

// Définir le type du formulaire pour inclure classification_document


const EditFinanceCompta: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<DemandeDocument>>({
    libelle_document: "",
    lien_document: "",
    date_document: "",
    id_nature_document: 0,
    classification_document: "",
  });
  
  const [natures, setNatures] = useState<NatureDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [originalDocument, setOriginalDocument] = useState<DemandeDocument | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        // 1. Charger toutes les natures de document
        const naturesData = await getAllNatureDocuments();
        setNatures(naturesData);

        // 2. Déterminer la nature actuelle (finance ou compta)
        let currentNature: NatureDocument | undefined;
        if (type === "finance") {
          currentNature = naturesData.find(n => n.libelle && /finance|financier/i.test(n.libelle));
        } else if (type === "comptabilite") {
          currentNature = naturesData.find(n => n.libelle && /comptabilite|comptable|compta/i.test(n.libelle));
        }

        if (!currentNature) {
          toast.error("Type de document inconnu.");
          setLoading(false);
          return;
        }

        // 3. Charger les documents de cette nature
        const documents = await getDocumentsByNature(currentNature.id_nature_document);
        
        // 4. Trouver le document spécifique par ID
        const documentData = documents.find(doc => doc.id_documents === parseInt(id));

        if (!documentData) {
          toast.error("Document non trouvé.");
          setLoading(false);
          return;
        }
        
        setOriginalDocument(documentData);
        
        // Pré-remplir le formulaire
        setFormData({
          libelle_document: documentData.libelle_document || "",
          lien_document: documentData.lien_document || "",
          date_document: documentData.date_document ? documentData.date_document.split('T')[0] : "",
          id_nature_document: documentData.id_nature_document || 0,
          classification_document: documentData.classification_document || "",
        });
        
        setFileName(documentData.lien_document || "");
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Impossible de charger les données du document");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, type]);

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
    setFileName(originalDocument?.lien_document || "");
    setFormData(prev => ({
      ...prev,
      lien_document: originalDocument?.lien_document || ""
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!(formData.libelle_document ?? "").trim()) {
      toast.error("Le titre du document est requis");
      return;
    }

    if (!formData.id_nature_document) {
      toast.error("Veuillez sélectionner un type de document");
      return;
    }

    setSaving(true);

    try {
      // Toujours utiliser FormData
      const documentPayload = {
        ...formData,
        libelle_document: formData.libelle_document ?? "",
        id_nature_document: formData.id_nature_document ?? 0,
        document: selectedFile ?? null,
      };

      await updateDocument(parseInt(id!), documentPayload);

      toast.success("Document modifié avec succès");

      // Rediriger vers la liste
      navigate(`/administration/finance-compta/${type}`);
    } catch (error) {
      console.error("Erreur lors de la modification du document:", error);
      toast.error("Impossible de modifier le document");
    } finally {
      setSaving(false);
    }
  };

  const getTitle = () => {
    return type === "finance" ? "Modifier le Document Finance" : "Modifier le Document Comptabilité";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/administration/finance-compta/${type}/${id}/details`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">{getTitle()}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Modifier les informations</CardTitle>
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
                  value={(formData.id_nature_document ?? 0).toString()}
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

              {/* Fichier actuel */}
              <div className="space-y-2">
                <Label>Fichier actuel</Label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium">{originalDocument?.lien_document}</span>
                  </div>
                </div>
              </div>

              {/* Upload de nouveau fichier */}
              <div className="space-y-2">
                <Label htmlFor="file">Nouveau fichier (optionnel)</Label>
                {!selectedFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('file-input')?.click()}
                      >
                        Sélectionner un nouveau fichier
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Laissez vide pour conserver le fichier actuel
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
                  onClick={() => navigate(`/administration/finance-compta/${type}/${id}/details`)}
                  disabled={saving}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save size={16} />
                  )}
                  {saving ? "Modification en cours..." : "Enregistrer les modifications"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditFinanceCompta; 