import type { NextApiRequest, NextApiResponse } from 'next';
import { SNS } from 'aws-sdk';

const otpStore = new Map<string, { otp: string; expiresAt: number }>();
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

  const fullPhone = `+61${phone.replace(/^0/, '')}`;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  try {
    await sns
      .publish({
        Message: `Your verification code is: ${otp}`,
        PhoneNumber: fullPhone,
      })
      .promise();

    otpStore.set(phone, { otp, expiresAt });
    return res.status(200).json({ message: 'OTP sent' });
  } catch (error) {
    console.error('SNS Error:', error);
    return res.status(500).json({ message: 'Failed to send SMS' });
  }
}

export { otpStore };
