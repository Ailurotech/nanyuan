import type { NextApiRequest, NextApiResponse } from 'next';
import { otpStore } from './send-sms';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { phone, otp } = req.body;

  const record = otpStore.get(phone);

  if (!record) {
    return res.status(400).json({ message: 'OTP not found or expired' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(phone);
    return res.status(400).json({ message: 'OTP expired' });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: 'Incorrect OTP' });
  }

  otpStore.delete(phone);
  return res.status(200).json({ verified: true });
}
