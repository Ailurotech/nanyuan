import { NextApiRequest, NextApiResponse } from 'next';

export const mockRequestResponse = (body: Record<string, any>) => {
  const req = { method: 'POST', body, headers: { origin: 'http://localhost:3000' } } as unknown as NextApiRequest;
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const res = { status } as unknown as NextApiResponse;

  return { req, res, status, json };
};
