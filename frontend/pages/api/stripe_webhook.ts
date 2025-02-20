import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { sanityClient } from '@/lib/sanityClient';
import { buffer } from 'node:stream/consumers';
import apiHandler from '@/lib/apiHandler';
export const config = {
  api: {
    bodyParser: false,
  },
};
const sessionStatus = {
  'checkout.session.completed': 'Paid',
  'checkout.session.expired': 'Cancelled',
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia',
});

export default apiHandler().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const sig = req.headers['stripe-signature'];
    const rawBody = await buffer(req);

    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          await sanityClient
            .patch(orderId)
            .set({ status: sessionStatus[event.type] })
            .commit();

          console.log(
            `Sanity Order Updated: ${orderId} → ${sessionStatus[event.type]}`,
          );
        } else {
          console.warn('No orderId found in metadata');
        }
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('❌ Stripe Webhook Error:', error);
      res.status(400).json({ error: 'Webhook Error' });
    }
  },
);
