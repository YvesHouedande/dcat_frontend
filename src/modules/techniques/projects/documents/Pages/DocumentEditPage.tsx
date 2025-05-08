// src/Pages/DocumentEditPage.tsx
import { DocumentForm } from "../../components/forms/DocumentForm";
import { useParams, useNavigate } from "react-router-dom";
import { useDocuments } from "../hooks/useDocuments";
import { useProjects } from "../../projet/hooks/useProjects";
import { Card } from "@/components/ui/card";
import { Document } from "../../types/types";
import Layout from "@/components/Layout";

export const DocumentEditPage = () => {
  const { id } = useParams<{ id?: string }>();
  const { documents, updateDocument, createDocument } = useDocuments();
  const { projects } = useProjects();
  const navigate = useNavigate();
  
  // Vérification plus robuste de l'ID et conversion en nombre
  const documentId = id ? parseInt(id, 10) : undefined;
  const document = documentId ? documents.find(d => d.Id_documents === documentId) : undefined;
  
  const handleSubmit = async (values: Omit<Document, 'Id_documents'> & { file?: File }) => {
    try {
      const { file, ...documentData } = values;
      
      if (documentId) {
        // Mise à jour du document existant
        await updateDocument(documentId, documentData);
        
        // Gestion facultative du fichier
        if (file) await uploadDocumentFile(file, documentId);
      } else {
        // Création d'un nouveau document
        const newDocument = {
          ...documentData,
          libele_document: documentData.libele_document || '',
          classification_document: documentData.classification_document || '',
          etat_document: documentData.etat_document || '',
          lien_document: documentData.lien_document || '',
        };
        
        const createdId = await createDocument(newDocument);
        navigate(`/technique/documents/${createdId}`);
        
        
        // Gestion facultative du fichier après création
        if (file && createdId) await uploadDocumentFile(file, createdId);

      }
      
      navigate('/technique/documents');
    } catch (error) {
      console.error('Erreur lors de la soumission du document:', error);
      // Vous pourriez aussi utiliser un système de notification/toast ici
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            {documentId ? "Modifier le document" : "Ajouter un nouveau document"}
          </h1>
          <DocumentForm
            document={document}
            projects={projects.map(p => ({
              id_projet: p.id_projet,
              nom_projet: p.nom_projet
            }))}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </Layout>
    
  );
};


function uploadDocumentFile(_file: File, _createdId: any) {
  throw new Error("Function not implemented.");
}