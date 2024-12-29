import { ControlledInput } from './controller/ControlledInput';
import { InputsContainer } from '@/components/take-away-page/component/InputsContainer';

interface DateTimePickerProps {
    control: any;
    selectedDate: string;
  }
  
  function DateTimePicker({ control, selectedDate }: DateTimePickerProps) {
    return (
      <InputsContainer>
        <ControlledInput label="Date" control={control} name="date" type="date" />
        <ControlledInput
          label="Time"
          control={control}
          name="time"
          type="time"
          disabled={!selectedDate}
        />
      </InputsContainer>
    );
  }
  
  export default DateTimePicker;
  