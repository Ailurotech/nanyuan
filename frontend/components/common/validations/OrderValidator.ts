import { BaseValidator } from './BaseValidator';
import { OrderItem } from '@/types';
import { ValidationError } from '@/error/validationError';

export const OrderValidator = {
  ...BaseValidator,

  validateItemsArray: (items: OrderItem[]) => {
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
  },

  validateTotalPrice: (totalPrice: number) => {
    if (totalPrice < 0) throw new ValidationError('Invalid total price');
  },

  validatePaymentMethod: (paymentMethod: string) => {
    const validPaymentMethods = ['offline', 'online'];
    if (!validPaymentMethods.includes(paymentMethod))
      throw new ValidationError('Invalid payment method');
  },

  validateAll: (data: any) => {
    OrderValidator.validateRequiredFields(data, [
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
    OrderValidator.validatePhoneNumber(data.phone);
    OrderValidator.validateEmail(data.email);
    OrderValidator.validateDateFormat(data.date);
    OrderValidator.validateFutureDate(data.date);
    OrderValidator.validateItemsArray(data.items);
    OrderValidator.validateTotalPrice(data.totalPrice);
    OrderValidator.validatePaymentMethod(data.paymentMethod);
    OrderValidator.validateNotesLength(data.notes);
  },
};
