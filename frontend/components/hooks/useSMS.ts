import { useState } from 'react';
import useTimer from './useTimer';
import axios from 'axios';

export function useSMS() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const { timeLeft, isRunning, startTimer } = useTimer(60);

  const SendOtp = async (phone: string) => {
    try {
      await axios.post('/api/send-sms', { phone });
      setIsModalOpen(true);
      startTimer();
    } catch (error) {
      console.error('Failed to send OTP:', error);
    }
  };

  const handleVerifyOtp = async (enteredOtp: string, phone: string) => {
    try {
      const res = await axios.post('/api/verify-otp', {
        phone,
        otp: enteredOtp,
      });

      if (res.data.verified) {
        setVerifyOtp(true);
        setIsModalOpen(false);
        alert('Successfully verified');
      }
    } catch (error) {
      alert('OTP is incorrect or expired');
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
