import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { MoyensDesTravailForm } from "./MoyensDesTravailForm";
  import { MoyenDeTravail, MoyenDeTravailFormData } from "../types/moyens-de-travail.types";
  
  interface MoyensDesTravailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    moyen?: MoyenDeTravail;
    onSubmit: (data: MoyenDeTravailFormData) => void;
    sections: string[];
    isSubmitting: boolean;
  }
  
  export function MoyensDesTravailDialog({
    open,
    onOpenChange,
    moyen,
    onSubmit,
    sections,
    isSubmitting,
  }: MoyensDesTravailDialogProps) {
    const title = moyen ? "Modifier un moyen de travail" : "Ajouter un moyen de travail";
    const description = moyen 
      ? "Modifiez les informations du moyen de travail." 
      : "Ajoutez un nouveau moyen de travail à l'inventaire.";
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          
          <MoyensDesTravailForm
            moyen={moyen}
            sections={sections}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    );
  }
  