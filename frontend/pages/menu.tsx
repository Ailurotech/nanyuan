import { GetStaticProps } from 'next';
import { sanityClient } from '../lib/sanityClient';
import { MenuItem } from '../types'; // Define your types if needed
import MenuCard from '../components/menupage/MenuCard';
import FilterBar from '../components/menupage/FilterBar';
import { useState, useEffect } from 'react';
import { ShoppingCartItem } from '../types';
import { RiShoppingBagLine } from 'react-icons/ri';
import Link from 'next/link';
import { ShoppingCart } from '@/components/homepage/route';

interface MenuProps {
  menuItems: MenuItem[];
}


const MenuPage = ({ menuItems }: MenuProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState("");
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  const [cart, setCart] = useState<ShoppingCartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

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

  
  const filterAndSortItems = (categories: string[], sortOrder: string, searchQuery: string) => {
    let filtered = [...menuItems];

  if (categories.length > 0) {
    filtered = filtered.filter((item) => 
      Array.isArray(item.categoryName) && categories.every((cat) => item.categoryName.includes(cat))
    );
  }

  if (searchQuery) {
    filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  if (sortOrder === "asc") {
    filtered = filtered.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "desc") {
    filtered = filtered.sort((a, b) => b.price - a.price);
  }

  return filtered;
  };

  
  const handleFilterChange = (value: string) => {
    if (value === "All") {
      setSelectedCategories([]);
      setSelectedFilter("");
      setFilteredItems(menuItems);
    } else if (!selectedCategories.includes(value)) {
      const updatedCategories = [...selectedCategories, value];
      setSelectedCategories(updatedCategories);
      setSelectedFilter(value);
      setFilteredItems(filterAndSortItems(updatedCategories, sortOrder, searchQuery));
    }
  };

  const handleSortChange = (order: string) => {
    setSortOrder(order);
    setFilteredItems(filterAndSortItems(selectedCategories, order, searchQuery));
  };

  const handleRemoveCategory = (categoryName: string) => {
    const newCategories = selectedCategories.filter((category) => category !== categoryName);
    setSelectedCategories(newCategories);
    
    if (newCategories.length === 0) {
      setSelectedFilter("All");
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(filterAndSortItems(newCategories, sortOrder, searchQuery));
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredItems(filterAndSortItems(selectedCategories, sortOrder, query));
  };

  const handleSeeAll = () => {
    handleFilterChange("All");
  };

  const itemsToDisplay = filteredItems.length ? filteredItems : menuItems;
  // console.log(menuItems);
  return (
    <div className="bg-black min-h-screen py-12 pt-40">
    <h1 className="text-center text-white text-4xl font-bold mb-8">Choose Our Menu</h1>
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
    <div className="flex justify-start md:justify-center items-center gap-6 mb-6 w-full px-10">
        <div className="flex md:flex-row md:space-x-4 space-y-4 md:space-y-0 justify-center items-center w-full">
          <FilterBar 
            selectedCategories={selectedCategories} 
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange} 
            onSortChange={handleSortChange} 
            onRemoveCategory={handleRemoveCategory}
            onSearch={handleSearch}
          />
        </div>
    </div>
        
    {filteredItems.length === 0 ? (
        <div className="text-center text-white">
          No matching menu items found.
        </div>
      ) : (
        <div className="container mx-auto grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 justify-items-center px-5">
          {itemsToDisplay.map((item) => (
            <MenuCard key={item._id} menuItems={item} addToCart={addToCart}/>
          ))}
        </div>
      )}
    <div className="flex justify-center mt-10">
      <button className="bg-yellow-400 text-black py-2 px-6 rounded-lg text-lg" onClick={handleSeeAll}>
        See All
      </button>
    </div>
  </div>
  // const [cart, setCart] = useState<ShoppingCartItem[]>([]);
  // const [cartCount, setCartCount] = useState(0);

  // useEffect(() => {
  //   const cartData = localStorage.getItem('cart');
  //   if (cartData) {
  //     const parsedCart = JSON.parse(cartData);
  //     setCart(parsedCart);
  //     setCartCount(
  //       parsedCart.reduce(
  //         (total: number, item: ShoppingCartItem) => total + item.quantity,
  //         0,
  //       ),
  //     );
  //   }
  // }, []);

  // const addToCart = (item: MenuItem) => {
  //   const updatedCart = [...cart];
  //   const existingItem = updatedCart.find(
  //     (cartItem) => cartItem._id === item._id,
  //   );
  //   if (existingItem) {
  //     existingItem.quantity += 1;
  //   } else {
  //     updatedCart.push({ ...item, quantity: 1 });
  //   }
  //   setCart(updatedCart);
  //   setCartCount((prevCount) => prevCount + 1);
  //   localStorage.setItem('cart', JSON.stringify(updatedCart));
  // };

  // return (
  //   <div className="bg-black min-h-screen py-12 pt-40">
  //     <div className="container mx-auto flex items-center justify-center relative">
  //       <h1 className="text-center text-white text-4xl font-bold mb-8 grow">
  //         Choose Our Menu
  //       </h1>
  //       <Link
  //         href={ShoppingCart.Path}
  //         className="text-white absolute right-0 md:mr-12 mr-2 mb-8 hover:text-yellow-400"
  //       >
  //         <div className="relative">
  //           <RiShoppingBagLine className="w-7 h-7" />
  //           {cartCount > 0 && (
  //             <span className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
  //               {cartCount}
  //             </span>
  //           )}
  //         </div>
  //       </Link>
  //     </div>
  //     <div className="container mx-auto grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 justify-items-center px-5">
  //       {menuItems.map((item) => (
  //         <MenuCard key={item._id} menuItems={item} addToCart={addToCart} />
  //       ))}
  //     </div>
  //     <div className="flex justify-center mt-10">
  //       <button className="bg-yellow-400 text-white py-2 px-6 rounded-lg text-lg">
  //         See All
  //       </button>
  //     </div>
  //   </div>
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
      "image": image.asset->url,
      "categoryName": category[]->name
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
