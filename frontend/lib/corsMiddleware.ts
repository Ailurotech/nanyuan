import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

const allowedOrigins = ['http://localhost:3000', 'nanyuan.netlify.app'];

const cors = Cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});

const isStripeWebhook = (req: NextApiRequest) =>
  !!req.headers['stripe-signature'];

export default function corsMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void,
) {
  if (isStripeWebhook(req)) {
    return next();
  }

  cors(req, res, (err) => {
    if (err) {
      return res.status(403).json({ error: 'CORS error: Not allowed' });
    }
    next();
  });
}
