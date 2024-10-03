import { FormControl, Input, Text } from '@chakra-ui/react';
import clsx from 'clsx';
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from 'react-hook-form';

interface ControlledInputProps<TFieldValues extends FieldValues = FieldValues> {
  label: string;
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  type?: string;
}

export function ControlledInput<TFieldValues extends FieldValues>({
  label,
  name,
  control,
  type,
}: ControlledInputProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className="flex flex-col grow gap-2 relative">
      <Text fontSize="small" fontWeight="600">
        {label}
      </Text>
      <Input
        type={type}
        size="sm"
        borderRadius="5px"
        {...field}
        backgroundColor="white"
      />
      {error?.message && (
        <span
          className={clsx(
            'text-red-900 bg-red-400 absolute bottom-[40px] right-0 rounded-md px-2 py-1 text-[10px]',
            'after:bg-red-400 after:absolute after:-bottom-1 after:right-2 after:h-2 after:w-2 after:rotate-45',
          )}
        >
          {error.message}
        </span>
      )}
    </div>
  );
}
