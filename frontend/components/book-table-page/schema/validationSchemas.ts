import * as zod from 'zod';
import { Restaurant } from '@/types';
import { validateBlacklist, validateOperatingTime } from '@/components/common/utils/validationUtils';

export const getBookTableSchema = (restaurant: Restaurant) => {
  const requiredField = zod.string().min(1, { message: 'Required Field' });
  const phoneSchema = zod
    .string()
    .min(1, { message: 'Required Field' })
    .regex(/^\d{9}$/, { message: 'Phone number invalid' });

  return zod
    .object({
      name: requiredField,
      phone: phoneSchema,
      date: requiredField,
      time: requiredField,
      guests: requiredField,
      email: zod.string().email({ message: 'Invalid email address' }),
      preference: zod.string(),
      notes: zod.string(),
    })
    .superRefine((data, context) => {
      validateBlacklist(data.phone, restaurant, context);
      validateOperatingTime(data.date, data.time, restaurant, context);
    });
};
