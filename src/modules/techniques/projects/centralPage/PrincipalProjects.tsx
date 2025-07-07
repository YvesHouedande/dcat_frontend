import { useState, useEffect } from "react"; // Importez useState et useEffect
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardContent} from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom"; // Importez useNavigate et useLocation

// Importez vos composants de sous-modules existants
import TachesPage from "../tasks/TasksPage";
import LivrablesPage from "../livrables/LivrablesPage";
import ProjetsPage from "../projet/ProjectsPage";
import Layout from "@/components/Layout";

// --- La Page principale de Gestion des Projets avec les Onglets
export default function GestionProjetsPage() {
  const navigate = useNavigate(); // Hook pour naviguer programmatiquement
  const location = useLocation(); // Hook pour obtenir l'objet de localisation de l'URL actuelle

  // Fonction utilitaire pour déterminer l'onglet actif à partir de l'URL
  const getActiveTabFromUrl = (pathname: string) => {
    // Vérifiez si le chemin contient '/taches'
    if (pathname.includes("/technique/projets/taches")) {
      return "taches";
    }
    // Vérifiez si le chemin contient '/livrables'
    if (pathname.includes("/technique/projets/livrables")) {
      return "livrables";
    }
    // Si aucun sous-chemin spécifique n'est trouvé, l'onglet par défaut est 'projets-overview'
    return "projets-overview";
  };

  // État local qui contrôle quel onglet est actuellement actif
  // Initialisé en fonction de l'URL au moment du montage du composant
  const [activeTab, setActiveTab] = useState(getActiveTabFromUrl(location.pathname));

  // Effet pour mettre à jour l'onglet actif si l'URL change (par exemple, navigation arrière/avant du navigateur)
  useEffect(() => {
    setActiveTab(getActiveTabFromUrl(location.pathname));
  }, [location.pathname]); // Déclenche cet effet chaque fois que le chemin de l'URL change

  // Gestionnaire de changement d'onglet
  const handleTabChange = (value: string) => {
    let newPath = "/technique/projets"; // Le chemin de base pour la page de gestion des projets

    if (value === "taches") {
      newPath = "/technique/projets/taches";
    } else if (value === "livrables") {
      newPath = "/technique/projets/livrables";
    }
    // Si 'value' est 'projets-overview', newPath reste "/technique/projets"

    navigate(newPath); // Change l'URL dans la barre d'adresse
    setActiveTab(value); // Met à jour l'état de l'onglet pour que le composant Tabs reflète le changement immédiatement
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-6 text-center">Gestion des Projets</h1>

        {/* Composant Tabs principal pour organiser les sous-modules */}
        {/* Le 'value' du composant Tabs est maintenant contrôlé par notre état 'activeTab' */}
        {/* Le 'onValueChange' appelle notre fonction 'handleTabChange' */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Liste des onglets (boutons cliquables) */}
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px] mx-auto">
            {/* Onglet pour la vue d'ensemble des projets */}
            <TabsTrigger value="projets-overview">Vue d'ensemble des Projets</TabsTrigger>
            {/* Onglet pour la gestion des tâches */}
            <TabsTrigger value="taches">Gestion des Tâches</TabsTrigger>
            {/* Onglet pour la gestion des livrables */}
            <TabsTrigger value="livrables">Gestion des Livrables</TabsTrigger>
          </TabsList>

          {/* Contenu de chaque onglet */}
          {/* Le contenu de tous les onglets est toujours rendu, mais seul celui qui correspond à 'activeTab' est visible */}
          <TabsContent value="projets-overview">
              
              <CardContent>
                <ProjetsPage />
              </CardContent>
          </TabsContent>

          {/* Contenu de l'onglet "Gestion des Tâches" */}
          <TabsContent value="taches">
            <TachesPage />
          </TabsContent>

          {/* Contenu de l'onglet "Gestion des Livrables" */}
          <TabsContent value="livrables">
            <LivrablesPage />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}