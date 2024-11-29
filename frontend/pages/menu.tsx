import { GetStaticProps } from 'next';
import { MenuItem, ShoppingCartItem, Category } from '../types';
import MenuCard from '../components/menupage/MenuCard';
import { fetchMenuItemsByCate, fetchTotalCount, fetchCategories } from '@/components/menupage/menuService';
import { useState, useEffect } from 'react';
import { RiShoppingBagLine } from 'react-icons/ri';
import Link from 'next/link';
import { ShoppingCart } from '@/components/homepage/route';

interface MenuProps {
  initialMenuItems: MenuItem[];
  initialCategories: Category[];
  totalCount: number;
  totalPages: number;
  pageSize: number;
}

const MenuPage = ({ initialMenuItems, initialCategories, totalCount, totalPages, pageSize }: MenuProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [cart, setCart] = useState<ShoppingCartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ['All', ...Array.from(new Set(initialCategories.map((cat) => cat.name)))];

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

  const handleCategoryClick = async (category: string) => {
    setSelectedCategory(category);
    setIsLoading(true);
    try {
      const fetchedMenuItems =
        category === 'All'
          ? await fetchMenuItemsByCate(category, 0, pageSize)
          : await fetchMenuItemsByCate(category);

      setMenuItems(fetchedMenuItems);
      setCurrentPage(category === 'All' ? 1 : currentPage);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    if (selectedCategory !== 'All') return;

    setIsLoading(true);
    try {
      const offset = (page - 1) * pageSize;
      const fetchedMenuItems = await fetchMenuItemsByCate(selectedCategory, offset, pageSize);
      setMenuItems(fetchedMenuItems);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching paginated menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 px-5 justify-items-center">
        {menuItems.map((item) => (
          <MenuCard key={item._id} menuItems={item} addToCart={addToCart} />
        ))}
      </div>

      {selectedCategory === 'All' && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`mx-1 px-4 py-2 border rounded ${
                currentPage === page
                  ? 'bg-yellow-500 text-black font-bold'
                  : ' text-white hover:bg-yellow-600 hover:text-black'
              }`}
              onClick={() => handlePageChange(page)}
              disabled={isLoading}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const pageSize = 50;

  const menuItems = await fetchMenuItemsByCate('All', 0, pageSize);
  const totalCount = await fetchTotalCount('menu');
  const categories = await fetchCategories();
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    props: {
      initialMenuItems: menuItems,
      initialCategories: categories,
      totalCount,
      totalPages,
      pageSize,
    },
  };
};

export default MenuPage;
