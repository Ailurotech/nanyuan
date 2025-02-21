import rateLimit from 'express-rate-limit';

export const webhookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100,
  message: 'Request too frequent, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export default function applyRateLimit(req: any, res: any) {
  return new Promise((resolve, reject) =>
    webhookLimiter(req, res, (result: any) =>
      result instanceof Error ? reject(result) : resolve(result),
    ),
  );
}
