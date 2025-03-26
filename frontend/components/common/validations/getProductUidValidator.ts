import { ValidationError } from '@/error/validationError';
import { BaseValidator } from './BaseValidator';
import { OrderValidator } from './OrderValidator';

export const getProductUidValidator = {
  ...BaseValidator,

  validateRequiredFields: (data: any) => {
    OrderValidator.validateRequiredFields(data, ['barcodes']);
  },

  validateBarcodes: (barcodes: string[]) => {
    if (!Array.isArray(barcodes) || barcodes.length === 0)
      throw new ValidationError('Invalid barcode structure');
  },

  validateAll: (data: any) => {
    getProductUidValidator.validateRequiredFields(data);
    getProductUidValidator.validateBarcodes(data.barcodes);
  },
};
