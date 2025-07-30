import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { LivrableForm } from '../components/LivrableForm';
import { Livrable, Projet, CreateLivrablePayload, ApiResponse, Nature, CreateDocumentTextPayload } from '../../types/types';
import { createLivrable, getAllNatureDocuments, addDocumentToLivrable } from '../api/livrables';
import { fetchAllProjets } from '../../projet/api/projets';
import { usePartenairesApi } from '../../projet/api/partenaires';
import { Partenaires } from "@/modules/administration-Finnance/administration/types/interfaces";
import { toast } from 'sonner';

// Interface pour adapter les partenaires au format attendu par LivrableForm
interface PartenaireOption {
  id_partenaire: number;
  nom_partenaire: string;
}

// Interface pour les documents temporaires en attente d'association
interface PendingDocument {
  id: string; // ID temporaire unique
  file: File;
  textPayload: CreateDocumentTextPayload;
}

const CreerLivrablePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getPartenaires } = usePartenairesApi();

  const [projets, setProjets] = useState<Projet[]>([]);
  const [partenaires, setPartenaires] = useState<PartenaireOption[]>([]);
  const [natureDocuments, setNatureDocuments] = useState<Nature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour charger les données avec cache clearing
  const loadData = useCallback(async (forceFresh = false) => {
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
        } else {
          console.warn("Structure d'ApiResponse inattendue pour la récupération des projets, données manquantes ou mal placées:", fetchedProjetsRaw);
          toast.warning("Impossible de charger les projets. Données de l'API inattendues.");
        }
      } else if (Array.isArray(fetchedProjetsRaw)) {
        projectsToSet = fetchedProjetsRaw;
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

      // Handle NatureDocument response
      let naturesToSet: Nature[] = [];
      if (fetchedNatureDocumentsResponse && typeof fetchedNatureDocumentsResponse === 'object' && ('data' in fetchedNatureDocumentsResponse || 'success' in fetchedNatureDocumentsResponse)) {
          const apiResponse = fetchedNatureDocumentsResponse as ApiResponse<Nature[]>;
          if (apiResponse.data && Array.isArray(apiResponse.data)) {
              naturesToSet = apiResponse.data;
          } else {
              console.warn("Structure d'ApiResponse inattendue pour la récupération des natures de document, données manquantes:", fetchedNatureDocumentsResponse);
              toast.warning("Impossible de charger les natures de document. Données de l'API inattendues.");
          }
      } else if (Array.isArray(fetchedNatureDocumentsResponse)) {
          naturesToSet = fetchedNatureDocumentsResponse;
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
  }, [queryClient, getPartenaires]);

  useEffect(() => {
    loadData(true); // Charger avec des données fraîches au montage
  }, [loadData]);

  // Fonction pour rafraîchir les données manuellement
  const refreshData = async () => {
    await loadData(true);
  };

  const handleSaveLivrable = async (
    payload: CreateLivrablePayload | Partial<Omit<Livrable, "documents" | "id_livrable">>,
    pendingDocuments?: PendingDocument[]
  ) => {
    try {
      // 1. Créer le livrable d'abord
      const createdLivrable = await createLivrable(payload as CreateLivrablePayload);
      
      // 2. Si des documents sont en attente et que le livrable a été créé avec succès
      if (pendingDocuments && pendingDocuments.length > 0 && createdLivrable.id_livrable) {
        toast.success(`Livrable créé avec succès ! Association de ${pendingDocuments.length} document(s)...`);
        
        // 3. Associer chaque document au livrable créé
        let successCount = 0;
        let errorCount = 0;
        
        for (const pendingDoc of pendingDocuments) {
          try {
            await addDocumentToLivrable(
              createdLivrable.id_livrable,
              pendingDoc.file,
              pendingDoc.textPayload
            );
            successCount++;
          } catch (docError) {
            console.error(`Erreur lors de l'association du document ${pendingDoc.textPayload.libelle_document}:`, docError);
            errorCount++;
          }
        }
        
        // 4. Afficher le résultat final
        if (errorCount === 0) {
          toast.success(`Livrable créé et ${successCount} document(s) associé(s) avec succès !`);
        } else if (successCount > 0) {
          toast.warning(`Livrable créé avec succès ! ${successCount} document(s) associé(s), ${errorCount} échec(s).`);
        } else {
          toast.error(`Livrable créé mais échec de l'association de tous les documents (${errorCount} échec(s)).`);
        }
      } else {
        toast.success("Livrable créé avec succès !");
      }
      
      navigate('/gestion-des-projets/projets/livrables');
    } catch (err) {
      console.error("Erreur lors de la création du livrable:", err);
      toast.error("Erreur lors de la création du livrable");
    }
  };

  const handleCancel = () => {
    navigate('/gestion-des-projets/projets/livrables');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-lg text-red-600 mb-4">{error}</div>
        <button 
          onClick={refreshData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <LivrableForm
      onSave={handleSaveLivrable}
      onCancel={handleCancel}
      projetsDisponibles={projets}
      partenairesDisponibles={partenaires}
      natureDocumentsDisponibles={natureDocuments}
    />
  );
};

export default CreerLivrablePage;