import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import applyRateLimit from '@/lib/rateLimiter';
import ipFilter from '@/lib/ipFilter';
import corsMiddleware from '@/lib/corsMiddleware';
import sanitizeMiddleware from '@/lib/sanitizeMiddleware';
import securityHeaders from '@/lib/securityHeaders';

const apiHandler = () => {
  return nextConnect<NextApiRequest, NextApiResponse>()
    .use(async (req, res, next) => {
      await applyRateLimit(req, res);
      next();
    })
    .use(ipFilter)
    .use(corsMiddleware)
    .use(sanitizeMiddleware)
    .use(securityHeaders);
};

export default apiHandler;
