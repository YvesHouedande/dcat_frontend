import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

interface PassewordProps {
  showPasswordDialog: boolean;
  setshowPasswordDialog: (open: boolean) => void;
}

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Champ requis"),
    newPassword: z.string().min(6, "6 caractères minimum"),
    confirmPassword: z.string().min(1, "Champ requis"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

function Passeword({
  showPasswordDialog,
  setshowPasswordDialog,
}: PassewordProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data: PasswordFormValues) => {
    // Traitez la soumission ici
    // ...
    console.log(data);
    setshowPasswordDialog(false);
    reset();
  };

  return (
    <AlertDialog
      open={showPasswordDialog}
      onOpenChange={(open) => {
        setshowPasswordDialog(open);
        if (!open) reset();
      }}
    >
      <AlertDialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Changer votre mot de passe</AlertDialogTitle>
            <div className="space-y-2">
              <div>
                <Label>Ancien mot de passe</Label>
                <Input type="password" {...register("oldPassword")} />
                {errors.oldPassword && (
                  <p className="text-xs text-red-500">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Nouveau mot de passe</Label>
                <Input type="password" {...register("newPassword")} />
                {errors.newPassword && (
                  <p className="text-xs text-red-500">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Confirmer votre mot de passe</Label>
                <Input type="password" {...register("confirmPassword")} />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <div className="flex space-x-2  w-full justify-end">
                <Button type="submit">Continuer</Button>
                <Button
                  variant={"outline"}
                  onClick={() => setshowPasswordDialog(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </AlertDialogHeader>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Passeword;
