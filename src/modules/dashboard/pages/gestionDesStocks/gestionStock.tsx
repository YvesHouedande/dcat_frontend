import Layout from "@/components/Layout";
import { Truck, NotepadText } from "lucide-react";

import { useNavigate } from "react-router-dom";

function GestionStock() {
  const onNavigate = useNavigate();
  return (
    <Layout>
      <div className="w-full h-full flex flex-col p-4 md:p-6">
        <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 items-center">
          <button
            onClick={() => onNavigate("creation-reference-produit")}
            className={`cursor-pointer w-full h-1/2 p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
          >
            <Truck className="h-12 w-12 mb-4" />
            <span className="text-xl">
              {"Création d'une référence de produit"}
            </span>
          </button>
          <button
            onClick={() => onNavigate("/entrees-sorties/entrees")}
            className={`cursor-pointer w-full h-1/2 p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
          >
            <NotepadText className="h-12 w-12 mb-4" />
            <span className="text-xl">{"Entrées"}</span>
          </button>

          <button
            onClick={() => onNavigate("/entrees-sorties/sorties")}
            className={`cursor-pointer w-full h-1/2 p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
          >
            <NotepadText className="h-12 w-12 mb-4" />
            <span className="text-xl">{"Sorties"}</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default GestionStock;
