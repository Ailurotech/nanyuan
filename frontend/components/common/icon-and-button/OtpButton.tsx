import { Button } from '@chakra-ui/react';
import clsx from 'clsx';

interface OtpButtonProps {
  isRunning: boolean;
  verifyOtp: boolean;
  timeLeft: number;
  onClick: () => void;
}

function OtpButton({ isRunning, verifyOtp, timeLeft, onClick }: OtpButtonProps) {
  return (
    <Button
      className={clsx({
        'bg-gray-300 text-white': isRunning,
        'bg-green-500 text-white': verifyOtp,
        'bg-yellow-400 text-black': !isRunning && !verifyOtp,
      })}
      variant="solid"
      padding="0.36rem 1rem"
      disabled={verifyOtp || isRunning}
      borderRadius={5}
      fontSize="small"
      fontWeight="600"
      onClick={!verifyOtp && !isRunning ? onClick : undefined}
    >
      {verifyOtp ? 'Verified' : isRunning ? `${timeLeft}s` : 'Verify'}
    </Button>
  );
}

export default OtpButton;
