import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '@/lib/apiHandler';
import { sanityClient } from '@/lib/sanityClient';
import mailgun, { Attachment } from 'mailgun-js';
import { readFile } from 'fs/promises';
import path from 'path';
import {
  generateTakeawayOrderEmail,
  OrderDetails,
} from '@/lib/emailTemplates/generateTakeawayOrderEmail';

// Configuration for Mailgun
const mailgunClient = mailgun({
  apiKey: process.env.MAILGUN_API_KEY as string,
  domain: process.env.MAILGUN_DOMAIN as string,
});

// type for EmailContent
interface EmailContent {
  from: string;
  to: string;
  subject: string;
  html: string;
  inline?: Attachment;
}

const logoImgPath: string = path.join(process.cwd(), 'public', 'logo.png');

export default apiHandler().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { orderId }: { orderId: string } = req.body;

      // Validate the required fields
      if (!orderId) {
        return res
          .status(400)
          .json({ error: 'Missing required field: orderId' });
      }

      // Fetch order items
      const orderDetails: OrderDetails = await sanityClient.fetch(
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

      // Read logo image asynchronously
      let logoBuffer: Buffer;
      try {
        logoBuffer = await readFile(logoImgPath);
      } catch {
        return res
          .status(500)
          .json({ error: 'Failed to read logo image file.' });
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
      return res.status(500).json({ error: 'Failed to send email.' });
    }
  },
);
