import axios from 'axios';
import { OrderData, YinbaoOrderPayload } from '@/types';
import dayjs from 'dayjs';
import { yinBaoSystemError } from '@/error/yinbaoSystemError';
export async function submitOrderToYinbao(
  orderData: OrderData,
  paid: boolean = false,
): Promise<any> {
  try {
    const yinbaoOrder: YinbaoOrderPayload = {
      payMethod: 'Wxpay',
      payOnLine: '1',
      orderRemark: `${paid ? 'paid!' : 'pay on counter!'} ${orderData.notes}`,
      orderDateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      reservationTime: dayjs(orderData.date).format('YYYY-MM-DD HH:mm:ss'),
      contactAddress: 'N/A',
      contactName: orderData.name,
      contactTel: orderData.phone,
      items: orderData.items.map((item) => ({
        barcode: item.barcode?.toString(),
        comment: 'No special request',
        quantity: item.quantity,
        productUid: item.productUid,
      })),
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/api/sendOrderToSystem`,
      yinbaoOrder,
    );

    return response.data;
  } catch (error) {
    console.error('Failed to send Cash order:', error);
    throw new yinBaoSystemError('Failed to send Cash order');
  }
}
