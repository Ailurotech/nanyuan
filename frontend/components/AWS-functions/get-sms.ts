import axios from 'axios';

export async function getSMS({ phone }: { phone: string }) {
  const url = process.env.NEXT_PUBLIC_AWS_SEND_SMS_URL;
  if (!url) {
    console.error('AWS_SEND_SMS_URL is not defined');
    return;
  }
  const data = { phone: `+61${phone}` };
  try {
    const res = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.status === 200) {
      const data = JSON.parse(res.data.body);
      return data.otp;
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
}
