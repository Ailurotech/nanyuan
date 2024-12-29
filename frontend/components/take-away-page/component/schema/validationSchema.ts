import * as zod from 'zod';
import { Restaurant } from '@/types';
import { validateBlacklist, validateOperatingTime } from '@/components/common/utils/validationUtils';

export const getFormDataSchema = (restaurant: Restaurant) => {
  const phoneSchema = zod
    .string()
    .min(1, { message: 'Required Field' })
    .regex(/^\d{9}$/, { message: 'Phone number invalid' });
  const requiredField = zod.string().min(1, { message: 'Required Field' });

  return zod
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
};
