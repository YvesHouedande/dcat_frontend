import Layout from "@/components/Layout";
import { BriefcaseMedical, HardDriveDownload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GestionEquipement() {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="w-full h-full flex flex-col p-4 md:p-6">
        <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 items-center">
          <button
            onClick={() => navigate("/gestion-equipements-et-moyens-travail/equipements")}
            className={`cursor-pointer w-full h-1/2 p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
          >
            <HardDriveDownload className="h-12 w-12 mb-4" />
            <span className="text-xl">
              {
                "Enregistrement des équipements et moyens de travail ( inventaire) "
              }
            </span>
          </button>
          <button
            onClick={() =>
              navigate("/gestion-equipements-et-moyens-travail/equipements/maintenance")
            }
            className={`cursor-pointer w-full h-1/2 p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
          >
            <BriefcaseMedical className="h-12 w-12 mb-4" />
            <span className="text-xl">
              {"Maintenance préventive et corrective "}
            </span>
          </button>
        </div>
      </div>
    </Layout>
  );
}
