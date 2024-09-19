import { Select, Box } from "@chakra-ui/react";
import MultiSelectBar from "./multiselectBar";
import SearchBar  from './SearchBar';

const FilterBar = ({ selectedCategories = [], selectedFilter, onFilterChange, onSortChange, onRemoveCategory, onSearch }: {  selectedCategories: string[], selectedFilter: string, onFilterChange: (value: string) => void, onSortChange: (sortOrder: string) => void, onRemoveCategory: (value: string) => void, onSearch: (searchTerm: string) => void }) => {
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(event.target.value);
  };
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(event.target.value);
  };

  return (
    <>
    <Box display="flex" gap={4} alignItems="center">
      <Box>
        <Select onChange={handleFilterChange} icon={<></>} bg="black" textColor="white" value={selectedFilter}>
          <option value="All">All</option>
          <option value="Signature Dishes">Signature Dishes</option>
          <option value="Entree">Entree</option>
          <option value="Soup">Soup</option>
          <option value="Chicken">Chicken</option>
          <option value="Beef & Lamb">Beef & Lamb</option>
          <option value="Duck">Duck</option>
          <option value="Seafood">Seafood</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Tofu & Claypot">Tofu & Claypot</option>
          <option value="Noodles & Rice">Noodles & Rice</option>
          <option value="Banquet">Banquet</option>
        </Select>
        <div className="max-w-[172px] mt-4">
          <MultiSelectBar selectedCategories={selectedCategories} onRemoveCategory={onRemoveCategory} />
        </div>
      </Box>      
    </Box>
    <Box>
        <Select placeholder="Sort by" onChange={handleSortChange} icon={<></>} bg="black" textColor="white">
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
        </Select>
    </Box>
    
    <Box>
      <div className="flex justify-center items-center">
      <SearchBar onSearch={onSearch} />
    </div>
    </Box>
    </>
  );
};

export default FilterBar;
