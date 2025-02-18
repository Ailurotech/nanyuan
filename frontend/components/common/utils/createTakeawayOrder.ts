import axios from 'axios';
import { OrderData, OrderItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function CreateTakeAwayOrder(orderData: OrderData): Promise<string> {
  const apiUrl = '/api/createTakeawayOrder'; 

  try {
    const formattedOrderData = {
      orderId: orderData.orderId, 
      customerName: orderData.name,
      phone: orderData.phone,
      email: orderData.email,
      date: `${orderData.date}T${orderData.time}`, 
      status: orderData.status,
      totalPrice: orderData.totalPrice,
      paymentMethod: orderData.paymentMethod,
      notes: orderData.notes,
      items: orderData.items,
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
