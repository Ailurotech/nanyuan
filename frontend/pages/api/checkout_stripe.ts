import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { OrderData } from '@/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const requiredFields = ['orderId', 'email', 'name', 'phone', 'items'];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ error: `Missing required field: ${field}` });
    }
  }

  try {
    const order: OrderData = req.body;

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: 'aud',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${req.headers.origin}/order-success`,
      cancel_url: `${req.headers.origin}/takeaway`,
      customer_email: order.email,
      line_items: lineItems,
      metadata: {
        orderId: order.orderId,
        phone: order.phone,
        name: order.name,
        email: order.email,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
