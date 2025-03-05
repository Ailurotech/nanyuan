import { debounce } from 'lodash';
import { sanityClient } from '@/lib/sanityClient';
/**
 * debouncedSubmit is a function that delays the execution of the submit logic to avoid
 * multiple calls to the submit function within a short period. It’s useful for optimizing
 * performance when submitting forms or handling user input in rapid succession (e.g., typing).
 * This function makes sure that the submit action is executed only after a specified delay
 * has passed since the last call.
 *
 * @param {Function} submit - The actual function that will be called after the debounce delay.
 * @param {number} delay - The debounce delay in milliseconds. Default is 500ms.
 *
 * Example Usage:
 * const handleSubmit = debouncedSubmit(submitForm, 500);
 * handleSubmit(); // Will only trigger submitForm() after 500ms delay.
 */
export const debouncedSubmit = debounce(async (data: any) => {
  try {
    await sanityClient.create({ _type: 'contact', ...data });
  } catch (error) {
    throw new Error('Something went wrong. Please try again later.');
  }
}, 500);
