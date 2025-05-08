// src/Pages/LivrableEditPage.tsx
import { LivrableForm } from "../../components/forms/LivrableForm";
import { useParams } from "react-router-dom";
import { useLivrables } from "../../livrables/hooks/useLivrables";
import { useProjects } from "../../projet/hooks/useProjects";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Livrable } from "../../types/types";
import Layout from "@/components/Layout";

export const LivrableEditPage = () => {
  const { id } = useParams<{ id?: string }>();
  const { livrables, updateLivrable, createLivrable } = useLivrables();
  const { projects } = useProjects();
  const navigate = useNavigate();

  const livrable = id
    ? livrables.find(
        (l: { Id_Livrable: { toString: () => string } }) =>
          l.Id_Livrable.toString() === id
      )
    : undefined;

  const handleSubmit = async (values: Omit<Livrable, "Id_Livrable">) => {
    try {
      if (id) {
        await updateLivrable(Number(id), values);
      } else {
        await createLivrable(values);
      }
      navigate(-1); // Retour arrière après soumission
    } catch (error) {
      console.error("Erreur lors de la sauvegarde", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>

        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            {id ? "Modifier le livrable" : "Créer un nouveau livrable"}
          </h1>
          <LivrableForm
            livrable={livrable}
            projects={projects.map(
              (p: { id_projet: string; nom_projet: string }) => ({
                id_projet: p.id_projet,
                nom_projet: p.nom_projet,
              })
            )}
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
          />
        </Card>
      </div>
    </Layout>
  );
};
