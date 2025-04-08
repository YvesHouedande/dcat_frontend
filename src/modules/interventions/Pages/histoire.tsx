import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Layout from "@/components/Layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import InterventionsTable from "./historique";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useInterventions } from "../lib/queries";
import { useState } from "react";
// Définition de l'interface pour un contrat
interface Contrat {
  id_contrat: string;
  nom_contrat: string;
  duree_Contrat: string;
  date_debut: string;
  date_fin: string;
}

const NavComponent = () => {
  return (
    <div>
      <Button
        className="cursor-pointer transition ease-in-out duration-300 active:scale-95"
        variant={"outline"}
      >
        <Link
          className="flex items-center space-x-2"
          to={"/interventions/nouvelle_intervention"}
        >
          Nouvelle intervention <Plus />
        </Link>
      </Button>
    </div>
  );
};

export function ResizableHandleDemo() {
  const contrats: Contrat[] = [
    {
      id_contrat: "ID_1",
      nom_contrat: "Contrat A",
      duree_Contrat: "3 années",
      date_debut: "2021-05-15",
      date_fin: "2024-05-15",
    },
    {
      id_contrat: "ID_2",
      nom_contrat: "Contrat B",
      duree_Contrat: "2 années",
      date_debut: "2022-08-01",
      date_fin: "2024-08-01",
    },
    {
      id_contrat: "ID_3",
      nom_contrat: "Contrat C",
      duree_Contrat: "1 année",
      date_debut: "2023-01-10",
      date_fin: "2024-01-10",
    },
    {
      id_contrat: "ID_4",
      nom_contrat: "Contrat D",
      duree_Contrat: "4 années",
      date_debut: "2020-07-20",
      date_fin: "2024-07-20",
    },
    {
      id_contrat: "ID_5",
      nom_contrat: "Contrat E",
      duree_Contrat: "5 années",
      date_debut: "2021-12-05",
      date_fin: "2026-12-05",
    },
    {
      id_contrat: "ID_6",
      nom_contrat: "Contrat F",
      duree_Contrat: "3 années",
      date_debut: "2020-11-10",
      date_fin: "2023-11-10",
    },
    {
      id_contrat: "ID_7",
      nom_contrat: "Contrat G",
      duree_Contrat: "2 années",
      date_debut: "2022-04-17",
      date_fin: "2024-04-17",
    },
    {
      id_contrat: "ID_8",
      nom_contrat: "Contrat H",
      duree_Contrat: "1 année",
      date_debut: "2023-07-25",
      date_fin: "2024-07-25",
    },
    {
      id_contrat: "ID_9",
      nom_contrat: "Contrat I",
      duree_Contrat: "4 années",
      date_debut: "2019-09-12",
      date_fin: "2023-09-12",
    },
    {
      id_contrat: "ID_10",
      nom_contrat: "Contrat J",
      duree_Contrat: "5 années",
      date_debut: "2020-06-30",
      date_fin: "2025-06-30",
    },
  ];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, isFetching, isError, error, refetch } = useInterventions(
    selectedId!
  );

  const handleClick = (id: string) => {
    setSelectedId(id);
    setTimeout(() => refetch(), 0); // 🚀 Refetch après mise à jour
  };

  return (
    <Layout autre={NavComponent}>
      <div className="space-y-4 flex flex-col p-4 w-full h-full ">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full h-full min-h-[calc(100vh-160px)] rounded-lg border"
        >
          <ResizablePanel defaultSize={30}>
            <div className="flex flex-col h-full  p-6">
              <span className="font-semibold">Contrats</span>
              <ScrollArea className="w-full  text-base font-normal h-[calc(100vh-240px)]">
                <div className="space-y-2">
                  {contrats.map((contrat) => (
                    <div
                      onClick={() => {
                        handleClick(contrat.id_contrat);
                      }}
                      key={contrat.id_contrat}
                      className="border p-4 rounded-lg hover:shadow-md cursor-pointer "
                    >
                      <h2 className=" font-semibold">{contrat.nom_contrat}</h2>
                      <p>
                        <span className="font-bold">Durée:</span>{" "}
                        {contrat.duree_Contrat}
                      </p>
                      <p>
                        <span className="font-bold">Date de début:</span>{" "}
                        {contrat.date_debut}
                      </p>
                      <p>
                        <span className="font-bold">Date de fin:</span>{" "}
                        {contrat.date_fin}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70}>
            <div className="flex h-full flex-col  p-6">
              <span className="font-semibold justify-self-start self-start items-start">
                Interventions
              </span>

              <div className="w-full h-full flex items-center justify-center">
                {!data && !isFetching && !isError && (
                  <span className="font-semibold">Content</span>
                )}
                {isFetching && <p>Chargement...</p>}
                {isError && <p>Erreur : {(error as Error).message}</p>}
              </div>

              {data && (
                <ScrollArea className="w-full flex h-full">
                  <InterventionsTable />
                </ScrollArea>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Layout>
  );
}
