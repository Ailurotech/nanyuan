import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';

type ApiType = 'stripe' | 'sanity' | 'webhook' | 'default';

interface MockRequestResponse {
  req: NextApiRequest;
  res: NextApiResponse;
  status: jest.Mock;
  json: jest.Mock;
}

export const mockRequestResponse = (
  body: string | object,
  apiType: ApiType = 'default',
  customHeaders: Record<string, string> = {}
): MockRequestResponse => {
  const BASE_ORIGIN = process.env.BASE_ORIGIN || 'http://localhost:3000';

  // Define special headers for different API types
  const specialHeaders: Partial<Record<ApiType, Record<string, string>>> = {
    webhook: { 'stripe-signature': 'valid-signature' },
  };

  // Merge headers
  const headers = {
    origin: BASE_ORIGIN,
    ...(specialHeaders[apiType] || {}),
    ...customHeaders,
  };

  // Format body for webhook (convert to Buffer), else use raw body
  const formattedBody = apiType === 'webhook'
    ? Buffer.from(typeof body === 'string' ? body : JSON.stringify(body))
    : body;

  // Create the request object with appropriate body handling based on apiType
  const req = Object.assign(
    apiType === 'webhook' ? Readable.from([formattedBody]) : {},
    {
      method: 'POST',
      headers,
      ...(apiType !== 'webhook' && { body }) // Attach body only for non-webhook API types
    }
  ) as NextApiRequest;

  // Mock response with status and json methods
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const res = { status } as unknown as NextApiResponse;

  return { req, res, status, json };
};
