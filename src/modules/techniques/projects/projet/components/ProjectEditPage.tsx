import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjetForm from '../components/ProjetForm';
import { Projet, Partenaire, Famille, Employe, Nature, CreateDocumentTextPayload } from '../../types/types'; // Import Nature, CreateDocumentTextPayload, ApiResponse
import {
  getProjetById,
  updateProjet,
  addPartenaireToProjet,
  removePartenaireFromProjet,
  getProjetAssociatedPartenaires,
  addDocumentToProjet, // Import the new function for adding documents to a project
} from '../api/projets';
import { getPartenaires } from '../api/partenaires';
import { getFamilles } from '../api/famille';
import { getEmployes } from '../api/employes';
import { getAllNatureDocuments } from '../../livrables/api/livrables'; // Import the function to get document natures
import { toast } from 'sonner'; // Import toast for messages

const EditerProjetPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [projet, setProjet] = useState<Projet | undefined>(undefined);
  const [initialPartnerIds, setInitialPartnerIds] = useState<number[]>([]);
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [familles, setFamilles] = useState<Famille[]>([]);
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [natureDocuments, setNatureDocuments] = useState<Nature[]>([]); // State to store document natures
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const projectId = Number(id);
        if (isNaN(projectId) || projectId === 0) {
          setError("ID de projet invalide dans l'URL.");
          setLoading(false);
          toast.error("Erreur: ID de projet invalide."); // Use toast for user feedback
          return;
        }

        const [
          fetchedProjetData,
          fetchedAssociatedPartnerIds,
          fetchedPartenaires,
          fetchedFamilles,
          fetchedEmployes,
          fetchedNatureDocumentsRaw, // Fetch document natures
        ] = await Promise.all([
          getProjetById(projectId),
          getProjetAssociatedPartenaires(projectId),
          getPartenaires(),
          getFamilles(),
          getEmployes(),
          getAllNatureDocuments(), // Call to fetch document natures
        ]);

        if (fetchedProjetData) {
          const projectWithPartners: Projet = {
            ...fetchedProjetData,
            id_partenaire: fetchedAssociatedPartnerIds || [],
          };
          setProjet(projectWithPartners);
          setInitialPartnerIds(projectWithPartners.id_partenaire);
        } else {
          setError("Projet introuvable.");
          toast.error("Projet introuvable.");
        }

        setPartenaires(fetchedPartenaires);
        setFamilles(fetchedFamilles);
        setEmployes(fetchedEmployes);
        
        // Handle Nature response - expecting a direct array of Nature objects
        if (Array.isArray(fetchedNatureDocumentsRaw)) {
            setNatureDocuments(fetchedNatureDocumentsRaw);
            console.log("[EditerProjetPage] Natures de document récupérées directement sous forme de tableau:", fetchedNatureDocumentsRaw);
        } else {
            console.warn("Structure de réponse inattendue pour la récupération des natures de document: n'est pas un tableau direct.", fetchedNatureDocumentsRaw);
            toast.warning("Impossible de charger les natures de document. Structure de réponse inattendue.");
        }

      } catch (err) {
        console.error("Erreur lors du chargement des données pour l'édition:", err);
        setError("Erreur lors du chargement des données du projet.");
        toast.error("Erreur de chargement: " + (err instanceof Error ? err.message : "Erreur inconnue"));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSaveProjet = async (projetMisAJour: Projet) => {
    try {
      if (!projetMisAJour.id_projet || projetMisAJour.id_projet === 0) {
        console.error("Tentative de sauvegarde d'un nouveau projet sur la page d'édition.");
        toast.error("Erreur: Tentative de créer un nouveau projet sur la page d'édition."); // Use toast
        return;
      }

      await updateProjet(projetMisAJour);
      console.log("Informations de base du projet mises à jour :", projetMisAJour);

      const newPartnerIds = projetMisAJour.id_partenaire || [];
      
      const partnersToAdd = newPartnerIds.filter(id => !initialPartnerIds.includes(id));
      for (const partnerId of partnersToAdd) {
        await addPartenaireToProjet(projetMisAJour.id_projet, partnerId);
        console.log(`Partenaire ${partnerId} ajouté au projet ${projetMisAJour.id_projet}`);
      }

      const partnersToRemove = initialPartnerIds.filter(id => !newPartnerIds.includes(id));
      for (const partnerId of partnersToRemove) {
        await removePartenaireFromProjet(projetMisAJour.id_projet, partnerId);
        console.log(`Partenaire ${partnerId} désassocié du projet ${projetMisAJour.id_projet}`);
      }

      toast.success("Projet mis à jour avec succès !"); // Use toast for success
      navigate('/technique/projets');

    } catch (err) {
      console.error("Erreur lors de la sauvegarde du projet ou de la gestion des partenaires:", err);
      toast.error(`Échec de la mise à jour du projet: ${(err as Error).message}`); // Use toast
    }
  };

  // Handler for saving documents linked to this project
  const handleSaveDocument = async (projectId: number, documentFile: File, textPayload: CreateDocumentTextPayload) => {
    try {
      await addDocumentToProjet(projectId, documentFile, textPayload);
      toast.success("Document associé au projet avec succès !");
      // Optionally, re-fetch the project details or documents to update the UI
      // If the ProjetForm doesn't display the list of associated documents, this re-fetch might not be strictly necessary here.
      // But if ProjetDetailsPage is updated to show documents, it would need a re-fetch.
    } catch (err) {
      console.error("Erreur lors de l'association du document au projet :", err);
      toast.error("Échec de l'association du document au projet.");
      throw err; // Re-throw the error so the form component can handle it if needed
    }
  };


  const handleCancel = () => {
    navigate('/technique/projets');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-lg">
        Chargement du projet et des données...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg font-bold">
        Erreur: {error}
      </div>
    );
  }

  if (!projet) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        Projet introuvable ! (Veuillez vérifier l'ID ou la connexion API)
      </div>
    );
  }

  return (
    <ProjetForm
      initialData={projet}
      onSave={handleSaveProjet}
      onCancel={handleCancel}
      partenairesDisponibles={partenaires}
      famillesDisponibles={familles}
      employesDisponibles={employes}
      onSaveDocument={handleSaveDocument} // Pass the document save handler
      natureDocumentsDisponibles={natureDocuments} // Pass natures of documents
    />
  );
};

export default EditerProjetPage;