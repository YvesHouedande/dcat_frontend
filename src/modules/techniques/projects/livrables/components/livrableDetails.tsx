// src/pages/LivrableDetailsPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { ArrowLeft, Edit, FileText, Download, Trash2, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Save } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";

// Import components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Import types
import { Livrable, Projet, Document, ApiResponse, Nature, CreateDocumentTextPayload } from "../../types/types";

// Import API functions
import {
  getLivrableById,
  deleteDocumentFromLivrable,
  getDocumentsByLivrableId,
  addDocumentToLivrable,
  getAllNatureDocuments,
} from "../api/livrables";
import { fetchAllProjets } from "../../projet/api/projets";
import Layout from "@/components/Layout";

// Get API_URL from environment variables (assuming it's available)
const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

// Determine the base URL for static files (media, documents, etc.)
// Assumes API_BASE_URL ends with /api (e.g., https://erpback.dcat.ci/api)
// and static files are served from the root domain (e.g., https://erpback.dcat.ci/media/...)
const STATIC_FILES_BASE_URL = API_BASE_URL.endsWith('/api') 
  ? API_BASE_URL.slice(0, -4) // Remove '/api' from the end
  : API_BASE_URL; // Otherwise, use it as is

interface LivrableDetailsPageProps {
  embedded?: boolean;
}

const LivrableDetailsPage: React.FC<LivrableDetailsPageProps> = ({ embedded = false }) => {
  const params = useParams<{ id?: string; livrableId?: string }>();
  const livrableId = params.livrableId || params.id;
  const navigate = useNavigate();

  const [livrable, setLivrable] = useState<Livrable | undefined>(undefined);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDocumentSheet, setShowDocumentSheet] = useState(false);
  const [natureDocuments, setNatureDocuments] = useState<Nature[]>([]);
  const [documentFormData, setDocumentFormData] = useState<CreateDocumentTextPayload & { file: File | null }>({
    libelle_document: "",
    classification_document: "",
    date_document: "",
    id_nature_document: 0,
    file: null,
  });

  const getProjectName = (projectId: number): string => {
    const project = projets.find((p) => p.id_projet === projectId);
    return project ? project.nom_projet : "Projet Inconnu";
  };

  const getApprobationBadge = (approbation: Livrable["approbation"]) => {
    switch (approbation) {
      case "en attente":
        return <Badge variant="secondary">En attente</Badge>;
      case "approuvé":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approuvé</Badge>;
      case "rejeté":
        return <Badge variant="destructive">Rejeté</Badge>;
      case "révisions requises":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Révisions requises</Badge>;
      default:
        return <Badge variant="outline">{approbation}</Badge>;
    }
  };

  useEffect(() => {
    const loadLivrableAndDocuments = async () => {
      setLoading(true);
      setError(null);
      try {
        const livrableIdNum = Number(livrableId);
        if (isNaN(livrableIdNum)) {
          setError("ID de livrable invalide dans l'URL.");
          setLoading(false);
          toast.error("Erreur: ID de livrable invalide.");
          return;
        }

        const [fetchedLivrable, fetchedProjetsRaw, fetchedDocumentsResponse] = await Promise.all([
          getLivrableById(livrableIdNum),
          fetchAllProjets(),
          getDocumentsByLivrableId(livrableIdNum),
        ]);

        setLivrable(fetchedLivrable);

        let projectsToSet: Projet[] = [];
        if (fetchedProjetsRaw && typeof fetchedProjetsRaw === 'object' && ('data' in fetchedProjetsRaw || 'success' in fetchedProjetsRaw)) {
          const apiResponse = fetchedProjetsRaw as ApiResponse<Projet[]>; 
          if (apiResponse.data && Array.isArray(apiResponse.data)) {
            projectsToSet = apiResponse.data;
          }
        } else if (Array.isArray(fetchedProjetsRaw)) {
          projectsToSet = fetchedProjetsRaw;
        }
        setProjets(projectsToSet);

        let docsToSet: Document[] = [];
        if (fetchedDocumentsResponse.documents && Array.isArray(fetchedDocumentsResponse.documents)) {
          docsToSet = fetchedDocumentsResponse.documents;
        } else if (fetchedDocumentsResponse.data && Array.isArray(fetchedDocumentsResponse.data)) {
          docsToSet = fetchedDocumentsResponse.data;
        }
        setDocuments(docsToSet);

        if (!fetchedLivrable) {
          setError(`Livrable introuvable ! L'ID ${livrableId} ne correspond à aucun livrable existant.`);
          toast.error(`Livrable introuvable ! L'ID ${livrableId} ne correspond à aucun livrable existant.`);
        }

        // Charger les natures de document
        getAllNatureDocuments().then((res) => {
          if (Array.isArray(res)) setNatureDocuments(res);
          else if (res && Array.isArray(res.data)) setNatureDocuments(res.data);
        });
      } catch (err) {
        console.error("Erreur lors du chargement des détails du livrable :", err);
        setError("Une erreur est survenue lors du chargement des détails. Veuillez réessayer.");
        toast.error("Erreur de chargement: " + (err instanceof Error ? err.message : "Erreur inconnue"));
      } finally {
        setLoading(false);
      }
    };

    loadLivrableAndDocuments();
  }, [livrableId]);

  const handleDeleteDocument = async (documentId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      try {
        await deleteDocumentFromLivrable(Number(livrableId), documentId);
        setDocuments(prevDocs => prevDocs.filter(doc => doc.id_documents !== documentId));
        toast.success("Document supprimé avec succès !");
      } catch (err) {
        console.error("Erreur lors de la suppression du document :", err);
        toast.error("Échec de la suppression du document.");
      }
    }
  };

  const handleDocumentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDocumentFormData((prev: typeof documentFormData) => ({ ...prev, [name]: value }));
  };

  const handleDocumentSelectChange = (name: keyof CreateDocumentTextPayload, value: string) => {
    const newValue = name === "id_nature_document" ? Number(value) : value;
    setDocumentFormData((prev: typeof documentFormData) => ({ ...prev, [name]: newValue as string }));
  };

  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocumentFormData((prev: typeof documentFormData) => ({ ...prev, file: e.target.files![0] }));
    } else {
      setDocumentFormData((prev: typeof documentFormData) => ({ ...prev, file: null }));
    }
  };

  const handleDocumentDateChange = (date: Date | undefined) => {
    setDocumentFormData((prev: typeof documentFormData) => ({ ...prev, date_document: date ? format(date, "yyyy-MM-dd") : "" }));
  };

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!livrable?.id_livrable) {
      toast.error("Le livrable doit être chargé avant d'ajouter des documents.");
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
      await addDocumentToLivrable(
        livrable.id_livrable,
        documentFormData.file,
        {
          libelle_document: documentFormData.libelle_document,
          classification_document: documentFormData.classification_document,
          date_document: documentFormData.date_document,
          id_nature_document: documentFormData.id_nature_document,
        }
      );
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
      const docsRes = await getDocumentsByLivrableId(livrable.id_livrable);
      let docsToSet: Document[] = [];
      if (docsRes.documents && Array.isArray(docsRes.documents)) docsToSet = docsRes.documents;
      else if (docsRes.data && Array.isArray(docsRes.data)) docsToSet = docsRes.data;
      setDocuments(docsToSet);
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      toast.error("Échec de l'ajout du document.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[150px] w-full rounded-lg" />
        <Skeleton className="h-[100px] w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-red-600 text-lg">
        <p>{error}</p>
        {!embedded && (
          <Button onClick={() => navigate("/technique/projets/livrables")} className="mt-4">
            Retour à la liste des livrables
          </Button>
        )}
      </div>
    );
  }

  if (!livrable) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-gray-600 text-lg">
        <p>Le livrable demandé n'existe pas.</p>
        {!embedded && (
          <Button onClick={() => navigate("/technique/projets/livrables")} className="mt-4">
            Retour à la liste des livrables
          </Button>
        )}
      </div>
    );
  }

  const detailContent = (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          {!embedded && (
            <Button onClick={() => navigate("/technique/projets/livrables")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour
            </Button>
          )}
          {!embedded && (
            <Button onClick={() => navigate(`/technique/projets/livrables/${livrable.id_livrable}/editer`)}>
              <Edit className="mr-2 h-4 w-4" /> Modifier
            </Button>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">{livrable.libelle_livrable}</h1>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Projet Parent :</span> {getProjectName(livrable.id_projet)}
        </p>
        <p className="text-gray-600 mb-4">
          <span className="font-semibold">Date :</span>{" "}
          {livrable.date ? format(parseISO(livrable.date), "dd MMMMyyyy", { locale: fr }) : "N/A"}
        </p>

        <div className="mb-6">
          <span className="font-semibold text-gray-700">Statut d'approbation :</span>{" "}
          {getApprobationBadge(livrable.approbation)}
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-4">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-xl font-semibold text-gray-700">Réalisations</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-gray-700">
              <p>{livrable.realisations || "Aucune réalisation enregistrée."}</p>
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-xl font-semibold text-gray-700">Réserves</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-gray-700">
              <p>{livrable.reserves || "Aucune réserve enregistrée."}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="p-4 mb-6">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-xl font-semibold text-gray-700">Recommandation</CardTitle>
          </CardHeader>
          <CardContent className="p-0 text-gray-700">
            <p>{livrable.recommandation || "Aucune recommandation enregistrée."}</p>
          </CardContent>
        </Card>

        {/* Section Documents Associés */}
        <Separator className="my-6" />
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Documents Associés</h2>
          <Sheet open={showDocumentSheet} onOpenChange={setShowDocumentSheet}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Associer un document
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Associer un Document</SheetTitle>
                <SheetDescription>
                  Téléchargez un document et associez-le à ce livrable.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleDocumentSubmit} className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="documentFile">Fichier du document <span className="text-red-500">*</span></Label>
                  <Input
                    id="documentFile"
                    type="file"
                    onChange={handleDocumentFileChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="libelle_document">Libellé du document <span className="text-red-500">*</span></Label>
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
                  <Label htmlFor="classification_document">Classification</Label>
                  <Input
                    id="classification_document"
                    name="classification_document"
                    value={documentFormData.classification_document}
                    onChange={handleDocumentInputChange}
                    placeholder="Ex: Confidentiel, Public"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_document">Date du document</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {documentFormData.date_document ? (
                          format(parseISO(documentFormData.date_document), "dd MMMM yyyy", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={documentFormData.date_document ? parseISO(documentFormData.date_document) : undefined}
                        onSelect={handleDocumentDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id_nature_document">Nature du document <span className="text-red-500">*</span></Label>
                  <Select
                    onValueChange={(value) => handleDocumentSelectChange("id_nature_document", value)}
                    value={documentFormData.id_nature_document ? String(documentFormData.id_nature_document) : ""}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une nature" />
                    </SelectTrigger>
                    <SelectContent>
                      {natureDocuments.map((nature) => (
                        <SelectItem key={nature.id_nature_document} value={String(nature.id_nature_document)}>
                          {nature.libelle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <SheetFooter>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Enregistrer Document
                  </Button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        {documents.length === 0 ? (
          <p className="text-gray-600">Aucun document associé à ce livrable.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <Card key={doc.id_documents} className="flex flex-col p-4">
                <CardHeader className="p-0 pb-2 flex-row justify-between items-start">
                  <FileText className="h-6 w-6 text-blue-500 mr-2" />
                  <CardTitle className="text-lg font-semibold text-gray-700 flex-grow">
                    {doc.libelle_document}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteDocument(doc.id_documents)}
                    title="Supprimer le document"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0 text-sm text-gray-600 flex-grow">
                  {doc.classification_document && (
                    <p>
                      <span className="font-medium">Classification:</span> {doc.classification_document}
                    </p>
                  )}
                  {doc.date_document && (
                    <p>
                      <span className="font-medium">Date du document:</span>{" "}
                      {format(parseISO(doc.date_document), "dd MMMMyyyy", { locale: fr })}
                    </p>
                  )}
                </CardContent>
                <div className="mt-4">
                  {doc.lien_document ? (
                    // Construct the full download URL using STATIC_FILES_BASE_URL
                    <a
                      href={`${STATIC_FILES_BASE_URL}/${doc.lien_document}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      download
                    >
                      <Download className="mr-2 h-4 w-4" /> Télécharger
                    </a>
                  ) : (
                    <span className="text-gray-500">Lien de téléchargement non disponible</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return embedded ? detailContent : <Layout>{detailContent}</Layout>;
};

export default LivrableDetailsPage;