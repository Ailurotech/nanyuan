import axios from "axios";
import JSONbig from "json-bigint";
import { generatev1Signature } from "@/components/common/utils/generateSignature";

export const fetchUidsByBarcodes = async (
    barcodes: string[],
    getUidApiHost: string,
    appId: string,
    appKey: string
): Promise<Record<string, bigint>> => {
    if (barcodes.length === 0) return {};

    const timestamp = Date.now().toString();
    const requestBody = JSON.stringify({ appId, barcodes });
    const dataSignature = generatev1Signature(appKey, requestBody);

    try {
        const { data } = await axios.post(getUidApiHost, { appId, barcodes }, {
            headers: {
                "User-Agent": "openApi",
                "Content-Type": "application/json; charset=utf-8",
                "time-stamp": timestamp,
                "data-signature": dataSignature,
                "accept-encoding": "gzip,deflate",
            },
            transformResponse: [(data) => JSONbig.parse(data)]
        });

        if (data.status !== "success") {
            throw new Error(`Failed to fetch UIDs: ${JSON.stringify(data.messages)}`);
        }

        return data.data.reduce((acc: Record<string, bigint>, product: { barcode: string, uid: bigint }) => {
            acc[product.barcode] = product.uid;
            return acc;
        }, {});

    } catch (error: any) {
        throw new Error(`Error fetching UIDs: ${error.response?.data || error.message}`);
    }
};
