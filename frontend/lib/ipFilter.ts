import { NextApiRequest, NextApiResponse } from 'next';
import requestIp from 'request-ip';
import geoip from 'geoip-lite';

const ALLOWED_COUNTRY = 'AU';

const STRIPE_IPS = [
  '3.18.12.63',
  '3.130.192.231',
  '13.235.14.237',
  '13.235.122.149',
  '18.211.135.69',
  '35.154.171.200',
  '52.15.183.38',
  '54.88.130.119',
  '54.88.130.237',
  '54.187.174.169',
  '54.187.205.235',
  '54.187.216.72',
];

const isStripeWebhook = (req: NextApiRequest) =>
  !!req.headers['stripe-signature'];

export default function ipFilter(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void,
) {
  const clientIp = requestIp.getClientIp(req) || 'unknown';

  if (isStripeWebhook(req)) {
    if (!STRIPE_IPS.includes(clientIp)) {
      return res
        .status(403)
        .json({ error: 'Forbidden: Only Stripe Webhooks are allowed' });
    }
    return next();
  }

  const geo = geoip.lookup(clientIp);
  if (!geo || geo.country !== ALLOWED_COUNTRY) {
    return res
      .status(403)
      .json({
        error: 'Forbidden: Only Australian users are allowed to access',
      });
  }

  next();
}
