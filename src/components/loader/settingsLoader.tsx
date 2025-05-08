import { Cog } from "lucide-react";
function settingsLoader() {
  return (
    <div className="flex flex-col h-full justify-center items-center">
      <Cog className="w-24 h-24  animate-spin text-blue-600" />
      <span>Chargement...</span>
    </div>
  );
}

export default settingsLoader;
