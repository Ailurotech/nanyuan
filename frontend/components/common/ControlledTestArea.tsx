import { Text, Textarea } from "@chakra-ui/react";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";

interface ControlledTextAreaProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  label: string;
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  placeholder?: string;
  rows: number;
}

export function ControlledTestArea<TFieldValues extends FieldValues>({
  label,
  name,
  control,
  placeholder,
  rows,
}: ControlledTextAreaProps<TFieldValues>) {
  const { field } = useController({ name, control });

  return (
    <div className="flex flex-col grow gap-2">
      <Text fontSize="small" fontWeight="600">
        {label}
      </Text>
      <Textarea
        size="md"
        borderRadius="5px"
        placeholder={placeholder}
        rows={rows}
        padding={2}
        fontSize="small"
        backgroundColor="white"
        {...field}
      />
    </div>
  );
}
