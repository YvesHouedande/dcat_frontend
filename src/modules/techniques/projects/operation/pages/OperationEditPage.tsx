import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import OperationForm from "../components/OperationForm";
import { getOperationById, updateOperation } from "../api/operation";
import { Operation } from "../../types/types";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const OperationEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [operation, setOperation] = useState<Operation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getOperationById(Number(id))
      .then(setOperation)
      .catch(() => setError("Impossible de charger l'opération."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (payload: Omit<Operation, "id_operation">) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateOperation(Number(id), payload);
      toast.success("Opération modifiée avec succès !");
      navigate(`/technique/projets/operations/${id}/details`);
    } catch {
      toast.error("Erreur lors de la modification de l'opération.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Layout><div className="p-8 text-center">Chargement de l'opération...</div></Layout>;
  }
  if (error || !operation) {
    return <Layout><div className="p-8 text-center text-red-500">{error || "Opération introuvable."}</div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-8">
        <Button
          variant="outline"
          onClick={() => {
            if (location.state && location.state.fromProject && location.state.projectId) {
              navigate(`/technique/projets/${location.state.projectId}/details/operations`);
            } else if (location.state && location.state.fromDetails) {
              navigate('/technique/projets/operations');
            } else {
              navigate('/technique/projets/operations');
            }
          }}
          className="mb-6 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <h2 className="text-2xl font-bold mb-6">Modifier l'opération</h2>
        {loading ? (
          <div>Chargement...</div>
        ) : error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : operation ? (
          <OperationForm
            idProjet={operation.id_projet}
            onCreate={handleUpdate}
            loading={isSubmitting}
            error={error}
            operationInitiale={operation}
          />
        ) : null}
      </div>
    </Layout>
  );
};

export default OperationEditPage; 