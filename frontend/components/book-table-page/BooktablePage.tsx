import { ControlledInput } from '@/components/common/controller/ControlledInput';
import { ControlledTestArea } from '@/components/common/controller/ControlledTestArea';
import { ControlledSelect } from '@/components/common/controller/ControlledSelect';
import { Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { InputsContainer } from '@/components/take-away-page/component/InputsContainer';
import { zodResolver } from '@hookform/resolvers/zod';
import VerifyOtpModal from '@/components/common/VerifyOtpModal';
import { Restaurant, Table } from '@/types';
import clsx from 'clsx';
import { runValidations,validateInitialConditions, validateReservationTime, validateTableAvailabilityAndConflicts } from './checkAvailability';
import { useSMS } from '../hooks/useSMS';
import OtpButton from '@/components/common/icon-and-button/OtpButton';
import DateTimePicker from '@/components/common/DateTImePicker';
import { createReservation } from '@/components/common/createReservation';
import { usePhoneClickHandler } from '@/components/hooks/usePhoneClickHandler';
import { getBookTableSchema } from './schema/validationSchemas';
import { useRouter } from 'next/router';
interface BooktablePageProps {
  restaurant: Restaurant;
  tables: Table[];
}

type FormData = {
  name: string;
  phone: string;
  time: string;
  guests: string;
  preference: string;
  notes: string;
  email: string;
  date: string;
};

export function BooktablePage({ restaurant, tables }: BooktablePageProps) {
  const router = useRouter();
  const {
    SendOtp,
    handleVerifyOtp,
    setIsModalOpen,
    verifyOtp,
    isModalOpen,
    timeLeft,
    isRunning,
  } = useSMS();

  const FormDataSchema = getBookTableSchema(restaurant);

  const { control, handleSubmit, trigger, watch, getValues } =
    useForm<FormData>({
      defaultValues: {
        name: '',
        phone: '',
        time: '',
        guests: '2',
        preference: 'No-preference',
        notes: '',
        date: '',
        email: '',
      },
      resolver: zodResolver(FormDataSchema),
    });

  const selectedDate = watch('date');

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      const validationResult = await runValidations([
        () => validateInitialConditions(verifyOtp, data.guests, tables),
        () => validateReservationTime(data.date, data.time),
        () => validateTableAvailabilityAndConflicts(tables, data.guests, data.date, data.time),
      ]);
  
      const tableId = validationResult.tableId;
  
      await createReservation(data, tableId);
      router.push({
        pathname: '/success/booktable',
        query: {
          name: data.name,
          date: data.date,
          time: data.time,
        },
      });
    } catch (error) {
      console.log('Error during reservation:', error);
    }
  };
  

  const phoneClickHandler = usePhoneClickHandler(SendOtp, trigger, getValues);

  return (
    <section className="bg-[#191919] min-h-screen pt-[200px] flex flex-col items-center">
      <div className="bg-[#e5e7ea] p-4 flex flex-col gap-8 rounded-lg max-w-[500px]">
        <div className="flex flex-col space-y-1">
          <h1 className="text-xl font-bold">Book a Table</h1>
          <h3 className="text-xs">
            Please fill in your details to reserve a table
          </h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <InputsContainer>
            <ControlledInput label="Name" control={control} name="name" />
            <span className="flex col-span-1 gap-2 items-end">
              <ControlledInput
                label="Phone Number"
                control={control}
                name="phone"
                disabled={verifyOtp}
              />
              <OtpButton
                isRunning={isRunning}
                verifyOtp={verifyOtp}
                timeLeft={timeLeft}
                onClick={phoneClickHandler}
              />
            </span>
          </InputsContainer>
          <DateTimePicker control={control} selectedDate={selectedDate} />
          <ControlledInput label="Email" control={control} name="email" />
          <InputsContainer>
            <ControlledInput
              label="Guests"
              control={control}
              name="guests"
              type="number"
            />
            <ControlledSelect
              label="Preference"
              control={control}
              name="preference"
              options={[
                { value: 'No-preference', label: 'No preference' },
                { value: 'Near-inside', label: 'Near the inside' },
                { value: 'Near-window', label: 'Near the window' },
              ]}
            />
          </InputsContainer>
          <ControlledTestArea
            label="Special Requests or Notes"
            control={control}
            name="notes"
            placeholder="Enter your special request or notes for your order here..."
            rows={5}
          />
          <Button
            marginTop="2rem"
            colorScheme="orange"
            variant="solid"
            type="submit"
            backgroundColor="#facc16"
            padding="0.6rem"
            borderRadius={5}
            fontSize="small"
            fontWeight="600"
          >
            Book a table
          </Button>
        </form>
        {isModalOpen && (
          <VerifyOtpModal
            onVerify={handleVerifyOtp}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </section>
  );
}
