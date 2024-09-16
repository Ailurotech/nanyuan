// pages/menu.tsx
import { GetStaticProps } from "next";
import { sanityClient } from "../lib/sanityClient";
import { MenuItem } from "../types"; // Define your types if needed
import MenuCard from '../components/menupage/MenuCard';
import { useState, useEffect} from 'react';
import { ShoppingCartItem } from "../types"; 

interface MenuProps {
  menuItems: MenuItem[];
}

const MenuPage = ({ menuItems}: MenuProps) => {
  const [cart, setCart] = useState<ShoppingCartItem[]>([]);
  useEffect(() => {
    const cartData=localStorage.getItem('cart');
    if (cartData) {
      setCart(JSON.parse(cartData));
    }
  },[]);
  
  const addToCart = (item: MenuItem) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(cartItem => cartItem._id === item._id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ ...item, quantity: 1 });
    }
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <div className="bg-black min-h-screen py-12 pt-40">
    <h1 className="text-center text-white text-4xl font-bold mb-8">Choose Our Menu</h1>
    <div className="container mx-auto grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 justify-items-center px-5">
      {menuItems.map((item) => (
          <MenuCard key={item._id} menuItems={item} addToCart={addToCart}/> 
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