import { useState } from "react";
import { Livraison } from "../types/types";

export const useDialogState = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentLivraison, setCurrentLivraison] = useState<Livraison | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    
    // Ouvrir le formulaire d'édition
    const handleEdit = (livraison: Livraison) => {
      setCurrentLivraison(livraison);
      setIsEditing(true);
      setDialogOpen(true);
    };
  
    // Ouvrir le formulaire de création
    const handleCreate = () => {
      setIsEditing(false);
      setCurrentLivraison(null);
      setDialogOpen(true);
    };
  
    // Fermer le dialogue et réinitialiser l'état
    const handleClose = () => {
      setDialogOpen(false);
      // On peut attendre la fin de l'animation de fermeture avant de réinitialiser
      setTimeout(() => {
        setCurrentLivraison(null);
        setIsEditing(false);
      }, 300);
    };
  
    return {
      dialogOpen,
      setDialogOpen,
      currentLivraison,
      setCurrentLivraison,
      isEditing,
      handleEdit,
      handleCreate,
      handleClose
    };
  };
  
  export const useDeleteDialog = () => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [idDelete, setIdDelete] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
  
    const handleDeleteRequest = (id: number) => {
      setIdDelete(id);
      setShowDeleteDialog(true);
    };
  
    const resetDeleteState = () => {
      setShowDeleteDialog(false);
      setIdDelete(null);
      setDeleteError(null);
    };
  
    return {
      showDeleteDialog,
      setShowDeleteDialog,
      idDelete,
      setIdDelete,
      deleteError,
      setDeleteError,
      handleDeleteRequest,
      resetDeleteState
    };
  };