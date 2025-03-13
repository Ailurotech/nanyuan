import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string()
    .nonempty('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .nonempty('Phone is required')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone format'),
  message: z
    .string()
    .nonempty('Message is required')
    .min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
