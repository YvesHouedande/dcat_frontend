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
import { Save, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MutationError, CreateContratData } from "../../types/interfaces";
import { useContratsApi } from "../../../services/contratService";
import { useCommonApi } from "../../../services/commonService";
import { useEntiteApi } from '../../../services/entiteService';
import { Interlocuteur, Entite } from "../../types/interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import DocumentSheet from "./DocumentSheet";
import { Textarea } from "@/components/ui/textarea";

// Type pour le formulaire de création (sans duree_contrat car calculé automatiquement)
type ContratFormData = CreateContratData;

const NouveauContrat: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { addContrat } = useContratsApi();
  const { fetchPartnersForForms, fetchInterlocuteursByPartenaire } = useCommonApi();
  const { fetchEntites } = useEntiteApi();
  const [partenaires, setPartenaires] = useState<
    Array<{ id: number; nom: string; id_entite?: number }>
  >([]);
  const [interlocuteurs, setInterlocuteurs] = useState<Interlocuteur[]>([]);
  const [selectedEntite, setSelectedEntite] = useState<Entite | null>(null);
  const [entites, setEntites] = useState<Entite[]>([]);
  const [entitesPartenaire, setEntitesPartenaire] = useState<Entite[]>([]);
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
              id_entite: 0,
      nom_interlocuteur: "",
      contact_interlocuteur: "",
      contenu_contrat: "",
      cout: "0",
      modalite_paiement: "",
    };
  });

  // Charger les partenaires et entités
  useEffect(() => {
    const loadData = async () => {
      try {
        const [partenairesData, entitesData] = await Promise.all([
          fetchPartnersForForms(),
          fetchEntites()
        ]);
        setPartenaires(
          partenairesData.data.map((partenaire) => ({
            id: partenaire.id_partenaire,
            nom: partenaire.nom_partenaire,
            id_entite: partenaire.id_entite,
          }))
        );

        // Charger les entités
        setEntites(entitesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };
    loadData();
  }, [fetchPartnersForForms, fetchEntites]);

  // Effet pour charger les interlocuteurs et l'entité quand un partenaire est sélectionné
  useEffect(() => {
    const loadPartenaireDetails = async () => {
      if (!formData.id_partenaire) {
        setInterlocuteurs([]);
        setSelectedEntite(null);
        setEntitesPartenaire([]); // reset
        setFormData(prev => ({ ...prev, id_entite: 0 }));
        return;
      }

      try {
        // Trouver le partenaire dans les données déjà chargées
        const partenaireDetails = partenaires.find(p => p.id === formData.id_partenaire);
        if (!partenaireDetails) {
          console.error("Partenaire non trouvé dans les données chargées");
          return;
        }

        // Filtrer les entités du partenaire sélectionné
        const entitesAssociees = entites.filter(e => e.id_partenaire === partenaireDetails.id);
        setEntitesPartenaire(entitesAssociees);
        
        // Si le partenaire a déjà une entité associée, l'utiliser
        if (partenaireDetails.id_entite) {
          const entiteExistante = entites.find(e => e.id_entite === partenaireDetails.id_entite);
          if (entiteExistante) {
            setSelectedEntite(entiteExistante);
            setFormData(prev => ({ ...prev, id_entite: entiteExistante.id_entite }));
          } else if (entitesAssociees.length === 1) {
            setSelectedEntite(entitesAssociees[0]);
            setFormData(prev => ({ ...prev, id_entite: entitesAssociees[0].id_entite }));
          } else {
            setSelectedEntite(null);
            setFormData(prev => ({ ...prev, id_entite: 0 }));
          }
        } else if (entitesAssociees.length === 1) {
          setSelectedEntite(entitesAssociees[0]);
          setFormData(prev => ({ ...prev, id_entite: entitesAssociees[0].id_entite }));
        } else {
          setSelectedEntite(null);
          setFormData(prev => ({ ...prev, id_entite: 0 }));
        }

        // Charger les interlocuteurs du partenaire
        const interlocuteursData = await fetchInterlocuteursByPartenaire(formData.id_partenaire);
        setInterlocuteurs(interlocuteursData);

        // Si il n'y a qu'un seul interlocuteur, le pré-remplir automatiquement
        if (interlocuteursData.length === 1) {
          const seulInterlocuteur = interlocuteursData[0];
          setFormData(prev => ({
            ...prev,
            nom_interlocuteur: `${seulInterlocuteur.nom_interlocuteur} ${seulInterlocuteur.prenom_interlocuteur}`,
            contact_interlocuteur: seulInterlocuteur.contact_interlocuteur
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            nom_interlocuteur: "",
            contact_interlocuteur: ""
          }));
        }
      } catch (error) {
        setEntitesPartenaire([]);
        setSelectedEntite(null);
        setFormData(prev => ({ ...prev, id_entite: 0 }));
        console.error("Erreur lors du chargement des détails du partenaire:", error);
        toast.error("Erreur lors du chargement des détails du partenaire");
      }
    };

    loadPartenaireDetails();
    // eslint-disable-next-line
  }, [formData.id_partenaire, partenaires, entites, fetchInterlocuteursByPartenaire]);

  const mutation = useMutation((data: CreateContratData) => addContrat(data), {
    onSuccess: (data) => {
      toast.success("Contrat créé avec succès !");
      // Stocker l'ID du contrat créé
      if (data && data.id_contrat) {
        setCreatedContratId(data.id_contrat);
      }
      // Invalider le cache pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ["contrats"] });
      
      // Redirection automatique vers la liste des contrats après 1.5 secondes
      setTimeout(() => {
        navigate("/gestion-administrative/contrats");
      }, 1500);
    },
    onError: (error: MutationError) => {
      toast.error("Erreur lors de la création du contrat", {
        description: error.message || "Une erreur inattendue s'est produite",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Fonction pour gérer la sélection d'un interlocuteur
  const handleInterlocuteurChange = (interlocuteurId: string) => {
    const selectedInterlocuteur = interlocuteurs.find(
      (inter) => inter.id_interlocuteur.toString() === interlocuteurId
    );
    
    if (selectedInterlocuteur) {
      setFormData(prev => ({
        ...prev,
        nom_interlocuteur: `${selectedInterlocuteur.nom_interlocuteur} ${selectedInterlocuteur.prenom_interlocuteur}`,
        contact_interlocuteur: selectedInterlocuteur.contact_interlocuteur
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs obligatoires
    if (
      !formData.nom_contrat ||
      !formData.date_debut ||
      !formData.date_fin ||
      !formData.reference
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Calculer automatiquement la durée du contrat
    let duree_contrat = "";
    if (formData.date_debut && formData.date_fin) {
      const dateDebut = new Date(formData.date_debut);
      const dateFin = new Date(formData.date_fin);

      // Vérifier que la date de fin est après la date de début
      if (dateFin <= dateDebut) {
        toast.error("La date de fin doit être postérieure à la date de début");
        return;
      }

      const diffTime = Math.abs(dateFin.getTime() - dateDebut.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffMonths = Math.ceil(diffDays / 30);
      const diffYears = Math.floor(diffMonths / 12);
      const remainingMonths = diffMonths % 12;

      if (diffYears > 0) {
        duree_contrat = `${diffYears} an${diffYears > 1 ? "s" : ""}`;
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
      id_partenaire: formData.id_partenaire
        ? Number(formData.id_partenaire)
        : undefined,
      id_entite: formData.id_entite, // ID de l'entité déjà mis à jour dans le formulaire
      duree_contrat: duree_contrat, // Durée calculée automatiquement
      nom_interlocuteur: formData.nom_interlocuteur,
      contact_interlocuteur: formData.contact_interlocuteur,
      contenu_contrat: formData.contenu_contrat,
      cout: formData.cout,
      modalite_paiement: formData.modalite_paiement,
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
                      {entitesPartenaire.length > 1 && (
                        <div className="space-y-2">
                          <Label htmlFor="entite">Entité associée <span className="text-red-500">*</span></Label>
                          <Select
                            value={formData.id_entite ? formData.id_entite.toString() : ""}
                            onValueChange={value => {
                              const entite = entitesPartenaire.find(e => e.id_entite === parseInt(value));
                              setSelectedEntite(entite || null);
                              setFormData(prev => ({ ...prev, id_entite: entite ? entite.id_entite : 0 }));
                            }}
                            required
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sélectionner une entité" />
                            </SelectTrigger>
                            <SelectContent>
                              {entitesPartenaire.map(entite => (
                                <SelectItem key={entite.id_entite} value={entite.id_entite.toString()}>
                                  {entite.denomination}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {/* Affichage détaillé de l'entité du partenaire */}
                      {selectedEntite && (
                        <div className="mt-2 p-3 bg-blue-50 border-2 border-blue-400 rounded-lg text-sm shadow-sm">
                          <div className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M3 21v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            Entité associée
                          </div>
                          <div><strong>Dénomination :</strong> {selectedEntite.denomination}</div>
                          {selectedEntite.abreviation_nom && (
                            <div><strong>Abréviation :</strong> {selectedEntite.abreviation_nom}</div>
                          )}
                          {selectedEntite.contact && (
                            <div><strong>Contact :</strong> {selectedEntite.contact}</div>
                          )}
                          {selectedEntite.localisation && (
                            <div><strong>Localisation :</strong> {selectedEntite.localisation}</div>
                          )}
                          {selectedEntite.adresse_postal && (
                            <div><strong>Adresse postale :</strong> {selectedEntite.adresse_postal}</div>
                          )}
                        </div>
                      )}
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
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interlocuteur">
                        Interlocuteur <span className="text-red-500">*</span>
                      </Label>
                      {interlocuteurs.length > 0 ? (
                        interlocuteurs.length === 1 ? (
                          // Si un seul interlocuteur, afficher en lecture seule
                          <div className="p-3 bg-gray-50 border rounded-md">
                            <p className="text-sm text-gray-700">
                              <strong>Interlocuteur unique :</strong> {formData.nom_interlocuteur}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Contact :</strong> {formData.contact_interlocuteur}
                            </p>
                          </div>
                        ) : (
                          // Si plusieurs interlocuteurs, permettre la sélection
                          <Select
                            onValueChange={handleInterlocuteurChange}
                            required
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sélectionner un interlocuteur" />
                            </SelectTrigger>
                            <SelectContent>
                              {interlocuteurs.map((interlocuteur) => (
                                <SelectItem
                                  key={interlocuteur.id_interlocuteur}
                                  value={interlocuteur.id_interlocuteur.toString()}
                                >
                                  {interlocuteur.nom_interlocuteur} {interlocuteur.prenom_interlocuteur} - {interlocuteur.fonction_interlocuteur}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )
                      ) : (
                        // Si aucun interlocuteur, permettre la saisie manuelle
                        <div className="space-y-2">
                          <Input
                            id="nom_interlocuteur"
                            name="nom_interlocuteur"
                            placeholder="Entrez le nom de l'interlocuteur"
                            value={formData.nom_interlocuteur}
                            onChange={handleInputChange}
                            required
                          />
                          <Input
                            id="contact_interlocuteur"
                            name="contact_interlocuteur"
                            placeholder="Entrez le contact de l'interlocuteur"
                            value={formData.contact_interlocuteur}
                            onChange={handleInputChange}
                            required
                            type="tel"
                          />
                        </div>
                      )}
                      
                      {/* Affichage des informations de l'interlocuteur sélectionné */}
                      {formData.nom_interlocuteur && formData.contact_interlocuteur && interlocuteurs.length > 1 && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-sm text-green-800">
                            <strong>Interlocuteur sélectionné :</strong> {formData.nom_interlocuteur}
                          </p>
                          <p className="text-sm text-green-700">
                            <strong>Contact :</strong> {formData.contact_interlocuteur}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="contenu_contrat">
                        contenu du contrat
                      </Label>
                      <Textarea
                        id="contenu_contrat"
                        name="contenu_contrat"
                        placeholder="Entrez le contenu du contrat"
                        value={formData.contenu_contrat}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contenu_contrat: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cout">
                        Coût du contrat <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        required
                        id="cout"
                        name="cout"
                        placeholder="Entrez le coût du contrat"
                        value={formData.cout}
                        onChange={handleInputChange}
                        type="number"
                        min={0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="modalite_paiement">
                        Modalités de paiement
                      </Label>
                      <Input
                        id="modalite_paiement"
                        name="modalite_paiement"
                        placeholder="Entrez les modalités de paiement"
                        value={formData.modalite_paiement}
                        onChange={handleInputChange}
                      />
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
                      <Input
                        type="date"
                        value={typeof formData.date_debut === 'string' ? formData.date_debut : ''}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            date_debut: e.target.value,
                          });
                        }}
                        className="w-full"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date_fin">
                        Date de fin <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={typeof formData.date_fin === 'string' ? formData.date_fin : ''}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            date_fin: e.target.value,
                          });
                        }}
                        className="w-full"
                        required
                      />
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
                              const diffTime = Math.abs(
                                dateFin.getTime() - dateDebut.getTime()
                              );
                              const diffDays = Math.ceil(
                                diffTime / (1000 * 60 * 60 * 24)
                              );
                              const diffMonths = Math.ceil(diffDays / 30);
                              const diffYears = Math.floor(diffMonths / 12);
                              const remainingMonths = diffMonths % 12;

                              let durationText = "";
                              if (diffYears > 0) {
                                durationText += `${diffYears} an${
                                  diffYears > 1 ? "s" : ""
                                }`;
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
                            Sélectionnez les dates de début et de fin pour
                            calculer la durée
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reference">
                        Référence du contrat{" "}
                        <span className="text-red-500">*</span>
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
              onClick={() => navigate("/gestion-administrative/contrats")}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              disabled={mutation.isLoading}
            >
              <Save size={16} className="mr-2" />
              {mutation.isLoading
                ? "Enregistrement..."
                : "Enregistrer le contrat"}
            </Button>
          </div>

          {/* Actions après création */}
          {mutation.isSuccess && createdContratId && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-green-800">
                    Contrat créé avec succès !
                  </h3>
                  <p className="text-green-600">
                    Le contrat a été créé avec succès.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/gestion-administrative/contrats")}
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    Retour à la liste
                  </Button>
                  <Button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/gestion-administrative/contrats/${createdContratId}`
                      )
                    }
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
                queryClient.invalidateQueries({ queryKey: ["contrats"] });
              }}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default NouveauContrat;
