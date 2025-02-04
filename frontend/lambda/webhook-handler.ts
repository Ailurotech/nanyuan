import Stripe from 'stripe';
import { sanityClient } from '@/lib/sanityClient';
import { withMiddlewares } from '@/components/common/corsMiddleware';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

const statusMap: Record<string, string> = {
  'checkout.session.completed': 'Paid', 
  'checkout.session.expired': 'Cancelled',  
};

export const webhookHandler = async (event: any) => {
  console.log('Stripe Webhook Received:', JSON.stringify(event, null, 2));
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const sig = event.headers['Stripe-Signature'];

  let stripeEvent: Stripe.Event;

  try {

    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Webhook signature verification failed:', err.message);
      return {
        statusCode: 400,
        body: `Webhook signature verification failed: ${err.message}`,
      };
    }
    console.error('Unexpected error during webhook verification:', err);
    return {
      statusCode: 400,
      body: 'Unexpected error during webhook verification.',
    };
  }

  console.log('Stripe Event Received:', JSON.stringify(stripeEvent, null, 2));

  const newStatus = statusMap[stripeEvent.type];
  if (!newStatus) {
    console.warn(`Unhandled event type: ${stripeEvent.type}`);
    return {
      statusCode: 200,
      body: `Unhandled event type: ${stripeEvent.type}`,
    };
  }

  

  const metadata = (stripeEvent.data.object as any).metadata;
  if (!metadata || !metadata.orderId) {
    console.error('Invalid metadata:', metadata);
    return { statusCode: 400, body: 'Invalid metadata' };
  }
  const orderId = metadata?.orderId;

  

  try {
    const result = await sanityClient
      .patch(orderId) 
      .set({ status: newStatus }) 
      .commit();

    console.log(`Order ${orderId} has been updated to ${newStatus}:`, result);

    return {
      statusCode: 200,
      body: `Order ${orderId} successfully updated to ${newStatus}.`,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to update order status:', error.message);
      return {
        statusCode: 500,
        body: `Failed to update order status: ${error.message}`,
      };
    }
    console.error('Unexpected error while updating order status:', error);
    return {
      statusCode: 500,
      body: 'Unexpected error while updating order status.',
    };
  }
}

