import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjetForm from '../components/ProjetForm';
import { createProjet, addPartenaireToProjet, addDocumentToProjet } from '../api/projets'; // Import addDocumentToProjet
import { getPartenaires } from '../api/partenaires';
import { getFamilles } from '../api/famille';
import { getEmployes } from '../api/employes';
import { getAllNatureDocuments } from '../../livrables/api/livrables'; // Import getAllNatureDocuments

import { Partenaire, Projet, Famille, Employe, Nature, CreateDocumentTextPayload } from '../../types/types'; // Import Nature, CreateDocumentTextPayload, ApiResponse
import { toast } from 'sonner';

const NouveauProjetPage = () => {
    const navigate = useNavigate();
    const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
    const [familles, setFamilles] = useState<Famille[]>([]);
    const [employes, setEmployes] = useState<Employe[]>([]);
    const [natureDocuments, setNatureDocuments] = useState<Nature[]>([]); // State to store document natures
    const [loading, setLoading] = useState(true);

    // State to hold the newly created project, so documents can be associated with its ID
    const [newlyCreatedProjet, setNewlyCreatedProjet] = useState<Projet | undefined>(undefined);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [fetchedPartenaires, fetchedFamilles, fetchedEmployes, fetchedNatureDocumentsRaw] = await Promise.all([
                    getPartenaires(),
                    getFamilles(),
                    getEmployes(),
                    getAllNatureDocuments(), // Fetch document natures
                ]);
                setPartenaires(fetchedPartenaires);
                setFamilles(fetchedFamilles);
                setEmployes(fetchedEmployes);

                // Handle Nature response - expecting a direct array of Nature objects
                if (Array.isArray(fetchedNatureDocumentsRaw)) {
                    setNatureDocuments(fetchedNatureDocumentsRaw);
                    console.log("[NouveauProjetPage] Natures de document récupérées directement sous forme de tableau:", fetchedNatureDocumentsRaw);
                } else {
                    console.warn("Structure de réponse inattendue pour la récupération des natures de document: n'est pas un tableau direct.", fetchedNatureDocumentsRaw);
                    toast.warning("Impossible de charger les natures de document. Structure de réponse inattendue.");
                }

            } catch (error) {
                console.error("Erreur lors du chargement des données de référence :", error);
                toast.error("Impossible de charger les listes (partenaires, familles, employés, natures de document).");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSaveProjet = async (projet: Projet) => {
        try {
            const { id_partenaire, ...projetToCreate } = projet;

            console.log("=== DONNÉES DU FORMULAIRE ===");
            console.log("Projet complet reçu:", projet);
            console.log("Partenaires extraits:", id_partenaire);
            console.log("Données à envoyer à l'API:", projetToCreate);

            const apiResponse = await createProjet(projetToCreate as Omit<Projet, 'id_projet' | 'id_partenaire'>);
            
            console.log("Réponse de l'API :", apiResponse);

            if (!apiResponse.success || !apiResponse.data || !apiResponse.data.projet) {
                toast.error("Erreur: Réponse de l'API invalide.");
                console.error("Réponse API invalide :", apiResponse);
                // No navigation here, allow user to stay on the form and fix it or associate documents
                return;
            }

            const newProjet = apiResponse.data.projet;

            if (!newProjet.id_projet || newProjet.id_projet === 0) {
                toast.error("Erreur: L'ID du projet créé est manquant. Impossible d'associer les partenaires/documents.");
                console.error("Projet créé sans ID valide :", newProjet);
                // No navigation here, allow user to stay on the form
                return;
            }

            toast.success(`Projet "${newProjet.nom_projet}" créé avec succès ! Vous pouvez maintenant y associer des documents.`);
            console.log("Nouveau projet créé :", newProjet);
            setNewlyCreatedProjet(newProjet); // Store the newly created project

            // Ajout des partenaires si nécessaire
            if (id_partenaire && id_partenaire.length > 0) {
                let partnersAddedCount = 0;
                let partnersFailedCount = 0;

                const results = await Promise.allSettled(
                    id_partenaire.map(partnerId => addPartenaireToProjet(newProjet.id_projet, partnerId))
                );

                results.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        partnersAddedCount++;
                    } else {
                        partnersFailedCount++;
                        const partnerId = id_partenaire[index];
                        console.error(`Échec de l'ajout du partenaire ${partnerId} au projet ${newProjet.id_projet}:`, result.reason);
                    }
                });

                if (partnersAddedCount > 0) {
                    toast.success(`${partnersAddedCount} partenaire(s) associé(s) au projet.`);
                }
                if (partnersFailedCount > 0) {
                    toast.error(`${partnersFailedCount} partenaire(s) n'ont pas pu être associés.`);
                }
            }

            // Redirect to project list after initial save and partner association,
            // or if the user chooses not to add documents immediately.
            // If we want to stay on the page to add documents, this navigation should be conditional.
            // For now, let's keep it here, as it's a "create" page.
            navigate('/technique/projets');

        } catch (error) {
            console.error("Erreur complète lors de la sauvegarde du projet :", error);
            if (error instanceof Error) {
                toast.error(`Échec de la création du projet: ${error.message}`);
            } else {
                toast.error("Échec de la création du projet. Veuillez réessayer.");
            }
        }
    };

    // Handler for saving documents linked to this project (from ProjetForm)
    const handleSaveDocument = async (projectId: number, documentFile: File, textPayload: CreateDocumentTextPayload) => {
        try {
            await addDocumentToProjet(projectId, documentFile, textPayload);
            toast.success("Document associé au projet avec succès !");
            // No need to re-fetch projet data here if ProjetForm doesn't display them
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
            <div className="flex justify-center items-center h-screen">
                Chargement des données du formulaire...
            </div>
        );
    }

    return (
        <ProjetForm
            initialData={newlyCreatedProjet} // Pass newly created project to allow document association
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

export default NouveauProjetPage;