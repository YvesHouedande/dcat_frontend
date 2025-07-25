import React from "react";
import { useNavigate } from "react-router-dom";
import OperationForm from "../components/OperationForm";
import { createOperation } from "../api/operation";
import { fetchAllProjets } from "../../projet/api/projets";
import { useEffect, useState } from "react";
import { Projet } from "../../types/types";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { Operation } from "../types/operation";

const OperationCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllProjets().then(res => {
      setProjets(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  const handleCreate = async (payload: Omit<Operation, "id_operation">) => {
    setLoading(true);
    try {
      await createOperation(payload);
      toast.success("Opération créée avec succès !");
      navigate("/operations");
    } catch {
      toast.error("Erreur lors de la création de l'opération.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Créer une nouvelle opération</h1>
        <OperationForm projetsDisponibles={
          projets.map(p => (
            { id_projet: p.id_projet,
             nom_projet: p.nom_projet }
             ))}
             onCreate={handleCreate} 
             loading={loading}
            />
      </div>
    </Layout>
  );
};

export default OperationCreatePage;
