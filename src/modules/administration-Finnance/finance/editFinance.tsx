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
import { Save, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const EditFinance: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // États du formulaire
  const [formData, setFormData] = useState({
    id_document: 0,
    libele_document: "",
    lien_document: "",
    etat_document: "private",
    id_nature_document: "",
    date_document: new Date().toISOString(),
    notes: "",
    fichier: null as File | null,
  });

  // Liste des natures de document
  const naturesDocument = [
    { id: "1", nom: "Contrat" },
    { id: "2", nom: "Facture" },
    { id: "3", nom: "Rapport" },
    { id: "4", nom: "CV" },
    { id: "5", nom: "Procédure" },
  ];

  // Chargement des données existantes
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        // Simulation de données existantes
        const mockDocument = {
          id_document: parseInt(id || "0"),
          libele_document: "Facture client XYZ",
          lien_document: "/documents/facture_xyz.pdf",
          etat_document: "private",
          id_nature_document: "2",
          date_document: "2023-05-15T10:30:00Z",
          notes: "Document important à conserver",
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
      setFormData({
        ...formData,
        fichier: e.target.files[0],
        libele_document: e.target.files[0].name.split(".")[0] // Mettre à jour le libellé avec le nom du fichier
      });
    }
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation des champs obligatoires
    if (!formData.libele_document || !formData.id_nature_document) {
      setIsSubmitting(false);
      return;
    }

    // Simuler une soumission API
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Rediriger après affichage du message de succès
      setTimeout(() => {
        navigate("/administration/finance");
      }, 1500);
    }, 1000);
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
              Modifier un document financier
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
                        value={formData.id_nature_document}
                        onValueChange={(value) =>
                          setFormData({ ...formData, id_nature_document: value })
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
                              value={nature.id}
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
                        value={new Date(formData.date_document).toLocaleDateString()}
                        disabled
                      />
                      <p className="text-xs text-gray-500 italic">
                        La date sera mise à jour automatiquement lors de l'enregistrement
                      </p>
                    </div>
                  </div>
                </div>

                {/* Document */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Fichier du document
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fichier">
                        Fichier du document <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="fichier"
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                          className="w-full"
                          onChange={handleFileChange}
                          required={!formData.lien_document}
                        />
                        <Button type="button" variant="outline" size="icon">
                          <Upload size={16} />
                        </Button>
                      </div>
                      {formData.lien_document && (
                        <p className="text-sm text-gray-600 mt-2">
                          Fichier actuel: {formData.lien_document.split('/').pop()}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Formats acceptés: PDF, DOC, XLS, JPG, PNG (max. 25 MB)
                      </p>
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
                        value={formData.notes}
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

export default EditFinance;