import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string({ required_error: 'Missing required field' })
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  phone: z
    .string({ required_error: 'Missing required field' })
    .min(1, 'Phone is required')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone format'),
  message: z
    .string({ required_error: 'Missing required field' })
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
