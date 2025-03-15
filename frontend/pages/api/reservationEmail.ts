import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '@/lib/apiHandler';
import mailgun, { Attachment } from 'mailgun-js';
import { readFile } from 'fs/promises';
import path from 'path';
import {
  generateReservationEmail,
  ReservationInfo,
} from '@/lib/emailTemplates/generateReservationEmail';

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
      const reservationInfo: ReservationInfo = req.body;

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

      // Define email content
      const emailContent: EmailContent = {
        from: `Nanyuan restaurant <${process.env.SENDER_EMAIL}>`,
        to: reservationInfo.email,
        subject: 'Reservation Confirmation',
        html: generateReservationEmail(reservationInfo),
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
