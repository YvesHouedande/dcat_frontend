export interface ReferenceItem {
  id: number;
  nom: string;
  code: string;
}

export function useReferenceOptions() {
  const categories: ReferenceItem[] = [
    { id: 1, nom: "Électronique", code: "ELC" },
    { id: 2, nom: "Informatique", code: "INF" },
    { id: 3, nom: "Mobilier", code: "MOB" },
  ];

  const modeles: ReferenceItem[] = [
    { id: 3, nom: "Modèle A", code: "MDA" },
    { id: 4, nom: "Modèle B", code: "MDB" },
    { id: 5, nom: "Modèle C", code: "MDC" },
  ];

  const familles: ReferenceItem[] = [
    { id: 6, nom: "Famille X", code: "FAX" },
    { id: 7, nom: "Famille Y", code: "FAY" },
    { id: 8, nom: "Famille Z", code: "FAZ" },
  ];

  const marques: ReferenceItem[] = [
    { id: 9, nom: "Samsung", code: "SAM" },
    { id: 10, nom: "Apple", code: "APP" },
    { id: 11, nom: "Dell", code: "DEL" },
  ];

  return { categories, modeles, familles, marques };
}