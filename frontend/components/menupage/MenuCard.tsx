import {
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
  Button,
  Image,
  CardFooter,
} from '@chakra-ui/react';
import { MenuItem } from '../../types';
import { urlFor } from '../../lib/sanityClient';

import { useState, useEffect } from 'react';

interface MenuProps {
  menuItems: MenuItem;
  addToCart: (item: MenuItem) => void;
}

const MenuCard = ({ menuItems, addToCart }: MenuProps) => {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        const existingItem = parsedCart.find((item: MenuItem) => item._id === menuItems._id);
        if (existingItem) {
          setItemCount(existingItem.quantity);
        }
      }
    }
  }, [menuItems]);

const addToCartHandler = () => {
  addToCart(menuItems);
  setItemCount((prev) => prev + 1);
};

const removeFromCartHandler = () => {
  if (typeof window !== 'undefined') {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const parsedCart = JSON.parse(cartData);
      const updatedCart = parsedCart.map((item: MenuItem) => {
        if (item._id === menuItems._id) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }).filter((item: MenuItem) => item.quantity > 0);

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setItemCount((prev) => Math.max(prev - 1, 0));
    }
  }
};

const imageUrl = menuItems.image
  ? urlFor(menuItems.image).width(250).height(150).auto('format').url()
  : null; 

  return (
    <Card
      key={menuItems._id}
      sx={{ backgroundColor: '#191919' }}
      maxW="300px"
      className="shadow-lg rounded-lg p-4 transform transition-transform duration-300 hover:scale-105"
    >
      <CardBody className="relative" justifyContent="center">
        {imageUrl ? (
          <Image
            src={imageUrl} 
            alt={menuItems.name}
            boxSize="150px"
            objectFit="cover"
            width="250px"
            height="150px"
            display="block"
            textColor="white"
            mx="auto"
            borderRadius="lg"
            loading="lazy" 
          />
        ) : (
          <div className="bg-gray-500 w-[250px] h-[150px] mx-auto rounded-lg flex items-center justify-center text-white">
            No Image
          </div>
        )}
        <Stack
          mt="6"
          spacing="3"
          width="268px"
          height="100px"
          className="text-center"
        >
          <Heading size="md" className="text-white">
            <strong>{menuItems.name}</strong>
          </Heading>
          <Text className="text-white">{menuItems.description}</Text>
        </Stack>
      </CardBody>
      <CardFooter display="flex" justifyContent="space-between" alignItems="center" mt={10}>
        <Text color="yellow.400" fontSize="xl" fontWeight="bold">
          ${menuItems.price}
        </Text>

        {itemCount > 0 ? (
          <div className="flex items-center bg-white text-black rounded-full px-2 py-1">
            <button
              onClick={removeFromCartHandler}
              className="px-2 text-lg font-bold"
            >
              -
            </button>
            <span className="px-2">{itemCount}</span>
            <button
              onClick={addToCartHandler}
              className="px-2 text-lg font-bold"
            >
              +
            </button>
          </div>
        ) : (
          <Button
            variant="solid"
            bg="white"
            color="black"
            w="40px"
            h="40px"
            borderRadius="50%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            _hover={{ bg: 'black', color: 'white' }}
            onClick={addToCartHandler}
          >
            +
          </Button>
        )}
      </CardFooter>

    </Card>
  );
};

export default MenuCard;
