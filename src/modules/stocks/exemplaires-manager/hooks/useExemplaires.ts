import { useState, useEffect } from 'react';
import { Exemplaire, Produit, Commande, Livraison } from '../types/exemplaires';
import { toast } from 'sonner';

export const useExemplaires = () => {
  const [exemplaires, setExemplaires] = useState<Exemplaire[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [livraisons, setLivraisons] = useState<Livraison[]>([]);
  const [filteredExemplaires, setFilteredExemplaires] = useState<Exemplaire[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'disponible' | 'indisponible'>('all');

  // Charger les données initiales
  useEffect(() => {
    // Simuler le chargement des données
    const fakeExemplaires: Exemplaire[] = [
      {
        id_exemplaire: 'EX001',
        num_serie: 'SN12345678',
        prix_exemplaire: '499.99',
        etat_disponible_indisponible_: 'disponible',
        Id_Commande: null,
        id_livraison: null,
        id_produit: 'PRD001',
        Code_produit: 'CP123456'
      },
      // ... autres exemplaires
    ];

    const fakeProduits: Produit[] = [
      {
        id_produit: 'PRD001',
        Code_produit: 'CP123456',
        desi_produit: 'Écran LCD 24 pouces',
      },
      // ... autres produits
    ];

    const fakeCommandes: Commande[] = [
      { Id_Commande: 'CMD001', date_commande: '2025-03-15', client: 'Client A' },
      // ... autres commandes
    ];

    const fakeLivraisons: Livraison[] = [
      { id_livraison: 'LIV001', date_livraison: '2025-03-18' },
      // ... autres livraisons
    ];

    setExemplaires(fakeExemplaires);
    setFilteredExemplaires(fakeExemplaires);
    setProduits(fakeProduits);
    setCommandes(fakeCommandes);
    setLivraisons(fakeLivraisons);
  }, []);

  // Filtrer les exemplaires
  useEffect(() => {
    const results = exemplaires.filter(exemplaire => {
      const matchesSearch = 
        exemplaire.num_serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exemplaire.id_exemplaire.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' || 
        exemplaire.etat_disponible_indisponible_ === statusFilter;
        
      return matchesSearch && matchesStatus;
    });
    
    setFilteredExemplaires(results);
  }, [searchTerm, statusFilter, exemplaires]);

  const generateExemplaireId = () => {
    const existingIds = exemplaires.map(ex => ex.id_exemplaire);
    let counter = 1;
    let newId = `EX${String(counter).padStart(3, '0')}`;
    
    while (existingIds.includes(newId)) {
      counter++;
      newId = `EX${String(counter).padStart(3, '0')}`;
    }
    
    return newId;
  };

  const addExemplaire = (newExemplaire: Exemplaire) => {
    setExemplaires([...exemplaires, newExemplaire]);
    toast.success("Exemplaire ajouté", {
      description: `L'exemplaire ${newExemplaire.id_exemplaire} a été ajouté avec succès.`,
    });
  };

  const updateExemplaire = (updatedExemplaire: Exemplaire) => {
    setExemplaires(exemplaires.map(ex => 
      ex.id_exemplaire === updatedExemplaire.id_exemplaire ? updatedExemplaire : ex
    ));
    toast.success("Exemplaire mis à jour", {
      description: `L'exemplaire ${updatedExemplaire.id_exemplaire} a été mis à jour avec succès.`,
    });
  };

  const deleteExemplaire = (id: string) => {
    setExemplaires(exemplaires.filter(ex => ex.id_exemplaire !== id));
    toast.success("Exemplaire supprimé", {
      description: `L'exemplaire ${id} a été supprimé avec succès.`,
    });
  };

  return {
    exemplaires,
    produits,
    commandes,
    livraisons,
    filteredExemplaires,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    generateExemplaireId,
    addExemplaire,
    updateExemplaire,
    deleteExemplaire
  };
};