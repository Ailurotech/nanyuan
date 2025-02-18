import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '@/lib/sanityClient';
import { withMiddlewares } from '@/components/common/corsMiddleware';

const createTakeawayOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { orderId, customerName, phone, email, items, date, status, totalPrice, paymentMethod, notes } = req.body;

    const requiredFields = ['orderId', 'customerName', 'phone', 'email', 'items', 'date', 'status', 'totalPrice', 'paymentMethod']; 
    const missingFields = requiredFields.filter((field) => !(req.body as any)[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    await sanityClient.create({
      ...req.body,
      _type: 'order',
      _id: orderId,
    });

    return res.status(200).json({ message: 'Order created successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
};

export default withMiddlewares(createTakeawayOrder);
