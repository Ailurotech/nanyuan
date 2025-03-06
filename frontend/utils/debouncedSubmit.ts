import { debounce } from 'lodash';
import { sanityClient } from '@/lib/sanityClient';

/**
 * debouncedSubmit is a function that delays form submission to prevent multiple
 * rapid submissions. It ensures that the submit action is executed only after a
 * specified delay has passed since the last call.
 *
 * @param {Object} data - Form data containing name, phone, and message.
 *
 * Example Usage:
 * const handleSubmit = debouncedSubmit(submitForm, 500);
 * handleSubmit(); // Will only trigger submitForm() after 500ms delay.
 */
export const debouncedSubmit = debounce(
  async (data: { name: string; phone: string; message: string }) => {
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

      // Submit to Sanity
      await sanityClient.create({ _type: 'contact', ...sanitizedData });
      console.log('Form submitted successfully!');
    } catch (error: any) {
      console.error('Form submission error:', error.message);
      throw new Error('Something went wrong. Please try again later.');
    }
  },
  500,
);
