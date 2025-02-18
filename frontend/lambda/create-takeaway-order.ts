import { APIGatewayProxyHandler } from 'aws-lambda';
import { sanityClient } from '@/lib/sanityClient';
import { withMiddlewares } from '@/components/common/corsMiddleware';
import { v4 as uuidv4 } from 'uuid';

export const createTakeawayOrder: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is empty' }),
      };
    }

    const requestData = JSON.parse(event.body);
    const {
      orderId,
      customerName,
      phone,
      email,
      items,
      date,
      status,
      totalPrice,
      paymentMethod,
      notes,
    } = requestData;

    if (
      !orderId ||
      !customerName ||
      !phone ||
      !email ||
      !items ||
      !date ||
      !status ||
      !totalPrice ||
      !paymentMethod
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const formattedItems = items.map((item: any) => {
      if (!item.menuItem || !item.quantity || item.price == null) {
        throw new Error(
          'Each item must contain menuItem, quantity, and price.',
        );
      }
      return {
        _type: 'object',
        _key: uuidv4(),
        menuItem: { _type: 'reference', _ref: item.menuItem._ref },
        quantity: item.quantity,
        price: item.price,
      };
    });

    await sanityClient.create({
      _type: 'order',
      _id: orderId,
      customerName,
      phone,
      email,
      items: formattedItems,
      date,
      status,
      totalPrice,
      paymentMethod,
      notes: notes || '',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order created successfully' }),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        details: (error as Error).message,
      }),
    };
  }
};

export const handler = withMiddlewares(createTakeawayOrder);
