import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { LivrableForm } from '../components/LivrableForm';
import { Livrable, Projet, CreateLivrablePayload, UpdateLivrablePayload, CreateDocumentTextPayload, ApiResponse, Nature } from '../../types/types';
import { createLivrable, addDocumentToLivrable, getLivrableById, getAllNatureDocuments, updateLivrable } from '../api/livrables';
import { fetchAllProjets } from '../../projet/api/projets';
import { usePartenairesApi } from '../../projet/api/partenaires';
import { Partenaires } from "@/modules/administration-Finnance/administration/types/interfaces";
import { toast } from 'sonner';

// Interface pour adapter les partenaires au format attendu par LivrableForm
interface PartenaireOption {
  id_partenaire: number;
  nom_partenaire: string;
}

const CreerLivrablePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getPartenaires } = usePartenairesApi();

  const [livrable, setLivrable] = useState<Livrable | undefined>(undefined);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [partenaires, setPartenaires] = useState<PartenaireOption[]>([]);
  const [natureDocuments, setNatureDocuments] = useState<Nature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour charger les données avec cache clearing
  const loadData = async (forceFresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Invalider le cache avant de charger si on veut des données fraîches
      if (forceFresh) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['partenaires'] }),
          queryClient.invalidateQueries({ queryKey: ['projets'] }),
        ]);
      }

      // Fetch projects, partenaires and document natures in parallel
      const [fetchedProjetsRaw, fetchedPartenaires, fetchedNatureDocumentsResponse] = await Promise.all([
        fetchAllProjets(1, 1000), // Récupérer jusqu'à 1000 projets (page 1, limite 1000)
        getPartenaires({ limit: 1000, page: 1 }), // Charger tous les partenaires
        getAllNatureDocuments(),
      ]);

      let projectsToSet: Projet[] = [];
      if (fetchedProjetsRaw && typeof fetchedProjetsRaw === 'object' && ('data' in fetchedProjetsRaw || 'success' in fetchedProjetsRaw)) {
        const apiResponse = fetchedProjetsRaw as ApiResponse<Projet[]>; 
        if (apiResponse.data && Array.isArray(apiResponse.data)) {
          projectsToSet = apiResponse.data;
          console.log("[CreerLivrablePage] Projets récupérés via ApiResponse.data:", projectsToSet);
          
          // Debug détaillé des projets avec leurs partenaires
          projectsToSet.forEach((projet, index) => {
            console.log(`[CreerLivrablePage] Projet ${index + 1}:`, {
              id_projet: projet.id_projet,
              nom_projet: projet.nom_projet,
              id_partenaire: projet.id_partenaire,
              type_id_partenaire: typeof projet.id_partenaire,
              is_array: Array.isArray(projet.id_partenaire),
              length: Array.isArray(projet.id_partenaire) ? projet.id_partenaire.length : 'N/A'
            });
          });
        } else {
          console.warn("Structure d'ApiResponse inattendue pour la récupération des projets, données manquantes ou mal placées:", fetchedProjetsRaw);
          toast.warning("Impossible de charger les projets. Données de l'API inattendues.");
        }
      } else if (Array.isArray(fetchedProjetsRaw)) {
        projectsToSet = fetchedProjetsRaw;
        console.log("[CreerLivrablePage] Projets récupérés directement sous forme de tableau:", projectsToSet);
        
        // Debug détaillé des projets avec leurs partenaires (cas tableau direct)
        projectsToSet.forEach((projet, index) => {
          console.log(`[CreerLivrablePage] Projet ${index + 1} (tableau):`, {
            id_projet: projet.id_projet,
            nom_projet: projet.nom_projet,
            id_partenaire: projet.id_partenaire,
            type_id_partenaire: typeof projet.id_partenaire,
            is_array: Array.isArray(projet.id_partenaire),
            length: Array.isArray(projet.id_partenaire) ? projet.id_partenaire.length : 'N/A'
          });
        });
      } else {
        console.warn("Structure de réponse inattendue pour la récupération des projets: ni ApiResponse ni un tableau direct.", fetchedProjetsRaw);
        toast.warning("Impossible de charger les projets. Structure de réponse inattendue.");
      }
      setProjets(projectsToSet);

      // Handle Partenaires response
      const partenairesOptions: PartenaireOption[] = fetchedPartenaires.map((p: Partenaires) => ({
        id_partenaire: p.id_partenaire,
        nom_partenaire: p.nom_partenaire
      }));
      setPartenaires(partenairesOptions);
      console.log("[CreerLivrablePage] Partenaires récupérés:", partenairesOptions);

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

  useEffect(() => {
    loadData(true); // Charger avec des données fraîches au montage
  }, []);

  // Fonction pour rafraîchir les données manuellement
  const refreshData = async () => {
    await loadData(true);
  };

  const handleSaveLivrable = async (payload: CreateLivrablePayload | UpdateLivrablePayload) => {
    try {
      console.log("[CreerLivrablePage] Payload reçu pour création:", payload);
      const newLivrable = await createLivrable(payload as CreateLivrablePayload);
      console.log("[CreerLivrablePage] Livrable créé avec succès:", newLivrable);
      toast.success("Livrable créé avec succès !");
      navigate("/gestion-des-projets/projets/livrables");
    } catch (error) {
      console.error("[CreerLivrablePage] Erreur lors de la création du livrable:", error);
      toast.error("Erreur lors de la création du livrable.");
    }
  };

  const handleCancel = () => {
    navigate("/gestion-des-projets/projets/livrables");
  };

  const handleSaveDocument = async (
    livrableId: number,
    documentFile: File,
    textPayload: CreateDocumentTextPayload
  ) => {
    try {
      await addDocumentToLivrable(livrableId, documentFile, textPayload);
      console.log("[CreerLivrablePage] Document ajouté avec succès au livrable:", livrableId);
    } catch (error) {
      console.error("[CreerLivrablePage] Erreur lors de l'ajout du document:", error);
      throw error;
    }
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
        Erreur lors du chargement des données. 
        <button 
          onClick={refreshData}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
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
      natureDocumentsDisponibles={natureDocuments || []}
      partenairesDisponibles={partenaires}
    />
  );
};

export default CreerLivrablePage;