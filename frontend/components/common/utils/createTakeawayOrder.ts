import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { OrderData } from '@/types';

export async function CreateTakeAwayOrder(orderData: OrderData): Promise<string> {
  const apiUrl = process.env.NEXT_PUBLIC_CREATE_TAKEAWAY_ORDER_URL;
  if (!apiUrl) {
    throw new Error('API URL is not defined in environment variables.');
  }

  try {
    const formattedOrderData = {
      orderId: orderData.orderId,  
      customerName: orderData.name,
      phone: orderData.phone,
      email: orderData.email,
      items: orderData.items.map((item) => ({
        menuItem: { _type: 'reference', _ref: item._id },
        quantity: item.quantity,
        _key: uuidv4(),
        price: item.price,
      })),
      date: `${orderData.date}T${orderData.time}`,  
      status: orderData.status,
      totalPrice: orderData.totalPrice,
      paymentMethod: orderData.paymentMethod,
      notes: orderData.notes || '',
    };

    const response = await axios.post(apiUrl, formattedOrderData, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 200) {
      return formattedOrderData.orderId;
    } else {
      throw new Error(`Order submission failed with status ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to create order:', error);
    throw new Error('Failed to create order. Please try again.');
  }
}
