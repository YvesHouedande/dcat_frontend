import Layout from "@/components/Layout";
import { JSX, ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Briefcase, FolderArchive, Calculator, CalendarDays,
  Package, Tags, Percent, ShoppingCart, LayoutDashboard, FolderKanban,
  CalendarClock, Wrench, ClipboardCheck, KanbanSquare, FolderGit2,
  CalendarCheck, BookOpen, BookUser, Landmark, Laptop
} from "lucide-react";

// --- Data Structure for Dashboard ---

interface Section {
  title: string;
  route: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
}

interface Department {
  name: string;
  route: string;
  color: string;
  sections: Section[];
}

const dashboardConfig: Record<"daf" | "dmc" | "dsei", Department> = {
  daf: {
    name: "Direction Administrative et Financière",
    route: "/administration",
    color: "bg-slate-700",
    sections: [
      { title: "Ressources", route: "/administration/documents", icon: FolderArchive, color: "from-amber-500 to-amber-600" },
      { title: "Opérations Admin", route: "/administration/partenaires", icon: Briefcase, color: "from-emerald-500 to-emerald-600" },
      { title: "Ressources Humaines", route: "/administration/employers", icon: Users, color: "from-orange-500 to-orange-600" },
      { title: "Matérielles", route: "/administration/materiel", icon: Laptop, color: "from-green-500 to-green-600" },
      { title: "Financières", route: "/administration/finance", icon: Landmark, color: "from-purple-500 to-purple-600" },
      { title: "Opérations Fin.", route: "/administration/comptabilite", icon: Calculator, color: "from-red-600 to-red-700" },
      { title: "Planning DAF", route: "/administration/planning", icon: CalendarDays, color: "from-teal-500 to-teal-600" },
    ],
  },
  dmc: {
    name: "Direction Marketing et Commerciale",
    route: "/commercial",
    color: "bg-orange-700",
    sections: [
      { title: "Produits", route: "/commercial/produits", icon: Package, color: "from-yellow-600 to-yellow-700" },
      { title: "Prix", route: "/commercial/prix", icon: Tags, color: "from-yellow-600 to-yellow-700" },
      { title: "Promotions", route: "/commercial/promotions", icon: Percent, color: "from-yellow-600 to-yellow-700" },
      { title: "Distribution / Vente", route: "/commercial/distribution", icon: ShoppingCart, color: "from-yellow-600 to-yellow-700" },
      { title: "Tableau de Bord", route: "/commercial/dashboard", icon: LayoutDashboard, color: "from-amber-600 to-amber-700" },
      { title: "Dossiers DMC", route: "/commercial/dossiers", icon: FolderKanban, color: "from-pink-600 to-pink-700" },
      { title: "Planning DCM", route: "/commercial/planning", icon: CalendarClock, color: "from-lime-500 to-lime-600" },
    ],
  },
  dsei: {
    name: "Direction des Systèmes d'Exploitation et d'Information",
    route: "/technique",
    color: "bg-blue-700",
    sections: [
      { title: "Interventions", route: "/technique/interventions", icon: Wrench, color: "from-sky-500 to-sky-600" },
      { title: "Tâches", route: "/technique/projets/taches", icon: ClipboardCheck, color: "from-rose-400 to-rose-500" },
      { title: "Projets", route: "/technique/projets", icon: KanbanSquare, color: "from-orange-400 to-orange-500" },
      { title: "Dossiers DSEI", route: "/technique/document", icon: FolderGit2, color: "from-indigo-400 to-indigo-500" },
      { title: "Planning DSEI", route: "/technique/planning", icon: CalendarCheck, color: "from-cyan-500 to-cyan-600" },
    ],
  },
};

const footerConfig: Section[] = [
    { title: "Manuel des Procédures", route: "/documentation/procedures", icon: BookOpen, color: "from-gray-100 to-gray-200 text-gray-800" },
    { title: "Contacts & Planning", route: "/administration/contacts", icon: BookUser, color: "from-gray-100 to-gray-200 text-gray-800" }
];


// --- Reusable Components ---

const Header = ({ onNavigate }: { onNavigate: (path: string) => void }) => (
  <header className="flex items-center justify-between bg-white p-4 border-b border-gray-200 shadow-sm">
    <div 
      className="flex items-center space-x-4 cursor-pointer"
      onClick={() => onNavigate('/')}
      title="Retour à l'accueil"
    >
      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-900 text-white font-bold text-xl shadow-md">
        DCAT
      </div>
      <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
        Portail de Gestion DCAT
      </h1>
    </div>
    <div 
      className="text-center font-bold text-2xl text-blue-800 cursor-pointer"
      onClick={() => onNavigate('/direction-generale')}
      title="Accéder à la Direction Générale"
    >
      Direction Générale
    </div>
  </header>
);

const DepartmentCard = ({ department, onNavigate }: { department: Department, onNavigate: (path: string) => void }) => (
  <div className="flex-1 flex flex-col bg-gray-50 rounded-xl overflow-hidden shadow-md border border-gray-100 min-w-[300px]">
    <div
      className={`${department.color} p-4 text-center font-bold text-xl text-white cursor-pointer hover:opacity-90 transition-opacity`}
      onClick={() => onNavigate(department.route)}
      title={`Vue d'ensemble ${department.name}`}
    >
      <h2>{department.name}</h2>
    </div>
    <div className="p-4 grid grid-cols-2 gap-4 flex-grow">
      {department.sections.map(section => (
        <SectionButton key={section.title} section={section} onNavigate={onNavigate} />
      ))}
    </div>
  </div>
);

const SectionButton = ({ section, onNavigate }: { section: Section, onNavigate: (path: string) => void }) => {
  const Icon = section.icon;
  return (
    <button
      onClick={() => onNavigate(section.route)}
      title={`Accéder à ${section.title}`}
      className={`p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br ${section.color} hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
    >
      <Icon className="h-8 w-8 mb-2" />
      <span>{section.title}</span>
    </button>
  );
};

const Footer = ({ onNavigate }: { onNavigate: (path: string) => void }) => (
    <footer className="flex flex-col md:flex-row mt-6">
        {footerConfig.map(section => {
            const Icon = section.icon;
            return (
                <div
                    key={section.title}
                    className={`flex-1 p-5 text-center font-semibold rounded-lg ${section.color} transition-all cursor-pointer hover:shadow-md border-t border-gray-200`}
                    onClick={() => onNavigate(section.route)}
                    title={`Consulter ${section.title.toLowerCase()}`}
                >
                    <div className="flex items-center justify-center">
                        <Icon className="h-5 w-5 mr-3" />
                        {section.title}
                    </div>
                </div>
            )
        })}
    </footer>
);


// --- Main Component ---

const AnotherDashboardPage = (): JSX.Element => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <Layout>
      <div className="w-full h-full p-4 md:p-6 bg-gray-100">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <Header onNavigate={handleNavigation} />
          
          <main className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <DepartmentCard department={dashboardConfig.daf} onNavigate={handleNavigation} />
              <DepartmentCard department={dashboardConfig.dmc} onNavigate={handleNavigation} />
              <DepartmentCard department={dashboardConfig.dsei} onNavigate={handleNavigation} />
            </div>
          </main>
          
          <Footer onNavigate={handleNavigation} />
        </div>
      </div>
    </Layout>
  );
};

export default AnotherDashboardPage;