// src/Pages/DocumentEditPage.tsx
import {
  DocumentForm,
  documentFormSchema,
  mapDocumentToFormValues,
} from "../../components/forms/DocumentForm";
import { useParams, useNavigate } from "react-router-dom";
import { useDocuments } from "../hooks/useDocuments";
import { useProjects } from "../../projet/hooks/useProjects";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { z } from "zod";
import { omit } from "@/lib/utils";

type DocumentFormValues = z.infer<typeof documentFormSchema>;

export const DocumentEditPage = () => {
  const { id } = useParams<{ id?: string }>();
  const { documents, updateDocument, createDocument } = useDocuments();
  const { projects } = useProjects();
  const navigate = useNavigate();

  // Vérification plus robuste de l'ID et conversion en nombre
  const documentId = id ? parseInt(id, 10) : undefined;
  const document = documentId
    ? documents.find((d) => d.Id_documents === documentId)
    : undefined;

  const handleSubmit = async (values: DocumentFormValues & { file?: File }) => {
    try {
      const restValues = omit(values, ["file"]);

      // Map form values to your backend Document model
      const documentData = {
        id_projet: restValues.id_projet,
        nom_document:
          typeof restValues.libele_document === "string"
            ? restValues.libele_document
            : "",
        description_document:
          typeof restValues.description === "string"
            ? restValues.description
            : "",
        version:
          typeof restValues.version === "string" ? restValues.version : "",
        libele_document:
          typeof restValues.libele_document === "string"
            ? restValues.libele_document
            : "",
        lien_document:
          typeof restValues.lien_document === "string"
            ? restValues.lien_document
            : "",
        classification_document:
          typeof restValues.classification_document === "string"
            ? restValues.classification_document
            : "",
        etat_document:
          typeof restValues.etat_document === "string"
            ? restValues.etat_document
            : "",
        date_creation:
          restValues.date_creation instanceof Date
            ? restValues.date_creation.toISOString()
            : restValues.date_creation,
        createur:
          typeof restValues.createur === "string" ? restValues.createur : "",
      };

      if (documentId) {
        // Mise à jour du document existant
        await updateDocument(documentId, documentData);
      } else {
        // Création d'un nouveau document
        const newDocument: DocumentFormValues = {
          ...documentData,
          libele_document: documentData.libele_document || "",
          classification_document: documentData.classification_document as "contrat" | "facture" | "rapport" | "plan" | "autre",
          etat_document: documentData.etat_document as "brouillon" | "validé" | "archivé",
          lien_document: documentData.lien_document || "",
          description: documentData.description_document || "",
          date_creation: documentData.date_creation
            ? new Date(documentData.date_creation)
            : new Date(), // Ensure this is a Date object
        };

        const createdId = await createDocument(newDocument);
        navigate(`/technique/documents/${createdId}`);
      }

      navigate("/technique/documents");
    } catch (error) {
      console.error("Erreur lors de la soumission du document:", error);
      // Vous pourriez aussi utiliser un système de notification/toast ici
    }
  };

  // Utilisation
  const documentFormDefaultValues = document
    ? mapDocumentToFormValues(document)
    : undefined;

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            {documentId
              ? "Modifier le document"
              : "Ajouter un nouveau document"}
          </h1>
          <DocumentForm
            document={documentFormDefaultValues}
            projects={projects.map((p) => ({
              id_projet: p.id_projet,
              nom_projet: p.nom_projet,
            }))}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </Layout>
  );
};
