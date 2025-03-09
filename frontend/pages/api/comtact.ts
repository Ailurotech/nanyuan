import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '@/lib/sanityClient';
import * as z from 'zod';
import { contactFormSchema } from '@/utils/validators';
import apiHandler from '@/lib/apiHandler';
import sanitizeHtml from 'sanitize-html';

type ContactFormData = z.infer<typeof contactFormSchema>;

const handler = apiHandler().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const parsedData = contactFormSchema.parse(req.body);

      const sanitizedData: ContactFormData = {
        name: sanitizeHtml(parsedData.name.trim()),
        phone: sanitizeHtml(parsedData.phone.trim()),
        message: sanitizeHtml(parsedData.message.trim(), {
          allowedTags: [],
          allowedAttributes: {},
        }),
      };

      const result = await sanityClient.create({
        _type: 'contact',
        ...sanitizedData,
      });

      res.status(200).json({
        message: 'Form submitted successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      res.status(400).json({
        message: 'Error processing the form',
        error: error instanceof z.ZodError ? error.errors : 'Invalid request',
      });
    }
  },
);

export default handler;
