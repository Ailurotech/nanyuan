import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '@/lib/apiHandler';
import { generateReservationEmailToCustomer } from '@/lib/emailTemplates/generateReservationEmailToCustomer';
import { generateReservationEmailToSeller } from '@/lib/emailTemplates/generateReservationEmailToSeller';
import { errorMap } from '@/error/errorMap';
import { sendEmail } from '@/lib/sendEmail';
import type { ReservationInfo } from '@/types';

const sendReservationEmail = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    const reservationInfo: ReservationInfo = req.body;

    await Promise.all([
      sendEmail({
        to: reservationInfo.email,
        subject: 'Reservation Confirmation',
        html: generateReservationEmailToCustomer(reservationInfo),
      }),
      sendEmail({
        to: `${process.env.SENDER_EMAIL}`,
        subject: 'New Reservation Received',
        html: generateReservationEmailToSeller(reservationInfo),
      }),
    ]);

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
    return res.status(500).json({ error: 'Failed to send reservation email' });
  }
};

export default apiHandler().post(sendReservationEmail);
