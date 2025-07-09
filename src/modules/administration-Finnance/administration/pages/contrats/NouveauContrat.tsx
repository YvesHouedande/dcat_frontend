import React, { useState, useEffect } from "react";
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
import { Contrat, EmployeDocument } from "../../types/interfaces";
import { addContrat, fetchNaturesDocument } from "../../../services/contratService"; // Importation du nouveau service
import { fetchPartners } from "../../../services/partenaireService"; // Importation du service existant

const NouveauContrat: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partenaires, setPartenaires] = useState<Array<{ id: number; nom: string }>>([]);
  const [naturesDocument, setNaturesDocument] = useState<Array<{ id_nature_document: number; libelle_td: string }>>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // États du formulaire
  const [formData, setFormData] = useState<Omit<Contrat, 'id_contrat'>>({
    nom_contrat: "",
    duree_Contrat: "",
    date_debut: "",
    date_fin: "",
    Reference: "",
    type_de_contrat: "standard", // Valeur par défaut
    status: "actif", // Valeur par défaut
    id_partenaire: undefined,
  });

  const [documentData, setDocumentData] = useState<EmployeDocument>({
    id_documents: 0,
    libelle_document: "",
    date_document: new Date().toISOString().split('T')[0], // Date du jour
    lien_document: "",
    classification_document: "",
    id_contrat: 0,
    id_nature_document: 0,
  });

  // Chargement des partenaires et des natures de document depuis l'API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Chargement des partenaires
        const partenairesData = await fetchPartners();
        setPartenaires(partenairesData.map(partenaire => ({
          id: partenaire.id_partenaire,
          nom: partenaire.nom_partenaire
        })));
        
        // Chargement des natures de document
        const naturesDocumentData = await fetchNaturesDocument();
        setNaturesDocument(naturesDocumentData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    loadData();
  }, []);

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
      const file = e.target.files[0];
      setUploadedFile(file);
      
      // Créer une URL locale pour prévisualisation si nécessaire
      const objectUrl = URL.createObjectURL(file);
      setDocumentData({
        ...documentData,
        lien_document: objectUrl,
      });
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
  
    try {
      // Préparation des données à envoyer
      const contratToSubmit = {
        ...formData,
        date_debut: new Date(formData.date_debut).toISOString().split('T')[0],
        date_fin: new Date(formData.date_fin).toISOString().split('T')[0],
      };
  
      // Appel à l'API pour ajouter le contrat
      const newContrat = await addContrat(contratToSubmit, uploadedFile || undefined);
      
      // Utilisation de la réponse
      console.log('Contrat créé avec ID:', newContrat.id_contrat);
      
      setSubmitSuccess(true);
      
      // Rediriger vers la page de détail du nouveau contrat
      setTimeout(() => {
        navigate(`/administration/contrats/${newContrat.id_contrat}`);
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de l'ajout du contrat:", error);
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue lors de l'enregistrement du contrat.");
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Message de succès */}
        {submitSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">Contrat enregistré avec succès!</span>
          </div>
        )}

        {/* Message d'erreur */}
        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{submitError}</span>
          </div>
        )}

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
                      <Label htmlFor="duree_Contrat">
                        Durée du contrat <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="duree_Contrat"
                        name="duree_Contrat"
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
                        value={formData.duree_Contrat}
                        required
                      />
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
                            selected={formData.date_debut ? new Date(formData.date_debut) : undefined}
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
                            selected={formData.date_fin ? new Date(formData.date_fin) : undefined}
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

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="type_de_contrat">
                        Type de contrat <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            type_de_contrat: value,
                          })
                        }
                        defaultValue="standard"
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="cadre">Contrat cadre</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">
                        Statut <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            status: value,
                          })
                        }
                        defaultValue="actif"
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="actif">Actif</SelectItem>
                          <SelectItem value="inactif">Inactif</SelectItem>
                          <SelectItem value="en_attente">En attente</SelectItem>
                          <SelectItem value="expire">Expiré</SelectItem>
                        </SelectContent>
                      </Select>
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
                        value={documentData.libelle_document}
                        onChange={(e) =>
                          setDocumentData({
                            ...documentData,
                            libelle_document: e.target.value,
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
                      <Label htmlFor="Reference">Notes ou commentaires</Label>
                      <Textarea
                        id="Reference"
                        name="Reference"
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