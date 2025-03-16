import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '@/lib/apiHandler';
import { sanityClient } from '@/lib/sanityClient';
import { Attachment } from 'mailgun-js';
import { readFile } from 'fs/promises';
import path from 'path';
import { generateTakeawayOrderEmail } from '@/lib/emailTemplates/generateTakeawayOrderEmail';
import type { EmailContent, OrderDetails } from '@/types';
import { mailgunClient } from '@/lib/mailgunClient';
import { BaseValidator } from '@/components/common/validations/BaseValidator';

const logoImgPath: string = path.join(process.cwd(), 'public', 'logo.png');

export default apiHandler().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { orderId }: { orderId: string } = req.body;

      // Validate the required fields
      BaseValidator.validateRequiredFields(req.body, ['orderId']);
      BaseValidator.validateOrderId(orderId);

      // Fetch order items
      let orderDetails: OrderDetails;
      try {
        orderDetails = await sanityClient.fetch(
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
        );
      } catch (error: unknown) {
        return res
          .status(500)
          .json({
            message: 'Failed to fetch order details.',
            error: (error as Error).message,
          });
      }

      if (!orderDetails) {
        return res
          .status(404)
          .json({ message: 'Order not found.', error: 'Order not found.' });
      }

      // Read logo image asynchronously
      let logoBuffer: Buffer;
      try {
        logoBuffer = await readFile(logoImgPath);
      } catch (error: unknown) {
        return res
          .status(500)
          .json({
            message: 'Failed to read logo image file.',
            error: (error as Error).message,
          });
      }

      // Create logo image as attachment and use cid to embed image in html
      const logoImg: Attachment = new mailgunClient.Attachment({
        data: logoBuffer,
        filename: 'logo.png',
      });

      // Define the email content
      const emailContent: EmailContent = {
        from: `Nanyuan restaurant <${process.env.SENDER_EMAIL}>`,
        to: orderDetails.email,
        subject: 'Order Confirmation',
        html: generateTakeawayOrderEmail(orderDetails, orderId),
        inline: logoImg,
      };

      // Send the email
      await mailgunClient.messages().send(emailContent);
      return res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error: unknown) {
      return res
        .status(500)
        .json({
          message: 'Failed to send email.',
          error: (error as Error).message,
        });
    }
  },
);
