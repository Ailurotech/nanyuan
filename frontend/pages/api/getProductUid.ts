import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import JSONbig from "json-bigint";
import { generatev1Signature } from "@/components/common/utils/generateSignature";
import { errorMap } from "@/error/errorMap";
import { ValidationError } from "@/error/validationError";

const GET_UID_API_HOST = process.env.GET_UID_API_HOST as string;
const APP_ID = process.env.SEND_ORDER_APP_ID as string;
const APP_KEY = process.env.SEND_ORDER_APP_KEY as string;

const getProductUid = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { barcodes } = req.body;

        const timestamp = Date.now().toString();
        const requestBody = JSON.stringify({ appId: APP_ID, barcodes });
        const dataSignature = generatev1Signature(APP_KEY, requestBody);

        const { data } = await axios.post(GET_UID_API_HOST, { appId: APP_ID, barcodes }, {
            headers: {
                "User-Agent": "openApi",
                "Content-Type": "application/json; charset=utf-8",
                "time-stamp": timestamp,
                "data-signature": dataSignature,
                "accept-encoding": "gzip,deflate",
            },
            transformResponse: [(data) => JSONbig.parse(data)],     
        });

        if (data.status !== "success") {
            throw new Error(`Failed to fetch UIDs: ${JSON.stringify(data.messages)}`);
        }

        const barcodeToUid = data.data.reduce((acc: Record<string, string>, product: { barcode: string, uid: bigint }) => {
            acc[product.barcode] = product.uid.toString();
            return acc;
        }, {});

        return res.status(200).json({ success: true, data: barcodeToUid });

    } catch (error: any) {
        if (error instanceof Error) {
            const errorName = error.name;
            const errorInfo = errorMap.get(errorName);
            return res
              .status(errorInfo?.status || 500)
              .json({ error: errorInfo?.message || 'Internal server error' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export default getProductUid;
