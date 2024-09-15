// pages/menu.tsx
import { GetStaticProps } from "next";
import { sanityClient } from "../lib/sanityClient";
import { MenuItem } from "../types"; // Define your types if needed
import MenuCard from '../components/menupage/MenuCard';
import { useState, useEffect, useRef, use } from 'react';

interface MenuProps {
  menuItems: MenuItem[];
}

const MenuPage = ({ menuItems }: MenuProps) => {
  const cartData0=[
    {
      _id: 'd3ca3b72-2418-4035-abfa-245f8696e8d1',
      name: 'Roasted Duck',
      description: 'This is the delicious rosted duck',
      price: 67,
      image: 'https://cdn.sanity.io/images/utvt9caf/test/dd236eafdebea0498587ac31fb102de59ddc2637-381x308.png',
      quantity:1,
    },
    {
      _id: 'd3ca3b72-2418-4035-abfa-245f8696e8d2',
      name: 'Roasted Duck',
      description: 'This is the delicious rosted duck',
      price: 67,
      image: 'https://cdn.sanity.io/images/utvt9caf/test/dd236eafdebea0498587ac31fb102de59ddc2637-381x308.png',
      quantity:2,
    },
    {
      _id: 'd3ca3b72-2418-4035-abfa-245f8696e8d3',
      name: 'Roasted Duck',
      description: 'This is the delicious rosted duck',
      price: 67,
      image: 'https://cdn.sanity.io/images/utvt9caf/test/dd236eafdebea0498587ac31fb102de59ddc2637-381x308.png',
      quantity:3,
    },
  ];
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartData0));
  })
  return (
    <div className="bg-black min-h-screen py-12 pt-40">
    <h1 className="text-center text-white text-4xl font-bold mb-8">Choose Our Menu</h1>
    <div className="container mx-auto grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 justify-items-center px-5">
      {menuItems.map((item) => (
          <MenuCard key={item._id} menuItems={item}/> 
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