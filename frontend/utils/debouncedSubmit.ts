import { debounce } from 'lodash';
import { useCallback } from 'react';

const validateName = (name: string) => {
  const sanitizedName = name.trim().replace(/\s+/g, ' ');
  if (!sanitizedName) {
    throw new Error('Name is required.');
  }
  return sanitizedName;
};

const validateMessage = (message: string) => {
  const sanitizedMessage = message.trim().replace(/\s+/g, ' ');
  if (!sanitizedMessage) {
    throw new Error('Message cannot be empty.');
  }
  return sanitizedMessage;
};

const validatePhone = (phone: string) => {
  const sanitizedPhone = phone.trim();
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(sanitizedPhone)) {
    throw new Error('Invalid phone number format.');
  }
  return sanitizedPhone;
};

/**
 * debouncedSubmit is a function that delays form submission to prevent multiple
 * rapid submissions. It ensures that the submit action is executed only after a
 * specified delay has passed since the last call.
 *
 * @param {Function} submitFunction - A function that handles form submission (e.g., API call).
 * @param {Object} data - Form data containing name, phone, and message.
 */
export const useDebouncedSubmit = (
  submitFunction: (data: {
    name: string;
    phone: string;
    message: string;
  }) => Promise<void>,
) => {
  const debouncedSubmit = useCallback(
    debounce(async (data: { name: string; phone: string; message: string }) => {
      try {
        const sanitizedData = {
          name: validateName(data.name),
          phone: validatePhone(data.phone),
          message: validateMessage(data.message),
        };

        await submitFunction(sanitizedData);

        // Only log in development mode
        if (process.env.NODE_ENV === 'development') {
          console.log('Form submitted successfully!');
        }
      } catch (error: any) {
        console.error('Form submission error:', error.message);
        throw new Error('Something went wrong. Please try again later.');
      }
    }, 500),
    [submitFunction],
  );

  return debouncedSubmit;
};
