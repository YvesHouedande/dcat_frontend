// pages/LivraisonPage.tsx
import React from "react";

const LivraisonPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Achats</h1>
      </div>

      {/* Section de recherche unifiée */}
      <div className="p-4 rounded-lg mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default LivraisonPage;
