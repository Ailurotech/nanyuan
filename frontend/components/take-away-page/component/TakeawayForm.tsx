import { useState, useEffect } from 'react';
import { ControlledInput } from '@/components/common/ControlledInput';
import { ControlledTestArea } from '@/components/common/ControlledTestArea';
import { Button, HStack, useDisclosure } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { InputsContainer } from './InputsContainer';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSMS } from '@/components/hooks/useSMS';
import VerifyOtpModal from '@/components/common/VerifyOtpModal';
import {
  runValidations,
  validatePrice,
  validatePickUpTime,
  validateOTP,
  validateOrderItem,
} from '@/components/take-away-page/component/checkAvailiability';
import { Restaurant } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import * as zod from 'zod';
import { CreateTakeAwayOrder } from '@/components/common/utils/createTakeawayOrder';
import { OrderData, OrderItem } from '@/types';
import { isValidTime } from '@/components/book-table-page/timeUtils';
import { checkoutStripe } from '@/components/common/utils/checkoutStripe';
import { submitOrderToYinbao } from '@/components/common/utils/submitOrderToYinbao';
import axios from 'axios';
import { SuccessModal } from '@/components/common/SuccessModal';

interface TakeawayProps {
  restaurant: Restaurant;
}

export function TakeawayForm({ restaurant }: TakeawayProps) {
  const router = useRouter();
  const {
    SendOtp,
    handleVerifyOtp,
    setIsModalOpen,
    verifyOtp,
    isModalOpen,
    timeLeft,
    isRunning,
  } = useSMS();

  const [orderList, setOrderList] = useState<OrderItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const ONLINE_PAYMENT_CHARGE_PERCENTAGE = 0.0499;

  const {
    isOpen: isSuccessOpen,
    onOpen: openSuccess,
    onClose: closeSuccess,
  } = useDisclosure();
  const [successMessage, setSuccessMessage] = useState('');

  const { success } = router.query;

  useEffect(() => {
    if (success === 'true') {
      setSuccessMessage('Your payment was successful!');
      openSuccess();
    }
  }, [success, openSuccess]);

  useEffect(() => {
    const cart = localStorage.getItem('cart');

    if (!cart) {
      setOrderList([]);
      setTotalPrice('0.00');
      setLoading(false);
      return;
    }
    const parsedList: OrderItem[] = JSON.parse(cart).map((item: any) => ({
      ...item,
      _key: uuidv4(),
      menuItem: {
        _type: 'reference',
        _ref: item._id,
      },
      menuItemName: item.name,
      barcode: item.barcode,
    }));
    setOrderList(parsedList);
    setTotalPrice(
      parsedList
        .reduce((acc, item) => acc + item.price * item.quantity, 0)
        .toFixed(2),
    );
    setLoading(false);
  }, []);

  const requiredField = zod.string().min(1, { message: 'Required Field' });
  const FormDataSchema = zod
    .object({
      name: requiredField,
      phone: requiredField,
      date: requiredField,
      time: requiredField,
      email: requiredField.email(),
      notes: zod.string().optional(),
    })
    .superRefine((data, context) => {
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

  const { control, handleSubmit, trigger, getValues, watch } =
    useForm<OrderData>({
      defaultValues: {
        name: '',
        phone: '',
        date: '',
        time: '',
        email: '',
        notes: '',
        items: [],
        totalPrice: 0,
        status: 'Offline',
        paymentMethod: 'offline',
        orderId: '',
      },
      resolver: zodResolver(FormDataSchema),
    });

  const selectedDate = watch('date');

  const handleOrderSubmission = async (
    data: OrderData,
    paymentMethod: 'offline' | 'online',
    status: 'Offline' | 'Pending',
  ) => {
    if (isSubmitting) {
      alert('You are already submitting a request, please wait for it to complete');
      return;
    }
    try {
      await runValidations([
        () => validateOTP(verifyOtp),
        () => validatePickUpTime(data.date, data.time),
        () => validatePrice(data.totalPrice),
        () => validateOrderItem(orderList),
      ]);
      setIsSubmitting(true);
      const barcodes = orderList.map((item) => item.barcode.toString());

      const response = await axios.post('/api/getProductUid', {
        barcodes,
      });
      const { success, data: barcodeToUid } = response.data;
      if (!success) {
        throw new Error('Failed to fetch product UIDs');
      }
      const orderData: OrderData = {
        ...data,
        items: orderList.map((item) => ({
          ...item,
          productUid: barcodeToUid[item.barcode.toString()],
        })),
        totalPrice: parseFloat(totalPrice),
        orderId: uuidv4(),
        status: status,
        paymentMethod: paymentMethod,
      };

      await CreateTakeAwayOrder(orderData);
      switch (paymentMethod) {
        case 'offline':
          await submitOrderToYinbao(orderData);
          setSuccessMessage(
            `Your Order detail: Date: ${data.date}, Time: ${data.time}, Total: $${totalPrice}`,
          );
          openSuccess();
          break;
        case 'online':
          await checkoutStripe(orderData);
          break;
      }
    } catch (error: any) {
      alert(error.message);
      setIsSubmitting(false);
    } 
  };

  const onSubmit = (data: OrderData) =>
    handleOrderSubmission(data, 'offline', 'Offline');
  const handlePayOnline = (data: OrderData) =>
    handleOrderSubmission(data, 'online', 'Pending');

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
              <div style={{ display: 'block' }}>
                {parseFloat(totalPrice) > 0 ? (
                  <>
                    Pay Online ($
                    {(
                      parseFloat(totalPrice) * ONLINE_PAYMENT_CHARGE_PERCENTAGE
                    ).toFixed(2)}{' '}
                    surcharge)
                  </>
                ) : (
                  <>Pay Online (4.99% surcharge)</>
                )}
              </div>
            </Button>
          </HStack>
        </form>
        {isModalOpen && (
          <VerifyOtpModal
            onVerify={handleVerifyOtp}
            onClose={() => setIsModalOpen(false)}
          />
        )}
        <SuccessModal
          isOpen={isSuccessOpen}
          onClose={closeSuccess}
          message={successMessage}
        />
      </section>
    )
  );
}
