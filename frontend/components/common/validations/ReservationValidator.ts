import { BaseValidator } from './BaseValidator';
import { ValidationError } from '@/error/validationError';

export const ReservationValidator = {
  ...BaseValidator,

  validateTable: (table: any) => {
    if (
      typeof table !== 'object' ||
      !table._type ||
      table._type !== 'reference' ||
      !table._ref
    ) {
      throw new ValidationError('Invalid table reference');
    }
  },

  validateGuests: (guests: string) => {
    if (isNaN(parseInt(guests, 10)) || parseInt(guests, 10) <= 0)
      throw new ValidationError('Invalid guest count');
  },

  validateAll: (data: any) => {
    ReservationValidator.validateRequiredFields(data, [
      'name',
      'phone',
      'email',
      'time',
      'guests',
      'table',
    ]);
    ReservationValidator.validatePhoneNumber(data.phone);
    ReservationValidator.validateEmail(data.email);
    ReservationValidator.validateDateFormat(data.time);
    ReservationValidator.validateFutureDate(data.time);
    ReservationValidator.validateGuests(data.guests);
    ReservationValidator.validateTable(data.table);
    ReservationValidator.validateNotesLength(data.notes);
  },
};
