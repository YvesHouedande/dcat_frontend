import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlertCircle, Settings, SquarePen, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useProductCategories,
  useProductFamilies,
  useProductModels,
  useProductMarques,
  useProductTypes,
} from "../../hooks/useOthers";
import { Label } from "@/components/ui/label";

type ParamKey = "catégories" | "familles" | "modèles" | "marques" | "types";

function Parametres() {
  const [editOpen, setEditOpen] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<ParamKey>("catégories");
  const [editId, setEditId] = useState<number | null>(null);

  const { productCategories } = useProductCategories();
  const { productFamilies } = useProductFamilies();
  const { productModels } = useProductModels();
  const { productMarques } = useProductMarques();
  const { productTypes } = useProductTypes();

  const handleEdit = (id: number, value: string) => {
    setEditValue(value);
    setEditId(id);
    setIsEdit(true);
    setEditOpen(true);
  };

  const handleAdd = () => {
    setEditValue("");
    setEditId(null);
    setIsEdit(false);
    setEditOpen(true);
  };

  const handleSave = async (value: string) => {
    try {
      if (isEdit && editId !== null) {
        // Mise à jour - chaque type a sa propre structure
        switch (selected) {
          case "catégories":
            await productCategories.update.mutateAsync({
              id_categorie: editId,
              libelle: value,
            });
            break;
          case "familles":
            await productFamilies.update.mutateAsync({
              id_famille: editId,
              libelle_famille: value,
            });
            break;
          case "modèles":
            await productModels.update.mutateAsync({
              id_modele: editId,
              libelle_modele: value,
            });
            break;
          case "marques":
            await productMarques.update.mutateAsync({
              id_marque: editId,
              libelle_marque: value,
            });
            break;
          case "types":
            await productMarques.update.mutateAsync({
              id_marque: editId,
              libelle_marque: value,
            });
            break;
        }
      } else {
        // Création - chaque type a sa propre structure
        switch (selected) {
          case "catégories":
            await productCategories.create.mutateAsync({
              libelle: value, // Pour la création, l'ID est généralement non défini
            });
            break;
          case "familles":
            await productFamilies.create.mutateAsync({
              libelle_famille: value, // Pour la création, l'ID est généralement non défini
            });
            break;
          case "modèles":
            await productModels.create.mutateAsync({
              libelle_modele: value,
            });
            break;
          case "marques":
            await productMarques.create.mutateAsync({
              libelle_marque: value, // Pour la création, l'ID est généralement non défini
            });
            break;
          case "types":
            await productTypes.create.mutateAsync({
              libelle: value, // Pour la création, l'ID est généralement non défini
            });
        }
      }
      setEditOpen(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      // Vous pouvez ajouter une notification d'erreur ici
    }
  };

  const handleRemove = async (id: number) => {
    try {
      switch (selected) {
        case "catégories":
          await productCategories.remove.mutateAsync(String(id));
          break;
        case "familles":
          await productFamilies.remove.mutateAsync(String(id));
          break;
        case "modèles":
          await productModels.remove.mutateAsync(String(id));
          break;
        case "marques":
          await productMarques.remove.mutateAsync(String(id));
          break;
        case "types":
          await productTypes.remove.mutateAsync(String(id));
          break;
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      // Vous pouvez ajouter une notification d'erreur ici
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Settings size={18} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editer les Paramètres supplementaires</SheetTitle>
          <Select
            value={selected}
            onValueChange={(value: ParamKey) => setSelected(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un paramètre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="catégories">Catégories</SelectItem>
              <SelectItem value="familles">Familles</SelectItem>
              <SelectItem value="modèles">Modèles</SelectItem>
              <SelectItem value="marques">Marques</SelectItem>
              <SelectItem value="types">Types</SelectItem>
            </SelectContent>
          </Select>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4 overflow-auto max-h-[60vh]">
          {(() => {
            switch (selected) {
              case "catégories":
                return productCategories.data?.map((item) => (
                  <div
                    className="flex items-center gap-3"
                    key={item.id_categorie}
                  >
                    <Label className="w-full">{item.libelle}</Label>
                    <SquarePen
                      size={16}
                      className="hover:scale-125 transition ease-in-out duration-300 hover:text-blue-600 cursor-pointer"
                      onClick={() =>
                        handleEdit(item.id_categorie, item.libelle)
                      }
                    />
                    <AlertDialogDelete
                      onConfirm={() => handleRemove(item.id_categorie)}
                    />
                  </div>
                ));
              case "familles":
                return productFamilies.data?.map((item) => (
                  <div
                    className="flex items-center gap-3"
                    key={item.id_famille}
                  >
                    <Label className="w-full">{item.libelle_famille}</Label>
                    <SquarePen
                      size={16}
                      className="hover:scale-125 transition ease-in-out duration-300 hover:text-blue-600 cursor-pointer"
                      onClick={() =>
                        handleEdit(item.id_famille, item.libelle_famille)
                      }
                    />
                    <AlertDialogDelete
                      onConfirm={() => handleRemove(item.id_famille)}
                    />
                  </div>
                ));
              case "modèles":
                return productModels.data?.map((item) => (
                  <div className="flex items-center gap-3" key={item.id_modele}>
                    <Label className="w-full">{item.libelle_modele}</Label>
                    <SquarePen
                      size={16}
                      className="hover:scale-125 transition ease-in-out duration-300 hover:text-blue-600 cursor-pointer"
                      onClick={() =>
                        handleEdit(item.id_modele, item.libelle_modele)
                      }
                    />
                    <AlertDialogDelete
                      onConfirm={() => handleRemove(item.id_modele)}
                    />
                  </div>
                ));
              case "marques":
                return productMarques.data?.map((item) => (
                  <div className="flex items-center gap-3" key={item.id_marque}>
                    <Label className="w-full">{item.libelle_marque}</Label>
                    <SquarePen
                      size={16}
                      className="hover:scale-125 transition ease-in-out duration-300 hover:text-blue-600 cursor-pointer"
                      onClick={() =>
                        handleEdit(item.id_marque, item.libelle_marque)
                      }
                    />
                    <AlertDialogDelete
                      onConfirm={() => handleRemove(item.id_marque)}
                    />
                  </div>
                ));
              case "types":
                return productTypes.data?.map((item) => (
                  <div
                    className="flex items-center gap-3"
                    key={item.id_type_produit}
                  >
                    <Label className="w-full">{item.libelle}</Label>
                    <SquarePen
                      size={16}
                      className="hover:scale-125 transition ease-in-out duration-300 hover:text-blue-600 cursor-pointer"
                      onClick={() =>
                        handleEdit(item.id_type_produit, item.libelle)
                      }
                    />
                    <AlertDialogDelete
                      onConfirm={() => handleRemove(item.id_type_produit)}
                    />
                  </div>
                ));
              default:
                return null;
            }
          })()}
        </div>

        <SheetFooter>
          <Button variant={"blue"} onClick={handleAdd}>
            Nouveau
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Fermer</Button>
          </SheetClose>
        </SheetFooter>

        <DialogEdit
          open={editOpen}
          setOpen={setEditOpen}
          value={editValue}
          onEdit={isEdit}
          onSave={handleSave}
        />
      </SheetContent>
    </Sheet>
  );
}

export default Parametres;

function DialogEdit({
  onEdit,
  value,
  open,
  setOpen,
  onSave,
}: {
  onEdit?: boolean;
  value?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  onSave?: (value: string) => void;
}) {
  const [inputValue, setInputValue] = useState(value || "");

  React.useEffect(() => {
    setInputValue(value || "");
  }, [value, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      alert("Le champ ne peut pas être vide.");
      return;
    }
    if (onSave) onSave(inputValue);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{onEdit ? "Editer" : "Nouveau"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </DialogClose>
            <Button onClick={handleSubmit} type="submit">
              {onEdit ? "Sauvegarder" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

function AlertDialogDelete({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Trash2
          size={18}
          className="hover:scale-125 transition ease-in-out duration-300 hover:text-red-600 cursor-pointer"
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Confirmer la suppression
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="text-sm text-gray-500">
              Êtes-vous sûr de vouloir supprimer l'élément ?
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
