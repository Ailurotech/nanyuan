import { GetStaticProps } from 'next';
import { sanityClient } from '../lib/sanityClient';
import { MenuItem, ShoppingCartItem } from '../types';
import MenuCard from '../components/menupage/MenuCard';
import { useState, useEffect } from 'react';
import { RiShoppingBagLine } from 'react-icons/ri';
import Link from 'next/link';
import { ShoppingCart } from '@/components/homepage/route';

interface MenuProps {
  menuItems: MenuItem[];
}

const MenuPage = ({ menuItems }: MenuProps) => {
  const [cart, setCart] = useState<ShoppingCartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract categories dynamically from menuItems
  const categories = Array.from(
    new Set(
      menuItems.flatMap((item) => item.categories).filter((category) => category)
    )
  );
  categories.unshift('All'); // Add "All" as the default category

  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const parsedCart = JSON.parse(cartData);
      setCart(parsedCart);
      setCartCount(
        parsedCart.reduce(
          (total: number, item: ShoppingCartItem) => total + item.quantity,
          0,
        ),
      );
    }
  }, []);

  const addToCart = (item: MenuItem) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(
      (cartItem) => cartItem._id === item._id,
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ ...item, quantity: 1 });
    }
    setCart(updatedCart);
    setCartCount((prevCount) => prevCount + 1);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const filteredMenuItems = menuItems
  .filter((item) => item.isAvailable === true) 
  .filter((item) =>
    selectedCategory === 'All'
      ? true 
      : item.categories?.some(
          (category) =>
            category.toLowerCase() === selectedCategory.toLowerCase(),
        )
  );


  return (
    <div className="bg-black min-h-screen py-12 pt-40">
      <div className="container mx-auto flex items-center justify-center relative">
        <h1 className="text-center text-white text-4xl font-bold mb-8 grow">
          Choose Our Menu
        </h1>
        <Link
          href={ShoppingCart.Path}
          className="text-white absolute right-0 md:mr-12 mr-2 mb-8 hover:text-yellow-400"
        >
          <div className="relative">
            <RiShoppingBagLine className="w-7 h-7" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartCount}
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Category Buttons */}
      <div className="flex flex-row gap-2 w-1/2 mx-auto text-white mb-8">
        {categories.map((category) => (
          <button
            key={category}
            className={`border border-yellow-400 py-2 px-4 rounded-lg ${
              selectedCategory === category
                ? 'bg-yellow-400 text-black'
                : 'bg-black text-yellow-400'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="container mx-auto grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 justify-items-center px-5">
        {filteredMenuItems.map((item) => (
          <MenuCard key={item._id} menuItems={item} addToCart={addToCart} />
        ))}
      </div>

      {/* See All Button */}
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
      categories,
      isAvailable, 
      "image": image.asset->url
    }
  `;

  const menuItems = await sanityClient.fetch(query);

  return {
    props: {
      menuItems,
    },
  };
};

export default MenuPage;
