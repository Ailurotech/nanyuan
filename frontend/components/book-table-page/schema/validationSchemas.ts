import * as zod from 'zod';
import { Restaurant } from '@/types';
import { isValidTime } from '@/components/common/utils/timeUtils';

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
};
