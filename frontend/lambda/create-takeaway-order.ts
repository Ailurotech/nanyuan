import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { sanityClient } from '@/lib/sanityClient';
import { CreateTakeAwayOrderParams } from '@/types';

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    // 解析请求体
    const body = JSON.parse(event.body || '{}');
    const { customerName, email, items, date, status, id }: CreateTakeAwayOrderParams = body;

    // 验证请求数据
    if (!customerName || !email || !items || !date || !status || !id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // 创建订单
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
      body: JSON.stringify({
        message: 'Order successfully created',
        order: createdOrder,
      }),
    };
  } catch (error) {
    console.error('Error creating order:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to create order',
        details: (error as Error).message || 'Unknown error',
      }),
    };
  }
};
