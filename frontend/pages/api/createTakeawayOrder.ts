import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '@/lib/sanityClient';
import apiHandler from '@/lib/apiHandler';
import { errorMap } from '@/error/errorMap';
import {
  validateRequiredFields,
  validatePhoneNumber,
  validateEmail,
  validateItemsArray,
  validateTotalPrice,
  validatePaymentMethod,
  validateDateFormat,
  validateFutureDate,
  validateNotesLength,
} from '@/components/common/utils/validation';

const createTakeawayOrder = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    const {
      orderId,
      customerName,
      phone,
      email,
      items,
      date,
      status,
      totalPrice,
      paymentMethod,
      notes,
    } = req.body;

    validateRequiredFields(req.body, [
      'orderId',
      'customerName',
      'phone',
      'email',
      'items',
      'date',
      'status',
      'totalPrice',
      'paymentMethod',
    ]);
    validatePhoneNumber(phone);
    validateEmail(email);
    validateItemsArray(items);
    validateTotalPrice(totalPrice);
    validatePaymentMethod(paymentMethod);
    validateDateFormat(date);
    validateFutureDate(date);
    validateNotesLength(notes);

    await sanityClient.create({
      ...req.body,
      _type: 'order',
      _id: orderId,
    });

    return res.status(200).json({ message: 'Order created successfully' });
  } catch (error) {
    if (error instanceof Error) {
      const errorName = error.name;
      const errorInfo = errorMap.get(errorName);
      return res
        .status(errorInfo?.status || 500)
        .json({ error: errorInfo?.message || 'Internal server error' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default apiHandler().post(createTakeawayOrder);
