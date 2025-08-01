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
    name: "ADMINISTRATION ET FINANCE",
    route: "/gestion-administrative",
    color: "bg-slate-800",
    sections: [
      {
        title: "Gestion Administrative",
        route: "/gestion-administrative",
        icon: FolderArchive,
        color: "from-slate-600 to-slate-700",
      },
      {
        title: "Finance et compatibilité",
        route: "/finance-et-compatibilite",
        icon: Briefcase,
        color: "from-blue-600 to-blue-700",
      },
      {
        title: "Ressources Humaines",
        route: "/resources-humaines",
        icon: Landmark,
        color: "from-indigo-600 to-indigo-700",
      },
    ],
  },
  gs: {
    name: "GESTION DES STOCKS",
    route: "/entrees-sorties",
    color: "bg-gray-800",
    sections: [
      {
        title: "Entrées/sorties stock",
        route: "/entrees-sorties",
        icon: Truck,
        color: "from-teal-600 to-teal-700",
      },
      {
        title: "Achat",
        route: "/achat",
        icon: NotepadText,
        color: "from-emerald-600 to-emerald-700",
      },
    ],
  },
  dsei: {
    name: "TECHNIQUE",
    route: "/gestion-des-interventions",
    color: "bg-zinc-800",
    sections: [
      {
        title: "Gestion des interventions",
        route: "/gestion-des-interventions",
        icon: Wrench,
        color: "from-cyan-600 to-cyan-700",
      },
      {
        title: "Gestion des Projets",
        route: "/gestion-des-projets",
        icon: KanbanSquare,
        color: "from-blue-600 to-blue-700",
      },
    ],
  },
  mg: {
    name: "MOYENS GENERAUX",
    route: "/gestion-des-outils-travail",
    color: "bg-stone-800",
    sections: [
      {
        title: "Gestion des outils de travail",
        route: "/gestion-des-outils-travail",
        icon: Camera,
        color: "from-slate-600 to-slate-700",
      },
      {
        title: "Gestion des équipements et moyens de travail",
        route: "/gestion-equipements-et-moyens-travail",
        icon: Printer,
        color: "from-gray-600 to-gray-700",
      },
    ],
  },
  dmc: {
    name: "MARKETING et COMMERCIAL",
    route: "/commercial",
    color: "bg-neutral-800",
    sections: [
      {
        title: "Marketing",
        route: "/marketing",
        icon: Megaphone,
        color: "from-violet-600 to-violet-700",
      },
      {
        title: "Commercial",
        route: "/commercial",
        icon: BadgeDollarSign,
        color: "from-purple-600 to-purple-700",
      },
    ],
  },
};

// --- Reusable Components ---

const DepartmentCard = ({
  department,
  onNavigate,
}: {
  department: Department;
  onNavigate: (path: string) => void;
}) => (
  <div className="flex-1 flex flex-col bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 min-w-[300px] hover:shadow-xl transition-all duration-300">
    <div
      className={`${department.color} p-5 text-center font-semibold text-lg text-white cursor-pointer hover:bg-opacity-90 transition-all duration-200`}
      onClick={() => onNavigate(department.route)}
      title={`Vue d'ensemble ${department.name}`}
    >
      <h2 className="tracking-wide">{department.name}</h2>
    </div>
    <div className="p-5 grid grid-cols-2 gap-3 container flex-grow bg-slate-50">
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
      className={`cursor-pointer p-4 flex flex-col items-center justify-center text-center font-medium text-white rounded-lg shadow-md bg-gradient-to-br ${section.color} hover:shadow-lg hover:scale-[1.02] transform transition-all duration-200 ease-out border border-gray-300/20`}
    >
      <Icon className="h-7 w-7 mb-2 opacity-95" />
      <span className="text-sm leading-tight">{section.title}</span>
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
      <div className="w-full h-full bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Tableau de Bord DCAT
            </h1>
            <p className="text-gray-600">
              Accédez rapidement à tous vos modules de gestion
            </p>
          </header>
          <main>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 justify-center items-stretch w-full">
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
