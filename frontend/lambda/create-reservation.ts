import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { sanityClient } from '@/lib/sanityClient';
import { withMiddlewares } from '@/components/common/corsMiddleware';
import { ReservationData } from '@/types';


const createReservation: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const { data, tableId }: { data: ReservationData; tableId?: string } = JSON.parse(event.body || '{}');

    if (!data || !tableId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request payload: data and tableId are required' }),
      };
    }

    const requiredFields = ['name', 'phone', 'email', 'guests', 'date', 'time'];
    const missingFields = requiredFields.filter((field) => !(data as any)[field]);
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
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
      body: JSON.stringify({ message: 'Reservation created successfully' }),
    };
  } catch (error: unknown) {
    console.error('Error creating reservation:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to create reservation',
        details: (error as Error).message || 'Unknown error',
      }),
    };
  }
};

export const handler = withMiddlewares(createReservation);
