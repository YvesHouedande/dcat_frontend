// components/FichierThumbnail.tsx
import { Fichier } from "../data/type";

interface FichierThumbnailProps {
  fichier: Fichier;
  className?: string;
  onPreview?: () => void;
}

export default function FichierThumbnail({ 
  fichier, 
  className = "",
  onPreview
}: FichierThumbnailProps) {
  return (
    <div 
      className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}
      onClick={onPreview}
    >
      <div className="aspect-video bg-gray-50 flex items-center p-2">
        {fichier.thumbnail ? (
          <img
            src={fichier.thumbnail}
            alt={`Aperçu ${fichier.titre}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Aucun aperçu</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium truncate">{fichier.titre}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            fichier.type === "comptabilité" 
              ? "bg-blue-100 text-blue-800" 
              : "bg-green-100 text-green-800"
          }`}>
            {fichier.type}
          </span>
          <span className="text-xs text-gray-500">
            {fichier.date.toLocaleDateString('fr-FR')}
          </span>
        </div>
      </div>
    </div>
  );
}