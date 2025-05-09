import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { YinbaoOrderPayload } from '@/types';
import apiHandler from '@/lib/apiHandler';
import { generateSignatureV2 } from '@/components/common/utils/generateSignature';
import JSONbig from 'json-bigint';
import { sendOrderToSystemValidator } from '@/components/common/validations/sendOrderToSystemValidator';

const SEND_ORDER_API_HOST = process.env.SEND_ORDER_API_HOST as string;
const APP_ID = process.env.SEND_ORDER_APP_ID as string;
const APP_KEY = process.env.SEND_ORDER_APP_KEY as string;

const sendOrderToSystem = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const timestamp = Date.now().toString();
    let orderData: YinbaoOrderPayload = req.body;
    sendOrderToSystemValidator.validateAll(orderData);

    const dataSignatureV3 = generateSignatureV2(
      APP_ID,
      APP_KEY,
      timestamp,
      JSON.stringify(orderData),
    );
    const { data } = await axios.post(SEND_ORDER_API_HOST, orderData, {
      headers: {
        appId: APP_ID,
        'User-Agent': 'openApi',
        'Content-Type': 'application/json',
        'time-stamp': timestamp,
        'data-signature-v3': dataSignatureV3,
        'accept-encoding': 'gzip,deflate',
      },
    });

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error(
      'Error sending order to system:',
      error.response?.data || error.message,
    );
    res
      .status(500)
      .json({ success: false, message: error.response?.data || error.message });
  }
};

export default apiHandler().post(sendOrderToSystem);
