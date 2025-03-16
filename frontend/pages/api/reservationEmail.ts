import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '@/lib/apiHandler';
import { Attachment } from 'mailgun-js';
import { readFile } from 'fs/promises';
import path from 'path';
import { generateReservationEmail } from '@/lib/emailTemplates/generateReservationEmail';
import type { EmailContent, ReservationInfo } from '@/types';
import { mailgunClient } from '@/lib/mailgunClient';

const logoImgPath: string = path.join(process.cwd(), 'public', 'logo.png');

export default apiHandler().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const reservationInfo: ReservationInfo = req.body;

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
      return res
        .status(500)
        .json({
          message: 'Failed to send email.',
          error: (error as Error).message,
        });
    }
  },
);
