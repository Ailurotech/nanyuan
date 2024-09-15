import { Card, CardBody, Heading, Stack, Text, Button, Image, CardFooter } from '@chakra-ui/react';
import { MenuItem } from "../../../types";
interface MenuProps {
    menuItems: MenuItem[];
  }
const MenuCard = ({ menuItems }: MenuProps) => {
    return (
        <div className="container mx-auto grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 mt-5 justify-items-center px-5">
          {menuItems.map((item) => (
            <Card key={item._id} sx={{ backgroundColor: "#191919" }} maxW="300px" className="shadow-lg rounded-lg p-4 transform transition-transform duration-300 hover:scale-105">
              <CardBody className="relative" justifyContent="center"  >
                  <Image
                    src={item.image}
                    alt={item.name}
                    boxSize="150px"
                    objectFit="cover"
                    width="150px"
                    height="150px"
                    display="block"
                    textColor="white"
                    mx="auto"
                    borderRadius="lg"
                  />
                <Stack mt="6" spacing="3" width="268px" height="100px" className="text-center">
                  <Heading size="md" className="text-white">{item.name}</Heading>
                  <Text className="text-white">{item.description}</Text>
                </Stack>
              </CardBody>
              <CardFooter display="flex" justifyContent="space-between" alignItems="center" mt={10}>
                <Text color="yellow.400" fontSize="xl" fontWeight="bold">${item.price}</Text>
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
                  _hover={{ bg: "black", color: "white" }}
                >
                  +
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    );
  };

  export default MenuCard;