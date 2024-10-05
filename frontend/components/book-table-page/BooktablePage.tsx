import { ControlledInput } from '@/components/common/ControlledInput';
import { ControlledTestArea } from '@/components/common/ControlledTestArea';
import { ControlledSelect } from '@/components/common/ControlledSelect';
import { Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { InputsContainer } from '@/components/Take-away-page/component/InputsContainer';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import VerifyOtpModal from '@/components/book-table-page/VerifyOtpModal';
import useTimer from './useTimer'; 
import { Restaurant } from '@/types';
import { isTimeWithinRange } from './timeUtils';

interface BooktablePageProps {
  restaurant: Restaurant;
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

export function BooktablePage({ restaurant }: BooktablePageProps) {

const requiredField = zod.string().min(1, { message: 'Required Field' });
const phoneSchema = zod.string()
  .min(1, { message: 'Required Field' }) 
  .regex(/^\d{9}$/, { message: 'Phone number invalid' }); 

const FormDataSchema = zod.object({
  name: requiredField,
  phone: phoneSchema,
  date: requiredField,
  time: requiredField,
  guests: requiredField,
  email: requiredField.email(),
}).superRefine((data, context) => {
  const selectedDate = new Date(data.date); 
  const dayOfWeek = selectedDate.getDay();
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 4; 
  const weekdayTimeRange = restaurant.Weekdaytime;
  const weekendTimeRange = restaurant.Weekandtime;

  const isTimeValid = isWeekday
    ? isTimeWithinRange(data.time, weekdayTimeRange.start, weekdayTimeRange.end)
    : (
        isTimeWithinRange(data.time, weekdayTimeRange.start, weekdayTimeRange.end) ||
        isTimeWithinRange(data.time, weekendTimeRange.start, weekendTimeRange.end)
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


  const {
    control,
    handleSubmit,
    trigger,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      time: '',
      guests: '2',
      preference: '',
      notes: '',
      date: '',
      email: '',
    },
    resolver: zodResolver(FormDataSchema),
  });

  const selectedDate = watch('date');

  const [otp, setOtp] = useState(''); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const { timeLeft, isRunning, startTimer } = useTimer(60); 
  
  

  const onSubmit = (data: FormData) => {
    if (verifyOtp) {
      const parsedData = { ...data };
      console.log(parsedData);
      alert('Table booked successfully!');
    }else{
      alert('Please verify your phone number');
    }
  };
  
  const Sendotp = async () => {
    const result = await trigger('phone');
    if (result) {
      setIsModalOpen(true);
      setOtp('1234'); 
      startTimer(); 
    }
  };

  const handleVerifyOtp = (enteredOtp: string) => {
    if (enteredOtp === otp) {
      setVerifyOtp(true);
      setIsModalOpen(false);
      alert('Successfully verified');
    } else {
      alert('OTP is incorrect');
    }
  };

  return (
    <section className="bg-[#191919] min-h-screen pt-[200px] flex flex-col items-center">
      <div className="bg-[#e5e7ea] p-4 flex flex-col gap-8 rounded-lg max-w-[500px]">
        <div className="flex flex-col space-y-1">
          <h1 className="text-xl font-bold">Book a Table</h1>
          <h3 className="text-xs">Please fill in your details to reserve a table</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <InputsContainer>
            <ControlledInput label="Name" control={control} name="name" />
            <span className="flex col-span-1 gap-2 items-end">
              <ControlledInput label="Phone Number" control={control} name="phone" disabled={verifyOtp} />
              <Button
                colorScheme={isRunning ? "gray" : "green"}
                variant="solid"
                backgroundColor={verifyOtp ? "#90EE90" : (isRunning ? "gray.300" : "#facc16")} 
                color={verifyOtp ? "white" : (isRunning ? "white" : "black")} 
                padding="0.36rem 1rem"
                disabled={verifyOtp || isRunning}
                borderRadius={5}
                fontSize="small"
                fontWeight="600"
                onClick={!(verifyOtp || isRunning) ? Sendotp : undefined}
              >
                {verifyOtp ? 'Verified' : (isRunning ? `${timeLeft}s` : 'Verify')}
              </Button>
            </span>
          </InputsContainer>
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
          <ControlledInput label="Email" control={control} name="email" />
          <InputsContainer>
            <ControlledInput label="Guests" control={control} name="guests" type="number" />
            <ControlledSelect
              label="Preference"
              control={control}
              name="preference"
              options={[
                { value: '1', label: 'No preference' },
                { value: '2', label: 'Near the inside' },
                { value: '3', label: 'Near the window' },
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
