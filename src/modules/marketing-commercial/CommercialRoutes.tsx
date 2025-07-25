import NotFound from "@/pages/NotFound";
import { Route, Routes } from "react-router-dom";
import CommandeForm from "./commercial/commande/components/CommandeForm";
import CommandeDetails from ".//commercial/commande/components/CommandeDetails";
import CommandePage from "./commercial/commande/pages/commandePage";
import MarketingLayout from "./marketingLayout";
import Commercial from "../dashboard/pages/marketingetcommercial/commercial";

const CommercialRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Commercial />} />
      <Route path="/" element={<MarketingLayout />}>
        <Route path="vente-equipements" element={<CommandePage />} />
        <Route path="commande-equipements" element={<CommandeForm />} />
        <Route path=":id" element={<CommandeDetails />} />
        <Route path=":id/modifier" element={<CommandeForm />} />
      </Route>
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default CommercialRoutes;
