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

    items.forEach((item, index) => {
      if (!item.name || typeof item.name !== 'string') {
        throw new ValidationError(`Item ${index + 1} has an invalid name`);
      }
      if (!item.price || typeof item.price !== 'number' || item.price <= 0) {
        throw new ValidationError(`Item ${index + 1} has an invalid price`);
      }
      if (
        !item.quantity ||
        typeof item.quantity !== 'number' ||
        item.quantity < 1
      ) {
        throw new ValidationError(`Item ${index + 1} has an invalid quantity`);
      }
      if (
        !item.menuItem ||
        typeof item.menuItem !== 'object' ||
        item.menuItem._type !== 'reference' ||
        typeof item.menuItem._ref !== 'string'
      ) {
        throw new ValidationError(
          `Item ${index + 1} has an invalid menuItem reference`,
        );
      }
    });
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
