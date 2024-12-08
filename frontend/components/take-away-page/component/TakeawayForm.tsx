import { ControlledInput } from '@/components/common/ControlledInput';
import { ControlledTestArea } from '@/components/common/ControlledTestArea';
import { Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { InputsContainer } from './InputsContainer';
import { useEffect, useState } from 'react';
import { MenuItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useSMS } from '@/components/hooks/useSMS';
import clsx from 'clsx';
import VerifyOtpModal from '@/components/common/VerifyOtpModal';
import checkTakeawayOrderAvailability from './checkAvailiability';
import { Restaurant } from '@/types';
import { validateBlacklist, validateOperatingTime } from '@/components/common/utils/validationUtils';
import OrderList from './small-component/OrderList';
import OtpButton from '@/components/common/icon-and-button/OtpButton';

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

  const phoneSchema = zod
    .string()
    .min(1, { message: 'Required Field' })
    .regex(/^\d{9}$/, { message: 'Phone number invalid' });
  const requiredField = zod.string().min(1, { message: 'Required Field' });
  const FormDataSchema = zod
    .object({
      name: requiredField,
      phone: phoneSchema,
      date: requiredField,
      time: requiredField,
      email: requiredField.email(),
      notes: zod.string().optional(),
    })
    .superRefine((data, context) => {
      validateBlacklist(data.phone, restaurant, context);
      validateOperatingTime(data.date, data.time, restaurant, context);
    });

  const { control, handleSubmit, trigger, getValues } = useForm<FormData>({
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
    const date = `${data.date}T${data.time}`;
    const result = await checkTakeawayOrderAvailability(
      verifyOtp,
      data.date,
      data.time,
      parseFloat(totalPrice)
    );

    if (result.errorMessage) {
      alert(result.errorMessage);
    } else {
      // TODO: Submit order to sanity
      console.log('Order submitted:', data);  
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
          <InputsContainer>
            <ControlledInput
              label="Pickup Date"
              control={control}
              name="date"
              type="Date"
            />
            <ControlledInput
              label="Pickup Time"
              control={control}
              name="time"
              type="Time"
            />
          </InputsContainer>
          <ControlledInput label="Email" control={control} name="email" />
          <OrderList orderList={orderList} totalPrice={totalPrice} />
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
            Submit Order
          </Button>
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
