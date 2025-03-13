import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '@/lib/sanityClient';
import { contactFormSchema } from '@/utils/validators';
import { errorMap } from '@/error/errorMap';
import apiHandler from '@/lib/apiHandler';
import { z } from 'zod';

const submitContactForm = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = req.body;

    const validatedData = contactFormSchema.parse(data);
    await sanityClient.create({ _type: 'contact', ...validatedData });

    return res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      const isMissingFieldError = firstError.code === 'invalid_type';
      return res
        .status(isMissingFieldError ? 400 : 422)
        .json({ error: firstError.message });
    }
    if (error instanceof Error) {
      const errorInfo = errorMap.get(error.name);
      return res
        .status(errorInfo?.status || 500)
        .json({ error: errorInfo?.message || 'Internal server error' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default apiHandler().post(submitContactForm);
