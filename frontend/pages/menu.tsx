// pages/menu.tsx
import { GetStaticProps } from "next";
import { sanityClient } from "../lib/sanityClient";
import { MenuItem } from "../types"; // Define your types if needed
import { Card, CardBody, Heading, Stack, Text, Button } from '@chakra-ui/react';

interface MenuProps {
  menuItems: MenuItem[];
}

const MenuPage = ({ menuItems }: MenuProps) => {
  return (
<div className="bg-black min-h-screen py-12">
  <h1 className="text-center text-white text-4xl font-bold mb-8">Choose Our Menu</h1>
  <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 mt-5">
    {menuItems.map((item) => (
      <div key={item._id} className="rounded-lg p-5 text-center transition-transform duration-300">
        <Card className="shadow-lg bg-[#191919] text-black relative rounded-lg p-4">
          <CardBody className="relative">
            <div className="flex justify-center mb-4">
                <img
                  src={item.image.url}
                  alt={item.name}
                  className="object-cover"
                />
            </div>
            <Stack mt="6" spacing="3" className="text-center">
              <Heading size="md" className="text-white">{item.name}</Heading>
              <Text className="text-white">{item.description}</Text>
              <div className="flex items-center justify-between mt-4">
                <Text className="text-yellow-400 font-bold text-xl">${item.price}</Text>
                <Button className="bg-white text-black w-8 h-8 rounded-full shadow-lg flex items-center justify-center">
                  +
                </Button>
              </div>
            </Stack>
          </CardBody>
        </Card>
      </div>
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

