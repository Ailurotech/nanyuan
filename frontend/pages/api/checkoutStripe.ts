import { NextApiRequest, NextApiResponse } from 'next';
import { OrderItem, OrderData } from '@/types';
import { StripeValidator } from '@/components/common/validations/StripeValidator';
import apiHandler from '@/lib/apiHandler';
import { stripe } from '@/lib/stripeClient';
import { errorMap } from '@/error/errorMap';

const checkoutStripe = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const orderData = req.body;
    StripeValidator.validateAll(orderData);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${req.headers.origin}/takeaway?success=true`,
      cancel_url: `${req.headers.origin}/takeaway`,
      customer_email: orderData.email,
      line_items: orderData.items.map((item: OrderItem) => ({
        price_data: {
          currency: 'aud',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        orderId: orderData.orderId,
        phone: orderData.phone,
        name: orderData.name,
        email: orderData.email,
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
