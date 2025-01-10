import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { sanityClient } from '@/lib/sanityClient';
import { ReservationData } from '@/types';

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
 
  const allowedOrigin = process.env.ALLOW_ORIGIN ||  `*`;

  try {
    const { data, tableId }: { data: ReservationData; tableId?: string } = JSON.parse(event.body || '{}');

    if (!data || !tableId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin, 
        },
        body: JSON.stringify({ error: 'Invalid request payload' }),
      };
    }

    const requiredFields = ['name', 'phone', 'email', 'guests', 'date', 'time'];
    const missingFields = requiredFields.filter((field) => !(data as any)[field]);
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin, 
        },
        body: JSON.stringify({ error: `Missing required fields: ${missingFields.join(', ')}` }),
      };
    }

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

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin, 
      },
      body: JSON.stringify({ message: 'Reservation created successfully' }),
    };
  } catch (error: unknown) {
    console.error('Error creating reservation:', error);


    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin, 
      },
      body: JSON.stringify({
        error: 'Failed to create reservation',
        details: (error as Error).message || 'Unknown error',
      }),
    };
  }
};
