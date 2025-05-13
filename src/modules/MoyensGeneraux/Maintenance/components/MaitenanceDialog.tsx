import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoyensDesTravailForm } from "./MaintenanceForm";
import { Maintenance, MaintenanceFormData } from "../types/maitenance.types";

interface MoyensDesTravailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance?: Maintenance;
  onSubmit: (data: MaintenanceFormData) => void;
  sections: string[];
  isSubmitting: boolean;
}

export function MoyensDesTravailDialog({
  open,
  onOpenChange,
  maintenance,
  onSubmit,
  sections,
  isSubmitting,
}: MoyensDesTravailDialogProps) {
  const title = maintenance
    ? "Modifier une maintenance"
    : "Ajouter une maintenance";
  const description = maintenance
    ? "Modifiez les informations de la maintenance."
    : "Ajoutez une nouvelle maintenance à l'inventaire.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-auto overscroll-none  md:max-w-[700px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <MoyensDesTravailForm
          maintenance={maintenance}
          sections={sections}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
