import { ControlledInput } from '@/components/common/ControlledInput';
import { ControlledTestArea } from '@/components/common/ControlledTestArea';
import { Button, HStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { InputsContainer } from './InputsContainer';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSMS } from '@/components/hooks/useSMS';
import VerifyOtpModal from '@/components/common/VerifyOtpModal';
import { runValidations, validatePrice, validatePickUpTime, validateOTP } from '@/components/take-away-page/component/checkAvailiability';
import { MenuItem, Restaurant } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import * as zod from 'zod';
import { CreateTakeAwayOrder } from '@/components/common/utils/createTakeawayOrder';
import { OrderData, OrderItem } from '@/types';
import { isValidTime } from '@/components/book-table-page/timeUtils';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useRouter } from 'next/router';

interface TakeawayProps {
  restaurant: Restaurant;
}

export function TakeawayForm({ restaurant }: TakeawayProps) {
  const router = useRouter();
  interface FormData {
    name: string;
    phone: string;
    date: string;
    time: string;
    email: string;
    notes: string;
  }

  type OrderList = MenuItem & { quantity: number };

  const { SendOtp, handleVerifyOtp, verifyOtp, setIsModalOpen, isModalOpen, timeLeft, isRunning } = useSMS();
  const [orderList, setOrderList] = useState<OrderList[]>([]);
  const [totalPrice, setTotalPrice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const cart = localStorage.getItem('cart');
    if (!cart) {
      setOrderList([]);
      setLoading(false);
    } 
    if (cart) {
      const parsedList = JSON.parse(cart) as OrderList[];
      setOrderList(parsedList);
      const price = parsedList
        .reduce((acc, cum) => {
          return acc + cum.price * cum.quantity;
        }, 0)
        .toFixed(2);
      setTotalPrice(price);
      setLoading(false);
    }
  }, []);

  const requiredField = zod.string().min(1, { message: 'Required Field' });
  const FormDataSchema = zod.object({
    name: requiredField,
    phone: requiredField,
    date: requiredField,
    time: requiredField,
    email: requiredField.email(),
    notes: zod.string().optional(),
  }).superRefine((data, context) => {
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

  const { control, handleSubmit, trigger, getValues, watch } = useForm<OrderData>({
    defaultValues: {
      name: '',
      phone: '',
      date: '',
      time: '',
      email: '',
      notes: 'Enter your special request or notes for your order here...',
      items: [],
      totalPrice: 0,
      status: 'Offline',
      paymentMethod: 'offline',
      orderId: '',
    },
    resolver: zodResolver(FormDataSchema),
  });

  const handleOrderSubmission = async (data: OrderData, paymentMethod: 'offline' | 'online', status: 'Offline' | 'Pending') => {
    try {
      await runValidations([
        () => validateOTP(verifyOtp),
        () => validatePickUpTime(data.date, data.time),
        () => validatePrice(data.totalPrice),
      ]);
  
      const id = uuidv4();
      const stripeEmbedUrl = process.env.NEXT_PUBLIC_STRIPE_EMBED_API_URL;

     
      await CreateTakeAwayOrder({
        ...data,
        items: orderList.map((item) => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          menuItem: { _type: 'reference', _ref: item._id }, 
        })),
        totalPrice: parseFloat(totalPrice),
        orderId: id,
        paymentMethod,
        status,
        notes: data.notes,
      });

      sessionStorage.setItem('orderDetails', JSON.stringify({
        ...data,
        items: orderList,
        totalPrice: parseFloat(totalPrice),
        orderId: id,
        paymentMethod,
        status,
      }));

      if (paymentMethod === 'offline') {
        router.push('/success/takeaway');
      }

      if (paymentMethod === 'online') {
        const response = await axios.post(`${stripeEmbedUrl}`, {
          orderList,
          totalPrice,
          id,
        });
      
        const { sessionId } = response.data;
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
        if (stripe && sessionId) {
          await stripe.redirectToCheckout({ sessionId });
        } else {
          throw new Error('Failed to create Stripe session');
        }
      }
    } catch (error) {
      console.error(`${paymentMethod === 'online' ? 'Online payment' : 'Order submission'} failed:`, error);
    }
  };
  
  const onSubmit = (data: OrderData) => handleOrderSubmission(data, 'offline', 'Offline');
  const handlePayOnline = (data: OrderData) => handleOrderSubmission(data, 'online', 'Pending');
  

  const selectedDate = watch('date');

  const phoneClickHandler = async () => {
    const result = await trigger('phone');
    const phone = getValues('phone');
    if (result) {
      SendOtp(phone);
    }
  };

  return (
    !loading && (
      <section>
        <form className="flex flex-col gap-4">
          <InputsContainer>
            <ControlledInput label="Name" control={control} name="name" />
            <span className="flex col-span-1 gap-2 items-end">
              <ControlledInput label="Phone Number" control={control} name="phone" disabled={verifyOtp} />
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
            <ControlledInput label="Date" control={control} name="date" type="date" />
            <ControlledInput label="Time" control={control} name="time" type="time" disabled={!selectedDate} />
          </InputsContainer>
          <ControlledInput label="Email" control={control} name="email" />
          <div className="flex flex-col gap-2">
            <h4 className="text-sm">Ordered Dishes</h4>
            <ul className="text-base space-y-1 list-disc px-4">
              {orderList.length === 0 && (
                <li className="font-bold">No Order Yet!</li>
              )}
              {orderList.map((order, index) => (
                <li
                  key={index}
                >{`${order.name} - $${order.price} X${order.quantity}`}</li>
              ))}
            </ul>
            <h4 className="font-bold">{`Total Price: $${totalPrice}`}</h4>
          </div>
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
            spacing={4}
            fontSize="small"
            fontWeight="600"
            borderRadius={5}
            className="common-btn-styles"
            color="black"
          >
            <Button
              width="100%"
              backgroundColor="#facc16"
              padding="0.6rem"
              onClick={handleSubmit(onSubmit)}
            >
            Submit Order
            </Button>
            <Button
              width="100%"
              backgroundColor="#facc16"
              padding="0.6rem"
              onClick={handleSubmit(handlePayOnline)}
            >
            Pay Online (4.99% charge)
            </Button>
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
