import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { rateLimitRedis } from '@/lib/rateLimitRedis';
import ipFilter from '@/lib/ipFilter';
import corsMiddleware from '@/lib/corsMiddleware';
import sanitizeMiddleware from '@/lib/sanitizeMiddleware';
import securityHeaders from '@/lib/securityHeaders';

const apiHandler = () =>
  nextConnect<NextApiRequest, NextApiResponse>()
    .use(async (req, res, next) => {
      const phone = req.body?.phone || req.query?.phone;
      const key = phone
        ? `phone:${phone}`
        : req.socket.remoteAddress || 'unknown';

      const { limited } = await rateLimitRedis({
        key,
        windowInSeconds: 60,
        maxRequests: 3,
      });

      if (limited) {
        return res
          .status(429)
          .json({ message: 'Too many requests, slow down.' });
      }

      next();
    })
    .use(ipFilter)
    .use(corsMiddleware)
    .use(sanitizeMiddleware)
    .use(securityHeaders);

export default apiHandler;
