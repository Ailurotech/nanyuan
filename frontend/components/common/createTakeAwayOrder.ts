import { sanityClient } from '@/lib/sanityClient';

interface CreateTakeAwayOrderParams {
  customerName: string;
  email: string;
  items: Array<{ _id: string; quantity: number }>;
  date: string;
  status: string;
}

export const createTakeAwayOrder = async ({
  customerName,
  email,
  items,
  date,
  status,
}: CreateTakeAwayOrderParams) => {
  try {
    const createdOrder = await sanityClient.create({
      _type: 'order',
      customerName,
      email,
      items: items.map((item) => ({
        _type: 'reference',
        _ref: item._id,
        _key: item._id,
      })),
      date,
      status,
    });
    const orderId = createdOrder._id;
    return orderId;
  } catch (error) {
    console.error('Error creating order in Sanity:', error);
    throw new Error('Failed to create order. Please try again.');
  }
};
