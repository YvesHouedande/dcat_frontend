import { UseFormReturn } from "react-hook-form";
import { ExemplaireSortieFormValues } from "../schemas/exemplaireSortieSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Définir les types pour les données
interface Client {
  id: string | number;
  name: string;
}

interface Projet {
  id: string | number;
  nom: string;
}

interface Intervention {
  id: string | number;
  reference: string;
}

interface Commande {
  id: string;
  numero_commande: string;
}

// Type pour les props du composant
interface ReferenceFieldProps {
  typeSortie:
    | "Vente en ligne"
    | "Vente directe"
    | "Projet"
    | "Intervention"
    | string;
  form: UseFormReturn<ExemplaireSortieFormValues>; // Type générique pour react-hook-form, ajustez si vous avez un schéma spécifique
  clients?: Client[];
  projets?: Projet[];
  interventions?: Intervention[];
  commandes?: Commande[];
}

const ReferenceField = ({
  typeSortie,
  form,
  clients = [],
  projets = [],
  interventions = [],
  commandes = [],
}: ReferenceFieldProps) => {
  const renderReferenceField = () => {
    switch (typeSortie) {
      case "Vente en ligne":
        return (
          <Select
            onValueChange={(value: string) =>
              form.setValue("reference_id", value)
            }
            defaultValue={form.getValues("reference_id") as string}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un numéro de commande" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {commandes.map((commande: Commande) => (
                <SelectItem key={commande.id} value={commande.id}>
                  {commande.numero_commande}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "Vente directe":
        return (
          <Select
            onValueChange={(value: string) =>
              form.setValue("reference_id", value)
            }
            defaultValue={form.getValues("reference_id")}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={String(client.id)}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "Projet":
        return (
          <Select
            onValueChange={(value: string) =>
              form.setValue("reference_id", value)
            }
            defaultValue={form.getValues("reference_id")}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un projet" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {projets.map((projet) => (
                <SelectItem key={projet.id} value={String(projet.id)}>
                  {projet.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "Intervention":
        return (
          <Select
            onValueChange={(value: string) =>
              form.setValue("reference_id", value)
            }
            defaultValue={form.getValues("reference_id")}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une intervention" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {interventions.map((intervention) => (
                <SelectItem
                  key={intervention.id}
                  value={String(intervention.id)}
                >
                  {intervention.reference}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input placeholder="Référence" {...form.register("reference_id")} />
        );
    }
  };

  return renderReferenceField();
};

export default ReferenceField;
