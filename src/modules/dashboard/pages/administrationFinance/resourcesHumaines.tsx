import Layout from "@/components/Layout";
import { FolderArchive, Users, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";


function ResourcesHumaines() {
  const onNavigate = useNavigate();
  return (
    <Layout>
      <div className="w-full h-full flex flex-col p-4 md:p-6">
        <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 items-center">
          <button
            onClick={() => onNavigate("/resources-humaines/employes")}
            className={`cursor-pointer w-full h-1/2 p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
          >
            <Users className="h-12 w-12 mb-4" />
            <span className="text-xl">{"Gestion des employés"}</span>
          </button>

          <button
            onClick={() => onNavigate("/resources-humaines/demandes")}
            className={`cursor-pointer w-full h-1/2 p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
          >
            <CalendarDays className="h-12 w-12 mb-4" />
            <span className="text-xl">
              {"Gestion des demandes d'absence (congés et permissions)"}
            </span>
          </button>
          <button
            onClick={() => onNavigate("/resources-humaines/dossier")}
            className={`cursor-pointer w-full h-1/2 p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
          >
            <FolderArchive className="h-12 w-12 mb-4" />
            <span className="text-xl">{"Documents"}</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default ResourcesHumaines;
