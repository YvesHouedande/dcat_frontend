import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "./ui/alert-dialog";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface AlertDeleteDialogProps {
  showDeleteDialog: boolean;
  setShowDeleteDialog: (open: boolean) => void;
  id: number | string;
  // id: number | null | undefined;
  deleteError: string | null;
  message?: string;
  handleSupprimer: (id: number | string) => void;
  isDeleting: boolean;
  title?: string;
}
function AlertDeleteDialog({
  showDeleteDialog,
  setShowDeleteDialog,
  id,
  deleteError,
  message,
  handleSupprimer,
  isDeleting,
  title,
}: AlertDeleteDialogProps) {
  return (
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      {/* Dialog de confirmation de suppression */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            {title || "Confirmer la suppression"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {message || (
              <span className="text-sm text-gray-500">
                Êtes-vous sûr de vouloir supprimer la référence avec l'ID {id} ?
                Cette action est irréversible et supprimera définitivement
                toutes les données sous-jacentes associées.
              </span>
            )}
            <br />
          </AlertDialogDescription>
          {deleteError && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              {deleteError}
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <Button
            className={`bg-red-600 hover:bg-red-700 ${
              isDeleting ? "opacity-75 cursor-not-allowed" : ""
            }`}
            onClick={() => handleSupprimer(id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertDeleteDialog;
