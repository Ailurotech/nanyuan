import { NextApiRequest, NextApiResponse } from 'next';

type ApiType = 'stripe' | 'sanity' | 'default';

interface MockRequestResponse {
  req: NextApiRequest;
  res: NextApiResponse;
  status: jest.Mock;
  json: jest.Mock;
}

export const mockRequestResponse = (
  body: string | object,
  customHeaders: Record<string, string> = {},
): MockRequestResponse => {
  const req = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...customHeaders },
    body: body,
  } as unknown as NextApiRequest;

  // 模拟响应
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const res = { status } as unknown as NextApiResponse;

  return { req, res, status, json };
};
