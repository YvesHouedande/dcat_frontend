export interface Fichier {
  id: string;
  titre: string;
  type: "comptabilité" | "finance";
  date: Date;
  url: string;       // Lien vers le PDF
  thumbnail: string; // Lien vers l'image (maintenant obligatoire)
}

// Types pour les erreurs API (futur)
export interface ApiError {
  message: string;
  code?: number;
}