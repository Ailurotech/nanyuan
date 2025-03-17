import crypto from "crypto";

export function generateSignature(appId: string, appKey: string, timestamp: string, requestBody: string): string {
    const rawString = appId + appKey + timestamp + requestBody;
    return crypto.createHash("md5").update(rawString, "utf8").digest("hex").toUpperCase();
}