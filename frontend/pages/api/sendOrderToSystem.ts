import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { yinbaoOrderData } from "@/types";
import apiHandler from "@/lib/apiHandler";
import { generateSignature } from "@/components/common/utils/generateSignature";


const sendOrderToSystem = async (req: NextApiRequest, res: NextApiResponse) => {
  
    try {
        const timestamp = Date.now().toString();
        const orderData: yinbaoOrderData = req.body;
        const requestBody = JSON.stringify(orderData);


        
        const dataSignatureV3 = generateSignature(process.env.SEND_ORDER_APP_ID as string, process.env.SEND_ORDER_APP_KEY as string, timestamp, requestBody);


        const { data } = await axios.post(process.env.SEND_ORDER_API_HOST as string, orderData, {
            headers: {
                "appId": process.env.SEND_ORDER_APP_ID as string,
                "User-Agent": "openApi",
                "Content-Type": "application/json",
                "time-stamp": timestamp,
                "data-signature-v3": dataSignatureV3,
                "accept-encoding": "gzip,deflate",
            },
        });
        console.log(data);

        res.status(200);

    } catch (error: any) {
        console.error("Order submission error:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: error.response?.data || error.message,
        });
    }
}

export default apiHandler().post(sendOrderToSystem);

