import { BaseValidator } from './BaseValidator';
import { ValidationError } from '@/error/validationError';
import { OrderItem, OrderData } from '@/types';

export const StripeValidator = {
  ...BaseValidator,

  validateOrderFields: (data: OrderData) => {
    const requiredFields = ['orderId', 'email', 'items', 'totalPrice'];
    BaseValidator.validateRequiredFields(data, requiredFields);
  },

  validateStripeItems: (items: OrderItem[]) => {
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Order must contain at least one item');
    }

    const isValid = items.every((item) => {
      return (
        typeof item === 'object' && item.name && item.price && item.quantity
      );
    });

    if (!isValid) {
      throw new ValidationError('Invalid item format');
    }
  },

  validateStripeTotalPrice: (totalPrice: number) => {
    if (typeof totalPrice !== 'number' || totalPrice <= 0) {
      throw new ValidationError('Total price must be a positive number');
    }
  },

  validateStripeOrderId: (orderId: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(orderId)) {
      throw new ValidationError('Order ID must be a valid UUID');
    }
  },

  validateAll: (data: OrderData) => {
    StripeValidator.validateOrderFields(data);
    StripeValidator.validateEmail(data.email);
    StripeValidator.validateStripeItems(data.items);
    StripeValidator.validateStripeTotalPrice(data.totalPrice);
    StripeValidator.validatePhoneNumber(data.phone);
    StripeValidator.validateStripeOrderId(data.orderId);
  },
};
