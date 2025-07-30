import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Tag, 
  TrendingUp, 
  Edit, 
  DollarSign
} from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { SocialShareButton } from "../components/SocialShareButton";

// Types pour les données
interface ExemplairePrix {
  id_exemplaire: number;
  num_serie: string;
  prix_achat: number;
  prix_de_revient: number;
  prix_de_vente: number;
  marge_haute: number;
  marge_basse: number;
  etat_exemplaire: string;
}

interface Produit {
  id_produit: number;
  nom_produit: string;
  categorie: string;
  description: string;
  image_produit?: string;
  exemplaires: ExemplairePrix[];
  prix_promotionnel?: number;
  pourcentage_reduction?: number;
}

function PromotionProduit() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [produitsFiltrés, setProduitsFiltrés] = useState<Produit[]>([]);
  const [produitSélectionné, setProduitSélectionné] = useState<Produit | null>(null);
  const [recherche, setRecherche] = useState("");
  const [loading, setLoading] = useState(true);
  const [modePromotion, setModePromotion] = useState<'prix' | 'pourcentage'>('prix');

  // États pour la promotion
  const [prixPromotionnel, setPrixPromotionnel] = useState<number>(0);
  const [pourcentageReduction, setPourcentageReduction] = useState<number>(0);
  const [exemplaireSélectionné, setExemplaireSélectionné] = useState<string>("");

  useEffect(() => {
    chargerProduits();
  }, []);

  useEffect(() => {
    // Filtrer les produits selon la recherche
    if (recherche.trim() === "") {
      setProduitsFiltrés(produits);
    } else {
      const filtrés = produits.filter(produit =>
        produit.nom_produit.toLowerCase().includes(recherche.toLowerCase()) ||
        produit.categorie.toLowerCase().includes(recherche.toLowerCase())
      );
      setProduitsFiltrés(filtrés);
    }
  }, [recherche, produits]);

  const chargerProduits = async () => {
    try {
      setLoading(true);
      // TODO: Remplacer par l'API réelle
      // const response = await fetch('/api/produits-avec-exemplaires');
      // const data = await response.json();
      
      // Données simulées pour la démonstration
      const donneesSimulées: Produit[] = [
        {
          id_produit: 1,
          nom_produit: "Ordinateur Portable Dell XPS 13",
          categorie: "Informatique",
          description: "Ordinateur portable haut de gamme",
          exemplaires: [
            {
              id_exemplaire: 1,
              num_serie: "XPS001",
              prix_achat: 800,
              prix_de_revient: 850,
              prix_de_vente: 1200,
              marge_haute: 300,
              marge_basse: 200,
              etat_exemplaire: "Disponible"
            },
            {
              id_exemplaire: 2,
              num_serie: "XPS002",
              prix_achat: 820,
              prix_de_revient: 870,
              prix_de_vente: 1250,
              marge_haute: 320,
              marge_basse: 210,
              etat_exemplaire: "Disponible"
            }
          ]
        },
        {
          id_produit: 2,
          nom_produit: "iPhone 15 Pro",
          categorie: "Téléphonie",
          description: "Smartphone Apple dernière génération",
          exemplaires: [
            {
              id_exemplaire: 3,
              num_serie: "IP001",
              prix_achat: 900,
              prix_de_revient: 950,
              prix_de_vente: 1400,
              marge_haute: 400,
              marge_basse: 250,
              etat_exemplaire: "Disponible"
            }
          ]
        }
      ];
      
      setProduits(donneesSimulées);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      toast.error("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  const sélectionnerProduit = (produit: Produit) => {
    setProduitSélectionné(produit);
    if (produit.exemplaires.length === 1) {
      setExemplaireSélectionné(produit.exemplaires[0].id_exemplaire.toString());
    }
    // Réinitialiser les valeurs
    setPrixPromotionnel(0);
    setPourcentageReduction(0);
  };

  const calculerPrixAvecReduction = (prixOriginal: number, reduction: number) => {
    return prixOriginal - (prixOriginal * reduction / 100);
  };

  const appliquerPromotion = async () => {
    if (!produitSélectionné || !exemplaireSélectionné) {
      toast.error("Veuillez sélectionner un produit et un exemplaire");
      return;
    }

    const exemplaire = produitSélectionné.exemplaires.find(
      e => e.id_exemplaire.toString() === exemplaireSélectionné
    );

    if (!exemplaire) {
      toast.error("Exemplaire non trouvé");
      return;
    }

    let prixFinal = 0;
    let reductionPourcentage = 0;

    if (modePromotion === 'prix') {
      if (prixPromotionnel <= 0 || prixPromotionnel >= exemplaire.prix_de_vente) {
        toast.error("Le prix promotionnel doit être supérieur à 0 et inférieur au prix de vente");
        return;
      }
      prixFinal = prixPromotionnel;
      reductionPourcentage = ((exemplaire.prix_de_vente - prixPromotionnel) / exemplaire.prix_de_vente) * 100;
    } else {
      if (pourcentageReduction <= 0 || pourcentageReduction >= 100) {
        toast.error("Le pourcentage de réduction doit être entre 1 et 99%");
        return;
      }
      prixFinal = calculerPrixAvecReduction(exemplaire.prix_de_vente, pourcentageReduction);
      reductionPourcentage = pourcentageReduction;
    }

    try {
      // TODO: API call pour enregistrer la promotion
      // await fetch('/api/promotions', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     id_produit: produitSélectionné.id_produit,
      //     id_exemplaire: exemplaire.id_exemplaire,
      //     prix_promotionnel: prixFinal,
      //     pourcentage_reduction: reductionPourcentage
      //   })
      // });

      // Mettre à jour l'état local
      const produitsMisÀJour = produits.map(p => 
        p.id_produit === produitSélectionné.id_produit 
          ? { ...p, prix_promotionnel: prixFinal, pourcentage_reduction: reductionPourcentage }
          : p
      );
      setProduits(produitsMisÀJour);

      toast.success(`Promotion appliquée ! Prix: ${prixFinal.toLocaleString()}€ (-${reductionPourcentage.toFixed(1)}%)`);
      setProduitSélectionné(null);
    } catch (error) {
      console.error("Erreur lors de l'application de la promotion:", error);
      toast.error("Erreur lors de l'application de la promotion");
    }
  };

  const retirerPromotion = async (produit: Produit) => {
    try {
      // TODO: API call pour retirer la promotion
      const produitsMisÀJour = produits.map(p => 
        p.id_produit === produit.id_produit 
          ? { ...p, prix_promotionnel: undefined, pourcentage_reduction: undefined }
          : p
      );
      setProduits(produitsMisÀJour);
      toast.success("Promotion retirée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de la promotion:", error);
      toast.error("Erreur lors de la suppression de la promotion");
    }
  };

  return (
    <Layout>
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* En-tête */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Tag className="h-8 w-8 text-blue-600" />
              Promotion des Produits
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez les prix promotionnels de vos produits en vous basant sur les prix de vos exemplaires
            </p>
          </div>

          {/* Barre de recherche */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Liste des produits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Catalogue des Produits
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Chargement des produits...</div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {produitsFiltrés.map((produit) => (
                      <div
                        key={produit.id_produit}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          produitSélectionné?.id_produit === produit.id_produit
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => sélectionnerProduit(produit)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{produit.nom_produit}</h3>
                            <p className="text-sm text-gray-600">{produit.categorie}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {produit.exemplaires.length} exemplaire(s) disponible(s)
                            </p>
                          </div>
                          <div className="text-right">
                            {produit.prix_promotionnel ? (
                              <div>
                                <Badge variant="destructive" className="mb-1">
                                  -{produit.pourcentage_reduction?.toFixed(1)}%
                                </Badge>
                                <div className="text-lg font-bold text-green-600">
                                  {produit.prix_promotionnel.toLocaleString()}€
                                </div>
                                <div className="text-sm text-gray-500 line-through">
                                  {Math.max(...produit.exemplaires.map(e => e.prix_de_vente)).toLocaleString()}€
                                </div>
                              </div>
                            ) : (
                              <div className="text-lg font-semibold">
                                {Math.min(...produit.exemplaires.map(e => e.prix_de_vente)).toLocaleString()}€
                                {produit.exemplaires.length > 1 && (
                                  <span className="text-sm text-gray-500">
                                    {" "}à {Math.max(...produit.exemplaires.map(e => e.prix_de_vente)).toLocaleString()}€
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configuration de la promotion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Configuration Promotion
                </CardTitle>
              </CardHeader>
              <CardContent>
                {produitSélectionné ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg">{produitSélectionné.nom_produit}</h3>
                      <p className="text-gray-600">{produitSélectionné.description}</p>
                    </div>

                    {/* Sélection de l'exemplaire */}
                    <div className="space-y-2">
                      <Label>Exemplaire de référence</Label>
                      <Select value={exemplaireSélectionné} onValueChange={setExemplaireSélectionné}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un exemplaire" />
                        </SelectTrigger>
                        <SelectContent>
                          {produitSélectionné.exemplaires.map((exemplaire) => (
                            <SelectItem 
                              key={exemplaire.id_exemplaire} 
                              value={exemplaire.id_exemplaire.toString()}
                            >
                              {exemplaire.num_serie} - {exemplaire.prix_de_vente.toLocaleString()}€
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {exemplaireSélectionné && (
                      <>
                        {/* Détails de l'exemplaire sélectionné */}
                        {(() => {
                          const exemplaire = produitSélectionné.exemplaires.find(
                            e => e.id_exemplaire.toString() === exemplaireSélectionné
                          );
                          return exemplaire ? (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium mb-2">Détails de l'exemplaire {exemplaire.num_serie}</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Prix d'achat: {exemplaire.prix_achat.toLocaleString()}€</div>
                                <div>Prix de revient: {exemplaire.prix_de_revient.toLocaleString()}€</div>
                                <div>Prix de vente: {exemplaire.prix_de_vente.toLocaleString()}€</div>
                                <div>État: {exemplaire.etat_exemplaire}</div>
                              </div>
                            </div>
                          ) : null;
                        })()}

                        {/* Mode de promotion */}
                        <div className="space-y-2">
                          <Label>Mode de promotion</Label>
                          <Select value={modePromotion} onValueChange={(value: 'prix' | 'pourcentage') => setModePromotion(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="prix">Prix fixe</SelectItem>
                              <SelectItem value="pourcentage">Pourcentage de réduction</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Configuration du prix ou pourcentage */}
                        {modePromotion === 'prix' ? (
                          <div className="space-y-2">
                            <Label>Prix promotionnel (€)</Label>
                            <Input
                              type="number"
                              value={prixPromotionnel}
                              onChange={(e) => setPrixPromotionnel(Number(e.target.value))}
                              placeholder="Entrez le prix promotionnel"
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label>Pourcentage de réduction (%)</Label>
                            <Input
                              type="number"
                              value={pourcentageReduction}
                              onChange={(e) => setPourcentageReduction(Number(e.target.value))}
                              placeholder="Entrez le pourcentage"
                              min="1"
                              max="99"
                            />
                            {pourcentageReduction > 0 && exemplaireSélectionné && (
                              <p className="text-sm text-gray-600">
                                Prix final: {calculerPrixAvecReduction(
                                  produitSélectionné.exemplaires.find(e => e.id_exemplaire.toString() === exemplaireSélectionné)?.prix_de_vente || 0,
                                  pourcentageReduction
                                ).toLocaleString()}€
                              </p>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button onClick={appliquerPromotion} className="flex-1">
                            Appliquer la promotion
                          </Button>
                          {produitSélectionné.prix_promotionnel && (
                            <Button 
                              variant="outline" 
                              onClick={() => retirerPromotion(produitSélectionné)}
                            >
                              Retirer
                            </Button>
                          )}
                        </div>

                        {/* Partage social */}
                        {produitSélectionné.prix_promotionnel && (
                          <div className="border-t pt-4">
                            <Label className="block mb-2">Partager la promotion</Label>
                            <SocialShareButton
                              productName={produitSélectionné.nom_produit}
                              originalPrice={Math.max(...produitSélectionné.exemplaires.map(e => e.prix_de_vente))}
                              promotionalPrice={produitSélectionné.prix_promotionnel}
                              discount={produitSélectionné.pourcentage_reduction || 0}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Tag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Sélectionnez un produit pour configurer sa promotion</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Table des promotions actives */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Promotions Actives</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Prix Original</TableHead>
                    <TableHead>Prix Promotionnel</TableHead>
                    <TableHead>Réduction</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produitsFiltrés.filter(p => p.prix_promotionnel).map((produit) => (
                    <TableRow key={produit.id_produit}>
                      <TableCell className="font-medium">{produit.nom_produit}</TableCell>
                      <TableCell>
                        <span className="line-through text-gray-500">
                          {Math.max(...produit.exemplaires.map(e => e.prix_de_vente)).toLocaleString()}€
                        </span>
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        {produit.prix_promotionnel?.toLocaleString()}€
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">
                          -{produit.pourcentage_reduction?.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sélectionnerProduit(produit)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => retirerPromotion(produit)}
                          >
                            Retirer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {produitsFiltrés.filter(p => p.prix_promotionnel).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucune promotion active
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default PromotionProduit;
