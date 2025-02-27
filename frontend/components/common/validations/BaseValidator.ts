import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { CountryCode } from 'libphonenumber-js';
import validator from 'validator';
import { DateTime } from 'luxon';
import { MissingFieldError } from '@/error/missingFieldError';
import { ValidationError } from '@/error/validationError';

export const BaseValidator = {
  validateRequiredFields: (
    body: Record<string, any>,
    requiredFields: string[],
  ) => {
    const missingFields = requiredFields.filter(
      (field) => !(field in body) || body[field] === '',
    );
    if (missingFields.length)
      throw new MissingFieldError(missingFields.join(', '));
  },

  validatePhoneNumber: (phone: string, countryCode: CountryCode = 'AU') => {
    const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
    if (!phoneNumber?.isValid())
      throw new ValidationError('Invalid phone number');
  },

  validateEmail: (email: string) => {
    if (!validator.isEmail(email)) throw new ValidationError('Invalid email');
  },

  validateDateFormat: (date: string) => {
    const dateTime = DateTime.fromISO(date);
    if (!dateTime.isValid) throw new ValidationError('Invalid date format');
  },

  validateFutureDate: (date: string) => {
    const dateTime = DateTime.fromISO(date, { zone: 'Australia/Adelaide' });
    const now = DateTime.local().setZone('Australia/Adelaide');

    if (dateTime < now) throw new ValidationError('should not be in the past');
  },

  validateNotesLength: (notes: string) => {
    if (notes.length > 1000) throw new ValidationError('Invalid notes length');
  },
};
