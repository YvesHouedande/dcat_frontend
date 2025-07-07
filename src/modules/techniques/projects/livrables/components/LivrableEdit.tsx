// src/pages/EditerLivrablePage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LivrableForm } from '../components/LivrableForm'; // Chemin correct vers votre LivrableForm
import { Livrable, Projet, CreateLivrablePayload, UpdateLivrablePayload, CreateDocumentTextPayload, ApiResponse, Nature } from '../../types/types'; // Import Nature type
import { getLivrableById, updateLivrable, addDocumentToLivrable, getAllNatureDocuments } from '../api/livrables'; // Import getAllNatureDocuments
import { fetchAllProjets } from '../../projet/api/projets'; // Assumant que c'est le chemin correct pour l'API des projets
import { toast } from 'sonner'; // Importation de toast pour les messages

const EditerLivrablePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [livrable, setLivrable] = useState<Livrable | undefined>(undefined);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [natureDocuments, setNatureDocuments] = useState<Nature[]>([]); // Changed to Nature[]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
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

        // Exécution des appels API en parallèle
        const [fetchedLivrable, fetchedProjetsRaw, fetchedNatureDocumentsRaw] = await Promise.all([
          getLivrableById(livrableId), // Appelle l'API réelle, retourne Promise<Livrable | undefined>
          fetchAllProjets(), // Appelle l'API réelle, peut retourner Promise<ApiResponse<Projet[]>> ou Promise<Projet[]>
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

        // Handle Nature response - expecting a direct array of Nature objects
        if (Array.isArray(fetchedNatureDocumentsRaw)) {
            setNatureDocuments(fetchedNatureDocumentsRaw);
            console.log("[EditerLivrablePage] Natures de document récupérées directement sous forme de tableau:", fetchedNatureDocumentsRaw);
        } else {
            console.warn("Structure de réponse inattendue pour la récupération des natures de document: n'est pas un tableau direct.", fetchedNatureDocumentsRaw);
            toast.warning("Impossible de charger les natures de document. Structure de réponse inattendue.");
        }

        if (!fetchedLivrable) {
          setError(`Livrable introuvable ! L'ID ${id} ne correspond à aucun livrable existant.`);
          toast.error(`Livrable introuvable ! L'ID ${id} ne correspond à aucun livrable existant.`);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données du livrable :", err);
        setError("Une erreur est survenue lors du chargement des données. Veuillez réessayer.");
        toast.error("Erreur de chargement: " + (err instanceof Error ? err.message : "Erreur inconnue"));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]); // Dépendance à 'id' pour recharger si l'ID change

  // Gère la sauvegarde du livrable (appelé depuis LivrableForm)
  const handleSaveLivrable = async (payload: CreateLivrablePayload | UpdateLivrablePayload) => {
    try {
      if (!livrable?.id_livrable) { // Vérifie si nous avons un ID pour l'opération de mise à jour
        toast.error("Impossible de mettre à jour : ID du livrable manquant.");
        return;
      }
      // Effectue l'appel API de mise à jour. Nous castons le payload vers UpdateLivrablePayload
      // car cette fonction est déclenchée pour une mise à jour d'un livrable existant.
      const updated = await updateLivrable(livrable.id_livrable, payload as UpdateLivrablePayload);
      toast.success(`Livrable "${updated.libelle_livrable}" mis à jour avec succès !`);
      navigate('/technique/projets/livrables'); // Redirige après succès
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
    navigate('/technique/projets/livrables'); // Redirige vers la liste des livrables en cas d'annulation
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
      <div className="flex justify-center items-center h-screen text-red-500 text-lg font-bold text-center">
        {error}
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
      onSaveDocument={handleSaveDocument} // Passe le nouveau gestionnaire pour l'ajout de document
      natureDocumentsDisponibles={natureDocuments} // Pass natures of documents
    />
  );
};

export default EditerLivrablePage;