import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { HomeIcon } from "lucide-react";

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = "Page Not Found - DCAT Shop";
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
      <h2 className="text-2xl font-medium text-slate-700 mb-6">
        Page Not Found
      </h2>
      <p className="text-slate-600 text-center max-w-md mb-8">
        La page que vous recherchez a peut-être été supprimée, son nom a
        peut-être changé ou elle est temporairement indisponible.
      </p>
      <Link to="/" className="btn-primary flex items-center">
        <HomeIcon className="mr-2 h-4 w-4" />
        Retour à la page d'accueil
      </Link>
    </div>
  );
};

export default NotFoundPage;
