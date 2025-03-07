import { debounce } from 'lodash';
import { useCallback } from 'react';

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
          name: data.name.trim().replace(/\s+/g, ' '),
          phone: data.phone.trim(),
          message: data.message.trim().replace(/\s+/g, ' '),
        };

        const phoneRegex = /^\+?[1-9]\d{1,14}$/;

        if (!sanitizedData.name) {
          throw new Error('Name is required.');
        }
        if (!sanitizedData.message) {
          throw new Error('Message cannot be empty.');
        }
        if (!phoneRegex.test(sanitizedData.phone)) {
          throw new Error('Invalid phone number format.');
        }

        await submitFunction(sanitizedData);
        console.log('Form submitted successfully!');
      } catch (error: any) {
        console.error('Form submission error:', error.message);
        throw new Error('Something went wrong. Please try again later.');
      }
    }, 500),
    [submitFunction],
  );

  return debouncedSubmit;
};
