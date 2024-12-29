import * as zod from 'zod';
import { Restaurant } from '../../../types';
import { isValidTime } from './timeUtils';


export const validateBlacklist = (
  phone: string,
  restaurant: Restaurant,
  context: zod.RefinementCtx
) => {
  if (restaurant.blacklist.includes(phone)) {
    context.addIssue({
      code: zod.ZodIssueCode.custom,
      message: 'Internal error, please try again later',
      path: ['phone'],
    });
  }
};

export const validateOperatingTime = (
  date: string,
  time: string,
  restaurant: Restaurant,
  context: zod.RefinementCtx
) => {
  
  const isTimeValid = isValidTime(
    date,
    time,
    restaurant.Weekdaytime,
    restaurant.Weekandtime
  );

  if (!isTimeValid) {
    context.addIssue({
      code: zod.ZodIssueCode.custom,
      message: 'Time is outside of restaurant operating hours',
      path: ['time'],
    });
  }
};
