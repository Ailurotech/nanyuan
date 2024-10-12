import { useState } from 'react';
import useTimer from '../common/useTimer';
import { getSMS } from '../AWS-functions/get-sms';

export function useSMS() {
  const [otp, setOtp] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const { timeLeft, isRunning, startTimer } = useTimer(60);

  const SendOtp = async (phone: string) => {
    const otp = await getSMS({ phone });
    setOtp(otp);
    setIsModalOpen(true);
    startTimer();
  };

  const handleVerifyOtp = (enteredOtp: string) => {
    if (enteredOtp === otp) {
      setVerifyOtp(true);
      setIsModalOpen(false);
      alert('Successfully verified');
    } else {
      alert('OTP is incorrect');
    }
  };

  return {
    SendOtp,
    handleVerifyOtp,
    setIsModalOpen,
    verifyOtp,
    isModalOpen,
    timeLeft,
    isRunning,
  };
}
