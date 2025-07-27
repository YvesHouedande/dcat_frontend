import { FileText, FolderArchive, UsersRound } from "lucide-react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function GestionAdminstrative() {
  const onNavigate = useNavigate();
  return (
    <Layout>
      <div className="w-full h-full flex flex-col p-4 md:p-6">
        <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 items-center">
          <button
            onClick={() => onNavigate("/gestion-administrative/partenaires")}
            className={`cursor-pointer w-full h-1/2 p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
          >
            <UsersRound className="h-12 w-12 mb-4" />
            <span className="text-xl">{"Partenaires"}</span>
          </button>
          <button
            onClick={() => onNavigate("/gestion-administrative/contrats")}
            className={`cursor-pointer w-full h-1/2 p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
          >
            <FileText className="h-12 w-12 mb-4" />
            <span className="text-xl">{"Contrats"}</span>
          </button>

          <button
            onClick={() => toast.info("En cours de développement")}
            className={`cursor-pointer w-full h-1/2 p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
          >
            <FolderArchive className="h-12 w-12 mb-4" />
            <span className="text-xl">{"Documents "}</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default GestionAdminstrative;
