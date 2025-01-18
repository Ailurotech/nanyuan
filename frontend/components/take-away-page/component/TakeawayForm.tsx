import { ControlledInput } from '@/components/common/ControlledInput';
import { ControlledTestArea } from '@/components/common/ControlledTestArea';
import { Button, HStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { InputsContainer } from './InputsContainer';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSMS } from '@/components/hooks/useSMS';
import VerifyOtpModal from '@/components/common/VerifyOtpModal';
import { runValidations, validatePrice, validatePickUpTime, validateOTP } from './checkAvailiability';
import { MenuItem, Restaurant } from '@/types';
import { v4 as uuidv4 } from 'uuid'; 
import ActionButton from '@/components/common/ActionButton';
import { CreateTakeAwayOrder } from '@/components/common/utils/createTakeAwayOrder';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import * as zod from 'zod';


interface TakeawayProps {
  restaurant: Restaurant;
}

export function TakeawayForm({ restaurant }: TakeawayProps) {
  
  interface FormData {
    name: string;
    phone: string;
    date: string;
    time: string;
    email: string;
    notes: string;
  }
  type OrderList = MenuItem & { quantity: number };

  const {
    SendOtp,
    handleVerifyOtp,
    verifyOtp,
    setIsModalOpen,
    isModalOpen,
    timeLeft,
    isRunning,
  } = useSMS();

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
    pickUpDate: requiredField,
    pickUpTime: requiredField,
    email: requiredField.email(),
    notes: zod.string().optional(),
  });
 
  

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
      await CreateTakeAwayOrder({
        data,
        orderList,
        totalPrice,
        status: 'Offline',
        paymentMethod: 'offline',
        orderId: id,
      });
  
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
      
      await CreateTakeAwayOrder({
        data,
        orderList,
        totalPrice,
        status: 'Pending',
        paymentMethod: 'online',
        orderId: id,
      });
  
  
    } catch (error) {
      console.error(error);
    }
  };

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
