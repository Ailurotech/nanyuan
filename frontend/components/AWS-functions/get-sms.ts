import axios from 'axios';

export async function getSMS({ phone }: { phone: string }) {
  const url = '/api/sendSMS';
  const data = { phone };

  try {
    const res = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      return res.data.otp;
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
}
