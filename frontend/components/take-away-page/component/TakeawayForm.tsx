import { ControlledInput } from '@/components/common/ControlledInput';
import { ControlledTestArea } from '@/components/common/ControlledTestArea';
import { Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { InputsContainer } from './InputsContainer';
import { useEffect, useState } from 'react';
import { MenuItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

export function TakeawayForm() {
  interface FormData {
    name: string;
    phoneNumber: string;
    pickUpDate: string;
    pickUpTime: string;
    email: string;
    notes: string;
  }
  type OrderList = MenuItem & { quantity: number };

  const requiredField = zod.string().min(1, { message: 'Required Field' });
  const FormDataSchema = zod.object({
    name: requiredField,
    phoneNumber: requiredField,
    pickUpDate: requiredField,
    pickUpTime: requiredField,
    email: requiredField.email(),
    notes: zod.string().optional(),
  });

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: '',
      phoneNumber: '',
      pickUpDate: '',
      pickUpTime: '',
      email: '',
      notes: '',
    },
    resolver: zodResolver(FormDataSchema),
  });

  const [orderList, setOrderList] = useState<OrderList[]>([]);
  const [totalPrice, setTotalPrice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const onSubmit = (data: FormData) => {
    const parsedData = { ...data, totalPrice };
    console.log(parsedData);
  };

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

  return (
    !loading && (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputsContainer>
          <ControlledInput label="Name" control={control} name="name" />
          <span className="flex col-span-1 gap-2 items-end">
            <ControlledInput
              label="Phone Number"
              control={control}
              name="phoneNumber"
            />
            <Button
              colorScheme="orange"
              variant="solid"
              backgroundColor="#facc16"
              padding="0.36rem 1rem"
              borderRadius={5}
              fontSize="small"
              fontWeight="600"
            >
              Verify
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
    )
  );
}
