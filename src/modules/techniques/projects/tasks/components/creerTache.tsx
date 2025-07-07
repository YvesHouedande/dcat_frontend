// src/pages/NouvelleTachePage.tsx (ou creerTache.tsx)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TacheForm from './TacheForm';
import { Projet, Employe, CreateTachePayload } from '../../types/types';
import { createTache, assignEmployeToTache } from '../api/taches';
import { fetchAllProjets } from '../../projet/api/projets';
import { getEmployes } from '../../projet/api/employes';
import { toast } from 'sonner';
import Layout from '@/components/Layout';

const NouvelleTachePage = () => {
    const navigate = useNavigate();

    const [projets, setProjets] = useState<Projet[]>([]);
    const [employes, setEmployes] = useState<Employe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const employesData = await getEmployes();
                setEmployes(employesData);

                const projetsResponse = await fetchAllProjets();
                // Extraire les données de l'ApiResponse
                const projetsData = projetsResponse.data || [];
                setProjets(projetsData);

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
    }, []);

    const handleSaveTache = async (formData: CreateTachePayload, employesIds: number[]) => {
        try {
            const nouvelleTache = await createTache(formData); 
            
            // MODIFICATION CLÉ ICI : Filtrer les IDs non numériques ou NaN
            const validEmployeIds = employesIds.filter(id => typeof id === 'number' && !isNaN(id));
            
            // Assigner les employés à la tâche nouvellement créée en utilisant les IDs valides
            await Promise.all(
                validEmployeIds.map(employeId => // Utilise validEmployeIds
                    assignEmployeToTache(nouvelleTache.id_tache, employeId)
                )
            );

            toast.success(`Tâche "${formData.nom_tache}" créée avec succès !`, {
                description: `Statut: ${formData.statut}`,
                action: {
                    label: 'Voir',
                    onClick: () => navigate(`/technique/projets/taches/${nouvelleTache.id_tache}`)
                }
            });

            navigate('/technique/projets/taches');

        } catch (error) {
            console.error("Erreur création tâche:", error);
            toast.error("Échec de la création", {
                description: error instanceof Error ? error.message : undefined
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
        navigate('/technique/projets/taches');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg">Chargement des données...</p>
            </div>
        );
    }

    if (projets.length === 0) {
        toast.error('Configuration requise manquante');
        return (
            <div className="flex flex-col justify-center items-center h-screen gap-4">
                <h2 className="text-xl font-bold text-red-600">Aucun projet disponible</h2>
                <button
                    onClick={() => navigate('/technique/projets')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Créer un projet
                </button>
            </div>
        );
    }

    if (employes.length === 0) {
        toast.error('Configuration requise manquante');
        return (
            <div className="flex flex-col justify-center items-center h-screen gap-4">
                <h2 className="text-xl font-bold text-red-600">Aucun employé disponible</h2>
                <button
                    onClick={() => navigate('/administration/employes')}
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
                    onSave={handleSaveTache}
                    onCancel={handleCancel}
                    projetsDisponibles={projets}
                    employesDisponibles={employes}
                />
            </div>
        </Layout>
    );
};

export default NouvelleTachePage;