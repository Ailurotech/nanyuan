import { useState } from 'react';
import { Button, HStack, Input } from '@chakra-ui/react';

interface VerifyOtpModalProps {
  onVerify: (otp: string) => void; 
  onClose: () => void;             
}

const VerifyOtpModal: React.FC<VerifyOtpModalProps> = ({ onVerify, onClose }) => {
  const [userotp, setUserOtp] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserOtp(event.target.value); 
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-5 shadow-lg w-96">
        <h2 className="text-xl font-bold mb-2">Verify OTP</h2>
        <p className="mb-4">An OTP has been sent to your phone. Please enter it below:</p>
        <Input
          className="mt-2 rounded-md border border-gray-300 pl-2"
          type="text"
          value={userotp}  
          onChange={handleChange}  // 
        />
        <HStack className="flex-start space-x-2 w-full mt-5">
          <Button 
            colorScheme="teal"
            onClick={() => onVerify(userotp)} 
          >
            Verify
          </Button>
          <Button 
            colorScheme="red"
            onClick={onClose} 
          >
            Cancel
          </Button>
        </HStack>
      </div>
    </div>
  );
};

export default VerifyOtpModal;
