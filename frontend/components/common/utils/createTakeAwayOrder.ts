import { v4 as uuidv4 } from 'uuid';

export async function  CreateTakeAwayOrder({
  data,
  orderList,
  totalPrice,
  status,
  paymentMethod,
  sessionId = null,
  orderId,
}: {
  data: {
    name: string;
    phone: string;
    date: string;
    time: string;
    email: string;
    notes: string;
  };
  orderList: any[];
  totalPrice: string;
  status: 'Offline' | 'Pending';
  paymentMethod: 'offline' | 'online';
  sessionId?: string | null;
  orderId: string;
}) {
  try {
    const orderData = {
      id: orderId,
      customerName: data.name,
      email: data.email,
      items: orderList.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
        _key: uuidv4(),
        menuItem: { _type: 'reference', _ref: item._id },
      })),
      date: `${data.date}T${data.time}`,
      status,
    };

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

    sessionStorage.setItem(
      'orderDetails',
      JSON.stringify({
        id: orderId,
        name: data.name,
        date: data.date,
        time: data.time,
        totalPrice,
        paymentMethod,
        items: orderList,
        sessionId,
      })
    );

    return orderId; 
  } catch (error) {
    console.error('Error handling order:', error);
    throw error;
  }
}
