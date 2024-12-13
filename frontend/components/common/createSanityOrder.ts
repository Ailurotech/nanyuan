import { sanityClient } from '@/lib/sanityClient';

interface CreateOrderParams {
  customerName: string;
  email: string;
  items: Array<{ _id: string; quantity: number }>;
  date: string;
  status: string;
}

export const createSanityOrder = async ({
  customerName,
  email,
  items,
  date,
  status,
}: CreateOrderParams) => {
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
    console.log('Order successfully created:', createdOrder);
    return createdOrder;
  } catch (error) {
    console.error('Error creating order in Sanity:', error);
    throw new Error('Failed to create order. Please try again.');
  }
};
