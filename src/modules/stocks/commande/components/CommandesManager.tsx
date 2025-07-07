import React, { useState } from "react";

import { CommandesTable } from "./CommandeTable";
import { Commande } from "../types/commande";
import { useNavigate } from "react-router-dom";
const CommandesManager: React.FC = () => {
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);

  console.log("CommandesManager rendered", selectedCommande, isCreating);

  const navigate = useNavigate();

  const handleCreateNew = () => {
    setSelectedCommande(null);
    setIsCreating(true);
  };

  const handleEdit = (commande: Commande) => {
    setSelectedCommande(commande);
    navigate(`/stocks/commandes/${commande.id_commande}/modifier`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CommandesTable onCreateNew={handleCreateNew} onEdit={handleEdit} />
    </div>
  );
};

export default CommandesManager;
