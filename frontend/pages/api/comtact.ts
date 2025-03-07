import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '@/lib/sanityClient';
import * as z from 'zod';
import { contactFormSchema } from '@/utils/validators';

type ContactFormData = z.infer<typeof contactFormSchema>;

// API handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Parse and validate the data using Zod
    const parsedData = contactFormSchema.parse(req.body);

    const sanitizedData: ContactFormData = {
      name: parsedData.name.trim(),
      phone: parsedData.phone.trim(),
      message: parsedData.message.trim().replace(/<[^>]*>/g, ''),
    };

    // Store data in Sanity
    const result = await sanityClient.create({
      _type: 'contact',
      ...sanitizedData,
    });

    res
      .status(200)
      .json({ message: 'Form submitted successfully', data: result });
  } catch (error) {
    console.error('Error submitting form:', error);
    res
      .status(400)
      .json({
        message: 'Error processing the form',
        error: 'Internal server error',
      });
  }
}
