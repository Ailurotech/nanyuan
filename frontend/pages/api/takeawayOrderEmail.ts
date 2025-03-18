import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '@/lib/apiHandler';
import { sanityClient } from '@/lib/sanityClient';
import { Attachment } from 'mailgun-js';
import { readFile } from 'fs/promises';
import path from 'path';
import { generateTakeawayOrderEmail } from '@/lib/emailTemplates/generateTakeawayOrderEmail';
import type { EmailContent, OrderDetails } from '@/types';
import { mailgunClient } from '@/lib/mailgunClient';
import { errorMap } from '@/error/errorMap';
import { SanityError } from '@/error/sanityError';
import { ReadFileError } from '@/error/readFileError';

const logoImgPath: string = path.join(process.cwd(), 'public', 'logo.png');

export default apiHandler().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { orderId }: { orderId: string } = req.body;

      const orderDetails: OrderDetails = await sanityClient
        .fetch(
          `
            *[_type == "order" && orderId == $orderId][0] {
              customerName,
              email,
              phone,
              date,
              totalPrice,
              paymentMethod,
              status,
              notes,
              items[] {
                menuItemName,
                price,
                quantity
              },
            }
          `,
          { orderId },
        )
        .catch(() => {
          throw new SanityError('Failed to fetch order details');
        });

      const logoBuffer: Buffer = await readFile(logoImgPath).catch(() => {
        throw new ReadFileError('Failed to read logo image file');
      });

      const logoImg: Attachment = new mailgunClient.Attachment({
        data: logoBuffer,
        filename: 'logo.png',
      });

      const emailContent: EmailContent = {
        from: `Nanyuan restaurant <${process.env.SENDER_EMAIL}>`,
        to: orderDetails.email,
        subject: 'Order Confirmation',
        html: generateTakeawayOrderEmail(orderDetails, orderId),
        inline: logoImg,
      };

      await mailgunClient.messages().send(emailContent);
      return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error: unknown) {
      console.error(
        'Failed to send takeaway order email.',
        (error as Error).message,
      );
      if (error instanceof Error) {
        const errorName = error.name;
        const errorInfo = errorMap.get(errorName);
        return res.status(errorInfo?.status || 500).json({
          error: errorInfo?.message || 'Failed to send takeaway order email',
        });
      }
      return res
        .status(500)
        .json({ error: 'Failed to send takeaway order email' });
    }
  },
);
