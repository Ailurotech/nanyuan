// pages/menu.tsx
import { GetStaticProps } from "next";
import { sanityClient } from "../lib/sanityClient";
import { MenuItem } from "../types"; // Define your types if needed
import MenuCard from '../components/menupage/MenuCard';
import FilterBar from '../components/menupage/FilterBar';
import SearchBar  from '../components/menupage/SearchBar';
import { useState } from "react";

interface MenuProps {
  menuItems: MenuItem[];
}
const MenuPage = ({ menuItems }: MenuProps) => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  const handleSortChange = (order: string) => {
    setSortOrder(order);
    let sortedItems = [...menuItems];

    if (order === "asc") {
      sortedItems = sortedItems.sort((a, b) => a.price - b.price);
    } else if (order === "desc") {
      sortedItems = sortedItems.sort((a, b) => b.price - a.price);
    }
    setFilteredItems(sortedItems);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const searchedItems = menuItems.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredItems(searchedItems);
  };

  const itemsToDisplay = filteredItems.length ? filteredItems : menuItems;

  return (
    <div className="bg-black min-h-screen py-12 pt-40">
    <h1 className="text-center text-white text-4xl font-bold mb-8">Choose Our Menu</h1>
    <div className="flex justify-center items-center gap-6 mb-6 w-full px-10">
        <div className="flex space-x-4">
            <FilterBar onFilterChange={handleFilterChange} onSortChange={handleSortChange} />
        </div>
        <div className="flex-grow max-w-xs relative">
            {/* 将放大镜和弹出框组合在一起 */}
            <div className="flex justify-center items-center">
              <SearchBar onSearch={handleSearch} />
            </div>
        </div>
    </div>
    <div className="container mx-auto grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 justify-items-center px-5">
      {itemsToDisplay.map((item) => (
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
      "image": image.asset->url,
      category
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