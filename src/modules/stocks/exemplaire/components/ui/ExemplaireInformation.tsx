import { Button } from "@/components/ui/button";

import { Info } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

// Types pour nos paramètres

// Données de démonstration

interface ExemplaireInformationProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ExemplaireInformation({
  open,
  onOpenChange,
}: ExemplaireInformationProps) {
  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent className="w-full max-w-2xl">
        <div className="w-full max-w-6xl mx-auto p-6 max-h-[98vh] overflow-y-auto">
          <SheetHeader>
            {/* En-tête */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Info className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <SheetTitle>
                    <h1 className="text-lg font-bold text-gray-900">
                      Information sur l'exemplaire sélectionné
                    </h1>
                  </SheetTitle>
                </div>
              </div>
            </div>
          </SheetHeader>
          {/* Contenu principal */}
          <div className="space-y-6 ">
            {/* Section infos principales */}
            <div className="bg-white rounded-lg p-5 shadow border">
              <h2 className="font-semibold text-gray-800 mb-4 text-base tracking-tight">
                Informations générales
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">
                    Numéro de série
                  </Label>
                  <p className="text-sm text-gray-900 font-mono">1234567890</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Date d'entrée</Label>
                  <p className="text-sm text-gray-900">2024-06-25</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Prix d'achat</Label>
                  <p className="text-sm text-gray-900 font-semibold">
                    120 000 FCFA
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">État</Label>
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    Disponible
                  </span>
                </div>
              </div>
            </div>

            {/* Section lot de livraison */}
            <div className="bg-white rounded-lg p-5 shadow border">
              <h2 className="font-semibold text-gray-800 mb-4 text-base tracking-tight">
                Lot de livraison
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Numéro de lot</Label>
                  <p className="text-sm text-gray-900">LOT123456</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">
                    Date de livraison
                  </Label>
                  <p className="text-sm text-gray-900">2024-06-20</p>
                </div>
              </div>
            </div>

            {/* Section marges et frais */}
            <div className="bg-white rounded-lg p-5 shadow border">
              <h2 className="font-semibold text-gray-800 mb-4 text-base tracking-tight">
                Marges &amp; frais
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Prix de vente</Label>
                  <p className="text-sm text-gray-900">130 000 FCFA</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Marge haute</Label>
                  <p className="text-sm text-gray-900">10 000 FCFA</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Marge basse</Label>
                  <p className="text-sm text-gray-900">5 000 FCFA</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Frais divers</Label>
                  <p className="text-sm text-gray-900">2 000 FCFA</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">
                    Variante (cota des frais)
                  </Label>
                  <p className="text-sm text-gray-900">1 000 FCFA</p>
                </div>
              </div>
            </div>

            {/* Section sortie */}
            <div className="bg-white rounded-lg p-5 shadow border">
              <h2 className="font-semibold text-gray-800 mb-4 text-base tracking-tight">
                Dernière sortie
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Motif</Label>
                  <p className="text-sm text-gray-900">Vente</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">
                    Prix de sortie
                  </Label>
                  <p className="text-sm text-gray-900 font-semibold">
                    130 000 FCFA
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Date</Label>
                  <p className="text-sm text-gray-900">2024-06-26</p>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Fermer</Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
