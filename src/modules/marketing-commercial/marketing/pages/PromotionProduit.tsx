import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tag, TrendingUp, DollarSign } from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "sonner";

import { ProductCombobox } from "@/components/combobox/ProductCombobox";
import { useFetchExemplaireProduitByEtat } from "@/modules/stocks/exemplaire/hooks/useExemplaireProduits";
import {
  useProduct,
  useUpadteProduct,
} from "@/modules/stocks/reference/hooks/useProducts";
import { formatCurrency } from "@/modules/stocks/utils/helpers";
// Types pour les données

function PromotionProduit() {
  const [produitId, setProduitId] = useState<string | null>(null);

  const [modePromotion, setModePromotion] = useState<"prix" | "pourcentage">(
    "prix"
  );

  // États pour la promotion
  const [prixPromotionnel, setPrixPromotionnel] = useState<number>(0);
  const [pourcentageReduction, setPourcentageReduction] = useState<number>(0);
  const [exemplaireSélectionné, setExemplaireSélectionné] =
    useState<string>("");

  const {
    ExemplaireProduitByEtat: exemplaires,
    loading: isLoadingExemplaires,
  } = useFetchExemplaireProduitByEtat(produitId ?? undefined, "Disponible");

  const { product } = useProduct(produitId ?? undefined);
  const { update: updateProduct } = useUpadteProduct();

  const calculerPrixAvecReduction = (
    prixOriginal: number,
    reduction: number
  ) => {
    return prixOriginal - (prixOriginal * reduction) / 100;
  };

  const appliquerPromotion = async () => {
    // Vérification de la sélection
    if (!exemplaireSélectionné) {
      toast.error("Veuillez sélectionner un exemplaire");
      return;
    }
  
    const exemplaire = exemplaires.find(
      (e) => e.id_exemplaire?.toString() === exemplaireSélectionné
    );
  
    if (!exemplaire) {
      toast.error("Impossible de récupérer l'exemplaire sélectionné.");
      return;
    }
  
    let prixFinal = 0;
    let reductionPourcentage = 0;
  
    if (modePromotion === "prix") {
      // Prix promo à 0 => remettre le prix d'origine
      if (prixPromotionnel === 0) {
        prixFinal = Number(exemplaire.prix_de_vente);
        reductionPourcentage = 0;
      }
      // Prix promo invalide
      else if (
        prixPromotionnel < 0 ||
        prixPromotionnel >= Number(exemplaire.prix_de_vente)
      ) {
        toast.error(
          "Le prix promotionnel doit être supérieur à 0 et inférieur au prix de vente"
        );
        return;
      }
      // Prix promo valide
      else {
        prixFinal = prixPromotionnel;
        reductionPourcentage =
          (((Number(exemplaire.prix_de_vente) || 0) - prixPromotionnel) /
            (Number(exemplaire.prix_de_vente) || 1)) *
          100;
      }
    } else {
      // Mode réduction en pourcentage
      if (pourcentageReduction <= 0 || pourcentageReduction >= 100) {
        toast.error("Le pourcentage de réduction doit être entre 1 et 99%");
        return;
      }
      prixFinal = calculerPrixAvecReduction(
        Number(exemplaire.prix_de_vente || 0),
        pourcentageReduction
      );
      reductionPourcentage = pourcentageReduction;
    }
  
    try {
      updateProduct.mutate(
        {
          id_produit: product?.data?.id_produit,
          prix_produit: prixFinal,
        },
        {
          onSuccess: () => {
            toast.success("Prix produit affecté avec succès");
          },
          onError: (error) => {
            toast.error(
              `Erreur lors de l'affectation du prix du produit: ${error}`
            );
          },
        }
      );
  
      toast.success(
        `Promotion appliquée ! Prix: ${formatCurrency(
          prixFinal
        )} (-${reductionPourcentage.toFixed(1)}%)`
      );
      setExemplaireSélectionné("");
    } catch (error) {
      console.error("Erreur lors de l'application de la promotion:", error);
      toast.error("Erreur lors de l'application de la promotion");
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
              Gérez les prix promotionnels de vos produits en vous basant sur
              les prix de vos exemplaires
            </p>
          </div>

          {/* Barre de recherche */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <ProductCombobox
                  value={produitId || ""}
                  onChange={(value) => setProduitId(value as string)}
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
                  Produit
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingExemplaires ? (
                  <div className="text-center py-8">
                    Chargement du produit...
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div
                      key={product?.data?.id_produit}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors border-blue-500 bg-blue-50`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            {product?.data?.desi_produit}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {product?.data?.categorie}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {exemplaires.length} exemplaire(s) disponible(s)
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            {exemplaires.length > 0 && (
                              <>
                                {formatCurrency(
                                  Math.min(
                                    ...exemplaires.map((e) =>
                                      e.prix_de_vente
                                        ? Number(e.prix_de_vente)
                                        : 0
                                    )
                                  )
                                )}
                              </>
                            )}
                            {exemplaires.length > 1 && (
                              <span className="text-sm text-gray-500">
                                {" "}
                                à{" "}
                                {formatCurrency(
                                  Math.max(
                                    ...exemplaires.map((e) =>
                                      e.prix_de_vente
                                        ? Number(e.prix_de_vente)
                                        : 0
                                    )
                                  )
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configuration de la promotion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Configuration Prix
                </CardTitle>
              </CardHeader>
              <CardContent>
                {product?.data && exemplaires.length > 0 ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {product?.data?.desi_produit}
                      </h3>
                      <p className="text-gray-600">
                        {product?.data?.categorie}
                      </p>
                    </div>

                    {/* Sélection de l'exemplaire */}
                    <div className="space-y-2">
                      <Label>Exemplaire de référence</Label>
                      <Select
                        value={exemplaireSélectionné}
                        onValueChange={setExemplaireSélectionné}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un exemplaire" />
                        </SelectTrigger>
                        <SelectContent>
                          {exemplaires.map((exemplaire) => (
                            <SelectItem
                              key={exemplaire.id_exemplaire}
                              value={
                                exemplaire.id_exemplaire
                                  ? exemplaire.id_exemplaire.toString()
                                  : ""
                              }
                            >
                              {exemplaire.num_serie} -{" "}
                              {formatCurrency(Number(exemplaire.prix_de_vente))}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {exemplaireSélectionné && (
                      <>
                        {/* Détails de l'exemplaire sélectionné */}
                        {(() => {
                          const exemplaire = exemplaires.find(
                            (e) =>
                              e.id_exemplaire?.toString() ===
                              exemplaireSélectionné
                          );
                          return exemplaire ? (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium mb-2">
                                Détails de l'exemplaire {exemplaire.num_serie}
                              </h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  Prix d'achat:{" "}
                                  {formatCurrency(
                                    Number(exemplaire.prix_achat)
                                  )}
                                </div>
                                <div>
                                  Prix de revient:{" "}
                                  {formatCurrency(
                                    Number(exemplaire.prix_de_revient)
                                  )}
                                </div>
                                <div>
                                  Prix de vente:{" "}
                                  {formatCurrency(
                                    Number(exemplaire.prix_de_vente)
                                  )}
                                </div>
                                <div>État: {exemplaire.etat_exemplaire}</div>
                              </div>
                            </div>
                          ) : null;
                        })()}

                        {/* Mode de promotion */}
                        <div className="space-y-2">
                          <Label>Mode de promotion</Label>
                          <Select
                            value={modePromotion}
                            onValueChange={(value: "prix" | "pourcentage") =>
                              setModePromotion(value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="prix">Prix fixe</SelectItem>
                              <SelectItem value="pourcentage">
                                Pourcentage de réduction
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Configuration du prix ou pourcentage */}
                        {modePromotion === "prix" ? (
                          <div className="space-y-2">
                            <Label>Prix promotionnel (CFA)</Label>
                            <Input
                              type="number"
                              value={prixPromotionnel}
                              onChange={(e) =>
                                setPrixPromotionnel(Number(e.target.value))
                              }
                              placeholder="Entrez le prix promotionnel"
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label>Pourcentage de réduction (%)</Label>
                            <Input
                              type="number"
                              value={pourcentageReduction}
                              onChange={(e) =>
                                setPourcentageReduction(Number(e.target.value))
                              }
                              placeholder="Entrez le pourcentage"
                              min="1"
                              max="99"
                            />
                            {pourcentageReduction > 0 &&
                              exemplaireSélectionné && (
                                <p className="text-sm text-gray-600">
                                  Prix final :{" "}
                                  {formatCurrency(
                                    calculerPrixAvecReduction(
                                      Number(
                                        exemplaires.find(
                                          (e) =>
                                            e.id_exemplaire?.toString() ===
                                            exemplaireSélectionné
                                        )?.prix_de_vente ?? 0
                                      ),
                                      pourcentageReduction
                                    )
                                  )}
                                </p>
                              )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            onClick={appliquerPromotion}
                            className="flex-1"
                          >
                            Appliquer la promotion
                          </Button>
                          {/* {product?.data?.prix_promotionnel && (
                            <Button
                              variant="outline"
                              onClick={() => retirerPromotion(product?.data)}
                            >
                              Retirer
                            </Button>
                          )} */}
                        </div>
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
              <CardTitle>Prix Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Prix Original</TableHead>
                    <TableHead>Prix Affiché</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product?.data &&
                    exemplaires.length > 0 &&
                    exemplaires
                      .filter((p) => p.prix_de_vente)
                      .map((produit) => (
                        <TableRow key={produit.id_produit}>
                          <TableCell className="font-medium">
                            {product?.data?.desi_produit}
                          </TableCell>
                          <TableCell>
                            <span className="line-through text-gray-500">
                              {formatCurrency(Number(produit.prix_de_vente))}
                            </span>
                          </TableCell>
                          <TableCell className="text-green-600 font-semibold">
                            {formatCurrency(Number(product.data?.prix_produit))}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default PromotionProduit;
