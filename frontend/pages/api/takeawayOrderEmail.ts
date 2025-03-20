import { NextApiRequest, NextApiResponse } from 'next';
import apiHandler from '@/lib/apiHandler';
import { sanityClient } from '@/lib/sanityClient';
import { generateTakeawayOrderEmail } from '@/lib/emailTemplates/generateTakeawayOrderEmail';
import type { OrderDetails } from '@/types';
import { errorMap } from '@/error/errorMap';
import { SanityError } from '@/error/sanityError';
import { sendEmail } from '@/lib/sendEmail';

const sendTakeawayOrderEmail = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
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
        throw new SanityError(
          'Failed to send email: Failed to fetch order details',
        );
      });

    await sendEmail({
      to: orderDetails.email,
      subject: 'Order Confirmation',
      html: generateTakeawayOrderEmail(orderDetails, orderId),
    });

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
};

export default apiHandler().post(sendTakeawayOrderEmail);
