import { BaseValidator } from './BaseValidator';
import { ValidationError } from '@/error/validationError';
import validator from 'validator';

export const ContactValidator = {
  ...BaseValidator,

  validateName: (name: string) => {
    if (!name || typeof name !== 'string' || name.length < 2) {
      throw new ValidationError('Name must be at least 2 characters');
    }
  },

  validatePhone: (phone: string) => {
    if (!validator.isMobilePhone(phone, 'any', { strictMode: false })) {
      throw new ValidationError('Invalid phone format');
    }
  },

  validateMessage: (message: string) => {
    if (!message || typeof message !== 'string' || message.length < 10) {
      throw new ValidationError('Message must be at least 10 characters');
    }
  },

  validateAll: (data: any) => {
    ContactValidator.validateRequiredFields(data, ['name', 'phone', 'message']);
    ContactValidator.validateName(data.name);
    ContactValidator.validatePhone(data.phone);
    ContactValidator.validateMessage(data.message);
  },
};
