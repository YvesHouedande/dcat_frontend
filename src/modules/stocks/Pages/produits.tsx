import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

// Types
interface Produit {
  id_produit: string;
  Code_produit: string;
  nom_produit: string;
  desc_produit: string;
  type_de_produit_outils_de_travail_equippement: string;
  image_produit: string;
  Qte_produit: string;
  Id_modele: string;
  id_categorie: string;
  id_famille: string;
  id_marque: string;
}

export default function AnnuaireProduits() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Simuler un chargement de données
  useEffect(() => {
    // En situation réelle, remplacez ceci par un appel API
    const produitsExemple: Produit[] = [
      {
        id_produit: "1",
        Code_produit: "OUTMECBOS4500",
        nom_produit: "Perceuse à colonne",
        desc_produit: "Perceuse à colonne professionnelle",
        type_de_produit_outils_de_travail_equippement: "Outil",
        image_produit: "perceuse.jpg",
        Qte_produit: "5",
        Id_modele: "4500",
        id_categorie: "OUT",
        id_famille: "MEC",
        id_marque: "BOS",
      },
      {
        id_produit: "2",
        Code_produit: "ELEELEAPP12PRO",
        nom_produit: "iPhone 12 Pro",
        desc_produit: "Smartphone haut de gamme",
        type_de_produit_outils_de_travail_equippement: "Équipement",
        image_produit: "iphone.jpg",
        Qte_produit: "12",
        Id_modele: "12PRO",
        id_categorie: "ELE",
        id_famille: "ELE",
        id_marque: "APP",
      },
      {
        id_produit: "3",
        Code_produit: "INFPORDER9000",
        nom_produit: "Ordinateur Dell XPS",
        desc_produit: "Ordinateur portable haute performance",
        type_de_produit_outils_de_travail_equippement: "Équipement",
        image_produit: "dell.jpg",
        Qte_produit: "8",
        Id_modele: "R9000",
        id_categorie: "INF",
        id_famille: "POR",
        id_marque: "DEL",
      },
    ];

    setTimeout(() => {
      setProduits(produitsExemple);
      setLoading(false);
    }, 500);
  }, []);

  // Filtrer les produits en fonction du terme de recherche
  const filteredProduits = produits.filter(
    (produit) =>
      produit.nom_produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produit.Code_produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produit.desc_produit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Annuaire des Produits</h1>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Ajouter un produit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des produits</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Chargement des produits...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProduits.length > 0 ? (
                  filteredProduits.map((produit) => (
                    <TableRow key={produit.id_produit}>
                      <TableCell className="font-medium">
                        {produit.Code_produit}
                      </TableCell>
                      <TableCell>{produit.nom_produit}</TableCell>
                      <TableCell>{produit.desc_produit}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          {produit.type_de_produit_outils_de_travail_equippement}
                        </Badge>
                      </TableCell>
                      <TableCell>{produit.Qte_produit}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Voir
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600"
                          >
                            Modifier
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-gray-500"
                    >
                      Aucun produit trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-600">
            {filteredProduits.length} produit(s) trouvé(s)
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}