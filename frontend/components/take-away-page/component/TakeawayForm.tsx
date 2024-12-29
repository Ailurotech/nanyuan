import { ControlledInput } from '@/components/common/controller/ControlledInput';
import { ControlledTestArea } from '@/components/common/controller/ControlledTestArea';
import { Button, HStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { InputsContainer } from './InputsContainer';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSMS } from '@/components/hooks/useSMS';
import VerifyOtpModal from '@/components/common/VerifyOtpModal';
import { runValidations, validatePrice, validatePickUpTime, validateOTP } from './checkAvailiability';
import { Restaurant } from '@/types';
import OrderList from './small-component/OrderList';
import OtpButton from '@/components/common/icon-and-button/OtpButton';
import DateTimePicker from '@/components/common/DateTImePicker';
import { loadStripe } from '@stripe/stripe-js';
import { fetchStripeSession } from '@/components/common/utils/paymentUtils';
import { v4 as uuidv4 } from 'uuid'; 
import { useCart } from '@/components/hooks/useCart';
import { usePhoneClickHandler } from '@/components/hooks/usePhoneClickHandler';
import { getFormDataSchema } from './schema/validationSchema';
import ActionButton from '@/components/common/ActionButton';
import { useRouter } from 'next/router';
import { processOrder } from '@/components/common/utils/orderUtils';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface TakeawayProps {
  restaurant: Restaurant;
}

export function TakeawayForm({ restaurant }: TakeawayProps) {
  const router = useRouter();
  const { orderList, totalPrice, loading } = useCart();
  interface FormData {
    name: string;
    phone: string;
    date: string;
    time: string;
    email: string;
    notes: string;
  }

  const {
    SendOtp,
    handleVerifyOtp,
    verifyOtp,
    setIsModalOpen,
    isModalOpen,
    timeLeft,
    isRunning,
  } = useSMS();
 
  const FormDataSchema = getFormDataSchema(restaurant);

  const { control, handleSubmit, trigger, getValues, watch } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      date: '',
      time: '',
      email: '',
      notes: '',
    },
    resolver: zodResolver(FormDataSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await runValidations([
        () => validateOTP(verifyOtp),
        () => validatePickUpTime(data.date, data.time),
        () => validatePrice(parseFloat(totalPrice)),
      ]);
      const id = uuidv4();
      await processOrder({
        data,
        orderList,
        totalPrice,
        status: 'Offline',
        paymentMethod: 'offline',
        orderId: id,
      });
  
      router.push('/success/takeaway');
    } catch (error) {
      console.error(error);
    }
  };
  
 
  const handlePayOnline = async (data: FormData) => {
    try {
      await runValidations([
        () => validateOTP(verifyOtp),
        () => validatePickUpTime(data.date, data.time),
        () => validatePrice(parseFloat(totalPrice)),
      ]);
      
      const id = uuidv4();
      const sessionId = await fetchStripeSession(orderList, totalPrice, id);
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe is not loaded.');
  
      await processOrder({
        data,
        orderList,
        totalPrice,
        status: 'Pending',
        paymentMethod: 'online',
        sessionId,
        orderId: id,
      });
  
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error(error);
    }
  };

  const selectedDate = watch('date');
  const phoneClickHandler = usePhoneClickHandler(SendOtp, trigger, getValues);
  
  return (
    !loading && (
      <section>
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
          <OrderList orderList={orderList} totalPrice={totalPrice} />
          <ControlledTestArea
            label="Special Requested or Notes"
            control={control}
            name="notes"
            placeholder="Enter your special request or notes for your order here..."
            rows={5}
          />
          <HStack
          marginTop="2rem"
          width="100%"
          marginX="auto"
          >
            <ActionButton label="Submit Order" onClick={handleSubmit(onSubmit)} />
            <ActionButton label="Pay Online(4.99% charge)" onClick={handleSubmit(handlePayOnline)} />
          </HStack>
        </form>
        {isModalOpen && (
          <VerifyOtpModal
            onVerify={handleVerifyOtp}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </section>
    )
  );
}
