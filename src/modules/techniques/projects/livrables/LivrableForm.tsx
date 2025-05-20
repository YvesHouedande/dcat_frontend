import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Calendar as CalendarIcon, Save, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";

// Define the Document interface
interface Document {
  id_document: number;
  libele_document: string;
  date_document: string;
  lien_document: string;
  id_nature_document?: number;
}

// Define nature de document options
const natureDocuments = [
  { id: 1, libelle: "Rapport" },
  { id: 2, libelle: "Cahier des charges" },
  { id: 3, libelle: "Plan" },
  { id: 4, libelle: "Document technique" },
];

// Define the Livrable interface
interface Livrable {
  id_livrable: number;
  libelle_livrable: string;
  date: string;
  realisations: string;
  reserves: string;
  approbation: "en attente" | "approuvé" | "rejeté" | "révisions requises";
  recommandation: string;
  id_projet: number;
  documents: Document[];
}

const NouveauLivrable: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Livrable>({
    id_livrable: 0,
    libelle_livrable: "",
    date: "",
    realisations: "",
    reserves: "",
    approbation: "en attente",
    recommandation: "",
    id_projet: 0,
    documents: [],
  });

  const [documentData, setDocumentData] = useState<Document>({
    id_document: 0,
    libele_document: "",
    date_document: format(new Date(), "yyyy-MM-dd"),
    lien_document: "",
    id_nature_document: undefined,
  });

  // Sample projects for dropdown
  const projets = [
    { id: 1, nom: "Projet Alpha" },
    { id: 2, nom: "Projet Beta" },
    // Add more projects as needed
  ];

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle document input changes
  const handleDocumentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setDocumentData({
      ...documentData,
      [name]: value,
    });
  };

  // Handle document date change
  const handleDocumentDateChange = (date: Date | undefined) => {
    if (date) {
      setDocumentData({
        ...documentData,
        date_document: format(date, "yyyy-MM-dd"),
      });
    }
  };

  // Handle nature document selection
  const handleNatureDocumentChange = (value: string) => {
    setDocumentData({
      ...documentData,
      id_nature_document: parseInt(value),
    });
  };

  // Handle file changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentData({
        ...documentData,
        id_document: formData.documents.length + 1,
        libele_document: e.target.files[0].name,
        lien_document: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // Add document to the form
  const addDocument = () => {
    if (documentData.libele_document && documentData.lien_document) {
      setFormData({
        ...formData,
        documents: [...formData.documents, { ...documentData }],
      });

      // Reset document form
      setDocumentData({
        id_document: 0,
        libele_document: "",
        date_document: format(new Date(), "yyyy-MM-dd"),
        lien_document: "",
        id_nature_document: undefined,
      });
    }
  };

  // Remove document from the form
  const removeDocument = (id: number) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter(doc => doc.id_document !== id),
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      console.log("Submitting form data:", formData);
      setIsSubmitting(false);

      // Redirect after showing success message
      setTimeout(() => {
        navigate("/technique/livrable");
      }, 1500);
    }, 1000);
  };

  return (
    <Layout>
      <div className="bg-gray-50 p-6 min-h-screen">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Ajouter un nouveau livrable
              </h1>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* General Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                      Informations générales
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="libelle_livrable">
                          Libellé du livrable <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="libelle_livrable"
                          name="libelle_livrable"
                          placeholder="Entrez le libellé du livrable"
                          value={formData.libelle_livrable}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="id_projet">
                          Projet <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              id_projet: parseInt(value),
                            })
                          }
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner un projet" />
                          </SelectTrigger>
                          <SelectContent>
                            {projets.map((projet) => (
                              <SelectItem
                                key={projet.id}
                                value={projet.id.toString()}
                              >
                                {projet.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date">
                          Date <span className="text-red-500">*</span>
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.date ? (
                                format(new Date(formData.date), "dd MMMM yyyy", {
                                  locale: fr,
                                })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.date ? new Date(formData.date) : undefined}
                              onSelect={(date) =>
                                date &&
                                setFormData({
                                  ...formData,
                                  date: format(date, "yyyy-MM-dd"),
                                })
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>

                  {/* Realisations and Reserves */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                      Réalisation et Réserves
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="realisations">
                          Réalisations <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="realisations"
                          name="realisations"
                          placeholder="Décrivez les réalisations..."
                          rows={4}
                          value={formData.realisations}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reserves">
                          Réserves <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="reserves"
                          name="reserves"
                          placeholder="Décrivez les réserves..."
                          rows={4}
                          value={formData.reserves}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Approval and Recommendation */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                      Approbation et Recommandation
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="approbation">
                          Approbation <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              approbation: value as
                                | "en attente"
                                | "approuvé"
                                | "rejeté"
                                | "révisions requises",
                            })
                          }
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner le statut d'approbation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en attente">En attente</SelectItem>
                            <SelectItem value="approuvé">Approuvé</SelectItem>
                            <SelectItem value="rejeté">Rejeté</SelectItem>
                            <SelectItem value="révisions requises">
                              Révisions requises
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="recommandation">
                          Recommandation <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="recommandation"
                          name="recommandation"
                          placeholder="Ajoutez des recommandations..."
                          rows={4}
                          value={formData.recommandation}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                      Documents
                    </h2>

                    {/* Existing Documents List */}
                    {formData.documents.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">
                          Documents ajoutés:
                        </h3>
                        <div className="space-y-2">
                          {formData.documents.map((doc) => (
                            <div
                              key={doc.id_document}
                              className="flex items-center justify-between p-3 border rounded-md bg-gray-50"
                            >
                              <div>
                                <p className="font-medium">{doc.libele_document}</p>
                                <div className="flex space-x-2 text-xs text-gray-500">
                                  <span>
                                    Date: {format(new Date(doc.date_document), "dd/MM/yyyy")}
                                  </span>
                                  {doc.id_nature_document && (
                                    <Badge variant="outline" className="ml-2">
                                      {natureDocuments.find(n => n.id === doc.id_nature_document)?.libelle || "Nature non définie"}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDocument(doc.id_document)}
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 border p-4 rounded-md">
                      <h3 className="text-sm font-medium text-gray-600">
                        Ajouter un document
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="fichier">
                          Fichier
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="fichier"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="w-full"
                            onChange={handleFileChange}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Formats acceptés: PDF, DOC, DOCX (max. 10 MB)
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="document_libele">
                            Libellé du document
                          </Label>
                          <Input
                            id="document_libele"
                            name="libele_document"
                            placeholder="Nom du document"
                            value={documentData.libele_document}
                            onChange={handleDocumentInputChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="nature_document">
                            Nature du document
                          </Label>
                          <Select
                            onValueChange={handleNatureDocumentChange}
                            value={documentData.id_nature_document?.toString()}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sélectionner la nature" />
                            </SelectTrigger>
                            <SelectContent>
                              {natureDocuments.map((nature) => (
                                <SelectItem
                                  key={nature.id}
                                  value={nature.id.toString()}
                                >
                                  {nature.libelle}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="document_date">
                          Date du document
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {documentData.date_document ? (
                                format(new Date(documentData.date_document), "dd MMMM yyyy", {
                                  locale: fr,
                                })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={documentData.date_document ? new Date(documentData.date_document) : undefined}
                              onSelect={handleDocumentDateChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addDocument}
                          disabled={!documentData.libele_document || !documentData.lien_document}
                          className="mt-2"
                        >
                          <Plus size={16} className="mr-2" />
                          Ajouter ce document
                        </Button>
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
                onClick={() => navigate("/technique/livrable")}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                disabled={isSubmitting}
              >
                <Save size={16} className="mr-2" />
                {isSubmitting ? "Enregistrement..." : "Enregistrer le livrable"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NouveauLivrable;
