import * as z from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2).max(20),

  phone: z
    .string()
    .min(10)
    .max(15)
    .regex(/^\+?[1-9]\d{1,14}$/),

  message: z.string().min(10).max(500),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
