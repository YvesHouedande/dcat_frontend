// src/pages/NouvelleTachePage.tsx (ou creerTache.tsx)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TacheForm from './TacheForm';
import { Employe, CreateTachePayload, Operation } from '../../types/types'; // Projet retiré de l'import
import { createTache, assignEmployeToTache } from '../api/taches';
// import { fetchAllProjets } from '../../projet/api/projets'; // Import de fetchAllProjets retiré
import { useEmployesApi } from '../../projet/api/employes';
import { getAllOperations } from '../../operation/api/operation'; // NOUVEAU : Import de la fonction pour récupérer les opérations
import { toast } from 'sonner';
import Layout from '@/components/Layout';

const NouvelleTachePage = () => {
    const navigate = useNavigate();

    // const [projets, setProjets] = useState<Projet[]>([]); // État projets retiré
    const [employes, setEmployes] = useState<Employe[]>([]);
    const [operations, setOperations] = useState<Operation[]>([]); // NOUVEAU : État pour les opérations
    const [loading, setLoading] = useState(true);
    const [selectedOperationId, setSelectedOperationId] = useState<number | null>(null);
    const { getEmployes } = useEmployesApi();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Chargement des employés
                const employesData = await getEmployes({limit: 100, page: 1});
                setEmployes(employesData);
                const operationsResponse = await getAllOperations(); 
                const operationsData = operationsResponse.data || []; // Extraction des données de l'ApiResponse
                setOperations(operationsData); // Mise à jour de l'état des opérations

            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
                toast.error(
                    error instanceof Error
                    ? error.message
                    : "Erreur lors du chargement des données"
                );
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []); // Le tableau de dépendances vide assure que cela ne s'exécute qu'une fois au montage

    const handleSaveTache = async (formData: CreateTachePayload, employesIds: number[]) => {
        try {
            // Création de la tâche
            const nouvelleTache = await createTache(formData); 
            
            // Filtrer les IDs non numériques ou NaN avant d'assigner les employés
            const validEmployeIds = employesIds.filter(id => typeof id === 'number' && !isNaN(id));
            
            // Assigner les employés à la tâche nouvellement créée en utilisant les IDs valides
            await Promise.all(
                validEmployeIds.map(employeId =>
                    assignEmployeToTache(nouvelleTache.id_tache, employeId)
                )
            );

            toast.success(`Tâche "${formData.nom_tache}" créée avec succès !`, {
                // CORRECTION : Retire la référence à formData.statut car il n'est pas dans CreateTachePayload
                description: `Tâche associée à l'opération ID: ${formData.id_operation}`, 
                action: {
                    label: 'Voir la tâche',
                    onClick: () => navigate(`/gestion-des-projets/projets/taches/${nouvelleTache.id_tache}`)
                }
            });

            // Redirection après succès
            navigate('/gestion-des-projets/projets/taches');

        } catch (error) {
            console.error("Erreur création tâche:", error);
            toast.error("Échec de la création de la tâche", {
                description: error instanceof Error ? error.message : "Une erreur inconnue est survenue."
            });
            throw error; 
        }
    };

    const handleCancel = () => {
        toast('Création annulée', {
            description: 'Aucune tâche n\'a été créée',
            action: {
                label: 'OK',
                onClick: () => {}
            }
        });
        navigate('/gestion-des-projets/projets/taches');
    };

    // Trouver l'opération sélectionnée pour limiter les dates
    const operationAssociee = operations.find(op => op.id_operation === selectedOperationId);
    const operationDates = operationAssociee ? { date_debut: operationAssociee.date_debut, date_fin: operationAssociee.date_fin } : undefined;

    // Affichage conditionnel pendant le chargement
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg">Chargement des données...</p>
            </div>
        );
    }

    // NOUVEAU : Vérification si aucune opération n'est disponible
    if (operations.length === 0) {
        toast.error('Configuration requise manquante', {
            description: 'Aucune opération disponible pour créer une tâche.'
        });
        return (
            <div className="flex flex-col justify-center items-center h-screen gap-4">
                <h2 className="text-xl font-bold text-red-600">Aucune opération disponible</h2>
                <p className="text-gray-700">Veuillez créer des opérations avant de créer une tâche.</p>
                {/* Assurez-vous que le chemin vers la page de gestion des opérations est correct */}
                <button
                    onClick={() => navigate('/gestion-des-projets/projets/operations')} 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Gérer les opérations
                </button>
            </div>
        );
    }

    // La vérification pour `projets.length === 0` est retirée.

    // Vérification si aucun employé n'est disponible
    if (employes.length === 0) {
        toast.error('Configuration requise manquante', {
            description: 'Aucun employé disponible pour assigner à une tâche.'
        });
        return (
            <div className="flex flex-col justify-center items-center h-screen gap-4">
                <h2 className="text-xl font-bold text-red-600">Aucun employé disponible</h2>
                <p className="text-gray-700">Veuillez ajouter des employés avant de créer une tâche.</p>
                <button
                    onClick={() => navigate('/resources-humaines/employes')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Gérer les employés
                </button>
            </div>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto p-6">
                <TacheForm
                    operationsDisponibles={operations} // CORRECTION : Passage des opérations chargées
                    onSave={handleSaveTache}
                    onCancel={handleCancel}
                    employesDisponibles={employes}
                    idOperation={selectedOperationId ?? undefined}
                    operationDates={operationDates}
                    // Ajout d'un callback pour suivre le changement d'opération
                    onOperationChange={setSelectedOperationId}
                />
            </div>
        </Layout>
    );
};

export default NouvelleTachePage;