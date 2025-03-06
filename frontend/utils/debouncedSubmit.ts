import { debounce } from 'lodash';

/**
 * debouncedSubmit is a function that delays form submission to prevent multiple
 * rapid submissions. It ensures that the submit action is executed only after a
 * specified delay has passed since the last call.
 *
 * @param {Function} submitFunction - A function that handles form submission (e.g., API call).
 * @param {Object} data - Form data containing name, phone, and message.
 */
export const debouncedSubmit = debounce(
  async (
    submitFunction: (data: {
      name: string;
      phone: string;
      message: string;
    }) => Promise<void>,
    data: { name: string; phone: string; message: string },
  ) => {
    try {
      // Data sanitization (trim spaces, replace multiple spaces with a single space)
      const sanitizedData = {
        name: data.name.trim().replace(/\s+/g, ' '),
        phone: data.phone.trim(),
        message: data.message.trim().replace(/\s+/g, ' '),
      };

      // International phone number regex (allows "+" and up to 15 digits)
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;

      // Input validation
      if (!sanitizedData.name) {
        throw new Error('Name is required.');
      }
      if (!sanitizedData.message) {
        throw new Error('Message cannot be empty.');
      }
      if (!phoneRegex.test(sanitizedData.phone)) {
        throw new Error('Invalid phone number format.');
      }

      // Call the provided submission function
      await submitFunction(sanitizedData);
      console.log('Form submitted successfully!');
    } catch (error: any) {
      console.error('Form submission error:', error.message);
      throw new Error('Something went wrong. Please try again later.');
    }
  },
  500,
);
