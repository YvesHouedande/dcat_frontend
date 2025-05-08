import { useState, KeyboardEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    // Logique de recherche à implémenter
    console.log("Recherche :", searchTerm);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      // Afficher la valeur dans la console uniquement quand Entrée est pressée
      console.log("Recherche :", searchTerm);
    }
  };

  return (
    <div className="relative w-full self-center">
      <div className="relative self-center">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <Input
          type="search"
          placeholder="Rechercher..."
          value={searchTerm}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 mb-2"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 mr-1 hover:bg-transparent"
            onClick={handleSearch}
          >
            <Search size={20} className="text-primary" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
