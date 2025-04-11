import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, FileImage } from "lucide-react";

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

interface Categorie {
  id: string;
  nom: string;
  code: string;
}

interface Famille {
  id: string;
  nom: string;
  code: string;
}

interface Marque {
  id: string;
  nom: string;
  code: string;
}

interface Modele {
  id: string;
  nom: string;
  code: string;
}

export default function AjoutProduit() {
  // États pour stocker les options de sélection
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [familles, setFamilles] = useState<Famille[]>([]);
  const [marques, setMarques] = useState<Marque[]>([]);
  const [modeles, setModeles] = useState<Modele[]>([]);
  const [codeGenere, setCodeGenere] = useState<string>("");
  const [message, setMessage] = useState<{ type: string; content: string } | null>(null);

  // État pour les valeurs sélectionnées
  const [selectedCategorie, setSelectedCategorie] = useState<string>("");
  const [selectedFamille, setSelectedFamille] = useState<string>("");
  const [selectedMarque, setSelectedMarque] = useState<string>("");
  const [selectedModele, setSelectedModele] = useState<string>("");

  // Charger les données simulées
  useEffect(() => {
    // Dans un cas réel, remplacer par des appels API
    setCategories([
      { id: "1", nom: "Outillage", code: "OUT" },
      { id: "2", nom: "Électronique", code: "ELE" },
      { id: "3", nom: "Informatique", code: "INF" },
    ]);

    setFamilles([
      { id: "1", nom: "Mécanique", code: "MEC" },
      { id: "2", nom: "Électrique", code: "ELE" },
      { id: "3", nom: "Portable", code: "POR" },
    ]);

    setMarques([
      { id: "1", nom: "Bosch", code: "BOS" },
      { id: "2", nom: "Apple", code: "APP" },
      { id: "3", nom: "Dell", code: "DEL" },
    ]);

    setModeles([
      { id: "1", nom: "Série 4500", code: "4500" },
      { id: "2", nom: "12 Pro", code: "12PRO" },
      { id: "3", nom: "XPS R9000", code: "R9000" },
    ]);
  }, []);

  // Générer le code produit automatiquement
  useEffect(() => {
    if (selectedCategorie && selectedFamille && selectedMarque && selectedModele) {
      const categorieObj = categories.find(cat => cat.id === selectedCategorie);
      const familleObj = familles.find(fam => fam.id === selectedFamille);
      const marqueObj = marques.find(mar => mar.id === selectedMarque);
      const modeleObj = modeles.find(mod => mod.id === selectedModele);

      if (categorieObj && familleObj && marqueObj && modeleObj) {
        const code = categorieObj.code + familleObj.code + marqueObj.code + modeleObj.code;
        setCodeGenere(code);
      }
    } else {
      setCodeGenere("");
    }
  }, [selectedCategorie, selectedFamille, selectedMarque, selectedModele, categories, familles, marques, modeles]);

  // Gérer la soumission du formulaire
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Simuler l'ajout d'un produit
    setMessage({ 
      type: "success", 
      content: "Produit ajouté avec succès! Code produit généré: " + codeGenere 
    });
    
    // Dans un cas réel, vous enverriez les données à votre API ici
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Ajouter un produit</h1>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
          <AlertDescription>{message.content}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations du produit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sélecteurs pour générer le code produit */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categorie">Catégorie</Label>
                  <Select 
                    value={selectedCategorie} 
                    onValueChange={setSelectedCategorie}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.nom} ({cat.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="famille">Famille</Label>
                  <Select 
                    value={selectedFamille} 
                    onValueChange={setSelectedFamille}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une famille" />
                    </SelectTrigger>
                    <SelectContent>
                      {familles.map((fam) => (
                        <SelectItem key={fam.id} value={fam.id}>
                          {fam.nom} ({fam.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="marque">Marque</Label>
                  <Select 
                    value={selectedMarque} 
                    onValueChange={setSelectedMarque}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une marque" />
                    </SelectTrigger>
                    <SelectContent>
                      {marques.map((mar) => (
                        <SelectItem key={mar.id} value={mar.id}>
                          {mar.nom} ({mar.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="modele">Modèle</Label>
                  <Select 
                    value={selectedModele} 
                    onValueChange={setSelectedModele}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      {modeles.map((mod) => (
                        <SelectItem key={mod.id} value={mod.id}>
                          {mod.nom} ({mod.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="code">Code produit généré</Label>
                  <Input 
                    id="code" 
                    value={codeGenere} 
                    disabled 
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* Informations générales du produit */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nom">Nom du produit</Label>
                  <Input id="nom" placeholder="Nom du produit" required />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Description du produit" 
                    rows={3} 
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type de produit</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outil">Outil de travail</SelectItem>
                      <SelectItem value="equipement">Équipement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantite">Quantité</Label>
                  <Input 
                    id="quantite" 
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Section image */}
            <div>
              <Label>Image du produit</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                <FileImage className="h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Glissez une image ici, ou{" "}
                  <Button variant="link" className="text-blue-600 p-0 h-auto">
                    parcourir vos fichiers
                  </Button>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, jusqu'à 5MB
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button variant="outline">Annuler</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}