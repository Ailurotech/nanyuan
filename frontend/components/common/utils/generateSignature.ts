import crypto from "crypto";

export function generatev2Signature(appId: string, appKey: string, timestamp: string, requestBody: string): string {
    const rawString = appId + appKey + timestamp + requestBody;
    return crypto.createHash("md5").update(rawString, "utf8").digest("hex").toUpperCase();
}

export function generatev1Signature( appKey: string, requestBody: string): string {
    const rawString = appKey + requestBody;
    return crypto.createHash("md5").update(rawString, "utf8").digest("hex").toUpperCase();
}