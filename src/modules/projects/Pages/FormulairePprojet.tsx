import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Cog} from "lucide-react";

const FormulaireProjet: React.FC = () => {
  // État pour gérer les valeurs du formulaire
  const [dateDebut, setDateDebut] = useState<string>("");
  const [dateFin, setDateFin] = useState<string>("");
  const [duree, setDuree] = useState<string>("");
  
  // Calculer la durée automatiquement à partir des dates
  useEffect(() => {
    if (dateDebut && dateFin) {
      const debut = new Date(dateDebut);
      const fin = new Date(dateFin);
      
      if (fin >= debut) {
        // Calculer la différence en jours
        const diffTime = Math.abs(fin.getTime() - debut.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Convertir en mois et jours pour l'affichage
        const months = Math.floor(diffDays / 30);
        const remainingDays = diffDays % 30;
        
        if (months > 0) {
          setDuree(`${months} mois ${remainingDays > 0 ? `et ${remainingDays} jours` : ''}`);
        } else {
          setDuree(`${diffDays} jours`);
        }
      }
    }
  }, [dateDebut, dateFin]);
  
  return (
    <Layout>
      {/* En-tête du formulaire */}
      <div className="w-full py-6">
        <div className="flex w-full flex-col justify-center items-center uppercase font-semibold text-xl">
          <div className="flex items-center gap-2">
            <Cog className="w-6 h-6" />
            Créer un nouveau projet
          </div>
          <div className="w-32 h-1.5 bg-blue-600 mt-1 rounded-full"></div>
        </div>
      </div>
      
      {/* Contenu du formulaire */}
      <div className="container mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Nom du projet */}
          <div className="space-y-2">
            <Label htmlFor="nom" className="text-sm font-medium">Nom du projet</Label>
            <Input id="nom" placeholder="Nom du projet" className="w-full" />
          </div>

          {/* Type de projet */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">Type de projet</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="informatique">Informatique</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Devis estimatif */}
          <div className="space-y-2">
            <Label htmlFor="devis" className="text-sm font-medium">Devis estimatif (€)</Label>
            <Input id="devis" type="number" placeholder="10000" className="w-full" />
          </div>

          {/* Date de début */}
          <div className="space-y-2">
            <Label htmlFor="debut" className="text-sm font-medium">Date de début</Label>
            <div className="relative">
              <Input 
                id="debut" 
                type="date" 
                className="w-full pr-10" 
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>
          </div>

          {/* Date de fin */}
          <div className="space-y-2">
            <Label htmlFor="fin" className="text-sm font-medium">Date de fin</Label>
            <div className="relative">
              <Input 
                id="fin" 
                type="date" 
                className="w-full pr-10 " 
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
          </div>

          {/* Durée prévue (calculée automatiquement) */}
          <div className="space-y-2">
            <Label htmlFor="duree" className="text-sm font-medium">Durée prévue</Label>
            <Input 
              id="duree" 
              placeholder="Calculée automatiquement" 
              className="w-full" 
              value={duree}
              readOnly 
            />
          </div>

          {/* Description - prend toute la largeur */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Description du projet..." 
              className="min-h-[120px] w-full" 
            />
          </div>

          {/* État du projet */}
          <div className="space-y-2">
            <Label htmlFor="etat" className="text-sm font-medium">État du projet</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner l'état" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="termine">Terminé</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Famille */}
          <div className="space-y-2">
            <Label htmlFor="famille" className="text-sm font-medium">Famille du projet</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une famille" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="developpement">Développement</SelectItem>
                <SelectItem value="recherche">Recherche</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Partenaire - prend toute la largeur */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="partenaire" className="text-sm font-medium">Partenaire associé</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un partenaire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="p1">Partenaire 1</SelectItem>
                <SelectItem value="p2">Partenaire 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bouton de soumission */}
          <div className="md:col-span-2 mt-6">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
              Créer le projet
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FormulaireProjet;