import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import applyRateLimit from '@/lib/rateLimiter';
import ipFilter from '@/lib/ipFilter';
import corsMiddleware from '@/lib/corsMiddleware';

const apiHandler = () => {
  return nextConnect<NextApiRequest, NextApiResponse>()
    .use(async (req, res, next) => {
      await applyRateLimit(req, res);
      next();
    })
    .use(ipFilter)
    .use(corsMiddleware);
};

export default apiHandler;
