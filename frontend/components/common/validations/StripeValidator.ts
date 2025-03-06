import { BaseValidator } from './BaseValidator';
import { ValidationError } from '@/error/validationError';
import { OrderItem } from '@/types';

export const StripeValidator = {
  ...BaseValidator,

  validateOrderFields: (data: any) => {
    const requiredFields = ['orderId', 'email', 'items', 'totalPrice'];
    BaseValidator.validateRequiredFields(data, requiredFields);
  },

  validateStripeItems: (items: OrderItem[]) => {
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Order must contain at least one item');
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

  validateAll: (data: any) => {
    StripeValidator.validateOrderFields(data);
    StripeValidator.validateEmail(data.email);
    StripeValidator.validateStripeItems(data.items);
    StripeValidator.validateStripeTotalPrice(data.totalPrice);
    StripeValidator.validatePhoneNumber(data.phone);
    StripeValidator.validateStripeOrderId(data.orderId);
  },
};
