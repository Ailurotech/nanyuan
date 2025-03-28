import type { NextApiRequest, NextApiResponse } from 'next';
import { SNS } from 'aws-sdk';
import redis from '@/lib/redis';
import { rateLimitRedis } from '@/lib/rateLimitRedis'; // ✅ 加上这一行

const sns = new SNS({ region: 'ap-southeast-2' });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { phone } = req.body;
  if (!phone || !/^\d{9,10}$/.test(phone)) {
    return res.status(400).json({ message: 'Invalid phone number' });
  }

  // ✅ 这里放 rate limit 检查
  const { limited } = await rateLimitRedis({
    key: phone,
    windowInSeconds: 60, // 每分钟最多3次
    maxRequests: 3,
  });

  if (limited) {
    return res.status(429).json({ message: 'Too many requests' });
  }

  const fullPhone = `+61${phone.replace(/^0/, '')}`;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresInSec = 5 * 60;

  try {
    await sns
      .publish({
        Message: `Your verification code is: ${otp}`,
        PhoneNumber: fullPhone,
      })
      .promise();

    await redis.set(`otp:${phone}`, otp, 'EX', expiresInSec);
    return res.status(200).json({ message: 'OTP sent' });
  } catch (error) {
    console.error('SNS Error:', error);
    return res.status(500).json({ message: 'Failed to send SMS' });
  }
}
