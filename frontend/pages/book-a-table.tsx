import { useForm } from 'react-hook-form';
import { Select, Box, FormControl, FormLabel, Button, NumberInputStepper, NumberInput, NumberInputField, NumberIncrementStepper, NumberDecrementStepper, HStack, Input } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function BookATablePage() {
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    clearErrors, // Add clearErrors to reset the error state
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
    },
    mode: 'onChange',
  });

  // States for OTP and timer
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(true);
  const otpTimerStart = useRef<number | null>(null);

  const onSubmit = async (data: any) => {
    if (!isOtpVerified) {
      alert('OTP is not verified yet. Please verify your phone number.');
      return;
    }

    try {
      // Use axios to send the data to the backend
      const response = await axios.post(process.env.NEXT_PUBLIC_SENDMAIL_URL, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert('Reservation successful!');
        window.location.href = '/';
      } else {
        console.error('Error submitting form:', response.data);
        alert('Failed to submit reservation. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error occurred. Please try again later.');
    }
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
    // Validate the phone field before sending OTP
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

  // Clear errors when user types in the phone number
  const handlePhoneChange = () => {
    clearErrors('phone');
  };

  // Restore timer on component mount
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
  const name = watch('name');
  const phone = watch('phone');
  const time = watch('time');
  const guests = watch('guests');

  const isWeekend = (date:any) => {
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
  };

  const isSelectedDateWeekend = selectedDate && isWeekend(selectedDate);

  const isFormComplete = name && phone && selectedDate && time && guests && isOtpVerified;

  

  return (
    <div className="w-full h-[120vh] sm:h-screen bg-[rgba(25,25,25,1)] pt-[20vh] pb-[5%] px-[5%] flex justify-center">
      <div className="w-[550px] h-[90vh] sm:h-[75vh] bg-[#e5e7eb] rounded-[20px] px-7 py-7 flex flex-col">
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
        >
          <FormControl isInvalid={!!errors.name}>
            <FormLabel className="font-bold">Name</FormLabel>
            <input
              className="w-full h-[35px] mt-2 rounded-[5px] pl-2"
              type="text"
              {...register('name', { required: 'Name is required' })}
            />
          </FormControl>

          <FormControl isInvalid={!!errors.phone}>
            <FormLabel className="font-bold">Phone number</FormLabel>
            <HStack align="flex-start" spacing={2} mt={2} className="w-full">
              <input
                className="flex-grow h-[35px] rounded-[5px] w-[80%] sm:w-[70%] pl-2"
                type="text"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^(\+61\d{9}|0\d{9})$/,
                    message: 'Please enter a valid phone number',
                  },
                })}
                disabled={isOtpVerified}
                onChange={handlePhoneChange} // Clear errors on input change
              />
              <Button
                colorScheme="yellow"
                bg={isOtpVerified ? 'green.400' : canResend ? '#FACC15' : 'gray.400'}
                color={isOtpVerified || !canResend ? 'white' : 'black'}
                _hover={{ bg: isOtpVerified ? 'green.400' : canResend ? '#FACC15' : 'gray.400' }}
                onClick={sendOtp}
                isDisabled={isOtpVerified || !canResend || !!errors.phone}
                className="h-[35px] w-[60px] sm:w-[auto] rounded-[5px] text-[0.9rem] sm:min-w-[80px] px-2"
              >
                {isOtpVerified ? 'Verified' : canResend ? 'Send OTP' : `Resend (${timer}s)`}
              </Button>
            </HStack>
            {errors.phone && <p className="text-red-500 mt-1">{errors.phone.message}</p>}
          </FormControl>

          <FormControl isInvalid={!!errors.date}>
            <FormLabel className="font-bold">Date</FormLabel>
            <input
              className="w-full h-[35px] mt-2 rounded-[5px] px-2"
              type="date"
              {...register('date', { required: 'Date is required' })}
            />
          </FormControl>

          <FormControl isInvalid={!!errors.time}>
            <FormLabel className="font-bold">Time</FormLabel>
            <Select
              placeholder="Select time"
              className="w-full h-[35px] mt-2 rounded-[5px] pl-2"
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
          </FormControl>

          <FormControl isInvalid={!!errors.guests}>
            <FormLabel className="font-bold">Number of Guests</FormLabel>
            <NumberInput max={50} min={1}>
              <NumberInputField
                className="w-full h-[35px] mt-2 rounded-[5px] px-2"
                {...register('guests', { required: 'Number of guests is required' })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper className="mt-2 px-2" />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
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
            <textarea
              className="w-full h-[130px] max-h-[200px] min-h-[130px] mt-2 rounded-[5px] p-2"
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
          <Box
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            p={6}
            rounded="md"
            shadow="md"
            zIndex={1000}
          >
            <FormControl>
              <FormLabel>Enter OTP</FormLabel>
              <Input
                placeholder="Enter Here"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className='mt-2'
              />
            </FormControl>
            <HStack spacing={4} mt={4}>
              <Button
                colorScheme="yellow"
                bg={'white'}
                color={'black'}
                onClick={verifyOtp}
              >
                Verify
              </Button>
              <Button
                variant="outline"
                onClick={sendOtp}
                isDisabled={!canResend}
              >
                {canResend ? 'Send Again' : `Send Again (${timer}s)`}
              </Button>
              <Button colorScheme="red" onClick={closeOtpPopup}>
                Close
              </Button>
            </HStack>
          </Box>
        )}
      </div>
    </div>
  );
}
