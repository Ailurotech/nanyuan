import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '@/lib/redis';

const OTP_PREFIX = 'otp:';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phone, otp } = req.body;

  // 验证输入
  if (typeof phone !== 'string' || typeof otp !== 'string') {
    return res.status(400).json({ message: 'Invalid phone or OTP' });
  }

  const key = `${OTP_PREFIX}${phone}`;

  try {
    const storedOtp = await redis.get(key);

    if (!storedOtp) {
      return res.status(400).json({ message: 'OTP expired or not found' });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ message: 'Incorrect OTP' });
    }

    await redis.del(key);

    return res.status(200).json({ verified: true });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
