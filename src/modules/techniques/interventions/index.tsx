import { ChartAreaInteractive } from "./components/ChartAreaInteractive";
import SectionCards from "./components/sectionCards";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

// Modification ici
const NavComponent = () => {
  return (
    <div>
      <Button
        className="cursor-pointer transition ease-in-out duration-300 active:scale-95"
        variant={"outline"}
      >
        <Link className="flex items-center space-x-2" to={"nouvelle_intervention"}>
          Nouvelle intervention <Plus />
        </Link>
      </Button>
    </div>
  );
};

export default function Index() {
  return (
    <Layout autre={NavComponent}>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
