import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface ReferenceSelectProps<
  TItem extends { id: number },
  TValues extends FieldValues
> {
  items: TItem[];
  label: string;
  name: FieldPath<TValues>;
  control: Control<TValues>;
  isRequired?: boolean;
  disabled?: boolean;
  disabledPlaceholder?: string;
  onChange?: (value: string) => void;
  getLabel: (item: TItem) => string;
}

export function ReferenceSelect<
  TItem extends { id: number },
  TValues extends FieldValues
>({
  items,
  label,
  name,
  control,
  isRequired = false,
  disabled = false,
  disabledPlaceholder,
  onChange,
  getLabel,
}: ReferenceSelectProps<TItem, TValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(Number(value));
              if (onChange) onChange(value);
            }}
            defaultValue={field.value ? field.value.toString() : ""}
            value={field.value ? field.value.toString() : ""}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    disabled
                      ? disabledPlaceholder ||
                        `Veuillez d'abord sélectionner les champs requis`
                      : `Sélectionner ${label.toLowerCase()}`
                  }
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {getLabel(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
