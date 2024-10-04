import { ControlledInput } from '@/components/common/ControlledInput';
import { ControlledTestArea } from '@/components/common/ControlledTestArea';
import { ControlledSelect } from '@/components/common/ControlledSelect';
import { Button, Box } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { InputsContainer } from '@/components/Take-away-page/component/InputsContainer';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import VerifyOtpModal from '@/components/book-table-page/VerifyOtpModal';

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

export function BooktablePage() {
  const requiredField = zod.string().min(1, { message: 'Required Field' });
  const phoneSchema = zod.string().regex(/^\d{9}$/, { message: 'Phone number invalid' });
  const FormDataSchema = zod.object({
    name: requiredField,
    phone: phoneSchema,
    date: requiredField,
    time: requiredField,
    guests: requiredField,
    email: requiredField.email(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
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
  const [timer, setTimer] = useState<number | null>(null); 

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => (prev ? prev - 1 : 0));
      }, 1000);
    } else if (timer === 0 && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const onSubmit = (data: FormData) => {
    if (verifyOtp) {
      const parsedData = { ...data };
      console.log(parsedData);
    }
  };

  const Sendotp = async () => {
    if (timer !== null && timer > 0) {
      alert(`Please wait for ${timer} seconds`);
      return; 
    }
    const result = await trigger('phone');
    if (result) {
      setIsModalOpen(true);
      setOtp('1234');
      setTimer(60); 
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
              <ControlledInput label="Phone Number" control={control} name="phone" />
              <Button
                colorScheme={timer !== null && timer > 0 ? "gray" : "green"}
                variant="solid"
                backgroundColor={verifyOtp ? "#90EE90" : (timer !== null && timer > 0 ? "gray.300" : "#facc16")} 
                color={verifyOtp ? "white" : (timer !== null && timer > 0 ? "white" : "black")} 
                padding="0.36rem 1rem"
                borderRadius={5}
                fontSize="small"
                fontWeight="600"
                onClick={Sendotp}
                disabled={timer !== null && timer > 0 || verifyOtp} 
              >
                {verifyOtp ? 'Verified' : (timer !== null && timer > 0 ? `${timer}s` : 'Verify')}
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
            label="Special Requested or Notes"
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
