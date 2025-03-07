import { FormControl, Select, Text } from '@chakra-ui/react';
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from 'react-hook-form';

interface Option {
  value: string | number;
  label: string;
}

interface ControlledSelectProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  label: string;
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  options: Option[];
}

export function ControlledSelect<TFieldValues extends FieldValues>({
  label,
  name,
  control,
  options,
}: ControlledSelectProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <div className="flex flex-col grow gap-2 relative">
      <Text fontSize="small" fontWeight="600">
        {label}
      </Text>
      <Select
        className="chakra-input css-c2vzha"
        {...field}
        backgroundColor="white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {error?.message && (
        <span className="text-red-900 text-sm">{error.message}</span>
      )}
    </div>
  );
}
