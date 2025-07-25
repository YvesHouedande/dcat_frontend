import { Button } from "./ui/button";
import { HomeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate("/")}
      variant={"outline"}
      className="cursor-pointer"
    >
      <HomeIcon />
    </Button>
  );
}
