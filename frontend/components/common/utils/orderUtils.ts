import { createTakeAwayOrder } from '@/components/common/createTakeAwayOrder';
import { v4 as uuidv4 } from 'uuid';

export async function processOrder({
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

  await createTakeAwayOrder({
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
  });


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
}
