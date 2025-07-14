import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Calendar as CalendarIcon, Save, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Contrat, MutationError, UpdateContratData } from "../../types/interfaces";
import { fetchContratById, updateContrat } from "../../../services/contratService";
import { fetchPartners } from "../../../services/partenaireService";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import DocumentSheet from './DocumentSheet';


// Type pour le formulaire d'édition (sans duree_contrat car calculé automatiquement)
type ContratFormData = Omit<Contrat, 'id_contrat' | 'duree_contrat'>;

const EditerContrat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [partenaires, setPartenaires] = useState<Array<{ id: number; nom: string }>>([]);
  const [formData, setFormData] = useState<ContratFormData>({
    nom_contrat: "",
    type_de_contrat: "standard",
    date_debut: "",
    date_fin: "",
    reference: "",
    statut: "actif",
    id_partenaire: undefined,
  });

  // Récupérer le contrat à éditer
  const { data: contrat, isLoading, isError } = useQuery({
    queryKey: ['contrat', id],
    queryFn: () => fetchContratById(id!),
    enabled: !!id,
  });

  // Pré-remplir le formulaire quand le contrat est chargé
  useEffect(() => {
    if (contrat) {
      setFormData({
        nom_contrat: contrat.nom_contrat,
        type_de_contrat: contrat.type_de_contrat,
        date_debut: contrat.date_debut,
        date_fin: contrat.date_fin,
        reference: contrat.reference,
        statut: contrat.statut,
        id_partenaire: contrat.id_partenaire,
      });
    }
  }, [contrat]);

  // Récupérer les partenaires
  useEffect(() => {
    const loadData = async () => {
      try {
        const partenairesData = await fetchPartners();
        setPartenaires(partenairesData.map((partenaire: { id_partenaire: number; nom_partenaire: string }) => ({
          id: partenaire.id_partenaire,
          nom: partenaire.nom_partenaire
        })));
      } catch (error) {
        console.error("Erreur lors du chargement des partenaires:", error);
      }
    };
    loadData();
  }, []);

  // Fonction utilitaire pour calculer la durée du contrat
  const calculerDureeContrat = (dateDebutStr: string, dateFinStr: string): string => {
    if (!dateDebutStr || !dateFinStr) return "";
    const dateDebut = new Date(dateDebutStr);
    const dateFin = new Date(dateFinStr);
    if (isNaN(dateDebut.getTime()) || isNaN(dateFin.getTime()) || dateFin <= dateDebut) return "";
    const diffTime = dateFin.getTime() - dateDebut.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30.4375); // moyenne mois
    const diffYears = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;
    let duree = "";
    if (diffYears > 0) {
      duree = `${diffYears} an${diffYears > 1 ? 's' : ''}`;
      if (remainingMonths > 0) {
        duree += ` et ${remainingMonths} mois`;
      }
    } else if (diffMonths > 0) {
      duree = `${diffMonths} mois`;
    } else {
      duree = `${diffDays} jours`;
    }
    return duree;
  };

  // Mutation pour la mise à jour
  const mutation = useMutation(
    (data: UpdateContratData) => updateContrat(id!, data),
    {
      onSuccess: () => {
        toast.success('Contrat modifié avec succès !');
        queryClient.invalidateQueries({ queryKey: ['contrats'] });
        queryClient.invalidateQueries({ queryKey: ['contrat', id] });
        navigate('/administration/contrats');
      },
      onError: (error: MutationError) => {
        toast.error('Erreur lors de la modification du contrat', {
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

    // Calculer automatiquement la durée du contrat
    let duree_contrat = "";
    if (formData.date_debut && formData.date_fin) {
      duree_contrat = calculerDureeContrat(formData.date_debut, formData.date_fin);
      if (!duree_contrat) {
        toast.error('La date de fin doit être postérieure à la date de début');
        return;
      }
    } else {
      toast.error('Veuillez renseigner les dates de début et de fin');
      return;
    }

    // Préparation des données à envoyer
    const dataToSend: UpdateContratData = {
      nom_contrat: formData.nom_contrat,
      type_de_contrat: formData.type_de_contrat,
      date_debut: formData.date_debut,
      date_fin: formData.date_fin,
      reference: formData.reference,
      statut: formData.statut,
      id_partenaire: formData.id_partenaire ? Number(formData.id_partenaire) : undefined,
      duree_contrat: duree_contrat, // Durée calculée automatiquement
    };

    mutation.mutate(dataToSend);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen text-lg text-gray-600 animate-pulse">Chargement du contrat...</div>;
  }
  if (isError) {
    return <div className="flex flex-col items-center justify-center min-h-screen text-red-600">Erreur lors du chargement du contrat.</div>;
  }

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Modifier le contrat
            </h1>
            <DocumentSheet
              contratId={parseInt(id!)}
              onDocumentAdded={() => {
                queryClient.invalidateQueries({ queryKey: ['contrat', id] });
              }}
              trigger={
                <Button
                  type="button"
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Plus size={16} className="mr-2" />
                  Ajouter un document
                </Button>
              }
            />
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
                        value={formData.id_partenaire?.toString()}
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
                        value={formData.type_de_contrat}
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
                        value={formData.statut}
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
                            {calculerDureeContrat(formData.date_debut, formData.date_fin)}
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
                        value={formData.reference ?? ""}
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
              {mutation.isLoading ? "Modification..." : "Modifier le contrat"}
            </Button>
          </div>
        </form>


      </div>
    </div>
  );
};

export default EditerContrat;