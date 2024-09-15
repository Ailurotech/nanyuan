// pages/menu.tsx
import { GetStaticProps } from "next";
import { sanityClient } from "../lib/sanityClient";
import { MenuItem } from "../types"; // Define your types if needed
import { Card, CardBody, Heading, Stack, Text, Button, Image, CardFooter } from '@chakra-ui/react';

interface MenuProps {
  menuItems: MenuItem[];
}

const MenuPage = ({ menuItems }: MenuProps) => {
  return (
    <div className="bg-black min-h-screen py-12 pt-40">
      <h1 className="text-center text-white text-4xl font-bold mb-8">Choose Our Menu</h1>
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
      <div className="flex justify-center mt-10">
        <button className="bg-yellow-400 text-white py-2 px-6 rounded-lg text-lg">
          See All
        </button>
      </div>
    </div>
  );
};

// Fetch menu data at build time using `getStaticProps`
export const getStaticProps: GetStaticProps = async () => {
  const query = `
    *[_type == "menu"]{
      _id,
      name,
      description,
      price,
      "image": image.asset->url
    }
  `;

  const menuItems = await sanityClient.fetch(query);

  return {
    props: {
      menuItems,
    },
    revalidate: 60,
  };
};

export default MenuPage;
