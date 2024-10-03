import { ControlledInput } from '@/components/common/ControlledInput';
import { ControlledTestArea } from '@/components/common/ControlledTestArea';
import { ControlledSelect } from '@/components/common/ControlledSelect';
import { Button, Box } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { InputsContainer } from '@/components/Take-away-page/component/InputsContainer';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';


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
  const phoneSchema = zod.string().regex(/^\d{9}$/,  { message: 'Phone number invalid' });
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
  
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(false);

  const onSubmit = (data: FormData) => {
    if(verifyOtp){
        const parsedData = { ...data };
        console.log(parsedData);
    }   
  };

  const Sendotp = async () => {
    const result = await trigger('phone'); 
    if (result) {
      setIsOtpSent(true);
      setIsModalOpen(true); 
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
            <ControlledInput
              label="Name"
              control={control}
              name="name"
            />
            <span className="flex col-span-1 gap-2 items-end">
              <ControlledInput
                label="Phone Number"
                control={control}
                name="phone"
              />
              <Button
                colorScheme="orange"
                variant="solid"
                backgroundColor="#facc16"
                padding="0.36rem 1rem"
                borderRadius={5}
                fontSize="small"
                fontWeight="600"
                onClick={Sendotp} 
              >
                Verify
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
          <ControlledInput
            label="Email"
            control={control}
            name="email"
          />
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
      </div>
    </section>
  );
}


<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg p-5 shadow-lg w-96">
  <h2 className="text-xl font-bold mb-2">Verify OTP</h2>
  <p className="mb-4">An OTP has been sent to your phone. Please enter it below:</p>
  <Input
    className="mt-2 rounded-md border border-gray-300 pl-2"
    type="text"
    
  />
  <HStack className="flex-start space-x-2 w-full mt-5">
    <Button onClick={() => onVerify(otp)}>
      Verify
    </Button>
    <Button onClick={onClose}>
      Cancel
    </Button>
  </HStack>
</div>
</div>