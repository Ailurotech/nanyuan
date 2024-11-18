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

interface MenuProps {
  menuItems: MenuItem;
  addToCart: (item: MenuItem) => void;
}

const MenuCard = ({ menuItems, addToCart }: MenuProps) => {
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
        <Stack mt="6" spacing="3" textAlign="center">
          <Heading size="md" className="text-white">
            {menuItems.name}
          </Heading>
          <Text className="text-white">{menuItems.description}</Text>
        </Stack>
      </CardBody>
      <CardFooter display="flex" justifyContent="space-between" alignItems="center" mt={10}>
        <Text color="yellow.400" fontSize="xl" fontWeight="bold">
          ${menuItems.price}
        </Text>
        <Button
          variant="solid"
          bg="white"
          color="black"
          w="40px"
          h="40px"
          borderRadius="50%"
          onClick={() => addToCart(menuItems)}
        >
          +
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuCard;
