import { ControlledInput } from '@/components/common/ControlledInput';
import { ControlledTestArea } from '@/components/common/ControlledTestArea';
import { ControlledSelect } from '@/components/common/ControlledSelect';
import { Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { InputsContainer } from '@/components/take-away-page/component/InputsContainer';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import VerifyOtpModal from '@/components/common/VerifyOtpModal';
import { Restaurant, Table } from '@/types';
import { isValidTime } from './timeUtils';
import clsx from 'clsx';
import { useSMS } from '../hooks/useSMS';
import { runValidations } from './checkAvailability';
import { validateReservationTime } from './checkAvailability';
import { validateTableAvailabilityAndConflicts } from './checkAvailability';
import { validateInitialConditions } from './checkAvailability';
import axios from 'axios';
import { ReservationData } from '@/types';

interface BooktablePageProps {
  restaurant: Restaurant;
  table: Table[];
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

export function BooktablePage({ restaurant, table }: BooktablePageProps) {
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
      email: requiredField.email(),
      preference: zod.string(),
      notes: zod.string(),
    })
    .superRefine((data, context) => {
      const isTimeValid = isValidTime(
        data.date,
        data.time,
        restaurant.Weekdaytime,
        restaurant.Weekandtime,
      );

      if (!isTimeValid) {
        context.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Time is outside of restaurant operating hours',
          path: ['time'],
        });
      }

      if (restaurant.blacklist.includes(data.phone)) {
        context.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Internal error, please try again later',
          path: ['phone'],
        });
      }
    });

  const { control, handleSubmit, trigger, watch, getValues } =
    useForm<ReservationData>({
      defaultValues: {
        name: '',
        phone: '',
        time: '',
        guests: '2',
        preference: 'No-preference',
        notes: '',
        date: '',
        email: '',
        tableId: '',
      },
      resolver: zodResolver(FormDataSchema),
    });

  const selectedDate = watch('date');

  const onSubmit = async (data: ReservationData) => {
    try {
      const validationResult = await runValidations([
        () => validateInitialConditions(verifyOtp, data.guests, table),
        () => validateReservationTime(data.date, data.time),
        () =>
          validateTableAvailabilityAndConflicts(
            table,
            data.guests,
            data.date,
            data.time,
          ),
      ]);

      const createReservationData = {
        _type: 'reservation',
        time: `${data.date}T${data.time}`,
        table: { _type: 'reference', _ref: validationResult.tableId },
        name: data.name,
        phone: data.phone,
        email: data.email,
        guests: data.guests,
        preference: data.preference,
        notes: data.notes,
      };

      await axios.post('/api/createReservations', createReservationData);
    } catch (error) {
      console.error('Error during reservation:', error);
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
              <Button
                className={clsx({
                  'bg-gray-300 text-white': isRunning,
                  'bg-green-500 text-white': verifyOtp,
                  'bg-yellow-400 text-black': !isRunning && !verifyOtp,
                })}
                variant="solid"
                padding="0.36rem 1rem"
                disabled={verifyOtp || isRunning}
                borderRadius={5}
                fontSize="small"
                fontWeight="600"
                onClick={verifyOtp || isRunning ? undefined : phoneClickHandler}
              >
                {verifyOtp ? 'Verified' : isRunning ? `${timeLeft}s` : 'Verify'}
              </Button>
            </span>
          </InputsContainer>
          <InputsContainer>
            <ControlledInput
              label="Date"
              control={control}
              name="date"
              type="date"
            />
            <ControlledInput
              label="Time"
              control={control}
              name="time"
              type="time"
              disabled={!selectedDate}
            />
          </InputsContainer>
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
