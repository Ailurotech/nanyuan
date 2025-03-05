import { NextApiRequest, NextApiResponse } from 'next';
import { OrderItem } from '@/types';
import { StripeValidator } from '@/components/common/validations/StripeValidator';
import apiHandler from '@/lib/apiHandler';
import { stripe } from '@/lib/stripeClient';
import { errorMap } from '@/error/errorMap';

const checkoutStripe = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = req.body;
    StripeValidator.validateAll(data);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${req.headers.origin}/order-success`,
      cancel_url: `${req.headers.origin}/takeaway`,
      customer_email: data.email,
      line_items: data.items.map((item: OrderItem) => ({
        price_data: {
          currency: 'aud',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        orderId: data.orderId,
        phone: data.phone,
        name: data.name,
        email: data.email,
      },
    });
    res.status(200).json({ url: session.url });
  } catch (error) {
    if (error instanceof Error) {
      const errorName = error.name;
      const errorInfo = errorMap.get(errorName);
      return res
        .status(errorInfo?.status || 500)
        .json({ error: errorInfo?.message || 'Internal server error' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default apiHandler().post(checkoutStripe);
