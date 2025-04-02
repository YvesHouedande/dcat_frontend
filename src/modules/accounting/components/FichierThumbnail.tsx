// components/FichierThumbnail.tsx
import { Fichier } from "../data/type";

export default function FichierThumbnail({ fichier }: { fichier: Fichier }) {
  return (
    <div className="group relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Aperçu visuel */}
      <div className="aspect-video bg-gray-50 flex items-center">
        <img
          src={fichier.thumbnail}
          alt={`Aperçu de ${fichier.titre}`}
          className="w-full h-full object-contain p-2"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/fallback-thumbnail.png';
          }}
        />
      </div>

      {/* Badge de type */}
      <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full 
        ${fichier.type === "comptabilité" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
        {fichier.type}
      </span>

      {/* Infos au survol */}
      <div className="p-3">
        <h3 className="font-medium truncate">{fichier.titre}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {fichier.date.toLocaleDateString('fr-FR')}
        </p>
        <a 
          href={fichier.url}
          download
          className="mt-2 inline-flex items-center text-sm text-blue-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Télécharger
        </a>
      </div>
    </div>
  );
}