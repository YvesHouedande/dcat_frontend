// src/pages/EditerLivrablePage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { LivrableForm } from '../components/LivrableForm'; // Chemin correct vers votre LivrableForm
import { Livrable, Projet, CreateLivrablePayload, UpdateLivrablePayload, CreateDocumentTextPayload, ApiResponse, Nature } from '../../types/types'; // Import Nature type
import { useLivrableService } from '../api/livrables'; // Import getAllNatureDocuments
import { useProjetService } from '../../projet/api/projets'; // Assumant que c'est le chemin correct pour l'API des projets
import { usePartenairesApi } from '../../projet/api/partenaires';
import { Partenaires } from "@/modules/administration-Finnance/administration/types/interfaces";
import { toast } from 'sonner'; // Importation de toast pour les messages

// Interface pour adapter les partenaires au format attendu par LivrableForm
interface PartenaireOption {
  id_partenaire: number;
  nom_partenaire: string;
}

const EditerLivrablePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getPartenaires } = usePartenairesApi();
  const { getLivrableById, updateLivrable, addDocumentToLivrable, getAllNatureDocuments } = useLivrableService();
  const { fetchAllProjets } = useProjetService();
  const [livrable, setLivrable] = useState<Livrable | undefined>(undefined);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [partenaires, setPartenaires] = useState<PartenaireOption[]>([]);
  const [natureDocuments, setNatureDocuments] = useState<Nature[]>([]); // Changed to Nature[]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour charger les données avec cache clearing
  const loadData = async (forceFresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const livrableId = Number(id);
      if (isNaN(livrableId)) {
        setError("ID de livrable invalide dans l'URL.");
        setLoading(false);
        toast.error("Erreur: ID de livrable invalide."); // Utilisation de toast pour le feedback utilisateur
        return;
      }

      // Invalider le cache avant de charger si on veut des données fraîches
      if (forceFresh) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['partenaires'] }),
          queryClient.invalidateQueries({ queryKey: ['projets'] }),
        ]);
      }

      // Exécution des appels API en parallèle
      const [fetchedLivrable, fetchedProjetsRaw, fetchedPartenaires, fetchedNatureDocumentsRaw] = await Promise.all([
        getLivrableById(livrableId), // Appelle l'API réelle, retourne Promise<Livrable | undefined>
        fetchAllProjets(1, 1000), // Récupérer jusqu'à 1000 projets (page 1, limite 1000)
        getPartenaires({ limit: 1000, page: 1 }), // Charger tous les partenaires
        getAllNatureDocuments(), // Now returns Promise<Nature[]> directly
      ]);

      setLivrable(fetchedLivrable);

      let projectsToSet: Projet[] = [];

      // Extraction des projets de la réponse de l'API
      if (fetchedProjetsRaw && typeof fetchedProjetsRaw === 'object' && ('data' in fetchedProjetsRaw || 'success' in fetchedProjetsRaw)) {
        const apiResponse = fetchedProjetsRaw as ApiResponse<Projet[]>; 
        if (apiResponse.data && Array.isArray(apiResponse.data)) {
          projectsToSet = apiResponse.data;
          console.log("[EditerLivrablePage] Projets récupérés via ApiResponse.data:", projectsToSet);
        } else {
          console.warn("Structure d'ApiResponse inattendue pour la récupération des projets, données manquantes:", fetchedProjetsRaw);
          toast.warning("Impossible de charger les projets. Données de l'API inattendues.");
        }
      } else if (Array.isArray(fetchedProjetsRaw)) {
        projectsToSet = fetchedProjetsRaw;
        console.log("[EditerLivrablePage] Projets récupérés directement sous forme de tableau:", projectsToSet);
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
      console.log("[EditerLivrablePage] Partenaires récupérés:", partenairesOptions);

      // Handle Nature response - expecting a direct array of Nature objects
      if (Array.isArray(fetchedNatureDocumentsRaw)) {
          setNatureDocuments(fetchedNatureDocumentsRaw);
          console.log("[EditerLivrablePage] Natures de document récupérées directement sous forme de tableau:", fetchedNatureDocumentsRaw);
      } else {
          console.warn("Structure de réponse inattendue pour la récupération des natures de document: n'est pas un tableau direct.", fetchedNatureDocumentsRaw);
          toast.warning("Impossible de charger les natures de document. Structure de réponse inattendue.");
          setNatureDocuments([]);
      }

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
  }, [id, loadData]);

  // Fonction pour rafraîchir les données manuellement
  const refreshData = async () => {
    await loadData(true);
  };

  // Gère la sauvegarde du livrable (appelé depuis LivrableForm)
  const handleSaveLivrable = async (
    payload: CreateLivrablePayload | UpdateLivrablePayload
  ) => {
    try {
      if (!livrable?.id_livrable) { // Vérifie si nous avons un ID pour l'opération de mise à jour
        toast.error("Impossible de mettre à jour : ID du livrable manquant.");
        return;
      }
      // Effectue l'appel API de mise à jour. Nous castons le payload vers UpdateLivrablePayload
      // car cette fonction est déclenchée pour une mise à jour d'un livrable existant.
      const updated = await updateLivrable(livrable.id_livrable, payload as UpdateLivrablePayload);
      toast.success(`Livrable "${updated.libelle_livrable}" mis à jour avec succès !`);
      navigate('/gestion-des-projets/projets/livrables'); // Redirige après succès
    } catch (err) {
      console.error("Erreur lors de la mise à jour du livrable :", err);
      toast.error("Échec de la mise à jour du livrable.");
    }
  };

  // Nouveau gestionnaire pour l'enregistrement de documents (passé à LivrableForm)
  const handleSaveDocument = async (livrableId: number, documentFile: File, textPayload: CreateDocumentTextPayload) => {
    try {
      await addDocumentToLivrable(livrableId, documentFile, textPayload);
      toast.success("Document associé avec succès !");
      // Optionnel: Recharger les données du livrable pour que la liste des documents dans le formulaire soit mise à jour.
      // Cela peut être utile si LivrableForm doit afficher la liste des documents associés.
      // if (livrableId) {
      //   const updatedLivrable = await getLivrableById(livrableId);
      //   if (updatedLivrable) {
      //     setLivrable(updatedLivrable);
      //   }
      // }
    } catch (err) {
      console.error("Erreur lors de l'association du document :", err);
      toast.error("Échec de l'association du document.");
      throw err; // Relance l'erreur pour que LivrableForm puisse l'intercepter et afficher son propre toast d'erreur
    }
  };

  const handleCancel = () => {
    navigate('/gestion-des-projets/projets/livrables'); // Redirige vers la liste des livrables en cas d'annulation
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Chargement du livrable et des données...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg font-bold text-center flex-col gap-4">
        {error}
        <button 
          onClick={refreshData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Si le livrable est undefined après le chargement et qu'il n'y a pas d'erreur spécifique, cela implique qu'il n'a pas été trouvé.
  // L'état `error` devrait idéalement capturer cela maintenant.
  // Ce bloc est conservé comme un ultime garde-fou.
  if (!livrable) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg font-bold">
        Livrable introuvable !
      </div>
    );
  }

  return (
    <LivrableForm
      initialData={livrable}
      onSave={handleSaveLivrable}
      onCancel={handleCancel}
      projetsDisponibles={projets}
      partenairesDisponibles={partenaires}
      onSaveDocument={handleSaveDocument} // Passe le nouveau gestionnaire pour l'ajout de document
      natureDocumentsDisponibles={natureDocuments} // Pass natures of documents
    />
  );
};

export default EditerLivrablePage;