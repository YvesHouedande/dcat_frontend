import Layout from "@/components/Layout";
import { ArrowDown, ArrowUp, NotepadText, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GestionOutils() {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="w-full h-full flex flex-col p-4 md:p-6">
        <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 items-center">
          <button
            onClick={() => navigate("/gestion-des-outils-travail/creation-outils")}
            className={`cursor-pointer w-full h-1/2 p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
          >
            <Wrench className="h-12 w-12 mb-4" />
            <span className="text-xl">
              {"Création d'une référence d'outil"}
            </span>
          </button>
          <button
            onClick={() => navigate("/gestion-des-outils-travail/entrees")}
            className={`cursor-pointer w-full h-1/2 p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
          >
            <NotepadText className="h-12 w-12 mb-4" />
            <span className="text-xl">{"Entrées"}</span>
          </button>

          <button
            onClick={() => navigate("/gestion-des-outils-travail/sorties")}
            className={`cursor-pointer w-full h-1/2 p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
          >
            <ArrowUp className="h-12 w-12 mb-4" />
            <span className="text-xl">{"Sorties"}</span>
          </button>

          <button
            onClick={() => navigate("/gestion-des-outils-travail/retours")}
            className={`cursor-pointer w-full h-1/2 p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
          >
            <ArrowDown className="h-12 w-12 mb-4" />
            <span className="text-xl">{"Retour"}</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}
