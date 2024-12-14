import { ControlledInput } from '@/components/common/controller/ControlledInput';
import { ControlledTestArea } from '@/components/common/controller/ControlledTestArea';
import { ControlledSelect } from '@/components/common/controller/ControlledSelect';
import { Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { InputsContainer } from '@/components/take-away-page/component/InputsContainer';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import VerifyOtpModal from '@/components/common/VerifyOtpModal';
import { Restaurant, Table } from '@/types';
import clsx from 'clsx';
import { sanityClient } from '@/lib/sanityClient';
import { runValidations,validateInitialConditions, validateReservationTime, validateTableAvailabilityAndConflicts } from './checkAvailability';
import { useSMS } from '../hooks/useSMS';
import { validateBlacklist, validateOperatingTime } from '../common/utils/validationUtils';
import OtpButton from '@/components/common/icon-and-button/OtpButton';
import DateTimePicker from '@/components/common/DateTImePicker';
import { createReservation } from '@/components/common/createReservation';

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
  const {
    SendOtp,
    handleVerifyOtp,
    setIsModalOpen,
    verifyOtp,
    isModalOpen,
    timeLeft,
    isRunning,
  } = useSMS();

  const requiredField = zod.string().min(1, { message: 'Required Field' });
  const phoneSchema = zod
    .string()
    .min(1, { message: 'Required Field' })
    .regex(/^\d{9}$/, { message: 'Phone number invalid' });

  const FormDataSchema = zod
    .object({
      name: requiredField,
      phone: phoneSchema,
      date: requiredField,
      time: requiredField,
      guests: requiredField,
      email: zod.string().email({ message: 'Invalid email address' }),
      preference: zod.string(),
      notes: zod.string(),
    })
    .superRefine((data, context) => {
      validateBlacklist(data.phone, restaurant, context);
      validateOperatingTime(data.date, data.time, restaurant, context);
    });

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
      if (!tableId) {
        throw new Error('Table ID not found after validations.');
      }
  
      await createReservation(data, tableId);
  
      // Redirect to success page or handle successful booking
      console.log('Reservation created successfully');
    } catch (error) {
      console.log('Error during reservation:', error);
    }
  };
  

  const phoneClickHandler = async () => {
    const result = await trigger('phone');
    const phone = getValues('phone');
    if (result) {
      SendOtp(phone);
    }
  };

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
