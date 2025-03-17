import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { yinbaoOrderData, yinbaoOrderItem } from "@/types";
import apiHandler from "@/lib/apiHandler";
import { generatev2Signature, generatev1Signature } from "@/components/common/utils/generateSignature";
import JSONbig from "json-bigint";


const GET_UID_API_HOST = process.env.GET_UID_API_HOST as string;
const SEND_ORDER_API_HOST = process.env.SEND_ORDER_API_HOST as string;
const APP_ID = process.env.SEND_ORDER_APP_ID as string;
const APP_KEY = process.env.SEND_ORDER_APP_KEY as string;

const fetchUidsByBarcodes = async (barcodes: string[]): Promise<Record<string, string>> => {
    if (barcodes.length === 0) return {};

    const timestamp = Date.now().toString();
    const requestBody = JSON.stringify({ appId: APP_ID, barcodes });
    const dataSignature = generatev1Signature(APP_KEY, requestBody);
    try {
        const { data } = await axios.post(GET_UID_API_HOST, { appId: APP_ID, barcodes }, {
            headers: {
                "User-Agent": "openApi",
                "Content-Type": "application/json; charset=utf-8",
                "accept-encoding": "gzip,deflate",
                "time-stamp": timestamp,
                "data-signature": dataSignature,
            },
            transformResponse: [(data) => {
                return JSONbig.parse(data);
            }]
        });
        console.log(data);
        if (data.status !== "success") {
            throw new Error(`Failed to fetch UIDs: ${JSON.stringify(data.messages)}`);
        }

        const barcodeToUid = data.data.reduce((acc: Record<string, bigint>, product: { barcode: string, uid: bigint }) => {
            acc[product.barcode] = BigInt(product.uid);
            return acc;
        }, {});

        return barcodeToUid;

    } catch (error: any) {
        console.error("Error fetching UIDs:", error.response?.data || error.message);
        throw new Error("Failed to retrieve product UIDs");
    }
};

const sendOrderToSystem = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const timestamp = Date.now().toString();
        let orderData: yinbaoOrderData = req.body;

        const barcodes = Array.from(new Set(orderData.items
            .map((item: yinbaoOrderItem) => item.barcode)
            .filter((barcode): barcode is string => barcode !== undefined)
        ));
        const barcodeToUid = await fetchUidsByBarcodes(barcodes);;
        orderData.items = orderData.items.map(({ barcode, ...item }: yinbaoOrderItem) => ({
            ...item,
            productUid: barcode && barcodeToUid[barcode] 
        }));
        console.log(orderData);
        const requestBody = JSON.stringify(orderData);
        
    

        const dataSignatureV3 = generatev2Signature(APP_ID, APP_KEY, timestamp, requestBody);

        const { data } = await axios.post(SEND_ORDER_API_HOST, orderData, {
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

        res.status(200).json({ success: true, data });

    } catch (error: any) {
        console.error("Order submission error:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: error.response?.data || error.message });
    }
};

export default apiHandler().post(sendOrderToSystem);
