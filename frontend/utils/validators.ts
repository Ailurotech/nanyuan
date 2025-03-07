import * as z from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  message: z.string().min(1, 'Message is required'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
