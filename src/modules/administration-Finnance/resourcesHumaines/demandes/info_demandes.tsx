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
import { DemandeDocument } from "../../administration/types/interfaces";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import useDocumentsApi from "../../services/finance_comptaService";
import { toast } from "sonner";
import { DossierCombobox } from "@/components/combobox/DossierCombobox";
import {
  SelectContent,
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { TypeDemandes } from "./enum";

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
  const { createDocument } = useDocumentsApi();
  const queryClient = useQueryClient();
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
  const [classification, setClassification] = React.useState("");
  const [natureId, setNatureId] = React.useState<string | undefined>(undefined);
  const addDocument = useAddDocumentToDemande();
  const deleteDocument = useDeleteDocumentFromDemande();
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [id_dossier, setIdDossier] = React.useState<number | null>(null);

  const approuverDemande = useApprouverDemande();
  const refuserDemande = useRefuserDemande();

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

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    if (
      !file ||
      !libelle ||
      !classification ||
      !natureId ||
      !demande ||
      !id_dossier
    ) {
      setUploadError("Tous les champs sont obligatoires.");
      return;
    }

    try {
      createDocument({
        lien_document: file.name,
        libelle_document: libelle,
        date_document: new Date().toISOString(),
        id_dossier: Number(id_dossier),
        id_nature_document: 0,
        classification_document: classification,
        id_demandes: String(demande.id_demandes),
      });
      setFile(null);
      setLibelle("");
      setClassification("");
      setNatureId(undefined);
    } catch (error) {
      console.error("Erreur lors du chargement des types de documents:", error);
      toast.error("Impossible de charger les types de documents");
    }

    // addDocument.mutate(
    //   {
    //     demandeId: demande.id_demandes,
    //     documentData: {
    //       file,
    //       libelle_document: libelle,
    //       classification_document: classification,
    //       id_nature_document: natureId,
    //     },
    //   },
    //   {
    //     onSuccess: () => {
    //       setFile(null);
    //       setLibelle("");
    //       setClassification("");
    //       setNatureId(null);
    //     },
    //     onError: (err: unknown) => {
    //       if (err instanceof Error) {
    //         setUploadError(err.message);
    //       } else if (
    //         typeof err === "object" &&
    //         err !== null &&
    //         "message" in err
    //       ) {
    //         setUploadError(String((err as { message?: string }).message));
    //       } else {
    //         setUploadError("Erreur lors de l'upload");
    //       }
    //     },
    //   }
    // );
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
                  <Sheet>
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
                            Fichier
                          </label>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*,application/pdf"
                            className="block w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Libellé
                          </label>
                          <input
                            type="text"
                            value={libelle}
                            onChange={(e) => setLibelle(e.target.value)}
                            className="block w-full border rounded px-2 py-1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Classification
                          </label>
                          <input
                            type="text"
                            value={classification}
                            onChange={(e) => setClassification(e.target.value)}
                            className="block w-full border rounded px-2 py-1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Nature du document
                          </label>
                          <Select
                            value={natureId ?? undefined}
                            onValueChange={(value) => setNatureId(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(TypeDemandes).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Dossier *
                          </label>
                          <DossierCombobox
                            value={id_dossier?.toString() ?? undefined}
                            onChange={(value) => setIdDossier(Number(value))}
                            type={"demandes RH"}
                          />
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
                          <div className="text-xs text-gray-500">
                            {doc.classification_document}
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
