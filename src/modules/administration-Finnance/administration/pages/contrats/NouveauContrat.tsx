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
import { Contrat, Document } from "../../types/interfaces";

// Interfaces


const NouveauContrat: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États du formulaire
  const [formData, setFormData] = useState<Contrat>({
    id_contrat: 0, // Changé de string vide à 0
    nom_contrat: "",
    duree_Contrat: "",
    date_debut: "",
    date_fin: "",
    Reference: "",
    type_de_contrat: "",
    status: "",
    id_partenaire: undefined,
  });

  const [documentData, setDocumentData] = useState<Document>({
    id_document: 0,
    libele_document: "",
    date_document: "",
    lien_document: "",
    id_contrat: undefined, // Changé de string vide à undefined
    id_nature_document: undefined,
  });

  // Liste des partenaires et des natures de document
  const partenaires = [
    { id: 1, nom: "Systèmes IT Pro" },
    { id: 2, nom: "TechSupport Plus" },
    // Ajoutez d'autres partenaires ici
  ];

  const naturesDocument = [
    { id_nature_document: 1, libelle_td: "Contrat Principal" },
    { id_nature_document: 2, libelle_td: "Annexe" },
    // Ajoutez d'autres natures de document ici
  ];

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
      setDocumentData({
        ...documentData,
        lien_document: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuler une soumission API
    setTimeout(() => {
      setIsSubmitting(false);

      // Rediriger après affichage du message de succès
      setTimeout(() => {
        navigate("/administration/contrats");
      }, 1500);
    }, 1000);
  };

  // Calculer automatiquement la date de fin en fonction de la date de début et de la durée
  const updateEndDate = (duree: string, startDate: Date) => {
    if (!startDate) return;

    const durationMatch = duree.match(/(\d+)/);
    if (!durationMatch) return;

    const months = parseInt(durationMatch[1]);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);

    setFormData({
      ...formData,
      date_fin: format(endDate, "yyyy-MM-dd"),
    });
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Ajouter un nouveau contrat
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
                      <Label htmlFor="nom_contrat">
                        Nom du contrat <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nom_contrat"
                        name="nom_contrat"
                        placeholder="Entrez le nom du contrat"
                        value={formData.nom_contrat}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="partenaire">
                        Partenaire <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            id_partenaire: parseInt(value),
                          })
                        }
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un partenaire" />
                        </SelectTrigger>
                        <SelectContent>
                          {partenaires.map((partenaire) => (
                            <SelectItem
                              key={partenaire.id}
                              value={partenaire.id.toString()}
                            >
                              {partenaire.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duree">
                        Durée du contrat <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            duree_Contrat: e.target.value,
                          });
                          if (formData.date_debut) {
                            updateEndDate(
                              e.target.value,
                              new Date(formData.date_debut)
                            );
                          }
                        }}
                        type="number"
                        required
                      ></Input>
                      <p className="text-xs text-gray-500 italic">
                        La durée du contrat doit s'exprimer en mois
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date_debut">
                        Date de début <span className="text-red-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date_debut ? (
                              format(new Date(formData.date_debut), "dd MMMM yyyy", {
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
                            selected={new Date(formData.date_debut)}
                            onSelect={(date) => {
                              if (date) {
                                setFormData({
                                  ...formData,
                                  date_debut: format(date, "yyyy-MM-dd"),
                                });
                                if (formData.duree_Contrat) {
                                  updateEndDate(formData.duree_Contrat, date);
                                }
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_fin">Date de fin</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            disabled
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date_fin ? (
                              format(new Date(formData.date_fin), "dd MMMM yyyy", {
                                locale: fr,
                              })
                            ) : (
                              <span>Calculée automatiquement</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(formData.date_fin)}
                            onSelect={(date) =>
                              date &&
                              setFormData({
                                ...formData,
                                date_fin: format(date, "yyyy-MM-dd"),
                              })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-gray-500 italic">
                        La date de fin est calculée à partir de la date de début
                        et de la durée
                      </p>
                    </div>
                  </div>
                </div>

                {/* Document */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Document du contrat
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
                        value={documentData.libele_document}
                        onChange={(e) =>
                          setDocumentData({
                            ...documentData,
                            libele_document: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="id_nature_document">
                        Nature du document <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setDocumentData({
                            ...documentData,
                            id_nature_document: parseInt(value),
                          })
                        }
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner la nature du document" />
                        </SelectTrigger>
                        <SelectContent>
                          {naturesDocument.map((nature) => (
                            <SelectItem
                              key={nature.id_nature_document}
                              value={nature.id_nature_document.toString()}
                            >
                              {nature.libelle_td}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fichier">
                        Fichier du contrat (PDF){" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="fichier"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="w-full"
                          onChange={handleFileChange}
                          required
                        />
                        <Button type="button" variant="outline" size="icon">
                          <Upload size={16} />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Formats acceptés: PDF, DOC, DOCX (max. 10 MB)
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
                        placeholder="Ajoutez des notes ou commentaires sur ce contrat..."
                        rows={4}
                        value={formData.Reference || ""}
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
              onClick={() => navigate("/administration/contrats")}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              disabled={isSubmitting}
            >
              <Save size={16} className="mr-2" />
              {isSubmitting ? "Enregistrement..." : "Enregistrer le contrat"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NouveauContrat;