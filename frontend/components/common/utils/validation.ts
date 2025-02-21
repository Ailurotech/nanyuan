import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { CountryCode } from 'libphonenumber-js';
import validator from 'validator';
import { OrderItem } from '@/types';
import { DateTime } from 'luxon';
import { MissingFieldError } from '@/error/MissingFieldError';
import { ValidationError } from '@/error/validationError';

export const validateRequiredFields = (
  body: Record<string, any>,
  requiredFields: string[],
) => {
  const missingFields = requiredFields.filter(
    (field) => !(field in body) || body[field] === '',
  );
  if (missingFields.length)
    throw new MissingFieldError(missingFields.join(', '));
};

export const validatePhoneNumber = (
  phone: string,
  countryCode: CountryCode = 'AU',
) => {
  const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
  if (!phoneNumber?.isValid())
    throw new ValidationError('Invalid phone number');
};

export const validateEmail = (email: string) => {
  if (!validator.isEmail(email)) throw new ValidationError('Invalid email');
};

export const validateItemsArray = (items: OrderItem[]) => {
  if (!Array.isArray(items) || items.length === 0)
    throw new ValidationError('Invalid item structure');

  const isValidItem = (item: OrderItem) =>
    typeof item._key === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    item.price >= 0 &&
    typeof item.quantity === 'number' &&
    item.quantity > 0 &&
    typeof item.menuItem === 'object' &&
    item.menuItem._type === 'reference' &&
    typeof item.menuItem._ref === 'string';

  if (!items.every(isValidItem))
    throw new ValidationError('Invalid item structure');
};

export const validateTotalPrice = (totalPrice: number) => {
  if (totalPrice < 0) throw new ValidationError('Invalid total price');
};

export const validatePaymentMethod = (paymentMethod: string) => {
  const validPaymentMethods = ['offline', 'online'];
  if (!validPaymentMethods.includes(paymentMethod))
    throw new ValidationError('Invalid payment method');
};

export const validateDateFormat = (date: string) => {
  const dateTime = DateTime.fromISO(date);

  if (!dateTime.isValid) {
    throw new ValidationError('Invalid date format');
  }
};

export const validateFutureDate = (date: string) => {
  const dateTime = DateTime.fromISO(date, { zone: 'Australia/Adelaide' });
  const now = DateTime.local().setZone('Australia/Adelaide');

  if (dateTime < now) {
    throw new ValidationError('should not be in the past');
  }
};

export const validateNotesLength = (notes: string) => {
  if (notes.length > 1000) throw new ValidationError('Invalid notes length');
};
