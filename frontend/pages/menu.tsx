import { GetStaticProps } from 'next';
import { sanityClient } from '../lib/sanityClient';
import { MenuItem, ShoppingCartItem, Category } from '../types';
import MenuCard from '../components/menupage/MenuCard';
import { useState, useEffect } from 'react';
import { RiShoppingBagLine } from 'react-icons/ri';
import Link from 'next/link';
import { ShoppingCart } from '@/components/homepage/route';

interface MenuProps {
  initialMenuItems: MenuItem[];
  initialCategories: Category[];
}

const MenuPage = ({ initialMenuItems, initialCategories }: MenuProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [cart, setCart] = useState<ShoppingCartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [isAllLoaded, setIsAllLoaded] = useState(false);

  const categories = ['All', ...Array.from(new Set(initialCategories.map((cat) => cat.name)))];

  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const parsedCart = JSON.parse(cartData);
      setCart(parsedCart);
      setCartCount(
        parsedCart.reduce(
          (total: number, item: ShoppingCartItem) => total + item.quantity,
          0
        )
      );
    }
  }, []);

  const addToCart = (item: MenuItem) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(
      (cartItem) => cartItem._id === item._id
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

  const fetchAllMenuItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/getMenuItems`);
      const data = await response.json();
      setMenuItems(data.menuItems);
      setIsAllLoaded(true);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMenuItemsByCategory = async (category: string) => {
    setIsLoading(true);
    try {
      const queryParam = category === 'All' ? '' : `?category=${category}`;
      const response = await fetch(`/api/getMenuItems${queryParam}`);
      const data = await response.json();
      setMenuItems(data.menuItems);
      setIsAllLoaded(true);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    fetchMenuItemsByCategory(category);
  };

  const filteredMenuItems = menuItems.filter((item) => item.isAvailable === true);

  return (
    <div className="bg-black min-h-screen py-12 pt-40">
      {/* Header */}
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

      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center w-3/4 mx-auto text-white mb-8">
        {categories.map((category) => (
          <button
            key={category}
            className={`border border-yellow-400 py-2 px-4 rounded-lg ${
              selectedCategory === category
                ? 'bg-yellow-400 text-black'
                : 'bg-black text-yellow-400'
            }`}
            onClick={() => handleCategoryClick(category)}
            disabled={isLoading && selectedCategory === category}
          >
            {isLoading && selectedCategory === category ? 'Loading...' : category}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 px-5 justify-items-center">
        {filteredMenuItems.map((item) => (
          <MenuCard key={item._id} menuItems={item} addToCart={addToCart} />
        ))}
      </div>

      {/* Load More */}
      {!isAllLoaded && (
        <div className="flex justify-center mt-10">
          <button
            className="bg-yellow-400 text-black py-2 px-6 rounded-lg text-lg"
            onClick={fetchAllMenuItems}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'See All'}
          </button>
        </div>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const menuQuery = `
    *[_type == "menu"] | order(_createdAt desc)[0...2]{
      _id,
      name,
      description,
      price,
      categories,
      isAvailable, 
      "image": image.asset->url
    }
  `;

  const categoryQuery = `
    *[_type == "category"] | order(_createdAt desc){
      name
    }
  `;

  const menuItems = await sanityClient.fetch(menuQuery);

  const categories = await sanityClient.fetch(categoryQuery);
  const uniqueCategories = Array.from(
    new Map(categories.map((cat: Category) => [cat.name.toLowerCase(), cat])).values()
  );

  return {
    props: {
      initialMenuItems: menuItems,
      initialCategories: uniqueCategories,
    },
  };
};

export default MenuPage;
