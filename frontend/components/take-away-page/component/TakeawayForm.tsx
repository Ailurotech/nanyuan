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

interface TakeawayProps {
  restaurant: Restaurant;
}

export function TakeawayForm({ restaurant }: TakeawayProps) {
  interface FormData {
    name: string;
    phone: string;
    pickUpDate: string;
    pickUpTime: string;
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

  const { control, handleSubmit, trigger, getValues } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      pickUpDate: '',
      pickUpTime: '',
      email: '',
      notes: '',
    },
    resolver: zodResolver(FormDataSchema),
  });

  const onSubmit = async (data: FormData) => {
    const date = `${data.pickUpDate}T${data.pickUpTime}`;
    const result = await checkTakeawayOrderAvailability(
      verifyOtp,
      data.pickUpDate,
      data.pickUpTime,
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
              label="Pickup Date"
              control={control}
              name="pickUpDate"
              type="Date"
            />
            <ControlledInput
              label="Pickup Time"
              control={control}
              name="pickUpTime"
              type="Time"
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
