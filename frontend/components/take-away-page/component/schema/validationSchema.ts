import * as zod from 'zod';
import { Restaurant } from '@/types';
import { isValidTime } from '@/components/common/utils/timeUtils';

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
