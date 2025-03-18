import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '@/lib/apiHandler';
import { Attachment } from 'mailgun-js';
import { readFile } from 'fs/promises';
import path from 'path';
import { generateReservationEmail } from '@/lib/emailTemplates/generateReservationEmail';
import type { EmailContent, ReservationInfo } from '@/types';
import { mailgunClient } from '@/lib/mailgunClient';
import { errorMap } from '@/error/errorMap';
import { ReadFileError } from '@/error/readFileError';

const logoImgPath: string = path.join(process.cwd(), 'public', 'logo.png');

export default apiHandler().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const reservationInfo: ReservationInfo = req.body;

      const logoBuffer: Buffer = await readFile(logoImgPath).catch(() => {
        throw new ReadFileError('Failed to read logo image file');
      });

      const logoImg: Attachment = new mailgunClient.Attachment({
        data: logoBuffer,
        filename: 'logo.png',
      });

      const emailContent: EmailContent = {
        from: `Nanyuan restaurant <${process.env.SENDER_EMAIL}>`,
        to: reservationInfo.email,
        subject: 'Reservation Confirmation',
        html: generateReservationEmail(reservationInfo),
        inline: logoImg,
      };

      await mailgunClient.messages().send(emailContent);
      return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error: unknown) {
      console.error(
        'Failed to send reservation email.',
        (error as Error).message,
      );
      if (error instanceof Error) {
        const errorName = error.name;
        const errorInfo = errorMap.get(errorName);
        return res.status(errorInfo?.status || 500).json({
          error: errorInfo?.message || 'Failed to send reservation email',
        });
      }
      return res
        .status(500)
        .json({ error: 'Failed to send reservation email' });
    }
  },
);
