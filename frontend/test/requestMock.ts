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
  customHeaders: Record<string, string> = {},
): MockRequestResponse => {
  const BASE_ORIGIN = process.env.BASE_ORIGIN || 'http://localhost:3000';

  const specialHeaders: Partial<Record<ApiType, Record<string, string>>> = {
    webhook: { 'stripe-signature': 'valid-signature' },
  };

  const headers = {
    origin: BASE_ORIGIN,
    ...(specialHeaders[apiType] || {}),
    ...customHeaders,
  };

  const formattedBody =
    apiType === 'webhook'
      ? Buffer.from(typeof body === 'string' ? body : JSON.stringify(body))
      : body;

  const req = Object.assign(
    apiType === 'webhook' ? Readable.from([formattedBody]) : {},
    {
      method: 'POST',
      headers,
      ...(apiType !== 'webhook' && { body }),
    },
  ) as NextApiRequest;

  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const res = { status } as unknown as NextApiResponse;

  return { req, res, status, json };
};
