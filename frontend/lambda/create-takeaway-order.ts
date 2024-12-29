import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { sanityClient } from '@/lib/sanityClient';
import { CreateTakeAwayOrderParams } from '@/types';

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  const allowedOrigin = process.env.ALLOW_ORIGIN || '*';

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
      body: '',
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { customerName, email, items, date, status, id }: CreateTakeAwayOrderParams = body;

    if (!customerName || !email || !items || !date || !status || !id) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
        },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const createdOrder = await sanityClient.createIfNotExists({
      _type: 'order',
      _id: id,
      customerName,
      email,
      items: items.map((item) => ({
        _type: 'object',
        _key: item._id,
        menuItem: {
          _type: 'reference',
          _ref: item._id,
        },
        quantity: item.quantity,
      })),
      date,
      status,
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
      },
      body: JSON.stringify({
        message: 'Order successfully created',
        order: createdOrder,
      }),
    };
  } catch (error) {
    console.error('Error creating order:', error);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
      },
      body: JSON.stringify({
        error: 'Failed to create order',
        details: (error as Error).message || 'Unknown error',
      }),
    };
  }
};
