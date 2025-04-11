import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Settings, ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const FormulaireProjet: React.FC = () => {
  // État pour gérer les valeurs du formulaire
  const [dateDebut, setDateDebut] = useState<Date | undefined>(undefined);
  const [dateFin, setDateFin] = useState<Date | undefined>(undefined);
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

  // Fonction pour le bouton de retour
  const boutonRetour = () => {
    return (
      <div>
        <Button
          className="cursor-pointer transition ease-in-out duration-300 active:scale-95"
          variant={"outline"}
        >
          <span className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" /> <span>Retour</span>
          </span>
        </Button>
      </div>
    );
  };
  
  return (
    <Layout autre={boutonRetour}>
      <div className="mx-auto px-4 py-8">
        {/* En-tête du formulaire avec style similaire au formulaire des tâches */}
        <div className="flex items-center justify-center mb-8">
          <Settings className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-semibold uppercase">CRÉER UN NOUVEAU PROJET</h1>
        </div>
        <div className="flex justify-center mb-8">
          <div className="w-32 h-1 bg-blue-600 rounded-full"></div>
        </div>
        
        {/* Contenu du formulaire avec style similaire au formulaire des tâches */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom du projet */}
            <div>
              <Label htmlFor="nom" className="text-sm font-medium block mb-2">
                Nom du projet <span className="text-red-500">*</span>
              </Label>
              <Input id="nom" placeholder="Nom du projet" className="w-full" />
            </div>

            {/* Type de projet */}
            <div>
              <Label htmlFor="type" className="text-sm font-medium block mb-2">
                Type de projet <span className="text-red-500">*</span>
              </Label>
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
            <div>
              <Label htmlFor="devis" className="text-sm font-medium block mb-2">
                Devis estimatif (€) <span className="text-red-500">*</span>
              </Label>
              <Input id="devis" type="number" placeholder="10000" className="w-full" />
            </div>

            {/* Date de début */}
            <div>
              <Label htmlFor="debut" className="text-sm font-medium block mb-2">
                Date de début <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateDebut && "text-gray-500"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateDebut ? (
                      format(dateDebut, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dateDebut}
                    onSelect={setDateDebut}
                    disabled={(date) => {
                      return date < new Date("1900-01-01");
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date de fin */}
            <div>
              <Label htmlFor="fin" className="text-sm font-medium block mb-2">
                Date de fin <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFin && "text-gray-500"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateFin ? (
                      format(dateFin, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dateFin}
                    onSelect={setDateFin}
                    disabled={(date) => {
                      // Assurez-vous de toujours retourner un boolean
                      if (date < new Date("1900-01-01")) return true;
                      if (dateDebut && date < dateDebut) return true;
                      return false;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Durée prévue (calculée automatiquement) */}
            <div>
              <Label htmlFor="duree" className="text-sm font-medium block mb-2">
                Durée prévue
              </Label>
              <Input 
                id="duree" 
                placeholder="Calculée automatiquement" 
                className="w-full bg-gray-50" 
                value={duree}
                readOnly 
              />
            </div>
          </div>

          {/* Description - prend toute la largeur */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium block mb-2">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea 
              id="description" 
              placeholder="Description du projet..." 
              className="min-h-[120px] w-full" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* État du projet */}
            <div>
              <Label htmlFor="etat" className="text-sm font-medium block mb-2">
                État du projet <span className="text-red-500">*</span>
              </Label>
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
            <div>
              <Label htmlFor="famille" className="text-sm font-medium block mb-2">
                Famille du projet <span className="text-red-500">*</span>
              </Label>
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
          </div>

          {/* Partenaire */}
          <div>
            <Label htmlFor="partenaire" className="text-sm font-medium block mb-2">
              Partenaire associé
            </Label>
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

          {/* Boutons d'action */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button 
              variant="outline" 
              className="w-32"
              onClick={() => {
                setDateDebut(undefined);
                setDateFin(undefined);
                setDuree("");
              }}
            >
              Réinitialiser
            </Button>
            <Button type="submit" className="w-32 bg-black hover:bg-gray-600 text-white">
              Enregistrer
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FormulaireProjet;