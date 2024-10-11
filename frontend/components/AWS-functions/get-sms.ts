import axios from 'axios';

export async function getSMS({ phone }: { phone: string }) {
  const url =
    'https://2t0ot5k3s5.execute-api.ap-southeast-2.amazonaws.com/dev/api/Send-SMS';
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
