import { CreateTakeAwayOrderParams } from '@/types';

export const createTakeAwayOrder = async (orderData: CreateTakeAwayOrderParams) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_CREATE_TAKEAWAY_ORDER_URL || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'Failed to create order');
    }

    const result = await response.json();
    console.log('Order created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};


