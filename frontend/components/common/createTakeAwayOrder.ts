import { sanityClient } from '@/lib/sanityClient';

interface CreateTakeAwayOrderParams {
  customerName: string;
  email: string;
  items: Array<{
    _id: string; 
    quantity: number; 
    _key: string; 
    menuItem: { _type: string; _ref: string }; 
  }>;
  date: string;
  status: string;
  id: string;
}


export const createTakeAwayOrder = async ({
  customerName,
  email,
  items,
  date,
  status,
  id,
}: CreateTakeAwayOrderParams) => {
  try {
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

    console.log('Order successfully created:', createdOrder);
    return createdOrder;
  } catch (error) {
    console.error('Error creating order in Sanity:', error);
    throw new Error('Failed to create order. Please try again.');
  }
};

