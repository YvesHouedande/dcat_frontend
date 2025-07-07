import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LivrableForm } from '../components/LivrableForm';
import { Livrable, Projet, CreateLivrablePayload, UpdateLivrablePayload, CreateDocumentTextPayload, ApiResponse, Nature } from '../../types/types';
import { createLivrable, addDocumentToLivrable, getLivrableById, getAllNatureDocuments, updateLivrable } from '../api/livrables';
import { fetchAllProjets } from '../../projet/api/projets';
import { toast } from 'sonner';

const CreerLivrablePage = () => {
  const navigate = useNavigate();

  const [livrable, setLivrable] = useState<Livrable | undefined>(undefined);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [natureDocuments, setNatureDocuments] = useState<Nature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch projects and document natures in parallel
        const [fetchedProjetsRaw, fetchedNatureDocumentsResponse] = await Promise.all([
          fetchAllProjets(),
          getAllNatureDocuments(),
        ]);

        let projectsToSet: Projet[] = [];
        if (fetchedProjetsRaw && typeof fetchedProjetsRaw === 'object' && ('data' in fetchedProjetsRaw || 'success' in fetchedProjetsRaw)) {
          const apiResponse = fetchedProjetsRaw as ApiResponse<Projet[]>; 
          if (apiResponse.data && Array.isArray(apiResponse.data)) {
            projectsToSet = apiResponse.data;
            console.log("[CreerLivrablePage] Projets récupérés via ApiResponse.data:", projectsToSet);
          } else {
            console.warn("Structure d'ApiResponse inattendue pour la récupération des projets, données manquantes ou mal placées:", fetchedProjetsRaw);
            toast.warning("Impossible de charger les projets. Données de l'API inattendues.");
          }
        } else if (Array.isArray(fetchedProjetsRaw)) {
          projectsToSet = fetchedProjetsRaw;
          console.log("[CreerLivrablePage] Projets récupérés directement sous forme de tableau:", projectsToSet);
        } else {
          console.warn("Structure de réponse inattendue pour la récupération des projets: ni ApiResponse ni un tableau direct.", fetchedProjetsRaw);
          toast.warning("Impossible de charger les projets. Structure de réponse inattendue.");
        }
        setProjets(projectsToSet);

        // Handle NatureDocument response
        let naturesToSet: Nature[] = [];
        if (fetchedNatureDocumentsResponse && typeof fetchedNatureDocumentsResponse === 'object' && ('data' in fetchedNatureDocumentsResponse || 'success' in fetchedNatureDocumentsResponse)) {
            const apiResponse = fetchedNatureDocumentsResponse as ApiResponse<Nature[]>;
            if (apiResponse.data && Array.isArray(apiResponse.data)) {
                naturesToSet = apiResponse.data;
                console.log("[CreerLivrablePage] Natures de document récupérées via ApiResponse.data:", naturesToSet);
            } else {
                console.warn("Structure d'ApiResponse inattendue pour la récupération des natures de document, données manquantes:", fetchedNatureDocumentsResponse);
                toast.warning("Impossible de charger les natures de document. Données de l'API inattendues.");
            }
        } else if (Array.isArray(fetchedNatureDocumentsResponse)) {
            naturesToSet = fetchedNatureDocumentsResponse;
            console.log("[CreerLivrablePage] Natures de document récupérées directement sous forme de tableau:", naturesToSet);
        } else {
            console.warn("Structure de réponse inattendue pour la récupération des natures de document: ni ApiResponse ni un tableau direct.", fetchedNatureDocumentsResponse);
            toast.warning("Impossible de charger les natures de document. Structure de réponse inattendue.");
        }
        setNatureDocuments(naturesToSet);

      } catch (err) {
        console.error("Erreur lors du chargement des données pour le livrable :", err);
        setError("Une erreur est survenue lors du chargement des données. Veuillez réessayer.");
        toast.error("Erreur de chargement: " + (err instanceof Error ? err.message : "Erreur inconnue"));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSaveLivrable = async (
    payload: CreateLivrablePayload | UpdateLivrablePayload
  ) => {
    try {
      // If livrable is already created, it's an update operation
      if (livrable && livrable.id_livrable !== 0) {
        // This path is less likely in a "Creer" page unless the user re-edits after initial creation
        const updatedLivrable = await updateLivrable(livrable.id_livrable, payload as UpdateLivrablePayload);
        setLivrable(updatedLivrable); // Update the state with the modified livrable
        toast.success(`Livrable "${updatedLivrable.libelle_livrable}" mis à jour avec succès !`);
        navigate('/technique/projets/livrables'); // Also redirect on update for consistency
      } else {
        // Otherwise, it's a creation operation
        const nouveauLivrable = await createLivrable(payload as CreateLivrablePayload);
        toast.success(`Livrable "${nouveauLivrable.libelle_livrable}" créé avec succès !`);
        navigate('/technique/projets/livrables'); // Redirect to the main page after creation
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du livrable :", err);
      toast.error("Échec de l'enregistrement du livrable.");
    }
  };

  const handleSaveDocument = async (livrableId: number, documentFile: File, textPayload: CreateDocumentTextPayload) => {
    try {
      await addDocumentToLivrable(livrableId, documentFile, textPayload);
      toast.success("Document associé avec succès !");
      // Optionally re-fetch the livrable to update its documents array in the state
      const updatedLivrable = await getLivrableById(livrableId);
      if (updatedLivrable) {
        setLivrable(updatedLivrable);
      }
    } catch (err) {
      console.error("Erreur lors de l'association du document :", err);
      toast.error("Échec de l'association du document.");
      throw err;
    }
  };

  const handleCancel = () => {
    navigate('/technique/projets/livrables');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Chargement des données du formulaire...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg font-bold text-center">
        {error}
      </div>
    );
  }

  if (projets.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-orange-500 text-lg font-bold text-center">
        Impossible de créer un livrable : aucun projet disponible.
        <br/>
        Veuillez créer des projets avant de pouvoir ajouter un livrable.
      </div>
    );
  }

  return (
    <LivrableForm
      initialData={livrable}
      onSave={handleSaveLivrable}
      onCancel={handleCancel}
      projetsDisponibles={projets}
      onSaveDocument={handleSaveDocument}
      natureDocumentsDisponibles={natureDocuments}
    />
  );
};

export default CreerLivrablePage;