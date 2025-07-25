import Layout from "@/components/Layout";
import { Tag, Tags } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Marketing() {
  const onNavigate = useNavigate();
  return (
    <Layout>
      <div className="w-full h-full flex flex-col p-4 md:p-6">
        <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 items-center">
          <button
            onClick={() => onNavigate("/marketing/promotion-produit")}
            className={`cursor-pointer w-full h-1/2 p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
          >
            <Tag className="h-12 w-12 mb-4" />
            <span className="text-xl">{"Promotion d'un produit"}</span>
          </button>
          <button
            onClick={() => toast.info("En cours de conception")}
            className={`cursor-pointer w-full h-1/2 p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
          >
            <Tags className="h-12 w-12 mb-4" />
            <span className="text-xl">{"Promotion des services"}</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}
