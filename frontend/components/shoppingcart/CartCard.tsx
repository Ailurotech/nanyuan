import { Card, CardBody, Heading, Stack, Text, Button, Image, CardFooter, Flex, Box, NumberInput, NumberInputField,NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper} from '@chakra-ui/react';
// import { MenuItem } from "../../types";
import { ShoppingCartItem } from "../../types"; 
import { RiDeleteBin6Line } from "react-icons/ri";
interface CartCardProps {
    shoppingCartItem: ShoppingCartItem;
    removeItem: () => void;
    updateQuantity: (newQuantity:number,id:string) => void;
  }
const CartCard = ({ shoppingCartItem, removeItem, updateQuantity }: CartCardProps) => {
    const handleQuantityChange = (valueAsString:string, valueAsNumber:number) => {
      updateQuantity(valueAsNumber, shoppingCartItem._id);
    };
    return (
        <>
          <Card
            key={shoppingCartItem._id}
            direction={{ base: 'column', sm: 'row' }}
            overflow="hidden"
            variant="outline"
            className='text-white flex flex-col md:items-center justify-center justify-between bg-gray-600 p-3 rounded-lg mb-5 gap-y-3 justify-items-start items-start'
          >
            <Image
              objectFit="cover"
              maxW={{ base: '100%', sm: '100px' }}
              src={shoppingCartItem.image}
              alt={shoppingCartItem.name}
              className='rounded-lg'
            />
            <div className=''>
              <Text className="text-white">{shoppingCartItem.description}</Text>
              <div className='text-sm'>Note: No spicy</div>
            </div>
            <Box>
              <NumberInput defaultValue={shoppingCartItem.quantity} min={1} max={100} onChange={handleQuantityChange}>
                <NumberInputField width={10} height={10} className='bg-gray-600'/>
                <NumberInputStepper>
                  <NumberIncrementStepper/>
                  <NumberDecrementStepper/>
                </NumberInputStepper>
              </NumberInput>
            </Box>
            <div className=''>${shoppingCartItem.price}</div>
            <RiDeleteBin6Line size={25} className='hover:text-yellow-400' onClick={removeItem}/>
          </Card>
      </>
    );
  };

  export default CartCard;