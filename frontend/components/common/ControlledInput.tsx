import {
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
} from '@chakra-ui/react';
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from 'react-hook-form';
import clsx from 'clsx';

interface ControlledInputProps<TFieldValues extends FieldValues = FieldValues> {
  label: string;
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  type?: string;
  disabled?: boolean;
}

export function ControlledInput<TFieldValues extends FieldValues>({
  label,
  name,
  control,
  type,
  disabled = false,
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
      <FormControl>
        <InputGroup size="sm" borderRadius="5px">
          {name === 'phone' && <InputLeftAddon>+61</InputLeftAddon>}
          <Input
            borderRadius="5px"
            type={type}
            {...field}
            backgroundColor="white"
            isDisabled={disabled}
            pl={(() => {
              if (name === 'phone') return '1';
              return undefined;
            })()}
          />
        </InputGroup>
      </FormControl>
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
