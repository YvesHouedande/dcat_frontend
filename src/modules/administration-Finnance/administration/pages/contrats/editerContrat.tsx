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
import {
  Contrat,
  MutationError,
  UpdateContratData,
} from "../../types/interfaces";
import { useContratsApi } from "../../../services/contratService";
import { useCommonApi } from "../../../services/commonService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import DocumentSheet from "./DocumentSheet";
import { Textarea } from "@/components/ui/textarea";
import { Entite, Interlocuteur } from "../../types/interfaces";
import { useEntiteApi } from '../../../services/entiteService';

// Type pour le formulaire d'édition (sans duree_contrat car calculé automatiquement)
type ContratFormData = Omit<Contrat, "id_contrat" | "duree_contrat">;

const EditerContrat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [partenaires, setPartenaires] = useState<
    Array<{ id: number; nom: string; id_entite?: number }>
  >([]);
  const [entites, setEntites] = useState<Entite[]>([]);
  const [interlocuteurs, setInterlocuteurs] = useState<Interlocuteur[]>([]);
  const { fetchContratById, updateContrat } = useContratsApi();
  const { fetchPartnersForForms, fetchInterlocuteursByPartenaire } = useCommonApi();
  const { fetchEntites } = useEntiteApi();
  const [formData, setFormData] = useState<ContratFormData>({
    nom_contrat: "",
    type_de_contrat: "standard",
    date_debut: "",
    date_fin: "",
    reference: "",
    statut: "actif",
    id_partenaire: undefined,
    id_entite: 0,
    nom_interlocuteur: "",
    contact_interlocuteur: "",
    contenu_contrat: "",
    cout: "0",
    modalite_paiement: "",
  });
  const [entitesPartenaire, setEntitesPartenaire] = useState<Entite[]>([]);

  // Récupérer le contrat à éditer
  const {
    data: contrat,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["contrat", id],
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
        id_entite: contrat.id_entite || 0,
        nom_interlocuteur: contrat.nom_interlocuteur,
        contact_interlocuteur: contrat.contact_interlocuteur,
        contenu_contrat: contrat.contenu_contrat,
        cout: contrat.cout,
        modalite_paiement: contrat.modalite_paiement,
      });
    }
  }, [contrat]);

  // Charger les partenaires
  useEffect(() => {
    const loadPartenaires = async () => {
      try {
        const partenairesData = await fetchPartnersForForms();
        setPartenaires(
          partenairesData.data.map((p) => ({
            id: p.id_partenaire,
            nom: p.nom_partenaire,
            id_entite: p.id_entite,
          }))
        );
      } catch (error) {
        console.error("Erreur lors du chargement des partenaires:", error);
      }
    };
    loadPartenaires();
  }, [fetchPartnersForForms]);

  // Récupérer les entités
  useEffect(() => {
    const loadEntites = async () => {
      try {
        const entitesData = await fetchEntites();
        setEntites(entitesData);
      } catch (error) {
        console.error("Erreur lors du chargement des entités:", error);
      }
    };
    loadEntites();
  }, [fetchEntites]);

  // Charger les détails du partenaire et de l'entité quand le partenaire change
  useEffect(() => {
    const loadPartenaireDetails = async () => {
      if (!formData.id_partenaire) {
        setInterlocuteurs([]);
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
            setFormData(prev => ({ ...prev, id_entite: entiteExistante.id_entite }));
          } else if (entitesAssociees.length === 1) {
            setFormData(prev => ({ ...prev, id_entite: entitesAssociees[0].id_entite }));
          } else {
            // Si on édite, garder l'entité déjà sélectionnée si elle existe
            const entiteExistante = entitesAssociees.find(e => e.id_entite === formData.id_entite);
            setFormData(prev => ({ ...prev, id_entite: entiteExistante ? entiteExistante.id_entite : 0 }));
          }
        } else if (entitesAssociees.length === 1) {
          setFormData(prev => ({ ...prev, id_entite: entitesAssociees[0].id_entite }));
        } else {
          // Si on édite, garder l'entité déjà sélectionnée si elle existe
          const entiteExistante = entitesAssociees.find(e => e.id_entite === formData.id_entite);
          setFormData(prev => ({ ...prev, id_entite: entiteExistante ? entiteExistante.id_entite : 0 }));
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
          setFormData(prev => ({ ...prev, nom_interlocuteur: "", contact_interlocuteur: "" }));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des détails du partenaire:", error);
        setEntitesPartenaire([]);
        setFormData(prev => ({ ...prev, id_entite: 0 }));
      }
    };
    loadPartenaireDetails();
  }, [formData.id_partenaire, entites, partenaires, fetchInterlocuteursByPartenaire]);

  // Fonction utilitaire pour calculer la durée du contrat
  const calculerDureeContrat = (
    dateDebutStr: string,
    dateFinStr: string
  ): string => {
    if (!dateDebutStr || !dateFinStr) return "";
    const dateDebut = new Date(dateDebutStr);
    const dateFin = new Date(dateFinStr);
    if (
      isNaN(dateDebut.getTime()) ||
      isNaN(dateFin.getTime()) ||
      dateFin <= dateDebut
    )
      return "";
    const diffTime = dateFin.getTime() - dateDebut.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30.4375); // moyenne mois
    const diffYears = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;
    let duree = "";
    if (diffYears > 0) {
      duree = `${diffYears} an${diffYears > 1 ? "s" : ""}`;
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
        toast.success("Contrat modifié avec succès !");
        queryClient.invalidateQueries({ queryKey: ["contrats"] });
        queryClient.invalidateQueries({ queryKey: ["contrat", id] });
        navigate("/gestion-administrative/contrats");
      },
      onError: (error: MutationError) => {
        toast.error("Erreur lors de la modification du contrat", {
          description: error.message || "Une erreur inattendue s'est produite",
        });
      },
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInterlocuteurChange = (interlocuteurId: string) => {
    const interlocuteur = interlocuteurs.find(i => i.id_interlocuteur.toString() === interlocuteurId);
    if (interlocuteur) {
      setFormData(prev => ({
        ...prev,
        nom_interlocuteur: interlocuteur.nom_interlocuteur,
        contact_interlocuteur: interlocuteur.contact_interlocuteur
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculer automatiquement la durée du contrat
    let duree_contrat = "";
    if (formData.date_debut && formData.date_fin) {
      duree_contrat = calculerDureeContrat(
        formData.date_debut,
        formData.date_fin
      );
      if (!duree_contrat) {
        toast.error("La date de fin doit être postérieure à la date de début");
        return;
      }
    } else {
      toast.error("Veuillez renseigner les dates de début et de fin");
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
      id_partenaire: formData.id_partenaire
        ? Number(formData.id_partenaire)
        : undefined,
      // Ne pas envoyer id_entite si sa valeur n'est pas valide
      ...(formData.id_entite && formData.id_entite > 0 && { id_entite: formData.id_entite }),
      nom_interlocuteur: formData.nom_interlocuteur || "",
      contact_interlocuteur: formData.contact_interlocuteur || "",
      contenu_contrat: formData.contenu_contrat || "",
      cout: formData.cout || "0",
      modalite_paiement: formData.modalite_paiement || "",
      duree_contrat: duree_contrat, // Durée calculée automatiquement
    };

    // Nettoyer les données en supprimant les valeurs undefined et null
    const cleanData = Object.fromEntries(
      Object.entries(dataToSend).filter(([key, value]) => {
        if (value === undefined || value === null) {
          console.log(`Suppression du champ ${key} avec valeur:`, value);
          return false;
        }
        // Ne pas supprimer les chaînes vides pour certains champs
        if (value === "" && ["nom_interlocuteur", "contact_interlocuteur", "contenu_contrat", "modalite_paiement"].includes(key)) {
          return true;
        }
        return true;
      })
    );

    // Log pour déboguer
    console.log("Données originales:", dataToSend);
    console.log("Données nettoyées:", cleanData);
    console.log("formData complet:", formData);

    mutation.mutate(cleanData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600 animate-pulse">
        Chargement du contrat...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        Erreur lors du chargement du contrat.
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
              Modifier le contrat
            </h1>
            <DocumentSheet
              contratId={parseInt(id!)}
              onDocumentAdded={() => {
                queryClient.invalidateQueries({ queryKey: ["contrat", id] });
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

                    {/* Affichage de l'entité associée */}
                    {entitesPartenaire.length > 1 && (
                      <div className="mt-2 p-3 bg-blue-50 border-2 border-blue-400 rounded-lg text-sm shadow-sm">
                        <div className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M3 21v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Entité associée
                        </div>
                        <div>
                          <Label htmlFor="entite">Entité associée <span className="text-red-500">*</span></Label>
                          <Select
                            value={formData.id_entite ? formData.id_entite.toString() : ""}
                            onValueChange={value => {
                              const entite = entitesPartenaire.find(e => e.id_entite === parseInt(value));
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
                      </div>
                    )}

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
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nom_interlocuteur">
                        Nom de l'interlocuteur{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      {interlocuteurs.length > 1 ? (
                        <Select
                          onValueChange={handleInterlocuteurChange}
                          value={formData.nom_interlocuteur ? interlocuteurs.find(i => i.nom_interlocuteur === formData.nom_interlocuteur)?.id_interlocuteur.toString() || "" : ""}
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
                                {interlocuteur.nom_interlocuteur} {interlocuteur.prenom_interlocuteur} - {interlocuteur.contact_interlocuteur}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id="nom_interlocuteur"
                          name="nom_interlocuteur"
                          placeholder="Entrez le nom de l'interlocuteur"
                          value={formData.nom_interlocuteur}
                          onChange={handleInputChange}
                          required
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_interlocuteur">
                        Contact de l'interlocuteur{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="contact_interlocuteur"
                        name="contact_interlocuteur"
                        placeholder="Entrez le contact de l'interlocuteur"
                        value={formData.contact_interlocuteur}
                        onChange={handleInputChange}
                        required
                        type="tel"
                        readOnly={interlocuteurs.length > 1}
                      />
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
                              format(
                                new Date(formData.date_debut),
                                "dd MMMM yyyy",
                                {
                                  locale: fr,
                                }
                              )
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              formData.date_debut
                                ? new Date(formData.date_debut)
                                : undefined
                            }
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
                      <Label htmlFor="date_fin">
                        Date de fin <span className="text-red-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date_fin ? (
                              format(
                                new Date(formData.date_fin),
                                "dd MMMM yyyy",
                                {
                                  locale: fr,
                                }
                              )
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              formData.date_fin
                                ? new Date(formData.date_fin)
                                : undefined
                            }
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
                            {calculerDureeContrat(
                              formData.date_debut,
                              formData.date_fin
                            )}
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
              {mutation.isLoading ? "Modification..." : "Modifier le contrat"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditerContrat;
