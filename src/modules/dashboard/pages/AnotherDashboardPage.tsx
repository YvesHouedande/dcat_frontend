import Layout from "@/components/Layout";
import { JSX, ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  FolderArchive,
  Wrench,
  KanbanSquare,
  Landmark,
  NotepadText,
  Truck,
  Camera,
  Printer,
  Megaphone,
  BadgeDollarSign,
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

const dashboardConfig: Record<
  "daf" | "dmc" | "dsei" | "gs" | "mg",
  Department
> = {
  daf: {
    name: "Administration et Financier",
    route: "/gestion-administrative",
    color: "bg-slate-700",
    sections: [
      {
        title: "Gestion Adminsitrative",
        route: "/gestion-administrative",
        icon: FolderArchive,
        color: "from-amber-500 to-amber-600",
      },
      {
        title: "Finance et compatiblité  ",
        route: "/finance-et-compatibilite",
        icon: Briefcase,
        color: "from-emerald-500 to-emerald-600",
      },
      {
        title: "Resources Humaines",
        route: "/resources-humaines",
        icon: Landmark,
        color: "from-purple-500 to-purple-600",
      },
    ],
  },
  gs: {
    name: "GESTION DES STOCKS",
    route: "/entrees-sorties",
    color: "bg-slate-700",
    sections: [
      {
        title: "Entrées/sorties stock",
        route: "/entrees-sorties",
        icon: Truck,
        color: "from-amber-500 to-amber-600",
      },
      {
        title: "Achat",
        route: "/achat",
        icon: NotepadText,
        color: "from-emerald-500 to-emerald-600",
      },
    ],
  },
  dsei: {
    name: "TECHNIQUE",
    route: "/gestion-des-interventions",
    color: "bg-blue-700",
    sections: [
      {
        title: "Gestion des interventions",
        route: "/gestion-des-interventions",
        icon: Wrench,
        color: "from-sky-500 to-sky-600",
      },
      {
        title: "Gestion des Projets",
        route: "/gestion-des-projets",
        icon: KanbanSquare,
        color: "from-orange-400 to-orange-500",
      },
    ],
  },
  mg: {
    name: "MOYENS GENERAUX",
    route: "/gestion-des-outils-travail",
    color: "bg-blue-700",
    sections: [
      {
        title: "Gestion des outils de travail",
        route: "/gestion-des-outils-travail",
        icon: Camera,
        color: "from-sky-500 to-sky-600",
      },
      {
        title: "Gestion des equipements et moyens de travail",
        route: "/gestion-equipements-et-moyens-travail",
        icon: Printer,
        color: "from-orange-400 to-orange-500",
      },
    ],
  },
  dmc: {
    name: "MARKETING et COMMERCIAL",
    route: "/commercial",
    color: "bg-orange-700",
    sections: [
      {
        title: "Marketing",
        route: "/marketing",
        icon: Megaphone,
        color: "from-yellow-600 to-yellow-700",
      },
      {
        title: "Commercial",
        route: "/commercial",
        icon: BadgeDollarSign,
        color: "from-yellow-600 to-yellow-700",
      },
    ],
  },
};

// --- Reusable Components ---

const Header = ({ onNavigate }: { onNavigate: (path: string) => void }) => (
  <header className="flex items-center justify-between bg-white p-4 border-b border-gray-200 shadow-sm">
    <div
      className="flex items-center space-x-4 cursor-pointer"
      onClick={() => onNavigate("/")}
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
      onClick={() => onNavigate("/direction-generale")}
      title="Accéder à la Direction Générale"
    >
      Direction Générale
    </div>
  </header>
);

const DepartmentCard = ({
  department,
  onNavigate,
}: {
  department: Department;
  onNavigate: (path: string) => void;
}) => (
  <div className="flex-1 flex flex-col  bg-gray-50 rounded-xl overflow-hidden shadow-md border border-gray-100 min-w-[300px]">
    <div
      className={`${department.color} p-4 text-center text-wrap font-bold text-xl text-white cursor-pointer hover:opacity-90 transition-opacity`}
      onClick={() => onNavigate(department.route)}
      title={`Vue d'ensemble ${department.name}`}
    >
      <h2>{department.name}</h2>
    </div>
    <div className="p-4 grid grid-cols-2 gap-4 container flex-grow">
      {department.sections.map((section) => (
        <SectionButton
          key={section.title}
          section={section}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  </div>
);

const SectionButton = ({
  section,
  onNavigate,
}: {
  section: Section;
  onNavigate: (path: string) => void;
}) => {
  const Icon = section.icon;
  return (
    <button
      onClick={() => onNavigate(section.route)}
      title={`Accéder à ${section.title}`}
      className={` cursor-pointer p-4 flex flex-col items-center justify-center text-center font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br ${section.color} hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out`}
    >
      <Icon className="h-8 w-8 mb-2" />
      <span>{section.title}</span>
    </button>
  );
};

// --- Main Component ---

const AnotherDashboardPage = (): JSX.Element => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Layout>
      <div className="w-full h-full ">
        <div className=" bg-white rounded-2xl shadow-xl overflow-hidden">
          <Header onNavigate={handleNavigation} />
          <main className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 justify-center items-stretch w-full mx-auto max-w-7xl">
              <DepartmentCard
                department={dashboardConfig.daf}
                onNavigate={handleNavigation}
              />
              <DepartmentCard
                department={dashboardConfig.gs}
                onNavigate={handleNavigation}
              />
              <DepartmentCard
                department={dashboardConfig.dsei}
                onNavigate={handleNavigation}
              />
              <DepartmentCard
                department={dashboardConfig.mg}
                onNavigate={handleNavigation}
              />
              <DepartmentCard
                department={dashboardConfig.dmc}
                onNavigate={handleNavigation}
              />
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default AnotherDashboardPage;
