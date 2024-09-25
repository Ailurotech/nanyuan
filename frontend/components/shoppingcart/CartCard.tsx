import {
  Card,
  Text,
  Image,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { CartCardProps } from '../../types';

const CartCard = ({
  shoppingCartItem,
  removeItem,
  updateQuantity,
}: CartCardProps) => {
  const handleQuantityChange = (
    valueAsString: string,
    valueAsNumber: number,
  ) => {
    updateQuantity(valueAsNumber, shoppingCartItem._id);
  };
  return (
    <>
      <Card
        key={shoppingCartItem._id}
        direction={{ base: 'column', sm: 'row' }}
        overflow="hidden"
        variant="outline"
        className="text-white flex flex-col md:items-center md:justify-center md:justify-between bg-gray-600 p-3 rounded-lg mb-5 gap-y-3 justify-items-start items-start h-[60vh] md:h-[15vh]"
      >
        <div className="flex flex-col md:flex-row md:items-center w-full md:w-3/5 h-3/5 gap-2">
          <div className='h-2/3 w-full md:w-1/5 md:h-full'>
            <Image
                objectFit="cover"
                maxW={{ base: '100%', sm: '100px' }}
                src={shoppingCartItem.image}
                alt={shoppingCartItem.name}
                className="rounded-lg w-full h-full"
              />
          </div>
          <div className="md:w-full ">
            <Text className="text-white">
              <strong>{shoppingCartItem.name}</strong>
              <br />
              <Text noOfLines={[1, 2, 3]} >{shoppingCartItem.description}</Text>
            </Text>
          </div>
        </div>
        <Box>
          <NumberInput
            defaultValue={shoppingCartItem.quantity}
            min={1}
            max={100}
            onChange={handleQuantityChange}
          >
            <NumberInputField
              width={10}
              height={10}
              className="bg-gray-600"
              _focus={{ outline: 'none', boxShadow: 'none' }}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>
        <div className="">${shoppingCartItem.price}</div>
        <RiDeleteBin6Line
          size={25}
          className="hover:text-yellow-400"
          onClick={removeItem}
        />
      </Card>
    </>
  );
};

export default CartCard;
