import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Stripe from 'stripe';
import { withMiddlewares } from '@/components/common/corsMiddleware';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

const stripeEmbed = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { orderList, totalPrice, id } = JSON.parse(event.body || '{}');

    if (!orderList || !totalPrice || !id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: orderList, totalPrice, or id' }),
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: orderList.map((item: { name: string; price: number; quantity: number }) => ({
        price_data: {
          currency: 'aud',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), 
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_BASE_URL}/success/takeaway`,
      cancel_url: `${process.env.CLIENT_BASE_URL}`,
      metadata: {
        orderId: id,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.error('Error creating Stripe Checkout Session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

export const handler = withMiddlewares(stripeEmbed);
