import { YinbaoOrderPayload, yinbaoOrderItem } from '@/types';
import { BaseValidator } from './BaseValidator';
import { ValidationError } from '@/error/validationError';

export const sendOrderToSystemValidator = {
  ...BaseValidator,

  validateOrderPayload: (payload: YinbaoOrderPayload) => {
    if (!payload) throw new ValidationError('Invalid order payload');

    if (!payload.payMethod) throw new ValidationError('payMethod is required');
    if (!['Cash', 'Wxpay', 'Alipay'].includes(payload.payMethod)) {
      throw new ValidationError(
        'Invalid payMethod, must be Cash, Wxpay, or Alipay',
      );
    }

    if (!payload.payOnLine) throw new ValidationError('payOnLine is required');
    if (!['0', '1'].includes(payload.payOnLine)) {
      throw new ValidationError('Invalid payOnLine value, must be "0" or "1"');
    }

    if (!payload.contactName || payload.contactName.trim() === '') {
      throw new ValidationError('contactName is required');
    }

    if (!payload.contactTel || !/^\d{1,15}$/.test(payload.contactTel)) {
      throw new ValidationError('Invalid contactTel, must be 1-15 digits');
    }

    if (!payload.orderDateTime || !payload.reservationTime) {
      throw new ValidationError(
        'Both orderDateTime and reservationTime are required',
      );
    }
  },

  validateOrderItems: (items: yinbaoOrderItem[]) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ValidationError('At least one item is required in the order');
    }

    items.forEach((item, index) => {
      if (!item.productUid)
        throw new ValidationError(`Item ${index + 1} is missing productUid`);
      if (!item.quantity || item.quantity <= 0) {
        throw new ValidationError(`Item ${index + 1} has invalid quantity`);
      }
    });
  },

  validateAll: (data: any) => {
    sendOrderToSystemValidator.validateRequiredFields(data, [
      'payMethod',
      'payOnLine',
      'orderDateTime',
      'reservationTime',
      'contactAddress',
      'contactName',
      'contactTel',
      'orderRemark',
      'items',
    ]);
    sendOrderToSystemValidator.validateOrderPayload(data);
    sendOrderToSystemValidator.validateOrderItems(data.items);
  },
};
