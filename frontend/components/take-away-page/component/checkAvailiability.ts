import { OrderItem } from '@/types';
import { DateTime } from 'luxon';

interface ValidationResult {
  success: boolean;
  errorMessage?: string;
}

export const validateOTP = (otp: boolean): ValidationResult => {
  return otp
    ? { success: true }
    : { success: false, errorMessage: 'OTP not verified' };
};

export const validatePickUpTime = (
  pickUpDate: string,
  pickUpTime: string,
): ValidationResult => {
  const now = DateTime.now();
  const pickUpDateTime = DateTime.fromISO(`${pickUpDate}T${pickUpTime}`);

  if (pickUpDateTime <= now) {
    return { success: false, errorMessage: 'Cannot pick up in the past.' };
  } else if (pickUpDateTime < now.plus({ hours: 0.5 })) {
    return {
      success: false,
      errorMessage: 'Pick-up time must be at least 30 minutes from now.',
    };
  }
  return { success: true };
};

export const validatePrice = (price: number): ValidationResult => {
  if (price <= 0) {
    return { success: false, errorMessage: 'Price must be greater than zero.' };
  } else if (price >= 1000) {
    return { success: false, errorMessage: 'Please call us to order.' };
  }
  return { success: true };
};

export const validateOrderItem = (orderItem: OrderItem[]): ValidationResult => {
  if (orderItem.length === 0) {
    return { success: false, errorMessage: 'Please add at least one item to your order.' };
  }
  return { success: true };
};

export const runValidations = async (
  validations: (() => ValidationResult)[],
): Promise<void> => {
  validations.forEach((validation) => {
    const result = validation();
    if (!result.success && result.errorMessage) {
      alert(result.errorMessage);
      throw new Error(result.errorMessage);
    }
  });
};
