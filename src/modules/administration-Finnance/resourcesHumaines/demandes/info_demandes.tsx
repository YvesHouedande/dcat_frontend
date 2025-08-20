import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Plus,
  FileText,
  BadgeCheck,
  XCircle,
  Clock,
  Edit,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  useDemande,
  useEmploye,
  useAddDocumentToDemande,
  useDeleteDocumentFromDemande,
  useApprouverDemande,
  useRefuserDemande,
} from "../../hooks/useDemandes";
import { DemandeDocument, NatureDocument } from "../../administration/types/interfaces";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { DossierCombobox } from "@/components/combobox/DossierCombobox";
import {
  SelectContent,
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { useDemandesApi } from "../../services/demandeService";

// Clés de requête pour TanStack Query
const natureKeys = {
  all: ["natures"] as const,
  lists: () => [...natureKeys.all, "list"] as const,
  list: () => [...natureKeys.lists()] as const,
  details: () => [...natureKeys.all, "detail"] as const,
  detail: (id: number) => [...natureKeys.details(), id] as const,
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "En attente":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-medium">
          <Clock size={14} /> En attente
        </span>
      );
    case "Approuvé":
    case "Approuvée":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-medium">
          <BadgeCheck size={14} /> Approuvée
        </span>
      );
    case "Refusé":
    case "Refusée":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 text-red-800 text-xs font-medium">
          <XCircle size={14} /> Refusée
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs font-medium">
          {status}
        </span>
      );
  }
};

const InfoDemandePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getAllNatureDocuments, createNature: createNatureApi, updateNature: updateNatureApi, deleteNature: deleteNatureApi } = useDemandesApi();
  
  const {
    data: demande,
    isLoading: loadingDemande,
    error,
  } = useDemande(Number(id));
  const { data: employe, isLoading: loadingEmploye } = useEmploye(
    demande?.id_employes ?? 0
  );

  // Gestion des documents
  const [file, setFile] = React.useState<File | null>(null);
  const [libelle, setLibelle] = React.useState("");
  // const [classification, setClassification] = React.useState("");
  const [natureId, setNatureId] = React.useState<string | undefined>(undefined);
  const [etatDocument, setEtatDocument] = React.useState("Actif");
  const addDocument = useAddDocumentToDemande();
  const deleteDocument = useDeleteDocumentFromDemande();
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [id_dossier, setIdDossier] = React.useState<number | undefined>(undefined);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  // États pour la création de nature
  const [newNatureLibelle, setNewNatureLibelle] = React.useState("");
  
  // États pour la modification de nature
  const [editingNature, setEditingNature] = React.useState<{ id: number; libelle: string } | null>(null);
  const [editNatureLibelle, setEditNatureLibelle] = React.useState("");

  const approuverDemande = useApprouverDemande();
  const refuserDemande = useRefuserDemande();

  // Hook pour récupérer les natures
  const { data: natures, isLoading: naturesLoading, error: naturesError } = useQuery({
    queryKey: natureKeys.list(),
    queryFn: async () => {
      console.log("🔍 Récupération des natures...");
      const result = await getAllNatureDocuments();
      console.log("📋 Natures récupérées:", result);
      return result;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
    retryDelay: 1000,
  });

  // Hook pour créer une nature
  const createNature = useMutation({
    mutationFn: (libelle: string) => createNatureApi(libelle),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: natureKeys.list(),
      });
      toast.success("Nature créée avec succès");
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la création de la nature:", error);
      toast.error(`Erreur lors de la création de la nature: ${error.message}`);
    },
  });

  // Hook pour mettre à jour une nature
  const updateNature = useMutation({
    mutationFn: ({ id, libelle }: { id: number; libelle: string }) => updateNatureApi(id, libelle),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: natureKeys.list(),
      });
      toast.success("Nature mise à jour avec succès");
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la mise à jour de la nature:", error);
      toast.error(`Erreur lors de la mise à jour de la nature: ${error.message}`);
    },
  });

  // Hook pour supprimer une nature
  const deleteNature = useMutation({
    mutationFn: (id: number) => deleteNatureApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: natureKeys.list(),
      });
      toast.success("Nature supprimée avec succès");
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la suppression de la nature:", error);
      const errorMessage = error.message;
      
      if (errorMessage.includes("utilisée") || errorMessage.includes("utilisé")) {
        toast.info(errorMessage, {
          style: {
            background: '#dbeafe',
            color: '#1e40af',
            border: '1px solid #3b82f6',
          },
          icon: 'ℹ️',
        });
      } else {
        toast.error(errorMessage);
      }
    },
  });

  // Handler pour créer une nouvelle nature
  const handleCreateNature = async () => {
    if (!newNatureLibelle.trim()) return;
    
    try {
      const newNature = await createNature.mutateAsync(newNatureLibelle);
      // Gérer le cas où l'API retourne id_nature_document
      const natureId = (newNature as NatureDocument).id_nature_document;
      if (natureId) {
        setNatureId(natureId.toString());
      }
      setNewNatureLibelle("");
    } catch (error) {
      console.error("Erreur lors de la création de la nature:", error);
    }
  };

  // Handler pour modifier une nature
  const handleUpdateNature = async () => {
    if (!editingNature || !editNatureLibelle.trim()) return;
    
    try {
      await updateNature.mutateAsync({
        id: editingNature.id,
        libelle: editNatureLibelle.trim()
      });
      setEditingNature(null);
      setEditNatureLibelle("");
    } catch (error) {
      console.error("Erreur lors de la modification de la nature:", error);
    }
  };

  // Handler pour supprimer une nature
  const handleDeleteNature = async (natureId: number) => {
    try {
      await deleteNature.mutateAsync(natureId);
    } catch (error) {
      console.error("Erreur lors de la suppression de la nature:", error);
    }
  };

  // Handler pour commencer l'édition d'une nature
  const handleStartEdit = (nature: NatureDocument) => {
    const id = nature.id_nature_document;
    if (id) {
      setEditingNature({ id, libelle: nature.libelle });
      setEditNatureLibelle(nature.libelle);
    }
  };

  // Handlers d'action (à adapter selon hooks réels)
  const handleApprove = () => {
    if (!demande) return;
    approuverDemande.mutate(
      { id: demande.id_demandes },
      {
        onSuccess: (updatedDemande) => {
          // Mise à jour instantanée du cache pour UX fluide
          queryClient.setQueryData(
            ["demandes", "detail", demande.id_demandes],
            updatedDemande
          );
          queryClient.invalidateQueries([
            "demandes",
            "detail",
            demande.id_demandes,
          ]);
        },
      }
    );
  };
  const handleReject = () => {
    if (!demande) return;
    refuserDemande.mutate(
      { id: demande.id_demandes },
      {
        onSuccess: (updatedDemande) => {
          queryClient.setQueryData(
            ["demandes", "detail", demande.id_demandes],
            updatedDemande
          );
          queryClient.invalidateQueries([
            "demandes",
            "detail",
            demande.id_demandes,
          ]);
        },
      }
    );
  };

  // Déterminer la base URL pour les fichiers statiques (media, documents, etc.)
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL as string;
  const STATIC_FILES_BASE_URL = API_BASE_URL.endsWith("/api")
    ? API_BASE_URL.slice(0, -4)
    : API_BASE_URL;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    if (
      !file ||
      !libelle ||
      !demande
    ) {
      setUploadError("Le fichier et le libellé sont obligatoires.");
      return;
    }

    try {
      const result = await addDocument.mutateAsync({
        demandeId: demande.id_demandes,
        documentData: {
          file: file,
          libelle_document: libelle,
          id_nature_document: natureId ? parseInt(natureId) : 1, // Utiliser la nature sélectionnée ou par défaut
          id_dossier: id_dossier, // Ajout de l'ID du dossier sélectionné
          etat_document: etatDocument, // Ajout de l'état du document
        },
      });
      console.log("Document ajouté avec succès:", result);
      setFile(null);
      setLibelle("");
      // setClassification("");
      setNatureId(undefined);
      setIdDossier(undefined);
      setEtatDocument("Actif");
      toast.success("Document ajouté avec succès");
      
      // Fermer le sheet après succès
      setIsSheetOpen(false);
      
      // Invalider le cache pour rafraîchir les données
      queryClient.invalidateQueries(["demandes", "detail", demande.id_demandes]);
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      toast.error("Erreur lors de l'ajout du document");
    }
  };

  if (loadingDemande || loadingEmploye) {
    return (
      <div className="flex justify-center items-center h-96">Chargement...</div>
    );
  }
  if (error || !demande) {
    return (
      <div className="text-red-500 text-center py-8">
        Erreur : {String(error) || "Demande introuvable"}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-2 md:px-6">
      {/* Bouton retour */}
      <div className="mb-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Retour à la liste
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne principale (2/3) */}
        <div className="md:col-span-2 space-y-6">
          <Card className="relative">
            {/* Badge statut en haut à droite */}
            <div className="absolute top-6 right-6">
              {getStatusBadge(demande.status)}
            </div>
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Demande #{demande.id_demandes}
                </CardTitle>
                <CardDescription className="text-gray-500">
                  {demande.type_demande} - Créée le{" "}
                  {/* date de création non disponible, à remplacer par '-' */} -
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-0">
              {/* Grille d'infos */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                <div>
                  <div className="text-xs text-gray-500 font-medium mb-1">
                    TYPE DE DEMANDE
                  </div>
                  <div className="font-semibold text-gray-800">
                    {demande.type_demande}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium mb-1">
                    DURÉE
                  </div>
                  <div className="font-semibold text-gray-800">
                    {demande.duree || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium mb-1">
                    DATE DE DÉBUT
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon size={16} className="text-blue-500" />
                    {demande.date_absence
                      ? format(new Date(demande.date_absence), "dd MMMM yyyy", {
                          locale: fr,
                        })
                      : "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium mb-1">
                    DATE DE FIN
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon size={16} className="text-blue-500" />
                    {demande.date_retour
                      ? format(new Date(demande.date_retour), "dd MMMM yyyy", {
                          locale: fr,
                        })
                      : "-"}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                <div>
                  <div className="text-xs text-gray-500 font-medium mb-1">
                    DATE D'ABSENCE
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon size={16} className="text-blue-500" />
                    {demande.date_absence
                      ? format(new Date(demande.date_absence), "dd MMMM yyyy", {
                          locale: fr,
                        })
                      : "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium mb-1">
                    DATE DE RETOUR
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon size={16} className="text-blue-500" />
                    {demande.date_retour
                      ? format(new Date(demande.date_retour), "dd MMMM yyyy", {
                          locale: fr,
                        })
                      : "-"}
                  </div>
                </div>
              </div>
              {/* Motif */}
              <div>
                <div className="text-xs text-gray-500 font-medium mb-1">
                  MOTIF
                </div>
                <div className="bg-gray-50 rounded p-2 text-sm">
                  {demande.motif || "-"}
                </div>
              </div>
              {/* Documents joints */}
              <div>
                <div className="text-xs text-gray-500 font-medium mb-2">
                  DOCUMENTS JOINTS
                </div>
                <div className="flex justify-between items-center mb-2">
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Plus size={16} /> Ajouter un document
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle>Ajouter un document</SheetTitle>
                        <SheetDescription>
                          Remplissez les informations du document à associer à
                          cette demande.
                        </SheetDescription>
                      </SheetHeader>
                      <form
                        onSubmit={handleAddDocument}
                        className="space-y-3 mt-4 px-2"
                      >
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Fichier <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              onChange={handleFileChange}
                              accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {file && (
                              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                                <div className="flex items-center gap-2 text-sm text-green-700">
                                  <FileText size={16} />
                                  <span className="font-medium">{file.name}</span>
                                  <span className="text-xs">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Libellé <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={libelle}
                            onChange={(e) => setLibelle(e.target.value)}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nom du document"
                          />
                        </div>
                        {/* <div>
                          <label className="block text-sm font-medium mb-1">
                            Classification
                          </label>
                          <input
                            type="text"
                            value={classification}
                            onChange={(e) => setClassification(e.target.value)}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Classification du document (optionnel)"
                          />
                        </div> */}
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Nature du document
                          </label>
                          <div className="flex gap-2">
                            <Select
                              value={natureId ?? undefined}
                              onValueChange={(value) => setNatureId(value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un type" />
                              </SelectTrigger>
                              <SelectContent>
                                {naturesLoading ? (
                                  <SelectItem value="" disabled>Chargement...</SelectItem>
                                ) : naturesError ? (
                                  <SelectItem value="" disabled>Erreur: {String(naturesError)}</SelectItem>
                                ) : natures && Array.isArray(natures) && natures.length > 0 ? (
                                  (natures as NatureDocument[])
                                    .filter(nature => nature && nature.id_nature_document && nature.libelle)
                                    .map((nature) => {
                                      const natureId = nature.id_nature_document!;
                                      const isEditing = editingNature?.id === natureId;
                                      
                                      return (
                                        <div key={natureId} className="relative">
                                          {isEditing ? (
                                            <div className="flex items-center gap-2 p-2">
                                              <Input
                                                value={editNatureLibelle}
                                                onChange={(e) => setEditNatureLibelle(e.target.value)}
                                                className="flex-1 h-8 text-sm"
                                                onKeyDown={(e) => {
                                                  if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleUpdateNature();
                                                  } else if (e.key === 'Escape') {
                                                    setEditingNature(null);
                                                    setEditNatureLibelle("");
                                                  }
                                                }}
                                              />
                                              <Button
                                                size="sm"
                                                onClick={handleUpdateNature}
                                                disabled={updateNature.isLoading}
                                                className="h-8 px-2"
                                              >
                                                {updateNature.isLoading ? "..." : "✓"}
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                  setEditingNature(null);
                                                  setEditNatureLibelle("");
                                                }}
                                                className="h-8 px-2"
                                              >
                                                ✕
                                              </Button>
                                            </div>
                                          ) : (
                                            <div className="flex items-center justify-between p-2 hover:bg-gray-50">
                                              <SelectItem 
                                                value={natureId.toString()}
                                                className="flex-1 cursor-pointer"
                                              >
                                                {nature.libelle}
                                              </SelectItem>
                                              <div className="flex items-center gap-1 ml-2">
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleStartEdit(nature);
                                                  }}
                                                  className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                >
                                                  <Edit size={12} />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleDeleteNature(natureId);
                                                  }}
                                                  disabled={deleteNature.isLoading}
                                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                  title="Supprimer cette nature"
                                                >
                                                  <X size={12} />
                                                </Button>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })
                                ) : (
                                  <>
                                    <SelectItem value="1">Contrat</SelectItem>
                                    <SelectItem value="2">Facture</SelectItem>
                                    <SelectItem value="3">Rapport</SelectItem>
                                    <SelectItem value="4">CV</SelectItem>
                                    <SelectItem value="5">Procédure</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="px-3"
                                >
                                  +
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium leading-none">Créer une nouvelle nature</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Créez un nouveau type de document pour l'utiliser immédiatement.
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="nature-libelle">Libellé de la nature</Label>
                                    <Input
                                      id="nature-libelle"
                                      value={newNatureLibelle}
                                      onChange={(e) => setNewNatureLibelle(e.target.value)}
                                      placeholder="Ex: Contrat de travail"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          handleCreateNature();
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setNewNatureLibelle("")}
                                      className="flex-1"
                                    >
                                      Annuler
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={handleCreateNature}
                                      disabled={!newNatureLibelle.trim() || createNature.isLoading}
                                      className="flex-1"
                                    >
                                      {createNature.isLoading ? "Création..." : "Créer"}
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Dossier *
                          </label>
                          <DossierCombobox
                            value={id_dossier}
                            onChange={(value) => setIdDossier(Number(value))}
                            type={"demandes RH"}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            État du document *
                          </label>
                          <Select
                            value={etatDocument}
                            onValueChange={setEtatDocument}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un état" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Actif">Actif</SelectItem>
                              <SelectItem value="Archivé">Archivé</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {uploadError && (
                          <div className="text-red-600 text-sm">
                            {uploadError}
                          </div>
                        )}
                        <SheetFooter>
                          <Button
                            type="submit"
                            disabled={addDocument.isLoading}
                            className="w-full"
                          >
                            {addDocument.isLoading
                              ? "Ajout en cours..."
                              : "Ajouter le document"}
                          </Button>
                        </SheetFooter>
                      </form>
                    </SheetContent>
                  </Sheet>
                </div>
                {demande.documents && demande.documents.length > 0 ? (
                  <ul className="space-y-2">
                    {demande.documents.map((doc: DemandeDocument) => (
                      <li
                        key={doc.id_documents}
                        className="flex items-center gap-3 bg-gray-50 rounded p-2"
                      >
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {doc.libelle_document}
                          </div>

                        </div>
                        <a
                          href={`${STATIC_FILES_BASE_URL}/${doc.lien_document}`}
                          download
                          className="text-blue-600 underline text-xs"
                        >
                          Télécharger
                        </a>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            deleteDocument.mutate({
                              demandeId: demande.id_demandes,
                              documentId: doc.id_documents,
                            })
                          }
                          disabled={deleteDocument.isLoading}
                        >
                          Supprimer
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500">
                    Aucun document associé à cette demande.
                  </div>
                )}
              </div>
              {/* Bloc employé visuel */}
              <div className="flex items-center gap-3 mt-6">
                <Avatar>
                  <AvatarImage
                    src={undefined}
                    alt={employe ? employe.prenom_employes : "-"}
                  />
                  <AvatarFallback>
                    {employe
                      ? `${employe.prenom_employes[0]}${employe.nom_employes[0]}`.toUpperCase()
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-800">
                    {employe
                      ? `${employe.prenom_employes} ${employe.nom_employes}`
                      : "Non renseigné"}
                  </div>
                  <div className="text-xs text-gray-500">
                    Employé #{employe?.id_employes || "-"}
                  </div>
                </div>
              </div>
              {/* Boutons d'action */}
              {demande.status === "En attente" &&
                !approuverDemande.isLoading &&
                !refuserDemande.isLoading && (
                  <div className="flex gap-2 mt-6">
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={refuserDemande.isLoading}
                    >
                      Refuser
                    </Button>
                    <Button
                      variant="blue"
                      onClick={handleApprove}
                      disabled={approuverDemande.isLoading}
                    >
                      Approuver
                    </Button>
                    <Button
                      variant="default"
                      onClick={() =>
                        navigate(`/resources-humaines/demandes/${id}/modifier`)
                      }
                    >
                      Modifier
                    </Button>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
        {/* Colonne latérale (1/3) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Statut</span>
                  {getStatusBadge(demande.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Type</span>
                  <span className="font-medium text-gray-800">
                    {demande.type_demande}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Employé</span>
                  <span className="font-medium text-gray-800">
                    {employe
                      ? `${employe.prenom_employes} ${employe.nom_employes}`
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Durée</span>
                  <span className="font-medium text-gray-800">
                    {demande.duree || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Période</span>
                  <span className="font-medium text-gray-800">
                    {demande.date_absence && demande.date_retour
                      ? `${format(new Date(demande.date_absence), "dd/MM", {
                          locale: fr,
                        })} - ${format(
                          new Date(demande.date_retour),
                          "dd/MM/yyyy",
                          { locale: fr }
                        )}`
                      : "-"}
                  </span>
                </div>
                {/* Bloc téléchargement fichier joint (premier doc si dispo) */}
                {demande.documents && demande.documents.length > 0 && (
                  <div className="border border-dashed rounded p-3 text-center mt-2">
                    <a
                      href={`${STATIC_FILES_BASE_URL}/${demande.documents[0].lien_document}`}
                      download
                      className="text-blue-600 font-medium underline"
                    >
                      Télécharger le fichier joint
                    </a>
                    <div className="text-xs text-gray-500 mt-1">
                      Aperçu du fichier
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InfoDemandePage;
