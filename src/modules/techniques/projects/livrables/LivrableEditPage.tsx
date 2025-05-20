import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Calendar as CalendarIcon, Save, Upload } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import Layout from "@/components/Layout";

// Define the Document interface
interface Document {
  id_document: number;
  libele_document: string;
  date_document: string;
  lien_document: string;
  id_nature_document?: number;
}

// Define the Livrable interface
interface Livrable {
  id_livrable: number;
  libelle_livrable: string;
  date: string;
  realisations: string;
  reserves: string;
  approbation: "en attente" | "approuvé" | "rejeté" | "révisions requises";
  recommandation: string;
  id_projet: number | null;
  documents: Document[];
}

const EditLivrable: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sample projects for dropdown
  const projets = [
    { id: 1, nom: "Projet Alpha" },
    { id: 2, nom: "Projet Beta" },
    // Add more projects as needed
  ];

  // Form state
  const [formData, setFormData] = useState<Livrable>({
    id_livrable: 0,
    libelle_livrable: "",
    date: "",
    realisations: "",
    reserves: "",
    approbation: "en attente",
    recommandation: "",
    id_projet: null,
    documents: [],
  });

  // Fetch existing livrable data
  useEffect(() => {
    const fetchLivrable = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        const response = await fetch(`/api/livrables/${id}`);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des données");
        }
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Impossible de charger les données du livrable");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchLivrable();
    }
  }, [id]);

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

  // Handle file changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newDocument: Document = {
        id_document: formData.documents.length + 1,
        libele_document: e.target.files[0].name,
        lien_document: URL.createObjectURL(e.target.files[0]),
        date_document: format(new Date(), "yyyy-MM-dd"),
      };
      setFormData({
        ...formData,
        documents: [...formData.documents, newDocument],
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate project selection
      if (formData.id_projet === null) {
        toast.error("Veuillez sélectionner un projet");
        setIsSubmitting(false);
        return;
      }

      // Replace with actual API call
      const response = await fetch(`/api/livrables/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }

      toast.success("Le livrable a été mis à jour avec succès");

      // Redirect after showing success message
      setTimeout(() => {
        navigate("/technique/livrable");
      }, 1500);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Impossible de mettre à jour le livrable");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 p-6 min-h-screen">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Modifier le livrable
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
                          value={formData.id_projet?.toString() || ""}
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
                                setFormData({
                                  ...formData,
                                  date: date ? format(date, "yyyy-MM-dd") : "",
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
                          value={formData.approbation}
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

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fichier">
                          Fichier du livrable (PDF)
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="fichier"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="w-full"
                            onChange={handleFileChange}
                          />
                          <Button type="button" variant="outline" size="icon">
                            <Upload size={16} />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                          Formats acceptés: PDF, DOC, DOCX (max. 10 MB)
                        </p>
                      </div>

                      {/* Affichage des documents existants */}
                      {formData.documents.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium mb-2">Documents attachés:</h3>
                          <ul className="space-y-2">
                            {formData.documents.map((doc) => (
                              <li key={doc.id_document} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                <span>{doc.libele_document}</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      documents: formData.documents.filter(
                                        (d) => d.id_document !== doc.id_document
                                      ),
                                    });
                                  }}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  Supprimer
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
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
                {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditLivrable;
