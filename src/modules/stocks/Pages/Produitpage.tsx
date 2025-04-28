import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Search, Wrench } from "lucide-react";

export default function ProduitPage() {
  // État pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modelFilter, setModelFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const navigate = useNavigate();

  // Données exemple pour l'annuaire de produits
  const productsData = [
    {
      id_produit: "PRD001",
      Code_produit: "CP123456",
      desi_produit: "Écran LCD 24 pouces",
      desc_produit: "Écran LCD haute résolution 1080p avec ports HDMI et VGA",
      image_produit: "lcd_screen.jpg",
      Qte_produit: "15",
      emplacement: "Entrepôt A",
      Id_type_produit: "TYPE001",
      Id_modele: "MOD123",
      id_famille: "FAM22",
      id_marque: "BRAND05",
    },
    {
      id_produit: "PRD002",
      Code_produit: "CP789012",
      desi_produit: "Clavier mécanique",
      desc_produit: "Clavier gaming avec switches Cherry MX Red",
      image_produit: "keyboard.jpg",
      Qte_produit: "23",
      emplacement: "Entrepôt B",
      Id_type_produit: "TYPE002",
      Id_modele: "MOD456",
      id_famille: "FAM22",
      id_marque: "BRAND08",
    },
    {
      id_produit: "PRD003",
      Code_produit: "CP345678",
      desi_produit: "Souris sans fil",
      desc_produit: "Souris ergonomique avec capteur optique",
      image_produit: "mouse.jpg",
      Qte_produit: "42",
      emplacement: "Entrepôt A",
      Id_type_produit: "TYPE002",
      Id_modele: "MOD789",
      id_famille: "FAM22",
      id_marque: "BRAND08",
    },
    {
      id_produit: "PRD004",
      Code_produit: "CP901234",
      desi_produit: "Disque SSD 500GB",
      desc_produit: "Disque SSD haute vitesse pour PC",
      image_produit: "ssd.jpg",
      Qte_produit: "8",
      emplacement: "Entrepôt C",
      Id_type_produit: "TYPE003",
      Id_modele: "MOD012",
      id_famille: "FAM33",
      id_marque: "BRAND12",
    },
    {
      id_produit: "PRD005",
      Code_produit: "CP567890",
      desi_produit: "Casque audio",
      desc_produit: "Casque audio avec réduction de bruit",
      image_produit: "headphones.jpg",
      Qte_produit: "17",
      emplacement: "Entrepôt B",
      Id_type_produit: "TYPE004",
      Id_modele: "MOD345",
      id_famille: "FAM44",
      id_marque: "BRAND07",
    },
    {
      id_produit: "PRD006",
      Code_produit: "CP112233",
      desi_produit: "Webcam HD",
      desc_produit: "Webcam 1080p avec microphone intégré",
      image_produit: "webcam.jpg",
      Qte_produit: "12",
      emplacement: "Entrepôt A",
      Id_type_produit: "TYPE005",
      Id_modele: "MOD678",
      id_famille: "FAM55",
      id_marque: "BRAND09",
    },
    {
      id_produit: "PRD007",
      Code_produit: "CP445566",
      desi_produit: "Câble HDMI 2m",
      desc_produit: "Câble HDMI haute vitesse 4K",
      image_produit: "hdmi_cable.jpg",
      Qte_produit: "30",
      emplacement: "Entrepôt B",
      Id_type_produit: "TYPE005",
      Id_modele: "MOD901",
      id_famille: "FAM55",
      id_marque: "BRAND03",
    },
    {
      id_produit: "PRD008",
      Code_produit: "CP778899",
      desi_produit: "Adaptateur USB-C",
      desc_produit: "Adaptateur USB-C vers HDMI/USB/Ethernet",
      image_produit: "adapter.jpg",
      Qte_produit: "14",
      emplacement: "Entrepôt A",
      Id_type_produit: "TYPE005",
      Id_modele: "MOD234",
      id_famille: "FAM55",
      id_marque: "BRAND05",
    },
  ];

  // Types de produits pour le filtre
  const productTypes = [
    { id: "TYPE001", name: "Écrans" },
    { id: "TYPE002", name: "Périphériques" },
    { id: "TYPE003", name: "Stockage" },
    { id: "TYPE004", name: "Audio" },
    { id: "TYPE005", name: "Accessoires" },
  ];

  // Modèles pour le filtre
  const productModels = [
    { id: "MOD123", name: "Modèle 123" },
    { id: "MOD456", name: "Modèle 456" },
    { id: "MOD789", name: "Modèle 789" },
    { id: "MOD012", name: "Modèle 012" },
    { id: "MOD345", name: "Modèle 345" },
    { id: "MOD678", name: "Modèle 678" },
    { id: "MOD901", name: "Modèle 901" },
    { id: "MOD234", name: "Modèle 234" },
  ];

  // Marques pour le filtre
  const productBrands = [
    { id: "BRAND05", name: "Marque 05" },
    { id: "BRAND08", name: "Marque 08" },
    { id: "BRAND12", name: "Marque 12" },
    { id: "BRAND07", name: "Marque 07" },
    { id: "BRAND09", name: "Marque 09" },
    { id: "BRAND03", name: "Marque 03" },
  ];

  // Filtrer les produits
  const filteredProducts = productsData.filter((product) => {
    const matchesSearch =
      product.desi_produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.Code_produit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.Id_type_produit === categoryFilter;
    const matchesModel =
      modelFilter === "all" || product.Id_modele === modelFilter;
    const matchesBrand =
      brandFilter === "all" || product.id_marque === brandFilter;
    return matchesSearch && matchesCategory && matchesModel && matchesBrand;
  });

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Catalogue Equipements</h1>
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
      <div className="flex flex-wrap gap-2 mb-4">
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
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            {productTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
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
              <SelectItem key={model.id} value={model.id}>
                {model.name}
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
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchTerm("");
            setCategoryFilter("all");
            setModelFilter("all");
            setBrandFilter("all");
          }}
          className="h-9"
        >
          Réinitialiser
        </Button>
      </div>
      <div className="text-sm text-gray-500 p-2">
        {filteredProducts.length} produits
      </div>

      {/* Grille de produits */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filteredProducts.map((product) => (
          <Card
            key={product.id_produit}
            className="overflow-hidden border rounded-md hover:shadow-md transition-shadow"
          >
            <div className="h-32 bg-gray-100 relative">
              <img
                src="/api/placeholder/400/300"
                alt={product.desi_produit}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-1 right-1 text-xs px-1 py-0 bg-blue-500">
                {product.Qte_produit}
              </Badge>
            </div>

            <CardHeader className="px-3 py-2">
              <CardTitle className="text-sm font-medium line-clamp-1">
                {product.desi_produit}
              </CardTitle>
              <p className="text-xs text-gray-500 mt-1">
                {product.Code_produit}
              </p>
            </CardHeader>

            <CardContent className="px-3 pb-3 pt-0">
              <div className="flex gap-1 flex-wrap mb-2">
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {product.emplacement}
                </Badge>
                {productTypes.find((t) => t.id === product.Id_type_produit) && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    {
                      productTypes.find((t) => t.id === product.Id_type_produit)
                        .name
                    }
                  </Badge>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  onClick={() => {
                    navigate(`${product.id_produit}`);
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2 flex-1 cursor-pointer"
                >
                  Détails
                </Button>
                <Button
                  size="sm"
                  className="text-xs h-7 px-2 flex-1 cursor-pointer"
                >
                  Ajouter
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
