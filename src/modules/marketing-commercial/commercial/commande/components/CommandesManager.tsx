import { CommandesTable } from "./CommandeTable";
import { useNavigate } from "react-router-dom";
const CommandesManager: React.FC = () => {
  const navigate = useNavigate();

  const handleEdit = (id_commande: string | number) => {
    navigate(`/stocks/commandes/${id_commande}/modifier`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CommandesTable onEdit={handleEdit} />
    </div>
  );
};

export default CommandesManager;
