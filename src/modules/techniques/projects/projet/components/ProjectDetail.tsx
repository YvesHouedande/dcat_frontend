// src/pages/ProjetDetailsPage.tsx

import React, { useState, useEffect, FC } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Projet,
  Partenaire,
  Famille,
  Document,
  Livrable,
  TacheWithAssignedEmployes,
  Employe,
  CreateTachePayload,
} from "../../types/types"; // Import Document, Livrable, ApiResponse
import {
  getProjetById,
  getProjetAssociatedPartenaires,
  getDocumentsByProjetId, // Import for fetching project documents
  deleteDocumentFromProjet, // Import for deleting project documents
  getLivrablesWithDocumentsByProjetId, // NEW: Import for fetching livrables with documents
  addDocumentToProjet, // Import for adding documents to project
} from "../api/projets"; // Ensure paths are correct
import { getFamilles } from "../api/famille"; // Ensure paths are correct
import { getPartenaires } from "../api/partenaires"; // Ensure paths are correct

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  MapPin,
  User,
  Tag,
  Clock,
  Building2,
  LayoutGrid,
  FileText, // For document icon
  Download, // For download icon
  Trash2, // For delete icon
  PackageOpen,
  Home,
  ArrowLeft,
  Edit,
  Eye,
  Target,
  Info,
  TrendingUp,
  Users,
  FolderOpen,
  Plus,
  Save,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  format,
  parseISO,
  differenceInDays,
  isAfter,
  isBefore,
} from "date-fns"; // Import parseISO for document/livrable dates
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner"; // Import toast for messages
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TacheTable } from "../../tasks/components/TacheTable";
import {
  getTachesByProjet,
  getEmployesAssignes,
  createTache,
  updateTache,
  assignEmployeToTache,
  removeEmployeFromTache,
  deleteTacheSafely,
  getTacheById,
} from "../../tasks/api/taches";
import { getEmployes } from "../api/employes";
import TacheForm from "../../tasks/components/TacheForm";
import TaskDetail from "../../tasks/components/TaskDetail";
import { LivrableTable } from "../../livrables/components/LivrableTable";

// Import des composants pour les livrables
import { LivrableForm } from "../../livrables/components/LivrableForm";
import LivrableDetailsPage from "../../livrables/components/livrableDetails";
import {
  getLivrableById,
  createLivrable,
  updateLivrable,
  deleteLivrable,
  addDocumentToLivrable,
  getAllNatureDocuments,
} from "../../livrables/api/livrables";
import {
  CreateLivrablePayload,
  UpdateLivrablePayload,
  CreateDocumentTextPayload,
  Nature,
} from "../../types/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Get API_URL from environment variables
const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

// Determine the base URL for static files (media, documents, etc.)
// Assumes API_BASE_URL ends with /api (e.g., https://erpback.dcat.ci/api)
// and static files are served from the root domain (e.g., https://erpback.dcat.ci/media/...)
const STATIC_FILES_BASE_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL.slice(0, -4) // Remove '/api' from the end
  : API_BASE_URL; // Otherwise, use it as is

interface ProjectTaskDetailWrapperProps {
  taches: TacheWithAssignedEmployes[];
  projet: Projet;
  onEdit: (tacheId: number) => void;
}

const ProjectTaskDetailWrapper: FC<ProjectTaskDetailWrapperProps> = ({
  taches,
  projet,
  onEdit,
}) => {
  const { tacheId, id } = useParams<{ tacheId: string; id: string }>();
  const navigate = useNavigate();
  const tache = taches.find(
    (t: TacheWithAssignedEmployes) => t.id_tache === Number(tacheId)
  );
  return (
    <div>
      <Button
        variant="outline"
        onClick={() => navigate(`/technique/projets/${id}/details/taches`)}
        className="mb-4"
      >
        ← Retour à la liste des tâches
      </Button>
      <TaskDetail
        tache={tache}
        projets={[projet]}
        isEmbedded={true}
        onEdit={onEdit}
      />
    </div>
  );
};

// Wrapper pour LivrableEdit dans le contexte de la page de détail du projet
interface ProjectLivrableEditWrapperProps {
  embedded?: boolean;
}
const ProjectLivrableEditWrapper: FC<ProjectLivrableEditWrapperProps> = ({
  embedded = false,
}) => {
  const { livrableId, id } = useParams<{ livrableId: string; id: string }>();
  const navigate = useNavigate();
  const [livrable, setLivrable] = useState<Livrable | null>(null);
  const [projet, setProjet] = useState<Projet | null>(null);
  const [natureDocuments, setNatureDocuments] = useState<Nature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!livrableId || !id) return;

      setLoading(true);
      setError(null);

      try {
        const livrableIdNum = Number(livrableId);
        const projetId = Number(id);

        if (isNaN(livrableIdNum) || isNaN(projetId)) {
          setError("ID invalide");
          return;
        }

        // Récupérer toutes les données nécessaires en parallèle
        const [livrableData, projetData, natureDocumentsData] =
          await Promise.all([
            getLivrableById(livrableIdNum),
            getProjetById(projetId),
            getAllNatureDocuments(),
          ]);

        if (!livrableData) {
          setError("Livrable introuvable");
          return;
        }

        if (!projetData) {
          setError("Projet introuvable");
          return;
        }

        setLivrable(livrableData);
        // S'assurer que le projet a la propriété id_partenaire
        const projetWithPartners: Projet = {
          ...projetData,
          id_partenaire: [], // Initialiser avec un tableau vide, sera rempli plus tard si nécessaire
        };
        setProjet(projetWithPartners);

        // Gérer la réponse des natures de documents
        let naturesToSet: Nature[] = [];
        if (
          natureDocumentsData.data &&
          Array.isArray(natureDocumentsData.data)
        ) {
          naturesToSet = natureDocumentsData.data;
        } else if (Array.isArray(natureDocumentsData)) {
          naturesToSet = natureDocumentsData;
        }
        setNatureDocuments(naturesToSet);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [livrableId, id]);

  if (loading) {
    return <div className="text-center py-8">Chargement du livrable...</div>;
  }

  if (error || !livrable || !projet) {
    return (
      <div className="text-center py-8 text-red-500">
        {error || "Données introuvables"}
        <Button
          variant="outline"
          onClick={() => navigate(`/technique/projets/${id}/details/livrables`)}
          className="mt-4"
        >
          ← Retour à la liste des livrables
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => navigate(`/technique/projets/${id}/details/livrables`)}
        className="mb-4"
      >
        ← Retour à la liste des livrables
      </Button>
      <LivrableForm
        initialData={livrable}
        onSave={async (payload) => {
          try {
            // Mise à jour du livrable
            await updateLivrable(
              livrable.id_livrable,
              payload as UpdateLivrablePayload
            );
            toast.success("Livrable modifié avec succès !");
            navigate(`/technique/projets/${id}/details/livrables`);
          } catch (err) {
            console.error("Erreur lors de la mise à jour du livrable:", err);
            toast.error("Erreur lors de la mise à jour du livrable");
            throw err;
          }
        }}
        onCancel={() => navigate(`/technique/projets/${id}/details/livrables`)}
        projetsDisponibles={[projet]}
        natureDocumentsDisponibles={natureDocuments}
        onSaveDocument={async (livrableId, documentFile, textPayload) => {
          try {
            await addDocumentToLivrable(livrableId, documentFile, textPayload);
            toast.success("Document associé avec succès !");
          } catch (err) {
            console.error("Erreur lors de l'association du document:", err);
            toast.error("Échec de l'association du document.");
            throw err;
          }
        }}
        embedded={embedded}
      />
    </div>
  );
};

// Wrapper pour LivrableDetailsPage dans le contexte de la page de détail du projet
const ProjectLivrableDetailsWrapper: FC = () => {
  const { livrableId, id } = useParams<{ livrableId: string; id: string }>();
  const navigate = useNavigate();
  const [livrable, setLivrable] = useState<Livrable | null>(null);
  const [projet, setProjet] = useState<Projet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!livrableId || !id) return;

      setLoading(true);
      setError(null);

      try {
        const livrableIdNum = Number(livrableId);
        const projetId = Number(id);

        if (isNaN(livrableIdNum) || isNaN(projetId)) {
          setError("ID invalide");
          return;
        }

        // Récupérer les données nécessaires
        const [livrableData, projetData] = await Promise.all([
          getLivrableById(livrableIdNum),
          getProjetById(projetId),
        ]);

        if (!livrableData) {
          setError("Livrable introuvable");
          return;
        }

        if (!projetData) {
          setError("Projet introuvable");
          return;
        }

        setLivrable(livrableData);
        const projetWithPartners: Projet = {
          ...projetData,
          id_partenaire: [],
        };
        setProjet(projetWithPartners);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [livrableId, id]);

  if (loading) {
    return <div className="text-center py-8">Chargement du livrable...</div>;
  }

  if (error || !livrable || !projet) {
    return (
      <div className="text-center py-8 text-red-500">
        {error || "Données introuvables"}
        <Button
          variant="outline"
          onClick={() => navigate(`/technique/projets/${id}/details/livrables`)}
          className="mt-4"
        >
          ← Retour à la liste des livrables
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => navigate(`/technique/projets/${id}/details/livrables`)}
        className="mb-4"
      >
        ← Retour à la liste des livrables
      </Button>
      <LivrableDetailsPage embedded={true} />
    </div>
  );
};

// Wrapper pour l'édition des tâches dans le contexte de la page de détail du projet
const ProjectTacheEditWrapper: FC = () => {
  const { tacheId, id } = useParams<{ tacheId: string; id: string }>();
  const navigate = useNavigate();
  const [tache, setTache] = useState<TacheWithAssignedEmployes | null>(null);
  const [projet, setProjet] = useState<Projet | null>(null);
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!tacheId || !id) return;

      setLoading(true);
      setError(null);

      try {
        const tacheIdNum = Number(tacheId);
        const projetId = Number(id);

        if (isNaN(tacheIdNum) || isNaN(projetId)) {
          setError("ID invalide");
          return;
        }

        // Récupérer toutes les données nécessaires en parallèle
        const [tacheData, employesAssignes, projetData, employesData] =
          await Promise.all([
            getTacheById(tacheIdNum),
            getEmployesAssignes(tacheIdNum),
            getProjetById(projetId),
            getEmployes(),
          ]);

        if (!tacheData) {
          setError("Tâche introuvable");
          return;
        }

        if (!projetData) {
          setError("Projet introuvable");
          return;
        }

        // Combiner les données pour former TacheWithAssignedEmployes
        const tacheWithAssignes: TacheWithAssignedEmployes = {
          ...tacheData,
          id_assigne_a: employesAssignes,
        };

        setTache(tacheWithAssignes);
        // S'assurer que le projet a la propriété id_partenaire
        const projetWithPartners: Projet = {
          ...projetData,
          id_partenaire: [], // Initialiser avec un tableau vide, sera rempli plus tard si nécessaire
        };
        setProjet(projetWithPartners);
        setEmployes(employesData);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [tacheId, id]);

  if (loading) {
    return <div className="text-center py-8">Chargement de la tâche...</div>;
  }

  if (error || !tache || !projet) {
    return (
      <div className="text-center py-8 text-red-500">
        {error || "Données introuvables"}
        <Button
          variant="outline"
          onClick={() => navigate(`/technique/projets/${id}/details/taches`)}
          className="mt-4"
        >
          ← Retour à la liste des tâches
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => navigate(`/technique/projets/${id}/details/taches`)}
        className="mb-4"
      >
        ← Retour à la liste des tâches
      </Button>
      <TacheForm
        initialData={tache}
        onSave={async (formData, employesIds) => {
          try {
            // Mise à jour de la tâche
            await updateTache(tache.id_tache, formData);

            // Gestion des assignations
            const currentEmployeesIds = tache.id_assigne_a.map(
              (emp) => emp.id_employes
            );
            const employeesToAdd = employesIds.filter(
              (id) => !currentEmployeesIds.includes(id)
            );
            const employeesToRemove = currentEmployeesIds.filter(
              (id) => !employesIds.includes(id)
            );

            await Promise.all([
              ...employeesToAdd.map((empId) =>
                assignEmployeToTache(tache.id_tache, empId)
              ),
              ...employeesToRemove.map((empId) =>
                removeEmployeFromTache(tache.id_tache, empId)
              ),
            ]);

            toast.success("Tâche modifiée avec succès !");
            navigate(`/technique/projets/${id}/details/taches`);
          } catch (err) {
            console.error("Erreur lors de la mise à jour de la tâche:", err);
            toast.error("Erreur lors de la mise à jour de la tâche");
            throw err;
          }
        }}
        onCancel={() => navigate(`/technique/projets/${id}/details/taches`)}
        projetsDisponibles={[projet]}
        employesDisponibles={employes}
      />
    </div>
  );
};

const ProjetDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [projet, setProjet] = useState<Projet | undefined>(undefined);
  const [allPartenaires, setAllPartenaires] = useState<Partenaire[]>([]);
  const [familles, setFamilles] = useState<Famille[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]); // State for associated direct project documents
  const [livrables, setLivrables] = useState<Livrable[]>([]); // NEW: State for associated livrables with their documents
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taches, setTaches] = useState<TacheWithAssignedEmployes[]>([]); // Tâches du projet
  const [employes, setEmployes] = useState<Employe[]>([]); // Tous les employés
  const [loadingTaches, setLoadingTaches] = useState(true);
  const [tacheToEdit, setTacheToEdit] =
    useState<TacheWithAssignedEmployes | null>(null);
  const [isSubmittingTache, setIsSubmittingTache] = useState(false);

  // États pour la gestion des livrables
  const [natureDocuments, setNatureDocuments] = useState<Nature[]>([]); // Natures de documents disponibles
  const [showDocumentSheet, setShowDocumentSheet] = useState(false);
  const [documentFormData, setDocumentFormData] = useState<
    CreateDocumentTextPayload & { file: File | null }
  >({
    libelle_document: "",
    classification_document: "",
    date_document: "",
    id_nature_document: 0,
    file: null,
  });

  const loadProjetData = async () => {
    setLoading(true);
    setError(null);
    if (!id) {
      setError("ID du projet manquant.");
      setLoading(false);
      return;
    }

    try {
      const projectId = Number(id);
      if (isNaN(projectId)) {
        setError("ID de projet invalide.");
        setLoading(false);
        return;
      }

      // Fetch project, all partners, families, associated direct project documents, AND livrables with their documents in parallel
      const [
        fetchedProjet,
        fetchedAllPartenaires,
        fetchedFamilles,
        fetchedDocumentsResponse,
        fetchedLivrablesResponse, // NEW: Fetch livrables with documents
      ] = await Promise.all([
        getProjetById(projectId),
        getPartenaires(),
        getFamilles(),
        getDocumentsByProjetId(projectId), // Fetch documents directly associated with the project
        getLivrablesWithDocumentsByProjetId(projectId), // NEW: Fetch livrables and their nested documents
      ]);

      setAllPartenaires(fetchedAllPartenaires);
      setFamilles(fetchedFamilles);

      if (!fetchedProjet) {
        setError("Projet introuvable ou erreur de chargement.");
        setProjet(undefined);
        return;
      }

      // Get associated partner IDs for the project
      const associatedPartnerIds = await getProjetAssociatedPartenaires(
        projectId
      );

      // Enrich the project object with the id_partenaire property
      const fullProjet: Projet = {
        ...fetchedProjet,
        id_partenaire: associatedPartnerIds || [], // Ensure it's an array
      };

      setProjet(fullProjet);

      // Handle direct project documents response
      let docsToSet: Document[] = [];
      if (
        fetchedDocumentsResponse.documents &&
        Array.isArray(fetchedDocumentsResponse.documents)
      ) {
        docsToSet = fetchedDocumentsResponse.documents;
      } else if (
        fetchedDocumentsResponse.data &&
        Array.isArray(fetchedDocumentsResponse.data)
      ) {
        docsToSet = fetchedDocumentsResponse.data;
      } else if (Array.isArray(fetchedDocumentsResponse)) {
        // Fallback if API returns direct array
        docsToSet = fetchedDocumentsResponse; // Assuming fetchedDocumentsResponse could be direct array if no ApiResponse wrapper
      }
      setDocuments(docsToSet);

      // NEW: Handle livrables with documents response
      let livrablesToSet: Livrable[] = [];
      if (
        fetchedLivrablesResponse.livrables &&
        Array.isArray(fetchedLivrablesResponse.livrables)
      ) {
        livrablesToSet = fetchedLivrablesResponse.livrables;
      } else if (
        fetchedLivrablesResponse.data &&
        Array.isArray(fetchedLivrablesResponse.data)
      ) {
        livrablesToSet = fetchedLivrablesResponse.data;
      } else if (Array.isArray(fetchedLivrablesResponse)) {
        // Fallback if API returns direct array
        livrablesToSet = fetchedLivrablesResponse; // Assuming fetchedLivrablesResponse could be direct array
      }
      setLivrables(livrablesToSet);
    } catch (err: unknown) {
      console.error("Erreur lors du chargement des détails du projet :", err);
      setError(
        (err as Error).message ||
          "Impossible de charger les détails du projet. Veuillez réessayer."
      );
      setProjet(undefined);
    } finally {
      setLoading(false);
    }
  };

  // Chargement des tâches et employés pour l'onglet Tâches
  useEffect(() => {
    if (!projet?.id_projet) return;
    setLoadingTaches(true);
    const loadTaches = async () => {
      try {
        const tachesResponse = await getTachesByProjet(projet.id_projet);
        const tachesArray = Array.isArray(tachesResponse.data)
          ? tachesResponse.data
          : [];
        // Charger les assignés pour chaque tâche
        const tachesWithAssignes = await Promise.all(
          tachesArray.map(async (tache) => {
            const assignes = await getEmployesAssignes(tache.id_tache);
            return { ...tache, id_assigne_a: assignes };
          })
        );
        setTaches(tachesWithAssignes);
        const employesData = await getEmployes();
        setEmployes(employesData);
      } catch (err) {
        console.error("Erreur lors du chargement des tâches:", err);
        setTaches([]);
        setEmployes([]);
      } finally {
        setLoadingTaches(false);
      }
    };
    loadTaches();
  }, [projet?.id_projet]);

  // Chargement des natures de documents pour les livrables
  useEffect(() => {
    const loadNatureDocuments = async () => {
      try {
        const natureResponse = await getAllNatureDocuments();
        let naturesToSet: Nature[] = [];
        if (natureResponse.data && Array.isArray(natureResponse.data)) {
          naturesToSet = natureResponse.data;
        } else if (Array.isArray(natureResponse)) {
          naturesToSet = natureResponse;
        }
        setNatureDocuments(naturesToSet);
      } catch (err) {
        console.error(
          "Erreur lors du chargement des natures de documents:",
          err
        );
        setNatureDocuments([]);
      }
    };
    loadNatureDocuments();
  }, []);

  useEffect(() => {
    loadProjetData();
  }, [id]);

  // Function to format amount in CFA Franc
  const formatCFA = (amount: number | string | undefined): string => {
    const numericAmount = Number(amount) || 0;
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF", // ISO 4217 code for West African CFA Franc
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  };

  // Get partner name by ID
  const getPartnerName = (partnerId: number): string => {
    return (
      allPartenaires.find((p) => p.id_partenaire === partnerId)
        ?.nom_partenaire || `Inconnu (ID: ${partnerId})`
    );
  };

  // Get family name by ID
  const getFamilleName = (id_famille: number | null): string => {
    if (id_famille === null) {
      return "Non spécifiée";
    }
    return (
      familles.find((f) => f.id_famille === id_famille)?.libelle_famille ||
      "Inconnue"
    );
  };

  // Get full employee name using the 'responsable' field from the project
  const getResponsibleFullName = (responsibleName: string): string => {
    return responsibleName || "Non spécifié";
  };

  // Calculs pour l'expérience utilisateur améliorée
  const getProjectProgress = () => {
    if (!projet) return 0;

    switch (projet.etat) {
      case "planifié":
        return 25;
      case "en_cours":
        return 60;
      case "terminé":
        return 100;
      case "annulé":
        return 0;
      default:
        return 0;
    }
  };

  const getProjectStatus = () => {
    if (!projet)
      return { status: "unknown", message: "Statut inconnu", color: "gray" };

    const today = new Date();
    const startDate = projet.date_debut ? new Date(projet.date_debut) : null;
    const endDate = projet.date_fin ? new Date(projet.date_fin) : null;

    if (projet.etat === "terminé") {
      return {
        status: "completed",
        message: "Projet terminé avec succès",
        color: "green",
      };
    }

    if (projet.etat === "annulé") {
      return { status: "cancelled", message: "Projet annulé", color: "red" };
    }

    if (endDate && isAfter(today, endDate)) {
      return { status: "overdue", message: "Projet en retard", color: "red" };
    }

    if (startDate && isBefore(today, startDate)) {
      return { status: "upcoming", message: "Projet à venir", color: "blue" };
    }

    return { status: "ongoing", message: "Projet en cours", color: "yellow" };
  };

  const getDaysRemaining = () => {
    if (!projet?.date_fin) return null;
    const endDate = new Date(projet.date_fin);
    const today = new Date();
    const days = differenceInDays(endDate, today);
    return days;
  };

  const handleDeleteDocument = async (documentId: number) => {
    if (!projet) return;

    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      try {
        await deleteDocumentFromProjet(projet.id_projet, documentId);
        setDocuments((prevDocs) =>
          prevDocs.filter((doc) => doc.id_documents !== documentId)
        );
        toast.success("Document supprimé avec succès !");
      } catch (err) {
        console.error("Erreur lors de la suppression du document :", err);
        toast.error("Échec de la suppression du document.");
      }
    }
  };

  // === HANDLERS POUR LA GESTION DES TÂCHES ===
  const handleOpenCreateTache = () => {
    navigate(`/technique/projets/${id}/details/tache/nouvelle`);
  };
  const handleOpenEditTache = (tache: TacheWithAssignedEmployes) => {
    navigate(`/technique/projets/${id}/details/tache/${tache.id_tache}/editer`);
  };
  const handleSaveTache = async (
    formData: CreateTachePayload,
    employesIds: number[]
  ) => {
    setIsSubmittingTache(true);
    try {
      if (tacheToEdit) {
        // Edition
        await updateTache(tacheToEdit.id_tache, formData);
        // Gérer les assignations :
        const currentEmployeesIds = tacheToEdit.id_assigne_a.map(
          (emp) => emp.id_employes
        );
        const employeesToAdd = employesIds.filter(
          (id) => !currentEmployeesIds.includes(id)
        );
        const employeesToRemove = currentEmployeesIds.filter(
          (id) => !employesIds.includes(id)
        );
        await Promise.all([
          ...employeesToAdd.map((empId) =>
            assignEmployeToTache(tacheToEdit.id_tache, empId)
          ),
          ...employeesToRemove.map((empId) =>
            removeEmployeFromTache(tacheToEdit.id_tache, empId)
          ),
        ]);
        toast.success("Tâche modifiée avec succès !");
      } else {
        // Création
        const nouvelleTache = await createTache(formData);
        const nouvelleTacheWithAssignes: TacheWithAssignedEmployes = {
          ...nouvelleTache,
          id_assigne_a: [],
        };
        const validEmployeIds = employesIds.filter(
          (id) => typeof id === "number" && !isNaN(id)
        );
        await Promise.all(
          validEmployeIds.map((empId) =>
            assignEmployeToTache(nouvelleTacheWithAssignes.id_tache, empId)
          )
        );
        toast.success("Tâche créée avec succès !");
      }
      // Après succès, rafraîchir la liste
      if (projet?.id_projet) {
        setLoadingTaches(true);
        const tachesResponse = await getTachesByProjet(projet.id_projet);
        const tachesArray = Array.isArray(tachesResponse.data)
          ? tachesResponse.data
          : [];
        const tachesWithAssignes = await Promise.all(
          tachesArray.map(async (tache) => {
            const assignes = await getEmployesAssignes(tache.id_tache);
            return { ...tache, id_assigne_a: assignes };
          })
        );
        setTaches(tachesWithAssignes);
      }
      setTacheToEdit(null);
    } catch (err: unknown) {
      console.error("Erreur lors de l'enregistrement de la tâche:", err);
      toast.error("Erreur lors de l'enregistrement de la tâche");
    } finally {
      setIsSubmittingTache(false);
      setLoadingTaches(false);
    }
  };
  const handleDeleteTache = async (id: number) => {
    if (!window.confirm("Supprimer cette tâche ?")) return;
    try {
      await deleteTacheSafely(id);
      toast.success("Tâche supprimée avec succès !");
      // Rafraîchir la liste
      if (projet?.id_projet) {
        setLoadingTaches(true);
        const tachesResponse = await getTachesByProjet(projet.id_projet);
        const tachesArray = Array.isArray(tachesResponse.data)
          ? tachesResponse.data
          : [];
        const tachesWithAssignes = await Promise.all(
          tachesArray.map(async (tache) => {
            const assignes = await getEmployesAssignes(tache.id_tache);
            return { ...tache, id_assigne_a: assignes };
          })
        );
        setTaches(tachesWithAssignes);
      }
    } catch (err: unknown) {
      console.error("Erreur lors de la suppression de la tâche:", err);
      toast.error("Erreur lors de la suppression de la tâche");
    } finally {
      setLoadingTaches(false);
    }
  };

  // === HANDLER POUR LA VUE DÉTAIL DE TÂCHE ===
  const handleViewTache = (tacheId: number) => {
    navigate(`/technique/projets/${id}/details/tache/${tacheId}/detailsTache`);
  };

  // === HANDLERS POUR LA GESTION DES LIVRABLES ===
  const handleOpenCreateLivrable = () => {
    navigate(`/technique/projets/${id}/details/livrable/nouveau`);
  };
  const handleOpenEditLivrable = (livrableId: number) => {
    navigate(`/technique/projets/${id}/details/livrable/${livrableId}/editer`);
  };
  const handleViewLivrable = (livrableId: number) => {
    navigate(
      `/technique/projets/${id}/details/livrable/${livrableId}/detailsLivrable`
    );
  };

  // Handler pour sauvegarder un livrable (création ou édition)
  const handleSaveLivrable = async (
    payload: CreateLivrablePayload | UpdateLivrablePayload
  ) => {
    setIsSubmittingTache(true);
    try {
      // Vérifier si c'est une édition en cherchant l'id_livrable dans le payload
      const livrableId = (payload as Livrable).id_livrable;
      if (livrableId && typeof livrableId === "number" && !isNaN(livrableId)) {
        // Édition - créer un payload sans id_livrable pour updateLivrable
        const updatePayload = payload;
        await updateLivrable(
          livrableId,
          updatePayload as UpdateLivrablePayload
        );
        toast.success("Livrable modifié avec succès !");
      } else {
        // Création - s'assurer que le projet est assigné
        if (!projet) {
          toast.error("Projet non trouvé");
          return;
        }
        const createPayload = { ...payload, id_projet: projet.id_projet };
        await createLivrable(createPayload as CreateLivrablePayload);
        toast.success("Livrable créé avec succès !");
      }
      // Rafraîchir la liste des livrables
      await loadProjetData();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du livrable:", err);
      toast.error("Échec de l'enregistrement du livrable.");
    } finally {
      setIsSubmittingTache(false);
    }
  };

  // Handler pour supprimer un livrable
  const handleDeleteLivrable = async (livrableId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce livrable ?"))
      return;
    try {
      await deleteLivrable(livrableId);
      toast.success("Livrable supprimé avec succès !");
      // Rafraîchir la liste des livrables
      await loadProjetData();
    } catch (err) {
      console.error("Erreur lors de la suppression du livrable:", err);
      toast.error("Échec de la suppression du livrable.");
    }
  };

  // Handler pour ajouter un document à un livrable
  const handleSaveDocument = async (
    livrableId: number,
    documentFile: File,
    textPayload: CreateDocumentTextPayload
  ) => {
    try {
      await addDocumentToLivrable(livrableId, documentFile, textPayload);
      toast.success("Document associé avec succès !");
      // Optionnel: Recharger les données du livrable
      await loadProjetData();
    } catch (err) {
      console.error("Erreur lors de l'association du document:", err);
      toast.error("Échec de l'association du document.");
      throw err;
    }
  };

  const handleDocumentInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDocumentFormData((prev: typeof documentFormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDocumentSelectChange = (
    name: keyof CreateDocumentTextPayload,
    value: string
  ) => {
    const newValue = name === "id_nature_document" ? Number(value) : value;
    setDocumentFormData((prev: typeof documentFormData) => ({
      ...prev,
      [name]: newValue as string,
    }));
  };

  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocumentFormData((prev: typeof documentFormData) => ({
        ...prev,
        file: e.target.files![0],
      }));
    } else {
      setDocumentFormData((prev: typeof documentFormData) => ({
        ...prev,
        file: null,
      }));
    }
  };

  const handleDocumentDateChange = (date: Date | undefined) => {
    setDocumentFormData((prev: typeof documentFormData) => ({
      ...prev,
      date_document: date ? format(date, "yyyy-MM-dd") : "",
    }));
  };

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projet?.id_projet) {
      toast.error("Le projet doit être chargé avant d'ajouter des documents.");
      return;
    }
    if (!documentFormData.file) {
      toast.error("Veuillez sélectionner un fichier à télécharger.");
      return;
    }
    if (!documentFormData.libelle_document.trim()) {
      toast.error("Veuillez entrer le libellé du document.");
      return;
    }
    if (documentFormData.id_nature_document === 0) {
      toast.error("Veuillez sélectionner la nature du document.");
      return;
    }
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (documentFormData.file.size > MAX_FILE_SIZE) {
      toast.error("La taille du fichier ne doit pas dépasser 5 Mo.");
      return;
    }
    try {
      await addDocumentToProjet(projet.id_projet, documentFormData.file, {
        libelle_document: documentFormData.libelle_document,
        classification_document: documentFormData.classification_document,
        date_document: documentFormData.date_document,
        id_nature_document: documentFormData.id_nature_document,
      });
      toast.success("Document ajouté avec succès !");
      setShowDocumentSheet(false);
      setDocumentFormData({
        libelle_document: "",
        classification_document: "",
        date_document: "",
        id_nature_document: 0,
        file: null,
      });
      // Rafraîchir la liste des documents
      const docsRes = await getDocumentsByProjetId(projet.id_projet);
      let docsToSet: Document[] = [];
      if (docsRes.documents && Array.isArray(docsRes.documents))
        docsToSet = docsRes.documents;
      else if (docsRes.data && Array.isArray(docsRes.data))
        docsToSet = docsRes.data;
      setDocuments(docsToSet);
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      toast.error("Échec de l'ajout du document.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Erreur de chargement</AlertTitle>
            <AlertDescription>
              {error}
              <Button
                variant="ghost"
                onClick={loadProjetData}
                className="ml-2 px-2 py-1 h-auto text-sm"
              >
                <RefreshCcw className="h-3 w-3 mr-1" /> Réessayer
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  if (!projet) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Projet introuvable !
            </h1>
            <Button
              onClick={() => navigate("/technique/projets")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const projectProgress = getProjectProgress();
  const projectStatus = getProjectStatus();
  const daysRemaining = getDaysRemaining();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Tabs pour organiser la page projet */}
          <Tabs value={getActiveTab(location.pathname)} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger asChild value="details">
                <NavLink to={`/technique/projets/${id}/details`} end>
                  Détails
                </NavLink>
              </TabsTrigger>
              <TabsTrigger asChild value="taches">
                <NavLink to={`/technique/projets/${id}/details/taches`}>
                  Tâches
                </NavLink>
              </TabsTrigger>
              <TabsTrigger asChild value="documents">
                <NavLink to={`/technique/projets/${id}/details/documents`}>
                  Documents
                </NavLink>
              </TabsTrigger>
              <TabsTrigger asChild value="livrables">
                <NavLink to={`/technique/projets/${id}/details/livrables`}>
                  Livrables
                </NavLink>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              {/* Header avec navigation améliorée */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/technique/projets")}
                    className="hover:bg-blue-100 transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Home className="h-4 w-4" />
                    <span>Projets</span>
                    <span>/</span>
                    <span className="font-medium text-gray-900">
                      {projet.nom_projet}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {projet.nom_projet}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600">
                      <span className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />#{projet.id_projet}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {projet.date_debut
                          ? format(new Date(projet.date_debut), "dd MMM yyyy", {
                              locale: fr,
                            })
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(
                          `/technique/projets/${projet.id_projet}/editer`
                        )
                      }
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Eye className="mr-2 h-4 w-4" />
                      Voir les tâches
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonne principale */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Carte de statut et progression */}
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            Statut du Projet
                          </h3>
                          <p className="text-blue-100">
                            {projectStatus.message}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">
                            {projectProgress}%
                          </div>
                          <div className="text-blue-100 text-sm">
                            Progression
                          </div>
                        </div>
                      </div>
                      <Progress
                        value={projectProgress}
                        className="h-3 bg-blue-500"
                      />
                      {daysRemaining !== null && (
                        <div className="mt-4 flex items-center gap-2 text-blue-100">
                          <Target className="h-4 w-4" />
                          <span>
                            {daysRemaining > 0
                              ? `${daysRemaining} jours restants`
                              : daysRemaining === 0
                              ? "Échéance aujourd'hui"
                              : `${Math.abs(daysRemaining)} jours de retard`}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Informations détaillées du projet */}
                  <Card className="shadow-lg border-0">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                      <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-600" />
                        Informations du Projet
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Tag className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="font-medium">Type de projet</div>
                              <div className="text-gray-600">
                                {projet.type_projet}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <div>
                              <div className="font-medium">
                                Budget estimatif
                              </div>
                              <div className="text-gray-600">
                                {formatCFA(projet.devis_estimatif)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Clock className="h-5 w-5 text-orange-600" />
                            <div>
                              <div className="font-medium">Durée prévue</div>
                              <div className="text-gray-600">
                                {projet.duree_prevu_projet} mois
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <MapPin className="h-5 w-5 text-red-600" />
                            <div>
                              <div className="font-medium">Lieu</div>
                              <div className="text-gray-600">
                                {projet.lieu || "Non spécifié"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <User className="h-5 w-5 text-purple-600" />
                            <div>
                              <div className="font-medium">Responsable</div>
                              <div className="text-gray-600">
                                {getResponsibleFullName(projet.responsable)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <LayoutGrid className="h-5 w-5 text-indigo-600" />
                            <div>
                              <div className="font-medium">Famille</div>
                              <div className="text-gray-600">
                                {getFamilleName(projet.id_famille)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {projet.description_projet && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">
                            Description
                          </h4>
                          <p className="text-blue-800">
                            {projet.description_projet}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Partenaires */}
                  {projet.id_partenaire && projet.id_partenaire.length > 0 && (
                    <Card className="shadow-lg border-0">
                      <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50 border-b">
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-green-600" />
                          Partenaires Associés
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="flex flex-wrap gap-3">
                          {projet.id_partenaire.map((pId) => (
                            <Badge
                              key={pId}
                              variant="secondary"
                              className="px-4 py-2 text-sm bg-green-100 text-green-800 hover:bg-green-200"
                            >
                              <Building2 className="mr-2 h-3 w-3" />
                              {getPartnerName(pId)}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Statut rapide */}
                  <Card className="shadow-lg border-0">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Vue d'ensemble
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          {projectProgress}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Progression globale
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Planifié
                          </span>
                          <Badge
                            variant={
                              projet.etat === "planifié"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {projet.etat === "planifié" ? "✓" : "○"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            En cours
                          </span>
                          <Badge
                            variant={
                              projet.etat === "en_cours"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {projet.etat === "en_cours" ? "✓" : "○"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Terminé</span>
                          <Badge
                            variant={
                              projet.etat === "terminé"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {projet.etat === "terminé" ? "✓" : "○"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions rapides */}
                  <Card className="shadow-lg border-0">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Actions rapides</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() =>
                          navigate(
                            `/technique/projets/${projet.id_projet}/editer`
                          )
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier le projet
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Ajouter un document
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <PackageOpen className="mr-2 h-4 w-4" />
                        Créer un livrable
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Gérer les partenaires
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Statistiques */}
                  <Card className="shadow-lg border-0">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Statistiques</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Documents</span>
                        <Badge variant="secondary">{documents.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Livrables</span>
                        <Badge variant="secondary">{livrables.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Partenaires
                        </span>
                        <Badge variant="secondary">
                          {projet.id_partenaire?.length || 0}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="taches">
              <Routes>
                <Route
                  path="taches"
                  element={
                    <>
                      <div className="flex justify-end mb-4">
                        <Button
                          onClick={handleOpenCreateTache}
                          className="bg-blue-600 text-white"
                        >
                          + Nouvelle tâche
                        </Button>
                      </div>
                      <Card className="shadow-lg border-0">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                          <CardTitle className="flex items-center gap-2">
                            Tâches du Projet
                            <Badge variant="secondary" className="ml-2">
                              {taches.length}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          {loadingTaches ? (
                            <div className="text-center py-8 text-gray-500">
                              Chargement des tâches...
                            </div>
                          ) : taches.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              Aucune tâche pour ce projet.
                            </div>
                          ) : (
                            <TacheTable
                              taches={taches}
                              onDelete={handleDeleteTache}
                              onView={handleViewTache}
                              onEdit={(id) => {
                                const tache = taches.find(
                                  (t) => t.id_tache === id
                                );
                                if (tache) handleOpenEditTache(tache);
                              }}
                              projets={[projet]}
                              employes={employes}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </>
                  }
                />
                <Route
                  path="tache/nouvelle"
                  element={
                    <TacheForm
                      onSave={handleSaveTache}
                      onCancel={() => navigate(-1)}
                      projetsDisponibles={[projet]}
                      employesDisponibles={employes}
                      isSubmitting={isSubmittingTache}
                    />
                  }
                />
                <Route
                  path="tache/:tacheId/editer"
                  element={<ProjectTacheEditWrapper />}
                />
                <Route
                  path="tache/:tacheId/detailsTache"
                  element={
                    <ProjectTaskDetailWrapper
                      taches={taches}
                      projet={projet}
                      onEdit={(tacheId: number) =>
                        navigate(
                          `/technique/projets/${id}/details/tache/${tacheId}/editer`
                        )
                      }
                    />
                  }
                />
              </Routes>
            </TabsContent>
            <TabsContent value="documents">
              {/* --- Section Documents du projet (déplacer ici la section documents) --- */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-orange-50 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-orange-600" />
                      Documents du Projet
                      <Badge variant="secondary" className="ml-2">
                        {documents.length}
                      </Badge>
                    </CardTitle>
                    <Sheet
                      open={showDocumentSheet}
                      onOpenChange={setShowDocumentSheet}
                    >
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" /> Ajouter un document
                        </Button>
                      </SheetTrigger>
                      <SheetContent
                        side="right"
                        className="w-full sm:max-w-md overflow-y-auto"
                      >
                        <SheetHeader>
                          <SheetTitle>Associer un Document</SheetTitle>
                          <SheetDescription>
                            Téléchargez un document et associez-le à ce projet.
                          </SheetDescription>
                        </SheetHeader>
                        <form
                          onSubmit={handleDocumentSubmit}
                          className="grid gap-4 py-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="documentFile">
                              Fichier du document{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="documentFile"
                              type="file"
                              onChange={handleDocumentFileChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="libelle_document">
                              Libellé du document{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="libelle_document"
                              name="libelle_document"
                              value={documentFormData.libelle_document}
                              onChange={handleDocumentInputChange}
                              placeholder="Entrez le libellé du document"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="classification_document">
                              Classification
                            </Label>
                            <Input
                              id="classification_document"
                              name="classification_document"
                              value={documentFormData.classification_document}
                              onChange={handleDocumentInputChange}
                              placeholder="Ex: Confidentiel, Public"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="date_document">
                              Date du document
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {documentFormData.date_document ? (
                                    format(
                                      parseISO(documentFormData.date_document),
                                      "dd MMMM yyyy",
                                      { locale: fr }
                                    )
                                  ) : (
                                    <span>Sélectionner une date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    documentFormData.date_document
                                      ? parseISO(documentFormData.date_document)
                                      : undefined
                                  }
                                  onSelect={handleDocumentDateChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="id_nature_document">
                              Nature du document{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                handleDocumentSelectChange(
                                  "id_nature_document",
                                  value
                                )
                              }
                              value={
                                documentFormData.id_nature_document
                                  ? String(documentFormData.id_nature_document)
                                  : ""
                              }
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une nature" />
                              </SelectTrigger>
                              <SelectContent>
                                {natureDocuments.map((nature) => (
                                  <SelectItem
                                    key={nature.id_nature_document}
                                    value={String(nature.id_nature_document)}
                                  >
                                    {nature.libelle}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <SheetFooter>
                            <Button type="submit">
                              <Save className="mr-2 h-4 w-4" /> Enregistrer
                              Document
                            </Button>
                          </SheetFooter>
                        </form>
                      </SheetContent>
                    </Sheet>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {documents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucun document associé à ce projet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documents.map((doc) => (
                        <Card
                          key={`projet-doc-${doc.id_documents}`}
                          className="border border-gray-200 hover:border-blue-300 transition-colors"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <h4 className="font-medium text-gray-900">
                                  {doc.libelle_document}
                                </h4>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleDeleteDocument(doc.id_documents)
                                }
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                              {doc.classification_document && (
                                <p>
                                  <span className="font-medium">
                                    Classification:
                                  </span>{" "}
                                  {doc.classification_document}
                                </p>
                              )}
                              {doc.date_document && (
                                <p>
                                  <span className="font-medium">Date:</span>{" "}
                                  {format(
                                    parseISO(doc.date_document),
                                    "dd MMM yyyy",
                                    { locale: fr }
                                  )}
                                </p>
                              )}
                            </div>

                            {doc.lien_document && (
                              <div className="mt-4">
                                <a
                                  href={`${STATIC_FILES_BASE_URL}/${doc.lien_document}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                  download
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Télécharger
                                </a>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="livrables">
              <Routes>
                <Route
                  path="livrables"
                  element={
                    <>
                      <div className="flex justify-end mb-4">
                        <Button
                          onClick={handleOpenCreateLivrable}
                          className="bg-purple-600 text-white"
                        >
                          + Nouveau livrable
                        </Button>
                      </div>
                      <Card className="shadow-lg border-0">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50 border-b">
                          <CardTitle className="flex items-center gap-2">
                            Livrables du Projet
                            <Badge variant="secondary" className="ml-2">
                              {
                                livrables.filter(
                                  (l) => l.id_projet === projet.id_projet
                                ).length
                              }
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          {livrables.filter(
                            (l) => l.id_projet === projet.id_projet
                          ).length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              Aucun livrable pour ce projet.
                            </div>
                          ) : (
                            <LivrableTable
                              livrables={livrables.filter(
                                (l) => l.id_projet === projet.id_projet
                              )}
                              onView={handleViewLivrable}
                              onEdit={handleOpenEditLivrable}
                              onDelete={handleDeleteLivrable}
                              projets={[projet]}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </>
                  }
                />
                <Route
                  path="livrable/nouveau"
                  element={
                    <LivrableForm
                      onSave={handleSaveLivrable}
                      onCancel={() => navigate(-1)}
                      projetsDisponibles={[projet]}
                      onSaveDocument={handleSaveDocument}
                      natureDocumentsDisponibles={natureDocuments}
                      embedded={true}
                    />
                  }
                />
                <Route
                  path="livrable/:livrableId/editer"
                  element={<ProjectLivrableEditWrapper embedded={true} />}
                />
                <Route
                  path="livrable/:livrableId/detailsLivrable"
                  element={<ProjectLivrableDetailsWrapper />}
                />
              </Routes>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

// Helper pour déterminer l'onglet actif selon l'URL
function getActiveTab(pathname: string) {
  if (pathname.includes("/taches") || pathname.includes("/tache/"))
    return "taches";
  if (pathname.includes("/documents")) return "documents";
  if (pathname.includes("/livrables") || pathname.includes("/livrable/"))
    return "livrables";
  return "details";
}

export default ProjetDetailsPage;
