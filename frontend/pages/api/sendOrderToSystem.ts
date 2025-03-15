import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import crypto from "crypto";
import { yinbaoOrderData } from "@/types";
import apiHandler from "@/lib/apiHandler";

const API_HOST = "https://openapi75.pospal.cn/openinterface/orderOpenApi/addOnLineOrder";
const APP_ID = "C56D0B097D16F7DD4A5EDD88AEDE2FF5";
const APP_KEY = "42985553326968941";

const sendOrderToSystem = async (req: NextApiRequest, res: NextApiResponse) => {
  
    try {
        const timestamp = Date.now().toString();
        const orderData: yinbaoOrderData = req.body;
        console.log(orderData);
        const requestBody = JSON.stringify(orderData);
        const dataSignatureV3 = generateSignature(APP_ID, APP_KEY, timestamp, requestBody);

        const { data } = await axios.post(API_HOST, orderData, {
            headers: {
                "appId": APP_ID,
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

function generateSignature(appId: string, appKey: string, timestamp: string, requestBody: string): string {
    const rawString = appId + appKey + timestamp + requestBody;
    return crypto.createHash("md5").update(rawString, "utf8").digest("hex").toUpperCase();
}
