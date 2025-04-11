import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

  const boutonAdd = () => {
  return (
      <div>
        <Button
          className="cursor-pointer transition ease-in-out duration-300 active:scale-95"
          variant={"outline"}
        >
          <Link className="flex items-center space-x-2" to={"/COMPTABILITE/fichier"}>
            Ajouter un fichier <Plus />
          </Link>
        </Button>
      </div>
    );
  };

  export default boutonAdd;