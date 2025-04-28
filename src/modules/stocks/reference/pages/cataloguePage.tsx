import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Search, Wrench } from "lucide-react";
import ReferenceCarte from "@/modules/stocks/reference/components/ui/ReferenceCarte";
import { ReferenceProduit } from "@/modules/stocks/types/reference";
import {
  categorieTypes,
  familleTypes,
  modeleTypes,
  marqueTypes,
} from "@/modules/stocks/types/reference";

export default function CataloguePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modelFilter, setModelFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [familyFilter, setFamilyFilter] = useState("all");
  const [productTypeFilter, setProductTypeFilter] = useState("all");
  const navigate = useNavigate();

  // Données exemple pour l'annuaire de produits
  const productsData: ReferenceProduit[] = [
    {
      id_produit: 1,
      Code_produit: "PROD-001",
      desi_produit: "Ordinateur Portable Pro",
      desc_produit:
        "Ordinateur portable avec écran 15 pouces, 16GB RAM, 512GB SSD.",
      image_produit: "https://example.com/images/prod001.jpg",
      qte_produit: 25,
      emplacement: "A1-B2",
      caracteristiques: "Intel i7, Full HD, Wi-Fi 6",
      categorie: "Informatique",
      type_produit: "Ordinateur",
      modele: "ThinkBook 15",
      famille: "Laptop",
      marque: "Lenovo",
    },
    {
      id_produit: 2,
      Code_produit: "PROD-002",
      desi_produit: "Écran LED 24 pouces",
      desc_produit: "Écran LED Full HD avec connectique HDMI et VGA.",
      image_produit: "https://example.com/images/prod002.jpg",
      qte_produit: 40,
      emplacement: "B3-C1",
      caracteristiques: "1080p, HDMI, 75Hz",
      categorie: "Informatique",
      type_produit: "Écran",
      modele: "VG245H",
      famille: "Moniteur",
      marque: "Asus",
    },
    {
      id_produit: 3,
      Code_produit: "PROD-003",
      desi_produit: "Clavier mécanique RGB",
      desc_produit:
        "Clavier gaming avec rétroéclairage RGB et switches rouges.",
      image_produit: "https://example.com/images/prod003.jpg",
      qte_produit: 60,
      emplacement: "C2-D3",
      caracteristiques: "AZERTY, Switchs Red, USB",
      categorie: "Périphériques",
      type_produit: "Clavier",
      modele: "K70 RGB MK.2",
      famille: "Accessoires PC",
      marque: "Corsair",
    },
    {
      id_produit: 4,
      Code_produit: "PROD-004",
      desi_produit: "Imprimante laser multifonction",
      desc_produit: "Imprimante laser avec scanner et copieur intégré.",
      image_produit: "https://example.com/images/prod004.jpg",
      qte_produit: 15,
      emplacement: "E4-F1",
      caracteristiques: "Wi-Fi, Duplex, A4",
      categorie: "Bureautique",
      type_produit: "Imprimante",
      modele: "MFC-L2710DW",
      famille: "Imprimante",
      marque: "Brother",
    },
    {
      id_produit: 5,
      Code_produit: "PROD-005",
      desi_produit: "Disque dur externe 1TB",
      desc_produit: "Stockage portable USB 3.0 de 1 To.",
      image_produit: "https://example.com/images/prod005.jpg",
      qte_produit: 80,
      emplacement: "G2-H3",
      caracteristiques: "USB 3.0, Portable",
      categorie: "Stockage",
      type_produit: "Disque dur",
      modele: "Elements",
      famille: "Externe",
      marque: "Western Digital",
    },
    {
      id_produit: 6,
      Code_produit: "PROD-006",
      desi_produit: "Routeur Wi-Fi 6",
      desc_produit: "Routeur performant pour maisons connectées.",
      image_produit: "https://example.com/images/prod006.jpg",
      qte_produit: 30,
      emplacement: "H1-I2",
      caracteristiques: "Wi-Fi 6, 5GHz, MU-MIMO",
      categorie: "Réseau",
      type_produit: "Routeur",
      modele: "AX1800",
      famille: "Networking",
      marque: "TP-Link",
    },
    {
      id_produit: 7,
      Code_produit: "PROD-007",
      desi_produit: "Casque sans fil Bluetooth",
      desc_produit: "Casque avec réduction de bruit active.",
      image_produit: "https://example.com/images/prod007.jpg",
      qte_produit: 50,
      emplacement: "I4-J1",
      caracteristiques: "ANC, Bluetooth 5.0, Autonomie 20h",
      categorie: "Audio",
      type_produit: "Casque",
      modele: "WH-1000XM4",
      famille: "Casque audio",
      marque: "Sony",
    },
    {
      id_produit: 8,
      Code_produit: "PROD-008",
      desi_produit: "Souris ergonomique",
      desc_produit: "Souris sans fil conçue pour réduire la fatigue.",
      image_produit: "https://example.com/images/prod008.jpg",
      qte_produit: 70,
      emplacement: "J3-K2",
      caracteristiques: "2.4GHz, Ergonomique, USB",
      categorie: "Périphériques",
      type_produit: "Souris",
      modele: "MX Vertical",
      famille: "Accessoires PC",
      marque: "Logitech",
    },
    {
      id_produit: 9,
      Code_produit: "PROD-009",
      desi_produit: "Station d'accueil USB-C",
      desc_produit: "Dock USB-C avec ports HDMI, USB 3.0, Ethernet.",
      image_produit: "https://example.com/images/prod009.jpg",
      qte_produit: 35,
      emplacement: "K1-L1",
      caracteristiques: "USB-C, Power Delivery, 4K HDMI",
      categorie: "Accessoires",
      type_produit: "Dock",
      modele: "DS100",
      famille: "Connectivité",
      marque: "Anker",
    },
    {
      id_produit: 10,
      Code_produit: "PROD-010",
      desi_produit: "Tablette graphique",
      desc_produit: "Tablette pour dessinateurs et graphistes, stylet inclus.",
      image_produit: "https://example.com/images/prod010.jpg",
      qte_produit: 20,
      emplacement: "L3-M1",
      caracteristiques: "8192 niveaux de pression, USB",
      categorie: "Graphisme",
      type_produit: "Tablette graphique",
      modele: "Intuos Pro",
      famille: "Création numérique",
      marque: "Wacom",
    },
  ];

  // Modèles pour le filtre
  const productModels: modeleTypes[] = [
    { id: 1, libelle_modele: "Modèle 123" },
    { id: 2, libelle_modele: "Modèle 456" },
    { id: 3, libelle_modele: "Modèle 789" },
    { id: 4, libelle_modele: "Modèle 012" },
    { id: 5, libelle_modele: "Modèle 345" },
    { id: 6, libelle_modele: "Modèle 678" },
    { id: 7, libelle_modele: "Modèle 901" },
    { id: 8, libelle_modele: "Modèle 234" },
  ];

  // Marques pour le filtre
  const productBrands: marqueTypes[] = [
    { id: 1, libelle_marque: "Marque 05" },
    { id: 2, libelle_marque: "Marque 08" },
    { id: 3, libelle_marque: "Marque 12" },
    { id: 4, libelle_marque: "Marque 07" },
    { id: 5, libelle_marque: "Marque 09" },
    { id: 6, libelle_marque: "Marque 03" },
  ];

  const productCategories: categorieTypes[] = [
    { id: 1, libelle_categorie: "Informatique" },
    { id: 2, libelle_categorie: "Bureautique" },
    { id: 3, libelle_categorie: "Périphériques" },
    { id: 4, libelle_categorie: "Stockage" },
    { id: 5, libelle_categorie: "Audio" },
    { id: 6, libelle_categorie: "Graphisme" },
    { id: 7, libelle_categorie: "Réseau" },
  ];

  const productFamilies: familleTypes[] = [
    { id: 1, libelle_famille: "Laptop" },
    { id: 2, libelle_famille: "Moniteur" },
    { id: 3, libelle_famille: "Accessoires PC" },
    { id: 4, libelle_famille: "Imprimante" },
    { id: 5, libelle_famille: "Externe" },
    { id: 6, libelle_famille: "Networking" },
    { id: 7, libelle_famille: "Casque audio" },
    { id: 8, libelle_famille: "Création numérique" },
    { id: 9, libelle_famille: "Connectivité" },
  ];

  // Filtrer les produits
  const filteredProducts = productsData.filter((product) => {
    const matchesSearch =
      product.desi_produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.Code_produit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.categorie === categoryFilter;
    const matchesProductType =
      productTypeFilter === "all" || product.type_produit === productTypeFilter;
    const matchesModel =
      modelFilter === "all" || product.modele === modelFilter;
    const matchesBrand =
      brandFilter === "all" || product.marque === brandFilter;
    const matchesFamily =
      familyFilter === "all" || product.famille === familyFilter;
    return (
      matchesSearch &&
      matchesCategory &&
      matchesProductType &&
      matchesModel &&
      matchesBrand &&
      matchesFamily
    );
  });

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Catalogue des Produits</h1>
        <Button
          onClick={() => {
            navigate("nouveau");
          }}
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          <Wrench size={16} className="mr-2" />
          Ajouter
        </Button>
      </div>

      {/* Contrôles de recherche et de filtres */}
      <div className="space-y-4 mb-4">
        {/* Première ligne : Recherche et bouton réinitialiser */}
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
              setProductTypeFilter("all");
              setFamilyFilter("all");
              setModelFilter("all");
              setBrandFilter("all");
            }}
            className="h-9 whitespace-nowrap"
          >
            Réinitialiser les filtres
          </Button>
        </div>

        {/* Deuxième ligne : Filtres */}
        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {productCategories.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.libelle_categorie}
                >
                  {category.libelle_categorie}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={familyFilter} onValueChange={setFamilyFilter}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Famille" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes familles</SelectItem>
              {productFamilies.map((family) => (
                <SelectItem key={family.id} value={family.libelle_famille}>
                  {family.libelle_famille}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={modelFilter} onValueChange={setModelFilter}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Modèle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous modèles</SelectItem>
              {productModels.map((model) => (
                <SelectItem key={model.id} value={model.libelle_modele}>
                  {model.libelle_modele}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Marque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes marques</SelectItem>
              {productBrands.map((brand) => (
                <SelectItem key={brand.id} value={brand.libelle_marque}>
                  {brand.libelle_marque}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="text-sm text-gray-500 p-2">
        {filteredProducts.length} produits
      </div>

      {/* Grille de produits */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filteredProducts.map((product) => (
          <ReferenceCarte product={product} />
        ))}
      </div>
    </div>
  );
}
