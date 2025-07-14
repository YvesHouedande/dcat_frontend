import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { Calendar as CalendarIcon, Save, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MutationError, CreateContratData } from "../../types/interfaces";
import { addContrat } from "../../../services/contratService";
import { fetchPartners } from "../../../services/partenaireService";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import DocumentSheet from "./DocumentSheet";


// Type pour le formulaire de création (sans duree_contrat car calculé automatiquement)
type ContratFormData = CreateContratData;

const NouveauContrat: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [partenaires, setPartenaires] = useState<Array<{ id: number; nom: string }>>([]);
  const [createdContratId, setCreatedContratId] = useState<number | null>(null);
  const [isDocumentSheetOpen, setIsDocumentSheetOpen] = useState(false);
  const [formData, setFormData] = useState<ContratFormData>(() => {
    // Préremplir le partenaire si passé dans le state
    const partenaireId = location.state?.partenaireId;
    return {
      nom_contrat: "",
      type_de_contrat: "standard",
      date_debut: "",
      date_fin: "",
      reference: "",
      statut: "actif",
      id_partenaire: partenaireId ?? undefined,
    };
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const partenairesData = await fetchPartners();
        setPartenaires(partenairesData.map(partenaire => ({
          id: partenaire.id_partenaire,
          nom: partenaire.nom_partenaire
        })));
      } catch (error) {
        console.error("Erreur lors du chargement des partenaires:", error);
      }
    };
    loadData();
  }, []);

  const mutation = useMutation(
    (data: CreateContratData) => addContrat(data),
    {
      onSuccess: (data) => {
        toast.success('Contrat créé avec succès !');
        // Stocker l'ID du contrat créé
        if (data && data.id_contrat) {
          setCreatedContratId(data.id_contrat);
        }
        // Invalider le cache pour rafraîchir la liste
        queryClient.invalidateQueries({ queryKey: ['contrats'] });
      },
      onError: (error: MutationError) => {
        toast.error('Erreur lors de la création du contrat', {
          description: error.message || 'Une erreur inattendue s\'est produite',
        });
      },
    }
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs obligatoires
    if (!formData.nom_contrat || !formData.date_debut || !formData.date_fin || !formData.reference) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Calculer automatiquement la durée du contrat
    let duree_contrat = "";
    if (formData.date_debut && formData.date_fin) {
      const dateDebut = new Date(formData.date_debut);
      const dateFin = new Date(formData.date_fin);
      
      // Vérifier que la date de fin est après la date de début
      if (dateFin <= dateDebut) {
        toast.error('La date de fin doit être postérieure à la date de début');
        return;
      }
      
      const diffTime = Math.abs(dateFin.getTime() - dateDebut.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffMonths = Math.ceil(diffDays / 30);
      const diffYears = Math.floor(diffMonths / 12);
      const remainingMonths = diffMonths % 12;
      
      if (diffYears > 0) {
        duree_contrat = `${diffYears} an${diffYears > 1 ? 's' : ''}`;
        if (remainingMonths > 0) {
          duree_contrat += ` et ${remainingMonths} mois`;
        }
      } else {
        duree_contrat = `${diffMonths} mois`;
      }
    }

    // Préparation des données à envoyer
    const dataToSend: CreateContratData = {
      nom_contrat: formData.nom_contrat.trim(),
      type_de_contrat: formData.type_de_contrat,
      date_debut: formData.date_debut,
      date_fin: formData.date_fin,
      reference: formData.reference.trim(), // Référence saisie par l'utilisateur
      statut: formData.statut,
      id_partenaire: formData.id_partenaire ? Number(formData.id_partenaire) : undefined,
      duree_contrat: duree_contrat, // Durée calculée automatiquement
    };

    mutation.mutate(dataToSend as CreateContratData);
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
                        value={formData.id_partenaire?.toString()}
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
                            statut: value,
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
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date_fin">Date de fin <span className="text-red-500">*</span></Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date_fin ? (
                              format(new Date(formData.date_fin), "dd MMMM yyyy", {
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
                            selected={formData.date_fin ? new Date(formData.date_fin) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                setFormData({
                                  ...formData,
                                  date_fin: format(date, "yyyy-MM-dd"),
                                });
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Durée du contrat (calculée automatiquement)</Label>
                      <div className="p-3 bg-gray-50 border rounded-md">
                        {formData.date_debut && formData.date_fin ? (
                          <span className="text-sm text-gray-700">
                            {(() => {
                              const dateDebut = new Date(formData.date_debut);
                              const dateFin = new Date(formData.date_fin);
                              const diffTime = Math.abs(dateFin.getTime() - dateDebut.getTime());
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              const diffMonths = Math.ceil(diffDays / 30);
                              const diffYears = Math.floor(diffMonths / 12);
                              const remainingMonths = diffMonths % 12;
                              
                              let durationText = '';
                              if (diffYears > 0) {
                                durationText += `${diffYears} an${diffYears > 1 ? 's' : ''}`;
                                if (remainingMonths > 0) {
                                  durationText += ` et ${remainingMonths} mois`;
                                }
                              } else {
                                durationText += `${diffMonths} mois`;
                              }
                              durationText += ` (${diffDays} jours)`;
                              
                              return durationText;
                            })()}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500 italic">
                            Sélectionnez les dates de début et de fin pour calculer la durée
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reference">
                        Référence du contrat <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="reference"
                        name="reference"
                        placeholder="Entrez la référence du contrat"
                        value={formData.reference}
                        onChange={handleInputChange}
                        required
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
              disabled={mutation.isLoading}
            >
              <Save size={16} className="mr-2" />
              {mutation.isLoading ? "Enregistrement..." : "Enregistrer le contrat"}
            </Button>
          </div>

          {/* Actions après création */}
          {mutation.isSuccess && createdContratId && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-green-800">Contrat créé avec succès !</h3>
                  <p className="text-green-600">Le contrat a été créé avec succès.</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/administration/contrats")}
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    Retour à la liste
                  </Button>
                  <Button
                    type="button"
                    onClick={() => navigate(`/administration/contrats/${createdContratId}/details`)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <FileText size={16} className="mr-2" />
                    Voir le contrat
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* DocumentSheet */}
          {createdContratId && (
            <DocumentSheet
              contratId={createdContratId}
              isOpen={isDocumentSheetOpen}
              onOpenChange={setIsDocumentSheetOpen}
              onDocumentAdded={() => {
                // Rafraîchir la liste des contrats si nécessaire
                queryClient.invalidateQueries({ queryKey: ['contrats'] });
              }}
            />
          )}
        </form>


      </div>
    </div>
  );
};

export default NouveauContrat;
