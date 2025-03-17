import axios from 'axios';
import { OrderData, yinbaoOrderData } from '@/types';
import dayjs from "dayjs"; 

export async function submitCashOrderToYinbao(orderData: OrderData): Promise<any> {
  try {
    const yinbaoOrder: yinbaoOrderData = {
      payMethod: "Wxpay",
      payOnLine: "1",
      orderRemark: "pay on counter!"+orderData.notes,
      orderDateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),  
      reservationTime: dayjs(orderData.date).format('YYYY-MM-DD HH:mm:ss'), 
      contactAddress: "N/A", 
      contactName: orderData.name,
      contactTel: orderData.phone,
      items: orderData.items.map(item => ({
        barcode: item.barcode?.toString() || "", 
        comment:  "No special request", 
        quantity: item.quantity
      }))
    };

    const response = await axios.post('/api/sendOrderToSystem', yinbaoOrder);
    
    return response.data; 
  } catch (error) {
    console.error("Failed to send Cash order:", error);
    throw error;
  }
}
