import { Button } from '@chakra-ui/react';

interface ActionButtonProps {
  label: string; 
  onClick?: () => void; 
  isDisabled?: boolean; 
}

const ActionButton = ({ label, onClick, isDisabled = false }: ActionButtonProps) => {
  return (
    <Button
      width="100%"
      colorScheme="orange"
      variant="solid"
      backgroundColor="#facc16"
      padding="0.6rem"
      borderRadius={5}
      fontSize="small"
      fontWeight="600"
      onClick={onClick}
      disabled={isDisabled}
    >
      {label}
    </Button>
  );
};

export default ActionButton;
