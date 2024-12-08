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
import { isValidTime } from '@/components/common/timeUtils';
import clsx from 'clsx';
import { sanityClient } from '@/lib/sanityClient';
import checkTableBookingAvailability from './checkAvailability';
import { useSMS } from '../hooks/useSMS';

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

  const onSubmit = async (data: FormData) => {
    const result = await checkTableBookingAvailability(
      tables,
      data.guests,
      data.date,
      data.time,
      verifyOtp,
    );

    if (result.errorMessage) {
      alert(result.errorMessage);
      return;
    }

    const datetime = `${data.date}T${data.time}`;

    try {
      await sanityClient.create({
        _type: 'reservation',
        name: data.name,
        phone: data.phone,
        email: data.email,
        guests: data.guests,
        preference: data.preference,
        notes: data.notes,
        time: datetime,
        table: {
          _type: 'reference',
          _ref: result.tableId,
        },
      });
      // redirect to the success page
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Failed to book a table. Please try again later.');
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
