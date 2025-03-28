import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'node:stream/consumers';
import apiHandler from '@/lib/apiHandler';
import { stripe } from '@/lib/stripeClient';
import { sanityClient } from '@/lib/sanityClient';
import { Stripe } from 'stripe';
import { errorMap } from '@/error/errorMap';
import { WebhookValidator } from '@/components/common/validations/webhookValidator';
import { EmailError } from '@/error/emailError';
import axios from 'axios';
export const config = {
  api: {
    bodyParser: false,
  },
};

const sessionStatusMap: Record<string, string> = {
  'checkout.session.completed': 'Paid',
  'checkout.session.expired': 'Cancelled',
};

const stripeWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const sig = req.headers['stripe-signature'];
    const rawBody = await buffer(req);

    WebhookValidator.validateAll(rawBody, sig as string);

    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );

    const newStatus = sessionStatusMap[event.type];

    if (newStatus) {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      await sanityClient
        .patch(orderId as string)
        .set({ status: newStatus })
        .commit();

      await axios
        .post(`${process.env.CLIENT_BASE_URL}/api/takeawayOrderEmail`, {
          orderId,
        })
        .catch(() => {
          throw new EmailError('Failed to send email');
        });
    }

    res.status(200).json({ received: true });
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

export default apiHandler().post(stripeWebhook);
