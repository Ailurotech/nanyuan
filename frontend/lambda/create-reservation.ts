import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { sanityClient } from '@/lib/sanityClient';
import { ReservationData } from '@/types';

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  // 允许的跨域来源（从环境变量读取或设置为默认值）
  const allowedOrigin = process.env.ALLOW_ORIGIN || 'https://www.google.com';

  try {
    const { data, tableId }: { data: ReservationData; tableId?: string } = JSON.parse(event.body || '{}');

    // 检查请求有效性
    if (!data || !tableId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin, // 设置 CORS 响应头
        },
        body: JSON.stringify({ error: 'Invalid request payload' }),
      };
    }

    // 检查必填字段
    const requiredFields = ['name', 'phone', 'email', 'guests', 'date', 'time'];
    const missingFields = requiredFields.filter((field) => !(data as any)[field]);
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin, // 设置 CORS 响应头
        },
        body: JSON.stringify({ error: `Missing required fields: ${missingFields.join(', ')}` }),
      };
    }

    // 创建预订记录
    await sanityClient.create({
      _type: 'reservation',
      name: data.name,
      phone: data.phone,
      email: data.email,
      guests: data.guests,
      preference: data.preference || '',
      notes: data.notes || '',
      time: `${data.date}T${data.time}`,
      table: {
        _type: 'reference',
        _ref: tableId,
      },
    });

    // 成功响应
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin, // 设置 CORS 响应头
      },
      body: JSON.stringify({ message: 'Reservation created successfully' }),
    };
  } catch (error: unknown) {
    console.error('Error creating reservation:', error);

    // 错误响应
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin, // 设置 CORS 响应头
      },
      body: JSON.stringify({
        error: 'Failed to create reservation',
        details: (error as Error).message || 'Unknown error',
      }),
    };
  }
};
