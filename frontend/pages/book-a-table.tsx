import { useForm } from 'react-hook-form';
import { Select, Box, FormControl, FormLabel, Button, NumberInputStepper, NumberInput, NumberInputField, NumberIncrementStepper, NumberDecrementStepper, HStack, Input, FormErrorMessage, Textarea } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import clsx from 'clsx';

type FormData = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  preference: string;
  notes: string;
  email: string;
};

export default function BookATablePage() {
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: '',
      phone: '+61',
      date: '',
      time: '',
      guests: 2,
      preference: 'No Preference',
      notes: '',
      email: ''
    },
    mode: 'onChange',
  });
  


  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(true);
  const otpTimerStart = useRef<number | null>(null);

  const onSubmit = async (data: any) => {
    console.log(data);
    console.log('Form submitted successfully!');

    if (!isOtpVerified) {
      alert('OTP is not verified yet. Please verify your phone number.');
     return;
    }
    return ;
  };

  

  const verifyOtp = () => {
    if (otp === '123456') {
      alert('OTP verified successfully!');
      setIsOtpVerified(true);
      setIsOtpSent(false);
      setCanResend(false); // Lock the resend button
    } else {
      alert('Invalid OTP, please try again.');
    }
  };

  const sendOtp = async () => {
    const isPhoneValid = await trigger('phone');
    if (isPhoneValid) {
      setIsOtpSent(true);
      setCanResend(false);
      setTimer(60);
      otpTimerStart.current = Date.now();
      localStorage.setItem('otpTimerStart', otpTimerStart.current.toString());
      alert('OTP sent to phone number');
    }
  };

  const closeOtpPopup = () => {
    setIsOtpSent(false);
    setOtp('');
  };


  useEffect(() => {
    const startTimestamp = localStorage.getItem('otpTimerStart');
    if (startTimestamp) {
      const elapsed = Math.floor((Date.now() - parseInt(startTimestamp)) / 1000);
      const remaining = 60 - elapsed;

      if (remaining > 0) {
        setTimer(remaining);
        setCanResend(false);
        otpTimerStart.current = parseInt(startTimestamp);
      } else {
        setCanResend(true);
        localStorage.removeItem('otpTimerStart');
      }
    }
  }, []);

  useEffect(() => {
    if (!canResend && otpTimerStart.current !== null) {
      const interval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - otpTimerStart.current!) / 1000);
        const remainingTime = 60 - elapsedTime;

        if (remainingTime > 0) {
          setTimer(remainingTime);
        } else {
          setTimer(0);
          setCanResend(true);
          localStorage.removeItem('otpTimerStart');
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [canResend, timer]);

  const selectedDate = watch('date');
  const isWeekend = (date:any) => {
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
  };
  const isSelectedDateWeekend = selectedDate && isWeekend(selectedDate);
  const isFormComplete = isOtpVerified 
  //&& Object.keys(errors).length === 0;

  

  return (
    <div className="w-full h-[130vh] sm:h-screen bg-[rgba(25,25,25,1)] pt-[20vh] pb-[5%] px-[5%] flex justify-center">
      <div className="w-[550px] h-[90vh] sm:h-[80vh] bg-[#e5e7eb] rounded-[20px] px-7 py-7 flex flex-col">
        <div className="w-full">
          <h1 className="font-bold text-2xl">Book a Table</h1>
          <p className="mt-1 font-extralight">
            Please fill in your details to reserve a table
          </p>
        </div>
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          className="h-full flex-grow pt-5 grid grid-cols-2 grid-rows-[repeat(4,1fr)_2fr] gap-x-4 gap-y-2 text-[0.9rem]"
          noValidate
        >
          <FormControl isInvalid={!!errors.name} isRequired>
            <FormLabel className="font-bold">Name</FormLabel>
              <Input
              className={clsx( errors.name &&  "ring-2 ring-red-500","w-full h-[35px] mt-2 rounded-[5px] pl-2")}
              type="text"
              {...register('name', { required: 'Name is required' })}
              />
            <FormErrorMessage  className='text-red-500' >{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.phone} isRequired>
            <FormLabel className="font-bold">Phone number</FormLabel>
            <HStack align="flex-start" spacing={2} mt={2} className="w-full">
              <Input
                className={clsx(errors.phone && "ring-2 ring-red-500", "w-full h-[35px] rounded-[5px] pl-2")}
                type="text"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^(\+61\d{9}|0\d{9})$/,
                    message: 'Please enter a valid phone number',
                  },
                })}
                disabled={isOtpVerified} 
              />
              <Button
                colorScheme="yellow"
                bg={isOtpVerified ? 'green.400' : canResend ? '#FACC15' : 'gray.400'}
                color={isOtpVerified || !canResend ? 'white' : 'black'}
                _hover={{ bg: isOtpVerified ? 'green.400' : canResend ? '#FACC15' : 'gray.400' }}
                onClick={sendOtp}
                isDisabled={isOtpVerified || !canResend || !!errors.phone}
                className="h-[35px] text-[0.65rem] w-[60px] sm:w-[auto] rounded-[5px] sm:text-[0.9rem] sm:min-w-[80px] px-2"
              >
                {isOtpVerified ? 'Verified' : canResend ? 'Send OTP' : `Resend (${timer}s)`}
              </Button>
            </HStack>
            <FormErrorMessage className='text-red-500'>{errors.phone?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.date} isRequired>
            <FormLabel className="font-bold">Date</FormLabel>
            <Input
              className={clsx(errors.date && "ring-2 ring-red-500", "w-full h-[35px] mt-2 rounded-[5px] pl-2")}
              type="date"
              {...register('date', { required: 'Date is required' })}
            />
            <FormErrorMessage className='text-red-500'>{errors.date?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.time} isRequired>
            <FormLabel className="font-bold">Time</FormLabel>
            <Select
              placeholder="Select time"
              className={clsx(errors.time && "ring-2 ring-red-500", "w-full h-[35px] mt-2 rounded-[5px] pl-2")}
              {...register('time', { required: 'Time is required' })}
              isDisabled={!selectedDate}
              sx={{
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
              }}
            >
              {isSelectedDateWeekend && (
                <>
                  <option>11:30</option>
                  <option>12:00</option>
                  <option>12:30</option>
                  <option>13:00</option>
                  <option>13:30</option>
                </>
              )}
              <option>17:00</option>
              <option>17:30</option>
              <option>18:00</option>
              <option>18:30</option>
              <option>19:00</option>
              <option>19:30</option>
              <option>20:00</option>
            </Select>
            <FormErrorMessage className='text-red-500'>{errors.time?.message}</FormErrorMessage>
          </FormControl>
          
          <FormControl isInvalid={!!errors.email} isRequired className="col-span-2" >
            <FormLabel className="font-bold">Email</FormLabel>
              <Input
                className={clsx(errors.email && "ring-2 ring-red-500", "w-full h-[35px] mt-2 rounded-[5px] pl-2 ")}
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address', 
                  },
               })}
              />
           <FormErrorMessage className='text-red-500'>{errors.email?.message}</FormErrorMessage>
          </FormControl>  
          <FormControl isInvalid={!!errors.guests} isRequired>
            <FormLabel className="font-bold">Number of Guests</FormLabel>
            <NumberInput max={50} min={1}>
              <NumberInputField
                className={clsx(errors.guests && "ring-2 ring-red-500", "w-full h-[35px] mt-2 rounded-[5px] px-2")}
                {...register('guests', { required: 'Number of guests is required' })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper className="mt-2 px-2" />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage className='text-red-500'>{errors.guests?.message}</FormErrorMessage>
          </FormControl>
          
          <FormControl>
            <FormLabel className="font-bold">Seating preference</FormLabel>
            <Select
              className="w-full h-[35px] mt-2 rounded-[5px] pl-2"
              {...register('preference')}
              sx={{
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
              }}
            >
              <option>No Preference</option>
              <option>Near the Inside</option>
              <option>By windows</option>
            </Select>
          </FormControl>
          <FormControl className="col-span-2">
            <FormLabel className="font-bold">Notes</FormLabel>
            <Textarea
              className="w-full max-h-[150px] min-h-[100px] mt-1 rounded-[5px] p-2"
              {...register('notes')}
              placeholder="Additional notes or requests"
            />
          </FormControl>

          <Box className="col-span-2 mt-4">
            <Button
              type="submit"
              width="full"
              bg={isFormComplete ? '#FACC15' : 'gray.400'}
              color={isFormComplete ? 'black' : 'white'}
              rounded="10px"
              py={2}
              mt={5}
              fontWeight="bold"
              isDisabled={!isFormComplete}
              _hover={{ bg: isFormComplete ? '#FACC15' : 'gray.400' }}
              _disabled={{ bg: 'gray.400', color: 'white' }}
            >
              Reserve Table
            </Button>
            
          </Box>
        </Box>

        {/* OTP 验证弹窗 */}
        {isOtpSent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg p-5 shadow-lg w-96">
                <h2 className="text-xl font-bold mb-2">Verify OTP</h2>
                <p className="mb-4">An OTP has been sent to your phone. Please enter it below:</p>
                <Input
                  className="mt-2 rounded-md border border-gray-300 pl-2"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <HStack spacing={4} mt={4} justifyContent="flex-end">
                  <Button colorScheme="teal" onClick={verifyOtp}>
                    Verify
                  </Button>
                  <Button colorScheme="red" onClick={closeOtpPopup}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="yellow"
                    onClick={sendOtp} 
                    isDisabled={!canResend} 
                  >
                    {canResend ? 'Resend OTP' : `Resend (${timer}s)`}
                  </Button>
                </HStack>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
