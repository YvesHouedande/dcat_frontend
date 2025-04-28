/**
 * Génère un code produit à partir des trois premières lettres du modèle, de la famille et de la marque
 * @param modele Nom du modèle (ex: "Modèle Standard")
 * @param famille Nom de la famille (ex: "Informatique")
 * @param marque Nom de la marque (ex: "TechPro")
 * @returns Code produit formaté (ex: "MOD-INF-TEC")
 */
export function generateProductCode(modele: string, famille: string, marque: string): string {
    const getFirstThreeLetters = (str: string) => 
      str
        .replace(/[^a-zA-Z]/g, '') // Supprime les caractères non alphabétiques
        .toUpperCase()
        .substring(0, 3);
    
    const modelePart = getFirstThreeLetters(modele);
    const famillePart = getFirstThreeLetters(famille);
    const marquePart = getFirstThreeLetters(marque);
    
    return `${modelePart}-${famillePart}-${marquePart}`;
  }