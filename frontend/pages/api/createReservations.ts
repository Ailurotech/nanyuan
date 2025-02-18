import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '@/lib/sanityClient';
import { ReservationData } from '@/types';
import { withMiddlewares } from '@/components/common/corsMiddleware'; // 确保你有一个 Next.js 兼容的 CORS 中间件

const createReservation = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { data, tableId }: { data: ReservationData; tableId?: string } =
      req.body;

    if (!data || !tableId) {
      return res.status(400).json({
        error: 'Invalid request payload: data and tableId are required',
      });
    }

    const requiredFields = ['name', 'phone', 'email', 'guests', 'date', 'time'];
    const missingFields = requiredFields.filter(
      (field) => !(data as any)[field],
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    await sanityClient.create({
      _type: 'reservation',
      ...data,
    });

    return res
      .status(200)
      .json({ message: 'Reservation created successfully' });
  } catch (error: unknown) {
    console.error('Error creating reservation:', error);

    return res.status(500).json({
      error: 'Failed to create reservation',
      details: (error as Error).message || 'Unknown error',
    });
  }
};

export default withMiddlewares(createReservation);
