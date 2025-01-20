import { APIGatewayProxyHandler } from 'aws-lambda';
import { sanityClient } from '@/lib/sanityClient';
import { withMiddlewares } from '@/components/common/corsMiddleware';

export const createTakeawayOrder: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is empty' }),
      };
    }

    const requestData = JSON.parse(event.body);
    const { orderId, customerName, phone, email, items, date, status, totalPrice, paymentMethod, notes } = requestData;

    if (!orderId || !customerName || !phone || !email || !items || !date || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    await sanityClient.create({
      _type: 'order',
      _id: orderId,
      customerName,
      phone,
      email,
      items,
      date,
      status,
      totalPrice,
      paymentMethod,
      notes,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order created successfully' }),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const handler = withMiddlewares(createTakeawayOrder);
