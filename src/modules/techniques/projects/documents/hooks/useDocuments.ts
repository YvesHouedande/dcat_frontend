// src/techniques/projects/documents/hooks/useDocuments.ts
import { useState, useEffect, useCallback } from "react";
import { Document, DocumentStats } from "../../types/types";
import { DocumentFormValues } from "../../components/forms/DocumentForm";

// Données mockées basées sur votre interface Document
const mockDocuments: Document[] = [
  {
    Id_documents: 1,
    nom_document: "Cahier des charges",
    libele_document: "CDC Projet X",
    description_document: "Document détaillant les spécifications du projet",
    classification_document: "Technique",
    etat_document: "Validé",
    lien_document: "/docs/cdc_projet_x.pdf",
    date_creation: "2023-01-15T10:30:00Z",
    date_modification: "2023-01-20T14:45:00Z",
    id_projet: "1",
    createur: "user1",
    chemin_fichier: "/uploads/docs/cdc_projet_x.pdf",
    taille_fichier: "2.5 MB",
    version: "1.0",
    description: "Version initiale du cahier des charges"
  },
  {
    Id_documents: 2,
    nom_document: "Rapport d'avancement",
    libele_document: "Rapport Q1",
    description_document: "Rapport d'avancement trimestriel",
    classification_document: "Administratif",
    etat_document: "En révision",
    lien_document: "/docs/rapport_q1.pdf",
    date_creation: "2023-04-05T09:15:00Z",
    id_projet: "2",
    createur: "user2",
    version: "1.2",
    description: "Inclut les données de mars"
  },
  {
    Id_documents: 3,
    nom_document: "Spécifications techniques",
    libele_document: "Specs API",
    description_document: "Documentation technique de l'API",
    classification_document: "Technique",
    etat_document: "Brouillon",
    lien_document: "/docs/specs_api.pdf",
    date_creation: "2023-02-10T11:20:00Z",
    id_projet: "3",
    version: "0.9",
    description: "Version préliminaire"
  }
];

export const useDocuments = (projectId?: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DocumentStats | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filtrer par projet si projectId est spécifié
      const filteredDocs = projectId 
        ? mockDocuments.filter(doc => doc.id_projet === projectId)
        : [...mockDocuments]; // Copie du tableau
      
      setDocuments(filteredDocs);
      
      // Calculer les statistiques
      const stats: DocumentStats = {
        total: filteredDocs.length,
        byStatus: filteredDocs.reduce((acc, doc) => {
          acc[doc.etat_document] = (acc[doc.etat_document] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byType: filteredDocs.reduce((acc, doc) => {
          acc[doc.classification_document] = (acc[doc.classification_document] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byProject: filteredDocs.reduce((acc, doc) => {
          if (doc.id_projet) {
            acc[doc.id_projet] = (acc[doc.id_projet] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>),
        recentDocuments: filteredDocs
          .sort((a, b) => 
            new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime()
          )
          .slice(0, 5),
      };
      
      setStats(stats);
    } catch (err) {
      setError("Erreur lors du chargement des documents");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const createDocument = async (document: Omit<DocumentFormValues, 'Id_documents'>) => {
    try {
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newDocument: Document = {
        Id_documents: Math.max(
          0,
          ...mockDocuments
            .map(d => d.Id_documents)
            .filter((id): id is number => typeof id === "number")
        ) + 1,
        nom_document: document.libele_document,
        libele_document: document.libele_document,
        description_document: document.description,
        classification_document: document.classification_document,
        etat_document: document.etat_document,
        lien_document: document.lien_document,
        date_creation: new Date().toISOString(),
        date_modification: new Date().toISOString(),
        id_projet: document.id_projet,
        createur: document.createur ?? "",
        chemin_fichier: document.lien_document ?? "",
        taille_fichier: "",
        version: document.version || "1.0",
        description: document.description ?? ""
      };
      
      mockDocuments.push(newDocument);
      setDocuments(prev => [...prev, newDocument]);
      
      return newDocument;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateDocument = async (id: number, updates: Partial<Document>) => {
    try {
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockDocuments.findIndex(d => d.Id_documents === id);
      if (index === -1) throw new Error("Document non trouvé");
      
      const updatedDoc = {
        ...mockDocuments[index],
        ...updates,
        date_modification: new Date().toISOString()
      };
      
      mockDocuments[index] = updatedDoc;
      setDocuments(prev => 
        prev.map(d => d.Id_documents === id ? updatedDoc : d)
      );
      
      return updatedDoc;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteDocument = async (id: number) => {
    try {
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockDocuments.findIndex(d => d.Id_documents === id);
      if (index === -1) throw new Error("Document non trouvé");
      
      mockDocuments.splice(index, 1);
      setDocuments(prev => prev.filter(d => d.Id_documents !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateDocumentStatus = async (id: number, newStatus: Document['etat_document']) => {
    return updateDocument(id, { 
      etat_document: newStatus,
      date_modification: new Date().toISOString() 
    });
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    stats,
    loading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    updateDocumentStatus,
    refresh: fetchDocuments,
  };
};